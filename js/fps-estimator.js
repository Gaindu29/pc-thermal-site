/**
 * TempCore — FPS Estimator
 * Estimates native (no DLSS/FSR) FPS for a given GPU + CPU + settings combination.
 *
 * Base FPS = RTX 4090 @ 1440p High, native rendering, averaged across benchmarks
 * Sources: GamersNexus, Digital Foundry, Tom's Hardware, TechPowerUp 2024–2025
 */

// ── GPU performance multipliers (relative to RTX 4090 @ 1440p = 1.0) ─────────
// Derived from GPU_FPS data: gpu.f1440 / 190
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

// ── CPU gaming FPS ceilings (from bottleneck.js, same data) ──────────────────
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

// ── Resolution scaling (relative to 1440p = 1.0) ─────────────────────────────
const RES_SCALE = { "1080p": 1.42, "1440p": 1.00, "4K": 0.55 };

// ── Quality preset scaling (relative to High = 1.0) ──────────────────────────
const QUALITY_SCALE = {
  "Low":          1.85,
  "Medium":       1.40,
  "High":         1.00,
  "Ultra":        0.70,
  "Ultra + RT":   0.40,
};

// ── RAM penalty multipliers ───────────────────────────────────────────────────
// 8GB struggles in modern games (page file usage, texture streaming issues)
// 16GB is baseline; 32GB+ gives no meaningful gaming benefit
const RAM_MULT = {
  "8GB":  0.82,   // notable stutter and lower avg FPS in modern titles
  "16GB": 1.00,   // baseline
  "32GB": 1.01,   // marginal improvement in a few memory-hungry titles
  "64GB": 1.01,
};

