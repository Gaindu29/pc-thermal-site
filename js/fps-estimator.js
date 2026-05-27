/**
 * TempCore — FPS Estimator
 * Estimates native (no DLSS/FSR) FPS for a given GPU + CPU + settings combination.
 *
 * Base FPS = RTX 4090 @ 1440p High, native rendering, averaged across benchmarks
 * Sources: GamersNexus, Digital Foundry, Tom's Hardware, TechPowerUp, NotebookCheck 2024–2025
 */

// ── DESKTOP GPU performance multipliers (relative to RTX 4090 @ 1440p = 1.0) ─
const GPU_MULT = {
  // RTX 50 Series
  "RTX 5090":           1.168,
  "RTX 5080":           0.921,
  "RTX 5070 Ti":        0.779,
  "RTX 5070":           0.684,
  "RTX 5060 Ti 16GB":   0.558,
  "RTX 5060 Ti":        0.547,
  "RTX 5060":           0.500,
  // RTX 40 Series
  "RTX 4090":           1.000,
  "RTX 4080 Super":     0.884,
  "RTX 4080":           0.842,
  "RTX 4070 Ti Super":  0.789,
  "RTX 4070 Ti":        0.726,
  "RTX 4070 Super":     0.684,
  "RTX 4070":           0.605,
  "RTX 4060 Ti 16GB":   0.526,
  "RTX 4060 Ti":        0.521,
  "RTX 4060":           0.453,
  // RTX 30 Series
  "RTX 3090 Ti":        0.779,
  "RTX 3090":           0.737,
  "RTX 3080 Ti":        0.711,
  "RTX 3080 12GB":      0.674,
  "RTX 3080 10GB":      0.658,
  "RTX 3070 Ti":        0.589,
  "RTX 3070":           0.568,
  "RTX 3060 Ti":        0.511,
  "RTX 3060":           0.421,
  "RTX 3050":           0.316,
  // GTX Series
  "GTX 1080 Ti":        0.432,
  "GTX 1080":           0.358,
  "GTX 1070 Ti":        0.326,
  "GTX 1070":           0.295,
  "GTX 1660 Ti":        0.305,
  "GTX 1660 Super":     0.295,
  "GTX 1660":           0.253,
  "GTX 1650 Super":     0.226,
  "GTX 1650":           0.179,
  "GTX 1060 6GB":       0.211,
  "GTX 1060 3GB":       0.168,
  "GTX 1050 Ti":        0.137,
  // AMD RX 7000
  "RX 7900 XTX":        0.974,
  "RX 7900 XT":         0.853,
  "RX 7900 GRE":        0.737,
  "RX 7800 XT":         0.632,
  "RX 7700 XT":         0.547,
  "RX 7600 XT":         0.474,
  "RX 7600":            0.421,
  // AMD RX 6000
  "RX 6950 XT":         0.800,
  "RX 6900 XT":         0.753,
  "RX 6800 XT":         0.674,
  "RX 6800":            0.616,
  "RX 6750 XT":         0.542,
  "RX 6700 XT":         0.495,
  "RX 6700":            0.453,
  "RX 6650 XT":         0.416,
  "RX 6600 XT":         0.379,
  "RX 6600":            0.347,
  "RX 6500 XT":         0.195,
};

// ── LAPTOP GPU multipliers (relative to desktop RTX 4090 @ 1440p = 1.0) ──────
// Based on average TGP configurations. Laptop GPUs vary ±15% by OEM/TGP setting.
const LAPTOP_GPU_MULT = {
  // RTX 50 Laptop (Blackwell, avg ~150W TGP)
  "RTX 5090 Laptop":        0.88,   // ≈ desktop RTX 4090, near full desktop performance
  "RTX 5080 Laptop":        0.74,   // ≈ desktop RTX 4080
  "RTX 5070 Ti Laptop":     0.62,   // ≈ desktop RTX 4070 Ti
  "RTX 5070 Laptop":        0.53,   // ≈ desktop RTX 3080 Ti
  "RTX 5060 Laptop":        0.42,   // ≈ desktop RTX 3070
  // RTX 40 Laptop (Ada Lovelace)
  "RTX 4090 Laptop":        0.72,   // ≈ desktop RTX 3080 Ti (175W max)
  "RTX 4080 Laptop":        0.60,   // ≈ desktop RTX 3070 Ti (150W)
  "RTX 4070 Laptop":        0.52,   // ≈ desktop RTX 3070 (115W)
  "RTX 4060 Laptop":        0.44,   // ≈ desktop RTX 3060 Ti (115W)
  "RTX 4050 Laptop":        0.32,   // ≈ desktop RTX 3050 range (115W)
  // RTX 30 Laptop (Ampere)
  "RTX 3080 Ti Laptop":     0.55,   // 150W
  "RTX 3080 Laptop":        0.52,   // 150W
  "RTX 3070 Ti Laptop":     0.46,   // 125W
  "RTX 3070 Laptop":        0.42,   // 125W
  "RTX 3060 Laptop":        0.35,   // 115W
  "RTX 3050 Ti Laptop":     0.26,   // 80W
  "RTX 3050 Laptop":        0.22,   // 80W
  // GTX Laptop
  "GTX 1660 Ti Laptop":     0.23,
  "GTX 1650 Ti Laptop":     0.18,
  "GTX 1650 Laptop":        0.15,
  // AMD RX 7000M
  "RX 7900M":               0.68,   // 175W, close to desktop RX 6900 XT
  "RX 7800M":               0.52,   // 120W
  "RX 7700S":               0.42,   // 100W
  "RX 7600M XT":            0.38,   // 120W
  "RX 7600M":               0.34,   // 60–120W
  // AMD RX 6000M
  "RX 6850M XT":            0.55,   // 145W, laptop halo tier
  "RX 6700M":               0.42,   // 100W
  "RX 6600M":               0.34,   // 100W
};