// ── Game database ─────────────────────────────────────────────────────────────
// base: RTX 4090 @ 1440p High, native rendering, no upscaling, avg across benchmarks
// cpuScale: multiplier applied to cpu_fps ceiling for this game's CPU sensitivity
//   High value (>1.5) = game rewards fast CPU / can sustain very high FPS with fast CPU
//   Low value (<0.8)  = game is CPU-bottlenecked even on fast hardware (heavy sim/open-world)
// ramSensitive: whether 8GB RAM causes meaningful issues in this game
// rtSupport: whether the Ultra+RT preset makes sense for this game
// upscaleboost: approx multiplier when DLSS/FSR Quality mode is enabled
const GAMES = [
  // ── Heavy AAA ──────────────────────────────────────────────────────────────
  { name:"Cyberpunk 2077",           year:2020, genre:"RPG / Open World",    base:95,  cpuScale:0.9, ramSensitive:true,  rtSupport:true,  upscaleBoost:1.55, note:"Path tracing mode is GPU-intensive beyond most hardware." },
  { name:"Black Myth: Wukong",       year:2024, genre:"Action RPG",          base:88,  cpuScale:0.8, ramSensitive:true,  rtSupport:true,  upscaleBoost:1.60, note:"Extremely GPU-heavy. DLSS 4 strongly recommended on RTX cards." },
  { name:"Alan Wake 2",              year:2023, genre:"Action / Horror",      base:90,  cpuScale:0.8, ramSensitive:true,  rtSupport:true,  upscaleBoost:1.65, note:"One of the most GPU-demanding titles available. Path tracing at 4K requires top-end hardware." },
  { name:"Dragon's Dogma 2",         year:2024, genre:"Action RPG",          base:108, cpuScale:0.5, ramSensitive:true,  rtSupport:false, upscaleBoost:1.40, note:"Very CPU-sensitive. 6+ fast cores strongly recommended." },
  { name:"Hogwarts Legacy",          year:2023, genre:"Action RPG",          base:118, cpuScale:0.9, ramSensitive:true,  rtSupport:false, upscaleBoost:1.50, note:"GPU-limited at higher settings. Runs well on mid-range hardware at 1080p." },
  { name:"Assassin's Creed Shadows", year:2024, genre:"Action / Open World", base:108, cpuScale:0.8, ramSensitive:true,  rtSupport:false, upscaleBoost:1.50, note:"Ubisoft's most demanding AC title. Intel Arc and AMD cards well supported." },
  { name:"Star Wars Jedi: Survivor", year:2023, genre:"Action Adventure",    base:102, cpuScale:0.6, ramSensitive:true,  rtSupport:false, upscaleBoost:1.45, note:"Notorious for CPU sensitivity and stuttering. High-core-count CPU recommended." },
  { name:"Starfield",                year:2023, genre:"RPG / Open World",    base:130, cpuScale:0.6, ramSensitive:true,  rtSupport:false, upscaleBoost:1.45, note:"Heavy CPU workload in dense areas. 32GB RAM reduces stutter." },
  { name:"Microsoft Flight Simulator 2024", year:2024, genre:"Simulation",  base:82,  cpuScale:0.4, ramSensitive:true,  rtSupport:false, upscaleBoost:1.50, note:"Extremely CPU and VRAM hungry. 32GB system RAM and fast CPU essential." },
  { name:"Cities: Skylines 2",       year:2023, genre:"City Builder",        base:75,  cpuScale:0.3, ramSensitive:true,  rtSupport:false, upscaleBoost:1.55, note:"CPU-bound. Even top-end CPUs struggle in large cities." },
  { name:"Total War: Warhammer III", year:2022, genre:"Strategy / RTS",      base:115, cpuScale:0.45,ramSensitive:true,  rtSupport:false, upscaleBoost:1.40, note:"CPU-limited during battles with many units. Fast CPU core speed matters." },
  // ── Mid-weight AAA ─────────────────────────────────────────────────────────
  { name:"Red Dead Redemption 2",    year:2019, genre:"Action / Open World", base:132, cpuScale:0.9, ramSensitive:true,  rtSupport:false, upscaleBoost:1.40, note:"One of the best-optimised open-world games on PC." },
  { name:"The Witcher 3 (Next Gen)", year:2022, genre:"RPG",                 base:165, cpuScale:1.0, ramSensitive:false, rtSupport:true,  upscaleBoost:1.45, note:"RT overhaul is detailed but manageable. DLSS 3 support on RTX 30/40." },
  { name:"Elden Ring",               year:2022, genre:"Action RPG",          base:175, cpuScale:0.9, ramSensitive:false, rtSupport:false, upscaleBoost:1.00, note:"Capped at 60 FPS natively. Use mods or tools to unlock frame rate." },
  { name:"God of War",               year:2022, genre:"Action Adventure",    base:172, cpuScale:1.0, ramSensitive:false, rtSupport:false, upscaleBoost:1.40, note:"Excellent PC port. Scales well from low to ultra settings." },
  { name:"Baldur's Gate 3",          year:2023, genre:"RPG / Strategy",      base:120, cpuScale:0.6, ramSensitive:true,  rtSupport:false, upscaleBoost:1.40, note:"Act 3 is notably heavier than earlier chapters. 16GB RAM minimum." },
  { name:"Ghost of Tsushima",        year:2024, genre:"Action Adventure",    base:180, cpuScale:1.0, ramSensitive:false, rtSupport:false, upscaleBoost:1.40, note:"Excellent PC port with good AMD and NVIDIA support." },
  { name:"Helldivers 2",             year:2024, genre:"Co-op Shooter",       base:155, cpuScale:0.8, ramSensitive:false, rtSupport:false, upscaleBoost:1.40, note:"VRAM usage spikes in dense combat. Aim for 8GB VRAM minimum." },
  { name:"Palworld",                 year:2024, genre:"Survival / Crafting", base:162, cpuScale:0.7, ramSensitive:true,  rtSupport:false, upscaleBoost:1.40, note:"CPU-sensitive in large bases. Still benefits from optimisation patches." },
  { name:"Marvel Rivals",            year:2024, genre:"Hero Shooter",        base:188, cpuScale:0.9, ramSensitive:false, rtSupport:false, upscaleBoost:1.45, note:"Good optimisation. High-refresh play accessible on mid-range hardware." },
  { name:"Diablo IV",                year:2023, genre:"ARPG",                base:168, cpuScale:1.0, ramSensitive:false, rtSupport:false, upscaleBoost:1.40, note:"Well optimised. Ultra 4K is accessible on high-end GPU." },
  { name:"Spider-Man: Miles Morales",year:2022, genre:"Action Adventure",    base:205, cpuScale:1.0, ramSensitive:false, rtSupport:true,  upscaleBoost:1.50, note:"Excellent RT reflections. DLSS + RT is a very playable combo on RTX 30+." },
  { name:"Ratchet & Clank: Rift Apart",year:2023,genre:"Platformer",        base:188, cpuScale:1.0, ramSensitive:false, rtSupport:true,  upscaleBoost:1.50, note:"One of the best-looking PC ports available. RT is highly recommended." },
  { name:"Returnal",                 year:2023, genre:"Roguelike Shooter",   base:195, cpuScale:1.0, ramSensitive:false, rtSupport:false, upscaleBoost:1.40, note:"Good port, consistent frame pacing." },
  { name:"Death Stranding 2",        year:2025, genre:"Action / Open World", base:195, cpuScale:1.0, ramSensitive:false, rtSupport:false, upscaleBoost:1.40, note:"Well-optimised Decima engine title." },
  { name:"Forza Horizon 5",          year:2021, genre:"Racing",              base:178, cpuScale:1.1, ramSensitive:false, rtSupport:false, upscaleBoost:1.40, note:"Excellent optimisation. Enjoyable on a wide range of hardware." },
  { name:"F1 24",                    year:2024, genre:"Racing / Sim",        base:208, cpuScale:1.2, ramSensitive:false, rtSupport:false, upscaleBoost:1.40, note:"CPU-limited at high frame rates. Good RT support." },
  { name:"Halo Infinite",            year:2021, genre:"FPS",                 base:172, cpuScale:1.1, ramSensitive:false, rtSupport:false, upscaleBoost:1.40, note:"Good open-world FPS performance. Campaign is heavier than multiplayer." },
  // ── Esports / Competitive ──────────────────────────────────────────────────
  { name:"Counter-Strike 2",         year:2023, genre:"Tactical FPS",        base:340, cpuScale:2.2, ramSensitive:false, rtSupport:false, upscaleBoost:1.00, note:"Very CPU-sensitive. Fast CPUs yield significantly more frames." },
  { name:"Valorant",                 year:2020, genre:"Tactical FPS",        base:400, cpuScale:2.5, ramSensitive:false, rtSupport:false, upscaleBoost:1.00, note:"Extremely light on GPU. CPU and RAM speed are the main performance factors." },
  { name:"Apex Legends",             year:2019, genre:"Battle Royale",       base:248, cpuScale:1.6, ramSensitive:false, rtSupport:false, upscaleBoost:1.00, note:"CPU-sensitive at high frame rates. Source engine benefits from fast single-core performance." },
  { name:"Fortnite",                 year:2017, genre:"Battle Royale",       base:218, cpuScale:1.4, ramSensitive:false, rtSupport:true,  upscaleBoost:1.40, note:"Lumen (full RT) mode is very demanding. Standard mode runs on almost anything." },
  { name:"Call of Duty: Black Ops 6",year:2024, genre:"FPS",                 base:212, cpuScale:1.3, ramSensitive:false, rtSupport:false, upscaleBoost:1.35, note:"Good optimisation. Consistent performance across hardware tiers." },
  { name:"Rainbow Six Siege",        year:2015, genre:"Tactical FPS",        base:305, cpuScale:2.0, ramSensitive:false, rtSupport:false, upscaleBoost:1.00, note:"Very CPU-sensitive at high frame rates. Low GPU demands." },
  { name:"Doom Eternal",             year:2020, genre:"FPS",                 base:285, cpuScale:1.5, ramSensitive:false, rtSupport:false, upscaleBoost:1.00, note:"id Tech 7 is exceptionally well-optimised. Runs excellently on mid-range hardware." },
  // ── Other ──────────────────────────────────────────────────────────────────
  { name:"GTA V",                    year:2015, genre:"Open World",          base:218, cpuScale:1.4, ramSensitive:false, rtSupport:false, upscaleBoost:1.00, note:"Old engine. CPU-sensitive. Runs on nearly any modern hardware at max settings." },
  { name:"EA Sports FC 25",          year:2024, genre:"Sports",              base:272, cpuScale:1.5, ramSensitive:false, rtSupport:false, upscaleBoost:1.00, note:"CPU and RAM speed matter more than GPU for frame rates in this title." },
  { name:"Minecraft (with Shaders)", year:2024, genre:"Sandbox",             base:95,  cpuScale:1.2, ramSensitive:false, rtSupport:false, upscaleBoost:1.30, note:"Shader performance depends heavily on the specific shader pack. Values shown for OptiFine-tier shaders." },
  { name:"Baldur's Gate 3",          year:2023, genre:"RPG",                 base:120, cpuScale:0.6, ramSensitive:true,  rtSupport:false, upscaleBoost:1.40, note:"Act 3 in particular is heavier on CPU." },
];