// ── DESKTOP CPU gaming FPS ceilings ─────────────────────────────────────────
const CPU_FPS = {
  "Core i9-14900K":240,"Core i9-14900KF":240,"Core i7-14700K":225,"Core i7-14700KF":225,
  "Core i5-14600K":215,"Core i5-14600KF":215,"Core i9-13900K":238,"Core i9-13900KF":238,
  "Core i7-13700K":220,"Core i7-13700KF":220,"Core i7-13700":200,"Core i5-13600K":210,
  "Core i5-13600KF":210,"Core i5-13500":195,"Core i5-13400":188,"Core i5-13400F":188,
  "Core i3-13100":155,"Core i3-13100F":155,"Core i9-12900K":220,"Core i9-12900KF":220,
  "Core i7-12700K":205,"Core i7-12700KF":205,"Core i7-12700":192,"Core i5-12600K":200,
  "Core i5-12600KF":200,"Core i5-12600":180,"Core i5-12400":175,"Core i5-12400F":175,
  "Core i3-12100":150,"Core i3-12100F":150,"Core i9-11900K":180,"Core i7-11700K":170,
  "Core i5-11600K":162,"Core i9-10900K":178,"Core i7-10700K":168,"Core i5-10600K":155,
  "Core i5-10400":140,"Core i5-10400F":140,
  "Ryzen 9 7950X3D":248,"Ryzen 9 7950X":218,"Ryzen 9 7900X3D":244,"Ryzen 9 7900X":215,
  "Ryzen 9 7900":205,"Ryzen 7 7800X3D":260,"Ryzen 7 7700X":212,"Ryzen 7 7700":205,
  "Ryzen 5 7600X":208,"Ryzen 5 7600":200,"Ryzen 5 7500F":195,"Ryzen 9 5950X":192,
  "Ryzen 9 5900X":188,"Ryzen 7 5800X3D":248,"Ryzen 7 5800X":182,"Ryzen 7 5700X":175,
  "Ryzen 5 5600X":185,"Ryzen 5 5600":180,"Ryzen 5 5600G":162,"Ryzen 5 5500":158,
  "Ryzen 3 5300G":135,"Ryzen 9 3900XT":162,"Ryzen 9 3900X":158,"Ryzen 7 3800XT":155,
  "Ryzen 7 3800X":152,"Ryzen 7 3700X":150,"Ryzen 5 3600XT":148,"Ryzen 5 3600X":145,
  "Ryzen 5 3600":142,"Ryzen 3 3300X":132,"Ryzen 3 3100":122,"Ryzen 7 2700X":120,
  "Ryzen 7 2700":112,"Ryzen 5 2600X":118,"Ryzen 5 2600":112,
};

// ── LAPTOP CPU gaming FPS ceilings ───────────────────────────────────────────
// Laptop CPUs are thermally constrained. HX chips approach desktop; H/HS are lower.
// V-Cache (3D) variants get a meaningful gaming uplift even on laptop.
const LAPTOP_CPU_FPS = {
  // Intel Core Ultra 200 Series (Arrow Lake-H / HX) — 2024
  "Core Ultra 9 285HX": 210, "Core Ultra 9 285H":  185,
  "Core Ultra 7 265HX": 198, "Core Ultra 7 265H":  172, "Core Ultra 7 255H": 165,
  "Core Ultra 5 245HX": 182, "Core Ultra 5 245H":  158, "Core Ultra 5 235H": 150,
  // Intel Core Ultra 100 Series (Meteor Lake) — 2023
  "Core Ultra 9 185H":  172, "Core Ultra 7 165H":  158, "Core Ultra 7 155H": 152,
  "Core Ultra 5 135H":  145, "Core Ultra 5 125H":  138,
  // Intel 14th Gen H/HX — 2024
  "Core i9-14900HX":    215, "Core i7-14700HX":    205, "Core i7-14650HX":   198,
  "Core i5-14500HX":    188, "Core i9-14900H":     188, "Core i7-14700H":    175,
  "Core i5-14500H":     162,
  // Intel 13th Gen H/HX — 2023
  "Core i9-13980HX":    210, "Core i9-13900H":     182, "Core i7-13700HX":   200,
  "Core i7-13700H":     165, "Core i5-13600HX":    178, "Core i5-13500H":    155,
  "Core i5-13420H":     142,
  // Intel 12th Gen H — 2022
  "Core i9-12900HX":    192, "Core i7-12700H":     158, "Core i5-12600H":    142,
  "Core i5-12500H":     138,
  // AMD Ryzen 9000 HX (Fire Range) — 2025
  "Ryzen 9 9955HX":     215, "Ryzen 7 9855HX":     202, "Ryzen 5 9655HX":    188,
  // AMD Ryzen AI 300 (Strix Point) — 2024
  "Ryzen AI 9 HX 370":  185, "Ryzen AI 9 365":     175, "Ryzen AI 7 350":    165,
  // AMD Ryzen 7000 HX (Dragon Range) — 2023
  "Ryzen 9 7945HX3D":   228, "Ryzen 9 7945HX":     212,
  "Ryzen 7 7745HX":     195, "Ryzen 5 7645HX":     178,
  // AMD Ryzen 7000 HS (Phoenix) — 2023
  "Ryzen 9 7940HS":     182, "Ryzen 7 7745HS":     170, "Ryzen 5 7640HS":    158,
  // AMD Ryzen 6000 H (Rembrandt) — 2022
  "Ryzen 9 6980HX":     178, "Ryzen 7 6800H":      162, "Ryzen 5 6600H":     148,
  // AMD Ryzen 5000 H (Cezanne) — 2021
  "Ryzen 9 5900HX":     165, "Ryzen 7 5800H":      155, "Ryzen 5 5600H":     142,
};

// ── Resolution scaling (relative to 1440p = 1.0) ─────────────────────────────
const RES_SCALE = { "1080p": 1.42, "1440p": 1.00, "4K": 0.55 };

// ── Quality preset scaling (relative to High = 1.0) ──────────────────────────
const QUALITY_SCALE = {
  "Low":        1.85,
  "Medium":     1.40,
  "High":       1.00,
  "Ultra":      0.70,
  "Ultra + RT": 0.40,
};

// ── RAM penalty multipliers ───────────────────────────────────────────────────
const RAM_MULT = {
  "8GB":  0.82,   // notable stutter and lower avg FPS in modern titles
  "16GB": 1.00,   // baseline
  "32GB": 1.01,   // marginal improvement in memory-hungry titles
  "64GB": 1.01,
};

// ── Game database ─────────────────────────────────────────────────────────────
// presets: game-accurate quality options; label = in-game name, key = maps to QUALITY_SCALE
// upscaleLabel: upscaling tech this game supports (null = none)
// upscaleBoost: approx multiplier when upscaling Quality mode is enabled
const GAMES = [
  // ── Heavy AAA ──────────────────────────────────────────────────────────────
  {
    name:"Cyberpunk 2077", year:2020, genre:"RPG / Open World", base:95,
    cpuScale:0.9, ramSensitive:true, rtSupport:true, upscaleBoost:1.55,
    upscaleLabel:"DLSS 4 / FSR 3",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Ultra",key:"Ultra"},{label:"RT Ultra",key:"Ultra + RT"}],
    note:"Path tracing mode is GPU-intensive beyond most hardware."
  },
  {
    name:"Black Myth: Wukong", year:2024, genre:"Action RPG", base:88,
    cpuScale:0.8, ramSensitive:true, rtSupport:true, upscaleBoost:1.60,
    upscaleLabel:"DLSS 3 / FSR 3",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Cinematic",key:"Ultra"},{label:"Cinematic+RT",key:"Ultra + RT"}],
    note:"Extremely GPU-heavy. DLSS 4 strongly recommended on RTX cards."
  },
  {
    name:"Alan Wake 2", year:2023, genre:"Action / Horror", base:90,
    cpuScale:0.8, ramSensitive:true, rtSupport:true, upscaleBoost:1.65,
    upscaleLabel:"DLSS 3 / FSR 3",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Ultra",key:"Ultra"},{label:"Path Tracing",key:"Ultra + RT"}],
    note:"One of the most GPU-demanding titles available. Path tracing at 4K requires top-end hardware."
  },
  {
    name:"Dragon's Dogma 2", year:2024, genre:"Action RPG", base:108,
    cpuScale:0.5, ramSensitive:true, rtSupport:false, upscaleBoost:1.40,
    upscaleLabel:"DLSS 3 / FSR 3",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Ultra",key:"Ultra"}],
    note:"Very CPU-sensitive. 6+ fast cores strongly recommended."
  },
  {
    name:"Hogwarts Legacy", year:2023, genre:"Action RPG", base:118,
    cpuScale:0.9, ramSensitive:true, rtSupport:false, upscaleBoost:1.50,
    upscaleLabel:"DLSS 3 / FSR 3",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Ultra",key:"Ultra"}],
    note:"GPU-limited at higher settings. Runs well on mid-range hardware at 1080p."
  },
  {
    name:"Assassin's Creed Shadows", year:2024, genre:"Action / Open World", base:108,
    cpuScale:0.8, ramSensitive:true, rtSupport:false, upscaleBoost:1.50,
    upscaleLabel:"DLSS 3 / FSR 3 / XeSS",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Ultra",key:"Ultra"}],
    note:"Ubisoft's most demanding AC title. Intel Arc and AMD cards well supported."
  },
  {
    name:"Star Wars Jedi: Survivor", year:2023, genre:"Action Adventure", base:102,
    cpuScale:0.6, ramSensitive:true, rtSupport:false, upscaleBoost:1.45,
    upscaleLabel:"DLSS 3 / FSR 3",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Epic",key:"Ultra"}],
    note:"Notorious for CPU sensitivity and stuttering. High-core-count CPU recommended."
  },
  {
    name:"Starfield", year:2023, genre:"RPG / Open World", base:130,
    cpuScale:0.6, ramSensitive:true, rtSupport:false, upscaleBoost:1.45,
    upscaleLabel:"AMD FSR 2",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Ultra",key:"Ultra"}],
    note:"Heavy CPU workload in dense areas. 32GB RAM reduces stutter. FSR only — no DLSS."
  },
  {
    name:"Microsoft Flight Simulator 2024", year:2024, genre:"Simulation", base:82,
    cpuScale:0.4, ramSensitive:true, rtSupport:false, upscaleBoost:1.50,
    upscaleLabel:"DLSS 3 / FSR 3",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Ultra",key:"Ultra"}],
    note:"Extremely CPU and VRAM hungry. 32GB system RAM and fast CPU essential."
  },
  {
    name:"Cities: Skylines 2", year:2023, genre:"City Builder", base:75,
    cpuScale:0.3, ramSensitive:true, rtSupport:false, upscaleBoost:1.55,
    upscaleLabel:"DLSS 3 / FSR 3",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Ultra",key:"Ultra"}],
    note:"CPU-bound. Even top-end CPUs struggle in large cities."
  },
  {
    name:"Total War: Warhammer III", year:2022, genre:"Strategy / RTS", base:115,
    cpuScale:0.45, ramSensitive:true, rtSupport:false, upscaleBoost:1.00,
    upscaleLabel:null,
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Ultra",key:"Ultra"}],
    note:"CPU-limited during battles with many units. Fast CPU core speed matters. No upscaling support."
  },
  // ── Mid-weight AAA ─────────────────────────────────────────────────────────
  {
    name:"Red Dead Redemption 2", year:2019, genre:"Action / Open World", base:132,
    cpuScale:0.9, ramSensitive:true, rtSupport:false, upscaleBoost:1.00,
    upscaleLabel:null,
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Ultra",key:"Ultra"}],
    note:"One of the best-optimised open-world games on PC. No built-in upscaling."
  },
  {
    name:"The Witcher 3 (Next Gen)", year:2022, genre:"RPG", base:165,
    cpuScale:1.0, ramSensitive:false, rtSupport:true, upscaleBoost:1.45,
    upscaleLabel:"DLSS 3 / FSR 3",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Ultra",key:"Ultra"},{label:"Ultra + RT",key:"Ultra + RT"}],
    note:"RT overhaul is detailed but manageable. DLSS 3 support on RTX 30/40."
  },
  {
    name:"Elden Ring", year:2022, genre:"Action RPG", base:175,
    cpuScale:0.9, ramSensitive:false, rtSupport:false, upscaleBoost:1.00,
    upscaleLabel:null,
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Maximum",key:"Ultra"}],
    note:"Capped at 60 FPS natively. Use mods or tools to unlock frame rate. No upscaling."
  },
  {
    name:"God of War", year:2022, genre:"Action Adventure", base:172,
    cpuScale:1.0, ramSensitive:false, rtSupport:false, upscaleBoost:1.40,
    upscaleLabel:"DLSS 3 / FSR 3",
    presets:[{label:"Low",key:"Low"},{label:"Original",key:"Medium"},{label:"High",key:"High"},{label:"Ultra",key:"Ultra"}],
    note:"Excellent PC port. Scales well from low to ultra settings."
  },
  {
    name:"Baldur's Gate 3", year:2023, genre:"RPG / Strategy", base:120,
    cpuScale:0.6, ramSensitive:true, rtSupport:false, upscaleBoost:1.40,
    upscaleLabel:"DLSS 3 / FSR 3",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Ultra",key:"Ultra"}],
    note:"Act 3 is notably heavier than earlier chapters. 16GB RAM minimum."
  },
  {
    name:"Ghost of Tsushima", year:2024, genre:"Action Adventure", base:180,
    cpuScale:1.0, ramSensitive:false, rtSupport:false, upscaleBoost:1.40,
    upscaleLabel:"DLSS 3 / FSR 3",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Very High",key:"Ultra"}],
    note:"Excellent PC port with good AMD and NVIDIA support."
  },
  {
    name:"Helldivers 2", year:2024, genre:"Co-op Shooter", base:155,
    cpuScale:0.8, ramSensitive:false, rtSupport:false, upscaleBoost:1.40,
    upscaleLabel:"DLSS 3 / FSR 3",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Ultra",key:"Ultra"}],
    note:"VRAM usage spikes in dense combat. Aim for 8GB VRAM minimum."
  },
  {
    name:"Palworld", year:2024, genre:"Survival / Crafting", base:162,
    cpuScale:0.7, ramSensitive:true, rtSupport:false, upscaleBoost:1.40,
    upscaleLabel:"DLSS 3",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Epic",key:"Ultra"}],
    note:"CPU-sensitive in large bases. Still benefits from optimisation patches."
  },
  {
    name:"Marvel Rivals", year:2024, genre:"Hero Shooter", base:188,
    cpuScale:0.9, ramSensitive:false, rtSupport:false, upscaleBoost:1.45,
    upscaleLabel:"DLSS 4 / FSR 3",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Epic",key:"Ultra"}],
    note:"Good optimisation. High-refresh play accessible on mid-range hardware."
  },
  {
    name:"Diablo IV", year:2023, genre:"ARPG", base:168,
    cpuScale:1.0, ramSensitive:false, rtSupport:false, upscaleBoost:1.40,
    upscaleLabel:"DLSS 3 / FSR 3",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Ultra",key:"Ultra"}],
    note:"Well optimised. Ultra 4K is accessible on high-end GPU."
  },
  {
    name:"Spider-Man: Miles Morales", year:2022, genre:"Action Adventure", base:205,
    cpuScale:1.0, ramSensitive:false, rtSupport:true, upscaleBoost:1.50,
    upscaleLabel:"DLSS 3 / FSR 3",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Very High",key:"Ultra"},{label:"RT Mode",key:"Ultra + RT"}],
    note:"Excellent RT reflections. DLSS + RT is a very playable combo on RTX 30+."
  },
  {
    name:"Ratchet & Clank: Rift Apart", year:2023, genre:"Platformer", base:188,
    cpuScale:1.0, ramSensitive:false, rtSupport:true, upscaleBoost:1.50,
    upscaleLabel:"DLSS 3 / FSR 3",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Very High",key:"Ultra"},{label:"RT Mode",key:"Ultra + RT"}],
    note:"One of the best-looking PC ports available. RT is highly recommended."
  },
  {
    name:"Returnal", year:2023, genre:"Roguelike Shooter", base:195,
    cpuScale:1.0, ramSensitive:false, rtSupport:false, upscaleBoost:1.40,
    upscaleLabel:"DLSS 3 / FSR 3",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Epic",key:"Ultra"}],
    note:"Good port, consistent frame pacing."
  },
  {
    name:"Death Stranding 2", year:2025, genre:"Action / Open World", base:195,
    cpuScale:1.0, ramSensitive:false, rtSupport:false, upscaleBoost:1.40,
    upscaleLabel:"DLSS 4 / FSR 3",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Ultra",key:"Ultra"}],
    note:"Well-optimised Decima engine title."
  },
  {
    name:"Forza Horizon 5", year:2021, genre:"Racing", base:178,
    cpuScale:1.1, ramSensitive:false, rtSupport:false, upscaleBoost:1.40,
    upscaleLabel:"DLSS 3 / FSR 3",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Ultra",key:"Ultra"}],
    note:"Excellent optimisation. Enjoyable on a wide range of hardware."
  },
  {
    name:"F1 24", year:2024, genre:"Racing / Sim", base:208,
    cpuScale:1.2, ramSensitive:false, rtSupport:false, upscaleBoost:1.40,
    upscaleLabel:"DLSS 3 / FSR 3",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Ultra High",key:"Ultra"}],
    note:"CPU-limited at high frame rates. Very consistent frame delivery."
  },
  {
    name:"Halo Infinite", year:2021, genre:"FPS", base:172,
    cpuScale:1.1, ramSensitive:false, rtSupport:false, upscaleBoost:1.00,
    upscaleLabel:null,
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Ultra",key:"Ultra"}],
    note:"Good open-world FPS performance. Campaign is heavier than multiplayer. No upscaling support."
  },
  // ── Esports / Competitive ──────────────────────────────────────────────────
  {
    name:"Counter-Strike 2", year:2023, genre:"Tactical FPS", base:340,
    cpuScale:2.2, ramSensitive:false, rtSupport:false, upscaleBoost:1.00,
    upscaleLabel:null,
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Very High",key:"Ultra"}],
    note:"Very CPU-sensitive. Fast CPUs yield significantly more frames. No upscaling."
  },
  {
    name:"Valorant", year:2020, genre:"Tactical FPS", base:400,
    cpuScale:2.5, ramSensitive:false, rtSupport:false, upscaleBoost:1.00,
    upscaleLabel:null,
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Epic",key:"Ultra"}],
    note:"Extremely light on GPU. CPU and RAM speed are the main performance factors. No upscaling."
  },
  {
    name:"Apex Legends", year:2019, genre:"Battle Royale", base:248,
    cpuScale:1.6, ramSensitive:false, rtSupport:false, upscaleBoost:1.00,
    upscaleLabel:null,
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Ultra",key:"Ultra"}],
    note:"CPU-sensitive at high frame rates. Source engine benefits from fast single-core performance. No upscaling."
  },
  {
    name:"Fortnite", year:2017, genre:"Battle Royale", base:218,
    cpuScale:1.4, ramSensitive:false, rtSupport:true, upscaleBoost:1.40,
    upscaleLabel:"DLSS 4 / TSR",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Epic",key:"Ultra"},{label:"Lumen (RT)",key:"Ultra + RT"}],
    note:"Lumen (full RT) mode is very demanding. Standard mode runs on almost anything."
  },
  {
    name:"Call of Duty: Black Ops 6", year:2024, genre:"FPS", base:212,
    cpuScale:1.3, ramSensitive:false, rtSupport:false, upscaleBoost:1.35,
    upscaleLabel:"DLSS 3 / FSR 3",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Ultra",key:"Ultra"}],
    note:"Good optimisation. Consistent performance across hardware tiers."
  },
  {
    name:"Rainbow Six Siege", year:2015, genre:"Tactical FPS", base:305,
    cpuScale:2.0, ramSensitive:false, rtSupport:false, upscaleBoost:1.00,
    upscaleLabel:null,
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Ultra",key:"Ultra"}],
    note:"Very CPU-sensitive at high frame rates. Low GPU demands. No upscaling."
  },
  {
    name:"Doom Eternal", year:2020, genre:"FPS", base:285,
    cpuScale:1.5, ramSensitive:false, rtSupport:false, upscaleBoost:1.00,
    upscaleLabel:null,
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Ultra Nightmare",key:"Ultra"}],
    note:"id Tech 7 is exceptionally well-optimised. Runs excellently on mid-range hardware. No upscaling."
  },
  // ── Other ──────────────────────────────────────────────────────────────────
  {
    name:"GTA V", year:2015, genre:"Open World", base:218,
    cpuScale:1.4, ramSensitive:false, rtSupport:false, upscaleBoost:1.00,
    upscaleLabel:null,
    presets:[{label:"Low",key:"Low"},{label:"Normal",key:"Medium"},{label:"High",key:"High"},{label:"Ultra",key:"Ultra"}],
    note:"Old engine. CPU-sensitive. Runs on nearly any modern hardware at max settings. No upscaling."
  },
  {
    name:"EA Sports FC 25", year:2024, genre:"Sports", base:272,
    cpuScale:1.5, ramSensitive:false, rtSupport:false, upscaleBoost:1.00,
    upscaleLabel:null,
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Ultra",key:"Ultra"}],
    note:"CPU and RAM speed matter more than GPU for frame rates in this title."
  },
  {
    name:"Minecraft (with Shaders)", year:2024, genre:"Sandbox", base:95,
    cpuScale:1.2, ramSensitive:false, rtSupport:false, upscaleBoost:1.30,
    upscaleLabel:"Iris Upscaling",
    presets:[{label:"Low",key:"Low"},{label:"Medium",key:"Medium"},{label:"High",key:"High"},{label:"Ultra",key:"Ultra"}],
    note:"Shader performance depends heavily on the specific shader pack. Values shown for OptiFine-tier shaders."
  },
];