// Remove duplicate Baldur's Gate
const GAME_LIST = GAMES.filter((g, i, arr) => arr.findIndex(x => x.name === g.name) === i);

// ── FPS calculation ───────────────────────────────────────────────────────────
function estimateFPS(gpuKey, cpuKey, ramKey, resolution, quality, game) {
  const gpuMult   = GPU_MULT[gpuKey]      || 0.5;
  const cpuFPS    = CPU_FPS[cpuKey]       || 160;
  const ramMult   = RAM_MULT[ramKey]      || 1.0;
  const resMult   = RES_SCALE[resolution] || 1.0;
  const qualMult  = QUALITY_SCALE[quality]|| 1.0;

  // Raw GPU-limited FPS
  let gpuFPS = game.base * gpuMult * resMult * qualMult;

  // Apply RAM penalty (only for RAM-sensitive games)
  if (game.ramSensitive && ramKey === "8GB") {
    gpuFPS *= RAM_MULT["8GB"];
  }

  // CPU ceiling for this game/resolution
  // cpuScale > 1: game benefits a lot from fast CPU (esports)
  // cpuScale < 1: game has a low CPU ceiling even on fast hardware
  const cpuResFactor = resolution === "1080p" ? 1.5 : resolution === "4K" ? 0.5 : 1.0;
  const cpuCeiling = cpuFPS * game.cpuScale * cpuResFactor;

  // Final FPS = minimum of GPU and CPU ceiling
  const raw = Math.min(gpuFPS, cpuCeiling);

  // Round appropriately
  const finalFPS = raw >= 100 ? Math.round(raw / 5) * 5 : Math.round(raw);

  // DLSS/FSR estimate (Quality mode ≈ 67% render res, ~boostFactor gain)
  const hasRT = quality === "Ultra + RT";
  const dlssApplicable = game.upscaleBoost > 1.0 && !["Valorant","Counter-Strike 2","Apex Legends","Rainbow Six Siege","GTA V","EA Sports FC 25","Doom Eternal"].includes(game.name);
  const dlssFPS = dlssApplicable ? Math.round(finalFPS * game.upscaleBoost / 5) * 5 : null;

  return { fps: finalFPS, dlssFPS, cpuLimited: gpuFPS > cpuCeiling };
}