// Deduplicate (safety)
const GAME_LIST = GAMES.filter((g, i, arr) => arr.findIndex(x => x.name === g.name) === i);

// ── Resolution scaling ────────────────────────────────────────────────────────

// ── FPS calculation ───────────────────────────────────────────────────────────
function estimateFPS(gpuKey, cpuKey, ramKey, resolution, qualityKey, game, isLaptop) {
  const gpuMult  = isLaptop ? (LAPTOP_GPU_MULT[gpuKey] || 0.38) : (GPU_MULT[gpuKey] || 0.5);
  const cpuFPS   = isLaptop ? (LAPTOP_CPU_FPS[cpuKey] || 150)   : (CPU_FPS[cpuKey]  || 160);
  const ramMult  = RAM_MULT[ramKey]          || 1.0;
  const resMult  = RES_SCALE[resolution]     || 1.0;
  const qualMult = QUALITY_SCALE[qualityKey] || 1.0;

  // Raw GPU-limited FPS
  let gpuFPS = game.base * gpuMult * resMult * qualMult;

  // Laptop thermal penalty: additional ~5% reduction to model TDP throttling in sustained load
  if (isLaptop) gpuFPS *= 0.95;

  // Apply RAM penalty (only for RAM-sensitive games)
  if (game.ramSensitive && ramKey === "8GB") {
    gpuFPS *= RAM_MULT["8GB"];
  }

  // CPU ceiling for this game/resolution
  const cpuResFactor = resolution === "1080p" ? 1.5 : resolution === "4K" ? 0.5 : 1.0;
  // Laptop CPUs also throttle under sustained gaming load — apply a small ceiling reduction
  const cpuCeiling = cpuFPS * game.cpuScale * cpuResFactor * (isLaptop ? 0.93 : 1.0);

  // Final FPS = minimum of GPU and CPU ceiling
  const raw = Math.min(gpuFPS, cpuCeiling);
  const finalFPS = raw >= 100 ? Math.round(raw / 5) * 5 : Math.round(raw);

  // Upscaling estimate (Quality mode ≈ 67% render res)
  const dlssApplicable = game.upscaleBoost > 1.0 && game.upscaleLabel;
  const dlssFPS = dlssApplicable ? Math.round(finalFPS * game.upscaleBoost / 5) * 5 : null;

  return { fps: finalFPS, dlssFPS, cpuLimited: gpuFPS > cpuCeiling };
}

// ── Performance tier ──────────────────────────────────────────────────────────
function fpsTier(fps) {
  if (fps <  20) return { label:"UNPLAYABLE",   cssClass:"critical", color:"var(--critical)", icon:"💀" };
  if (fps <  30) return { label:"VERY POOR",    cssClass:"critical", color:"var(--critical)", icon:"🔴" };
  if (fps <  45) return { label:"PLAYABLE",     cssClass:"hot",      color:"var(--hot)",      icon:"🟠" };
  if (fps <  60) return { label:"DECENT",       cssClass:"warm",     color:"var(--warm)",     icon:"🟡" };
  if (fps <  90) return { label:"SMOOTH",       cssClass:"safe",     color:"var(--safe)",     icon:"🟢" };
  if (fps < 144) return { label:"GREAT",        cssClass:"safe",     color:"var(--safe)",     icon:"✅" };
  if (fps < 240) return { label:"HIGH REFRESH", cssClass:"safe",     color:"var(--accent)",   icon:"⚡" };
  return               { label:"OVERKILL",      cssClass:"safe",     color:"var(--accent)",   icon:"🚀" };
}

// ── Game search ───────────────────────────────────────────────────────────────
function searchGames(query) {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return GAME_LIST.filter(g => g.name.toLowerCase().includes(q)).slice(0, 7);
}