// ── Performance tier ──────────────────────────────────────────────────────────
function fpsTier(fps) {
  if (fps <  20) return { label: "UNPLAYABLE",    cssClass: "critical", color: "var(--critical)", icon: "💀" };
  if (fps <  30) return { label: "VERY POOR",     cssClass: "critical", color: "var(--critical)", icon: "🔴" };
  if (fps <  45) return { label: "PLAYABLE",      cssClass: "hot",      color: "var(--hot)",      icon: "🟠" };
  if (fps <  60) return { label: "DECENT",        cssClass: "warm",     color: "var(--warm)",     icon: "🟡" };
  if (fps < 90)  return { label: "SMOOTH",        cssClass: "safe",     color: "var(--safe)",     icon: "🟢" };
  if (fps < 144) return { label: "GREAT",         cssClass: "safe",     color: "var(--safe)",     icon: "✅" };
  if (fps < 240) return { label: "HIGH REFRESH",  cssClass: "safe",     color: "var(--accent)",   icon: "⚡" };
  return               { label: "OVERKILL",       cssClass: "safe",     color: "var(--accent)",   icon: "🚀" };
}

// ── Game search ───────────────────────────────────────────────────────────────
function searchGames(query) {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return GAME_LIST
    .filter(g => g.name.toLowerCase().includes(q))
    .slice(0, 7);
}

// ── MAIN: Run estimate ────────────────────────────────────────────────────────
var selectedGame = null;

function selectGame(game) {
  selectedGame = game;
  document.getElementById("fps-game-input").value = game.name;
  document.getElementById("fps-suggestions").innerHTML = "";
  document.getElementById("fps-suggestions").style.display = "none";
  // Show selected badge
  const badge = document.getElementById("fps-game-badge");
  badge.innerHTML =
    '<span style="background:rgba(0,200,255,0.1); border:1px solid rgba(0,200,255,0.25); border-radius:6px; padding:0.3rem 0.75rem; font-family:\'JetBrains Mono\',monospace; font-size:0.72rem; color:var(--accent);">' +
    game.name + ' · ' + game.genre + ' · ' + game.year +
    '</span>';
  badge.style.display = "flex";
}