// ── Platform + Quality state ─────────────────────────────────────────────────
var currentPlatform = "desktop";
var selectedQualityKey = "High";

function setPlatform(platform) {
  currentPlatform = platform;

  document.getElementById("gpu-desktop-wrap").style.display = platform === "desktop" ? "" : "none";
  document.getElementById("gpu-laptop-wrap").style.display  = platform === "laptop"  ? "" : "none";
  document.getElementById("cpu-desktop-wrap").style.display = platform === "desktop" ? "" : "none";
  document.getElementById("cpu-laptop-wrap").style.display  = platform === "laptop"  ? "" : "none";

  var btnD = document.getElementById("btn-desktop");
  var btnL = document.getElementById("btn-laptop");
  btnD.classList.toggle("active", platform === "desktop");
  btnL.classList.toggle("active", platform === "laptop");
  btnD.classList.toggle("hot", false);
  btnL.classList.toggle("hot", false);

  // Clear any results when switching platform
  var resultEl = document.getElementById("fps-result");
  resultEl.innerHTML = "";
  resultEl.className = "result-box";
  var defaultEl = document.getElementById("fps-default");
  if (defaultEl) defaultEl.style.display = "";
}

function setQuality(key, el) {
  selectedQualityKey = key;
  document.getElementById("fps-quality").value = key;
  document.querySelectorAll("#fps-quality-chips .fps-chip").forEach(function(b) {
    b.classList.remove("active", "hot");
  });
  el.classList.add("active", "hot");
}

function renderQualityChips(game) {
  var container = document.getElementById("fps-quality-chips");
  if (!game) {
    container.innerHTML = '<span style="font-family:\'JetBrains Mono\',monospace; font-size:0.75rem; color:#555568;">Select a game to see quality options</span>';
    return;
  }

  // If current quality key isn't in this game's presets, fall back to High key
  var validKeys = game.presets.map(function(p) { return p.key; });
  if (validKeys.indexOf(selectedQualityKey) === -1) {
    var highPreset = game.presets.find(function(p) { return p.key === "High"; });
    selectedQualityKey = highPreset ? "High" : game.presets[Math.floor(game.presets.length / 2)].key;
  }
  document.getElementById("fps-quality").value = selectedQualityKey;

  container.innerHTML = game.presets.map(function(p) {
    var active = (p.key === selectedQualityKey);
    return '<button class="fps-chip' + (active ? ' active hot' : '') + '" onclick="setQuality(\'' +
      p.key.replace(/'/g, "\\'") + '\', this)">' + p.label + '</button>';
  }).join("");
}

// ── Game select ───────────────────────────────────────────────────────────────
var selectedGame = null;

function selectGame(game) {
  selectedGame = game;
  document.getElementById("fps-game-input").value = game.name;
  document.getElementById("fps-suggestions").innerHTML = "";
  document.getElementById("fps-suggestions").style.display = "none";

  var badge = document.getElementById("fps-game-badge");
  badge.innerHTML =
    '<span style="background:rgba(0,200,255,0.1); border:1px solid rgba(0,200,255,0.25); border-radius:6px; ' +
    'padding:0.3rem 0.75rem; font-family:\'JetBrains Mono\',monospace; font-size:0.72rem; color:var(--accent);">' +
    game.name + ' · ' + game.genre + ' · ' + game.year + '</span>';
  badge.style.display = "flex";

  // Render game-accurate quality chips
  renderQualityChips(game);
}

function handleGameSearch() {
  var q   = document.getElementById("fps-game-input").value;
  var box = document.getElementById("fps-suggestions");

  if (!q || q.length < 1) { box.style.display = "none"; return; }

  var results = searchGames(q);
  if (results.length === 0) {
    box.innerHTML = '<div style="padding:0.75rem 1rem; font-size:0.82rem; color:#8888a0;">No matching games found</div>';
    box.style.display = "block";
    return;
  }

  box.innerHTML = results.map(function(g) {
    return '<div class="fps-suggestion-item" onclick="selectGame(' +
      JSON.stringify(g).replace(/"/g, '&quot;') + ')" ' +
      'style="padding:0.65rem 1rem; cursor:pointer; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border);">' +
        '<div>' +
          '<div style="font-size:0.85rem; color:var(--text);">' + g.name + '</div>' +
          '<div style="font-size:0.72rem; color:#8888a0; font-family:\'JetBrains Mono\',monospace;">' + g.genre + '</div>' +
        '</div>' +
        '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.68rem; color:#555568;">' + g.year + '</div>' +
      '</div>';
  }).join("");
  box.style.display = "block";
}

// ── MAIN: Run estimate ────────────────────────────────────────────────────────
function runFPSEstimate() {
  var isLaptop  = (currentPlatform === "laptop");
  var gpuKey    = isLaptop ? document.getElementById("fps-gpu-laptop").value : document.getElementById("fps-gpu").value;
  var cpuKey    = isLaptop ? document.getElementById("fps-cpu-laptop").value : document.getElementById("fps-cpu").value;
  var ramKey    = document.getElementById("fps-ram").value;
  var res       = document.getElementById("fps-res").value;
  var qualityKey= document.getElementById("fps-quality").value;
  var errorEl   = document.getElementById("fps-error");
  var resultEl  = document.getElementById("fps-result");
  var defaultEl = document.getElementById("fps-default");

  errorEl.textContent = ""; errorEl.style.display = "none";

  var platformLabel = isLaptop ? "Laptop " : "";
  if (!gpuKey)    { errorEl.textContent = "Please select your " + platformLabel + "GPU.";  errorEl.style.display = "block"; return; }
  if (!cpuKey)    { errorEl.textContent = "Please select your " + platformLabel + "CPU.";  errorEl.style.display = "block"; return; }
  if (!selectedGame) { errorEl.textContent = "Please search for and select a game."; errorEl.style.display = "block"; return; }

  if (!qualityKey) {
    var highPreset = selectedGame.presets.find(function(p) { return p.key === "High"; });
    qualityKey = highPreset ? "High" : selectedGame.presets[0].key;
    document.getElementById("fps-quality").value = qualityKey;
  }

  var est  = estimateFPS(gpuKey, cpuKey, ramKey, res, qualityKey, selectedGame, isLaptop);
  var tier = fpsTier(est.fps);
  var frameTime = (1000 / est.fps).toFixed(1);

  // Build bar chart using this game's actual presets
  var barData = selectedGame.presets.map(function(p) {
    return {
      label: p.label,
      key:   p.key,
      fps:   Math.min(estimateFPS(gpuKey, cpuKey, ramKey, res, p.key, selectedGame, isLaptop).fps, 999)
    };
  });

  var maxBar = Math.max.apply(null, barData.map(function(b) { return b.fps; }));

  // Find the active preset label for display
  var activePreset = selectedGame.presets.find(function(p) { return p.key === qualityKey; });
  var activeLabel  = activePreset ? activePreset.label : qualityKey;

  var barsHTML = barData.map(function(b) {
    var t = fpsTier(b.fps);
    var w = Math.max(4, Math.round((b.fps / maxBar) * 100));
    var active = (b.key === qualityKey);
    return '<div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.45rem;' +
      (active ? ' background:rgba(255,255,255,0.03); border-radius:4px; margin:-2px; padding:2px;' : '') + '">' +
      '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.68rem; color:' + (active ? 'var(--text)' : '#8888a0') +
        '; width:70px; flex-shrink:0;' + (active ? ' font-weight:600;' : '') + '">' + b.label + '</div>' +
      '<div style="flex:1; height:8px; background:var(--surface2); border-radius:4px; overflow:hidden;">' +
        '<div style="width:' + w + '%; height:100%; background:' + t.color + '; border-radius:4px;"></div>' +
      '</div>' +
      '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.78rem; color:' + t.color +
        '; width:45px; text-align:right; flex-shrink:0;' + (active ? ' font-weight:600;' : '') + '">' + b.fps + '</div>' +
      '</div>';
  }).join("");

  var upscaleNote = "";
  if (est.dlssFPS) {
    var upLabel = selectedGame.upscaleLabel || "DLSS/FSR";
    upscaleNote =
      '<div style="background:rgba(0,200,255,0.06); border:1px solid rgba(0,200,255,0.2); border-left:3px solid var(--accent); ' +
      'border-radius:6px; padding:0.75rem 1rem; font-size:0.82rem; color:#b0b0c8; line-height:1.6; margin-bottom:1rem;">' +
      '<strong style="color:var(--accent);">With ' + upLabel + ' Quality Mode:</strong> ~' + est.dlssFPS +
      ' FPS — upscaling from a lower resolution delivers significantly more frames with minimal visual impact.' +
      (isLaptop ? ' <strong style="color:var(--accent);">Highly recommended on laptops</strong> to recover performance lost to thermal constraints.' : ' Strongly recommended for this title.') +
      '</div>';
  }

  var cpuNote = est.cpuLimited
    ? '<div style="background:rgba(255,170,0,0.06); border:1px solid rgba(255,170,0,0.2); border-left:3px solid var(--warm); ' +
      'border-radius:6px; padding:0.75rem 1rem; font-size:0.82rem; color:#b0b0c8; line-height:1.6; margin-bottom:1rem;">⚠️ ' +
      '<strong style="color:var(--warm);">CPU-limited:</strong> Your ' + cpuKey + ' is the performance ceiling for ' +
      selectedGame.name + ' at ' + res + '. A faster CPU would increase FPS beyond this estimate.' +
      (isLaptop ? ' Laptop thermal throttling may further reduce CPU headroom under extended load.' : '') + '</div>'
    : "";

  var ramNote = (ramKey === "8GB" && selectedGame.ramSensitive)
    ? '<div style="background:rgba(255,34,68,0.05); border:1px solid rgba(255,34,68,0.2); border-left:3px solid var(--critical); ' +
      'border-radius:6px; padding:0.75rem 1rem; font-size:0.82rem; color:#b0b0c8; line-height:1.6; margin-bottom:1rem;">🔴 ' +
      '<strong style="color:var(--critical);">8GB RAM warning:</strong> ' + selectedGame.name +
      ' benefits significantly from 16GB. Expect stutter and reduced average FPS with 8GB.' +
      (isLaptop ? ' This is especially pronounced on laptops with shared memory bandwidth.' : '') + '</div>'
    : "";

  var platformBadge = isLaptop
    ? '<span style="background:rgba(255,170,0,0.1); border:1px solid rgba(255,170,0,0.25); color:var(--warm); ' +
      'font-family:\'JetBrains Mono\',monospace; font-size:0.62rem; border-radius:4px; padding:0.15rem 0.5rem; ' +
      'margin-left:0.5rem; vertical-align:middle;">💻 LAPTOP</span>'
    : "";

  resultEl.innerHTML =
    '<div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem; margin-bottom:1.25rem;">' +
      '<div>' +
        '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.65rem; letter-spacing:0.1em; text-transform:uppercase; color:#8888a0; margin-bottom:0.2rem;">' +
          selectedGame.name + ' · ' + res + ' · ' + activeLabel + platformBadge + '</div>' +
        '<div style="font-family:\'Bebas Neue\',sans-serif; font-size:3.5rem; color:' + tier.color + '; line-height:1;">' +
          est.fps + ' <span style="font-size:1.5rem; color:#8888a0;">FPS</span></div>' +
        '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.75rem; color:' + tier.color + '; margin-top:0.15rem;">' +
          tier.icon + ' ' + tier.label + '</div>' +
      '</div>' +
      '<div style="text-align:right;">' +
        '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.62rem; text-transform:uppercase; color:#8888a0; margin-bottom:0.2rem;">Frame Time</div>' +
        '<div style="font-family:\'JetBrains Mono\',monospace; font-size:1.6rem; color:var(--text); font-weight:600;">' +
          frameTime + '<span style="font-size:0.85rem; color:#8888a0;"> ms</span></div>' +
        '<div style="font-size:0.72rem; color:#555568;">' + gpuKey + '</div>' +
      '</div>' +
    '</div>' +
    cpuNote + ramNote + upscaleNote +
    '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.62rem; letter-spacing:0.1em; text-transform:uppercase; color:#8888a0; margin-bottom:0.5rem;">All Quality Presets at ' + res + '</div>' +
    '<div style="margin-bottom:1.25rem;">' + barsHTML + '</div>' +
    '<div style="background:var(--surface2); border-radius:8px; padding:0.875rem 1rem; border:1px solid var(--border); font-size:0.82rem; color:#b0b0c8; line-height:1.65;">' +
      '<strong style="color:var(--text);">About ' + selectedGame.name + ':</strong> ' + selectedGame.note + '</div>' +
    '<div style="font-size:0.7rem; color:#555568; margin-top:0.875rem; line-height:1.6; padding-top:0.75rem; border-top:1px solid var(--border);">' +
      'Estimates based on aggregated benchmark data at native resolution without upscaling. ' +
      (isLaptop ? 'Laptop estimates use average TGP configurations — actual performance varies ±20% based on OEM cooling and power limits. ' : '') +
      'Actual performance varies by scene, driver version, and system configuration. Numbers are approximate ±10–15%.</div>';

  resultEl.className = "result-box " + tier.cssClass + " show";
  if (defaultEl) defaultEl.style.display = "none";
  setTimeout(function() { resultEl.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 100);
}

// Close suggestions on outside click
document.addEventListener("click", function(e) {
  var box = document.getElementById("fps-suggestions");
  if (box && !box.contains(e.target) && e.target.id !== "fps-game-input") {
    box.style.display = "none";
  }
});