function handleGameSearch() {
  const q   = document.getElementById("fps-game-input").value;
  const box = document.getElementById("fps-suggestions");

  if (!q || q.length < 1) {
    box.style.display = "none";
    return;
  }

  const results = searchGames(q);
  if (results.length === 0) {
    box.innerHTML = '<div style="padding:0.75rem 1rem; font-size:0.82rem; color:#8888a0;">No matching games found</div>';
    box.style.display = "block";
    return;
  }

  box.innerHTML = results.map(g =>
    '<div class="fps-suggestion-item" onclick="selectGame(' + JSON.stringify(g).replace(/"/g,'&quot;') + ')" ' +
    'style="padding:0.65rem 1rem; cursor:pointer; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border);">' +
      '<div>' +
        '<div style="font-size:0.85rem; color:var(--text);">' + g.name + '</div>' +
        '<div style="font-size:0.72rem; color:#8888a0; font-family:\'JetBrains Mono\',monospace;">' + g.genre + '</div>' +
      '</div>' +
      '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.68rem; color:#555568;">' + g.year + '</div>' +
    '</div>'
  ).join('');
  box.style.display = "block";
}

function runFPSEstimate() {
  const gpuKey    = document.getElementById("fps-gpu").value;
  const cpuKey    = document.getElementById("fps-cpu").value;
  const ramKey    = document.getElementById("fps-ram").value;
  const res       = document.getElementById("fps-res").value;
  const quality   = document.getElementById("fps-quality").value;
  const errorEl   = document.getElementById("fps-error");
  const resultEl  = document.getElementById("fps-result");
  const defaultEl = document.getElementById("fps-default");

  errorEl.textContent = "";
  errorEl.style.display = "none";

  if (!gpuKey) { errorEl.textContent = "Please select your GPU."; errorEl.style.display = "block"; return; }
  if (!cpuKey) { errorEl.textContent = "Please select your CPU."; errorEl.style.display = "block"; return; }
  if (!selectedGame) { errorEl.textContent = "Please search for and select a game."; errorEl.style.display = "block"; return; }

  // Validate Ultra+RT only if game supports it
  if (quality === "Ultra + RT" && !selectedGame.rtSupport) {
    errorEl.textContent = selectedGame.name + " doesn't have meaningful ray tracing support. Try Ultra instead.";
    errorEl.style.display = "block";
    return;
  }

  const est  = estimateFPS(gpuKey, cpuKey, ramKey, res, quality, selectedGame);
  const tier = fpsTier(est.fps);
  const frameTime = (1000 / est.fps).toFixed(1);

  // Build bar chart: show different quality fps values for context
  const barData = [
    { label:"Low",    fps: Math.min(estimateFPS(gpuKey,cpuKey,ramKey,res,"Low",selectedGame).fps,     999) },
    { label:"Medium", fps: Math.min(estimateFPS(gpuKey,cpuKey,ramKey,res,"Medium",selectedGame).fps,  999) },
    { label:"High",   fps: Math.min(estimateFPS(gpuKey,cpuKey,ramKey,res,"High",selectedGame).fps,    999) },
    { label:"Ultra",  fps: Math.min(estimateFPS(gpuKey,cpuKey,ramKey,res,"Ultra",selectedGame).fps,   999) },
  ];
  if (selectedGame.rtSupport) {
    barData.push({ label:"Ultra+RT", fps: Math.min(estimateFPS(gpuKey,cpuKey,ramKey,res,"Ultra + RT",selectedGame).fps, 999) });
  }

  const maxBar = Math.max(...barData.map(b => b.fps));
  const barsHTML = barData.map(b => {
    const t = fpsTier(b.fps);
    const w = Math.max(4, Math.round((b.fps / maxBar) * 100));
    const active = b.label === quality.replace(" + RT","") || (b.label === "Ultra+RT" && quality === "Ultra + RT");
    return `<div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.45rem; ${active ? "background:rgba(255,255,255,0.03); border-radius:4px; margin:-2px; padding:2px;" : ""}">
      <div style="font-family:'JetBrains Mono',monospace; font-size:0.68rem; color:${active?'var(--text)':'#8888a0'}; width:60px; flex-shrink:0; ${active?'font-weight:600':''}">${b.label}</div>
      <div style="flex:1; height:8px; background:var(--surface2); border-radius:4px; overflow:hidden;">
        <div style="width:${w}%; height:100%; background:${t.color}; border-radius:4px;"></div>
      </div>
      <div style="font-family:'JetBrains Mono',monospace; font-size:0.78rem; color:${t.color}; width:45px; text-align:right; flex-shrink:0; ${active?'font-weight:600':''}">${b.fps}</div>
    </div>`;
  }).join('');

  const dlssNote = est.dlssFPS
    ? `<div style="background:rgba(0,200,255,0.06); border:1px solid rgba(0,200,255,0.2); border-left:3px solid var(--accent); border-radius:6px; padding:0.75rem 1rem; font-size:0.82rem; color:#b0b0c8; line-height:1.6; margin-bottom:1rem;">
        <strong style="color:var(--accent);">With DLSS/FSR Quality Mode:</strong> ~${est.dlssFPS} FPS — upscaling from a lower resolution delivers significantly more frames with minimal visual impact. Strongly recommended for this title.
       </div>`
    : "";

  const cpuNote = est.cpuLimited
    ? `<div style="background:rgba(255,170,0,0.06); border:1px solid rgba(255,170,0,0.2); border-left:3px solid var(--warm); border-radius:6px; padding:0.75rem 1rem; font-size:0.82rem; color:#b0b0c8; line-height:1.6; margin-bottom:1rem;">
        ⚠️ <strong style="color:var(--warm);">CPU-limited:</strong> Your ${cpuKey} is the performance ceiling for ${selectedGame.name} at ${res}. A faster CPU would increase FPS beyond this estimate.
       </div>`
    : "";

  const ramNote = (ramKey === "8GB" && selectedGame.ramSensitive)
    ? `<div style="background:rgba(255,34,68,0.05); border:1px solid rgba(255,34,68,0.2); border-left:3px solid var(--critical); border-radius:6px; padding:0.75rem 1rem; font-size:0.82rem; color:#b0b0c8; line-height:1.6; margin-bottom:1rem;">
        🔴 <strong style="color:var(--critical);">8GB RAM warning:</strong> ${selectedGame.name} benefits significantly from 16GB. Expect stutter and reduced average FPS with 8GB.
       </div>`
    : "";

  resultEl.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem; margin-bottom:1.25rem;">
      <div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.65rem; letter-spacing:0.1em; text-transform:uppercase; color:#8888a0; margin-bottom:0.2rem;">${selectedGame.name} · ${res} · ${quality}</div>
        <div style="font-family:'Bebas Neue',sans-serif; font-size:3.5rem; color:${tier.color}; line-height:1;">${est.fps} <span style="font-size:1.5rem; color:#8888a0;">FPS</span></div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.75rem; color:${tier.color}; margin-top:0.15rem;">${tier.icon} ${tier.label}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.62rem; text-transform:uppercase; color:#8888a0; margin-bottom:0.2rem;">Frame Time</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:1.6rem; color:var(--text); font-weight:600;">${frameTime}<span style="font-size:0.85rem; color:#8888a0;"> ms</span></div>
        <div style="font-size:0.72rem; color:#555568;">${gpuKey}</div>
      </div>
    </div>

    ${cpuNote}${ramNote}${dlssNote}

    <div style="font-family:'JetBrains Mono',monospace; font-size:0.62rem; letter-spacing:0.1em; text-transform:uppercase; color:#8888a0; margin-bottom:0.5rem;">All Quality Presets at ${res}</div>
    <div style="margin-bottom:1.25rem;">${barsHTML}</div>

    <div style="background:var(--surface2); border-radius:8px; padding:0.875rem 1rem; border:1px solid var(--border); font-size:0.82rem; color:#b0b0c8; line-height:1.65;">
      <strong style="color:var(--text);">About ${selectedGame.name}:</strong> ${selectedGame.note}
    </div>

    <div style="font-size:0.7rem; color:#555568; margin-top:0.875rem; line-height:1.6; padding-top:0.75rem; border-top:1px solid var(--border);">
      Estimates based on aggregated benchmark data at native resolution without upscaling. Actual performance varies by scene, driver version, and system configuration. Numbers are approximate ±10–15%.
    </div>`;

  resultEl.className = "result-box " + tier.cssClass + " show";
  if (defaultEl) defaultEl.style.display = "none";
  setTimeout(() => resultEl.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
}

// Close suggestions on outside click
document.addEventListener("click", function(e) {
  const box = document.getElementById("fps-suggestions");
  if (box && !box.contains(e.target) && e.target.id !== "fps-game-input") {
    box.style.display = "none";
  }
});
