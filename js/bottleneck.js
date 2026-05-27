/**
 * TempCore — PC Bottleneck Checker (v2)
 *
 * DATA SOURCE: Approximate average FPS from aggregated hardware reviews
 * (Tom's Hardware, GamersNexus, TechPowerUp, Digital Foundry).
 * All values represent average FPS across a typical AAA game mix at
 * high/ultra settings unless stated. These are estimates, not absolutes.
 *
 * KEY LOGIC FIX vs v1:
 * - CPU score = FPS CEILING the CPU can sustain (feed to the GPU)
 * - GPU score = FPS the GPU can RENDER at that resolution
 * - actual FPS = min(cpu_ceiling, gpu_fps)
 * - If GPU fps < CPU ceiling → GPU is the active limiter (expected at high res)
 * - If CPU ceiling < GPU fps → CPU is bottlenecking the GPU (concerning)
 */

// ── CPU FPS CEILINGS ──────────────────────────────────────────────────────────
// Approximate FPS ceiling the CPU can sustain in typical gaming workloads
// (measured at 1440p with a GPU that is NOT the bottleneck)
// Sources: GamersNexus, Tom's Hardware CPU gaming benchmarks 2022–2024

const CPU_FPS = {
  // ── Intel 14th Gen ───────────────────────────────────────────────────────
  "Core i9-14900K":    240,
  "Core i9-14900KF":   240,
  "Core i7-14700K":    225,
  "Core i7-14700KF":   225,
  "Core i5-14600K":    215,
  "Core i5-14600KF":   215,

  // ── Intel 13th Gen ───────────────────────────────────────────────────────
  "Core i9-13900K":    238,
  "Core i9-13900KF":   238,
  "Core i7-13700K":    220,
  "Core i7-13700KF":   220,
  "Core i7-13700":     200,
  "Core i5-13600K":    210,
  "Core i5-13600KF":   210,
  "Core i5-13500":     195,
  "Core i5-13400":     188,
  "Core i5-13400F":    188,
  "Core i3-13100":     155,
  "Core i3-13100F":    155,

  // ── Intel 12th Gen ───────────────────────────────────────────────────────
  "Core i9-12900K":    220,
  "Core i9-12900KF":   220,
  "Core i7-12700K":    205,
  "Core i7-12700KF":   205,
  "Core i7-12700":     192,
  "Core i5-12600K":    200,
  "Core i5-12600KF":   200,
  "Core i5-12600":     180,
  "Core i5-12400":     175,
  "Core i5-12400F":    175,
  "Core i3-12100":     150,
  "Core i3-12100F":    150,

  // ── Intel 11th / 10th Gen ────────────────────────────────────────────────
  "Core i9-11900K":    180,
  "Core i7-11700K":    170,
  "Core i5-11600K":    162,
  "Core i9-10900K":    178,
  "Core i7-10700K":    168,
  "Core i5-10600K":    155,
  "Core i5-10400":     140,
  "Core i5-10400F":    140,

  // ── AMD Ryzen 7000 (Zen 4) ────────────────────────────────────────────────
  "Ryzen 9 7950X3D":   248,   // 3D V-Cache across 16C
  "Ryzen 9 7950X":     218,
  "Ryzen 9 7900X3D":   244,
  "Ryzen 9 7900X":     215,
  "Ryzen 9 7900":      205,
  "Ryzen 7 7800X3D":   260,   // Best gaming CPU — 3D V-Cache + Zen 4
  "Ryzen 7 7700X":     212,
  "Ryzen 7 7700":      205,
  "Ryzen 5 7600X":     208,
  "Ryzen 5 7600":      200,
  "Ryzen 5 7500F":     195,

  // ── AMD Ryzen 5000 (Zen 3) ────────────────────────────────────────────────
  "Ryzen 9 5950X":     192,
  "Ryzen 9 5900X":     188,
  "Ryzen 7 5800X3D":   248,   // 3D V-Cache — best Zen 3 gaming CPU
  "Ryzen 7 5800X":     182,
  "Ryzen 7 5700X":     175,
  "Ryzen 5 5600X":     185,
  "Ryzen 5 5600":      180,
  "Ryzen 5 5600G":     162,
  "Ryzen 5 5500":      158,
  "Ryzen 3 5300G":     135,

  // ── AMD Ryzen 3000 (Zen 2) ────────────────────────────────────────────────
  "Ryzen 9 3900XT":    162,
  "Ryzen 9 3900X":     158,
  "Ryzen 7 3800XT":    155,
  "Ryzen 7 3800X":     152,
  "Ryzen 7 3700X":     150,
  "Ryzen 5 3600XT":    148,
  "Ryzen 5 3600X":     145,
  "Ryzen 5 3600":      142,
  "Ryzen 3 3300X":     132,
  "Ryzen 3 3100":      122,

  // ── AMD Ryzen 2000 (Zen+) ─────────────────────────────────────────────────
  "Ryzen 7 2700X":     120,
  "Ryzen 7 2700":      112,
  "Ryzen 5 2600X":     118,
  "Ryzen 5 2600":      112,
};

// ── GPU FPS OUTPUT ────────────────────────────────────────────────────────────
// Approximate average FPS at high/ultra settings across popular AAA titles
// Sources: Tom's Hardware, GamersNexus GPU benchmark hierarchies 2023–2024
// f1080 = 1080p, f1440 = 1440p, f4k = 4K
// Also: cores (GPU shader processors in thousands, for display only),
// vram (GB), tier string

const GPU_FPS = {

  // ── NVIDIA RTX 50 Series (Blackwell, GDDR7) ─────────────────────────────────
  // Sources: GamersNexus, Tom's Hardware GPU hierarchy, PNY 5080 review 2025
  // RTX 5090: ~30% faster than 4090 at 4K, 17% at 1440p (Tom's Hardware hierarchy)
  "RTX 5090":          { f1080: 338, f1440: 222, f4k: 127, vram: 32 },
  // RTX 5080: ~15-20% behind 5090, roughly matches or slightly trails 4090 at 4K
  "RTX 5080":          { f1080: 278, f1440: 175, f4k:  97, vram: 16 },
  // RTX 5070 Ti: ~18% slower than 5080 (PNY 5080 review), strong 1440p card
  "RTX 5070 Ti":       { f1080: 237, f1440: 148, f4k:  81, vram: 16 },
  // RTX 5070: ~30% slower than 5070 Ti (PNY 5080 review extrapolated)
  "RTX 5070":          { f1080: 205, f1440: 130, f4k:  70, vram: 12 },
  // RTX 5060 Ti: similar performance tier to RTX 4070, GDDR7 helps bandwidth
  "RTX 5060 Ti 16GB":  { f1080: 168, f1440: 106, f4k:  55, vram: 16 },
  "RTX 5060 Ti":       { f1080: 165, f1440: 104, f4k:  54, vram:  8 },
  // RTX 5060: ~10-15% faster than RTX 4060 with improved GDDR7 bandwidth
  "RTX 5060":          { f1080: 150, f1440:  95, f4k:  47, vram:  8 },

  // ── NVIDIA RTX 40 Series ─────────────────────────────────────────────────
  "RTX 4090":          { f1080: 310, f1440: 190, f4k:  98, vram: 24 },
  "RTX 4080 Super":    { f1080: 272, f1440: 168, f4k:  85, vram: 16 },
  "RTX 4080":          { f1080: 258, f1440: 160, f4k:  82, vram: 16 },
  "RTX 4070 Ti Super": { f1080: 240, f1440: 150, f4k:  76, vram: 16 },
  "RTX 4070 Ti":       { f1080: 220, f1440: 138, f4k:  70, vram: 12 },
  "RTX 4070 Super":    { f1080: 210, f1440: 130, f4k:  66, vram: 12 },
  "RTX 4070":          { f1080: 185, f1440: 115, f4k:  58, vram: 12 },
  "RTX 4060 Ti 16GB":  { f1080: 165, f1440: 100, f4k:  48, vram: 16 },
  "RTX 4060 Ti":       { f1080: 163, f1440:  99, f4k:  47, vram:  8 },
  "RTX 4060":          { f1080: 140, f1440:  86, f4k:  39, vram:  8 },

  // RTX 40 Laptop (noticeably lower than desktop due to power limits)
  "RTX 4090 (Laptop)": { f1080: 205, f1440: 128, f4k:  62, vram: 16 },
  "RTX 4080 (Laptop)": { f1080: 178, f1440: 110, f4k:  52, vram: 12 },
  "RTX 4070 (Laptop)": { f1080: 155, f1440:  95, f4k:  44, vram:  8 },
  "RTX 4060 (Laptop)": { f1080: 128, f1440:  78, f4k:  35, vram:  8 },
  "RTX 4050 (Laptop)": { f1080: 100, f1440:  61, f4k:  27, vram:  6 },

  // ── NVIDIA RTX 30 Series ─────────────────────────────────────────────────
  "RTX 3090 Ti":       { f1080: 235, f1440: 148, f4k:  74, vram: 24 },
  "RTX 3090":          { f1080: 222, f1440: 140, f4k:  70, vram: 24 },
  "RTX 3080 Ti":       { f1080: 215, f1440: 135, f4k:  68, vram: 12 },
  "RTX 3080 12GB":     { f1080: 205, f1440: 128, f4k:  64, vram: 12 },
  "RTX 3080 10GB":     { f1080: 200, f1440: 125, f4k:  62, vram: 10 },
  "RTX 3070 Ti":       { f1080: 182, f1440: 112, f4k:  54, vram:  8 },
  "RTX 3070":          { f1080: 170, f1440: 108, f4k:  52, vram:  8 },
  "RTX 3060 Ti":       { f1080: 155, f1440:  97, f4k:  46, vram:  8 },
  "RTX 3060":          { f1080: 128, f1440:  80, f4k:  37, vram: 12 },
  "RTX 3050":          { f1080:  98, f1440:  60, f4k:  27, vram:  8 },

  // ── NVIDIA GTX Series ─────────────────────────────────────────────────────
  "GTX 1080 Ti":       { f1080: 130, f1440:  82, f4k:  38, vram: 11 },
  "GTX 1080":          { f1080: 108, f1440:  68, f4k:  32, vram:  8 },
  "GTX 1070 Ti":       { f1080:  97, f1440:  62, f4k:  28, vram:  8 },
  "GTX 1070":          { f1080:  88, f1440:  56, f4k:  25, vram:  8 },
  "GTX 1660 Ti":       { f1080:  93, f1440:  58, f4k:  26, vram:  6 },
  "GTX 1660 Super":    { f1080:  90, f1440:  56, f4k:  25, vram:  6 },
  "GTX 1660":          { f1080:  78, f1440:  48, f4k:  21, vram:  6 },
  "GTX 1650 Super":    { f1080:  70, f1440:  43, f4k:  18, vram:  4 },
  "GTX 1650":          { f1080:  57, f1440:  34, f4k:  14, vram:  4 },
  "GTX 1060 6GB":      { f1080:  65, f1440:  40, f4k:  18, vram:  6 },
  "GTX 1060 3GB":      { f1080:  55, f1440:  32, f4k:  13, vram:  3 },
  "GTX 1050 Ti":       { f1080:  44, f1440:  26, f4k:  11, vram:  4 },

  // ── AMD RX 7000 Series ────────────────────────────────────────────────────
  "RX 7900 XTX":       { f1080: 282, f1440: 185, f4k:  97, vram: 24 },
  "RX 7900 XT":        { f1080: 250, f1440: 162, f4k:  84, vram: 20 },
  "RX 7900 GRE":       { f1080: 218, f1440: 140, f4k:  72, vram: 16 },
  "RX 7800 XT":        { f1080: 188, f1440: 120, f4k:  60, vram: 16 },
  "RX 7700 XT":        { f1080: 165, f1440: 104, f4k:  50, vram: 12 },
  "RX 7600 XT":        { f1080: 144, f1440:  90, f4k:  42, vram: 16 },
  "RX 7600":           { f1080: 128, f1440:  80, f4k:  37, vram:  8 },

  // ── AMD RX 6000 Series ────────────────────────────────────────────────────
  "RX 6950 XT":        { f1080: 235, f1440: 152, f4k:  78, vram: 16 },
  "RX 6900 XT":        { f1080: 222, f1440: 143, f4k:  73, vram: 16 },
  "RX 6800 XT":        { f1080: 200, f1440: 128, f4k:  65, vram: 16 },
  "RX 6800":           { f1080: 182, f1440: 117, f4k:  59, vram: 16 },
  "RX 6750 XT":        { f1080: 162, f1440: 103, f4k:  51, vram: 12 },
  "RX 6700 XT":        { f1080: 148, f1440:  94, f4k:  46, vram: 12 },
  "RX 6700":           { f1080: 135, f1440:  86, f4k:  42, vram: 10 },
  "RX 6650 XT":        { f1080: 125, f1440:  79, f4k:  36, vram:  8 },
  "RX 6600 XT":        { f1080: 115, f1440:  72, f4k:  33, vram:  8 },
  "RX 6600":           { f1080: 105, f1440:  66, f4k:  30, vram:  8 },
  "RX 6500 XT":        { f1080:  62, f1440:  37, f4k:  15, vram:  4 },
  "RX 6400":           { f1080:  48, f1440:  29, f4k:  11, vram:  4 },
};

// ── Use-case CPU penalties ────────────────────────────────────────────────────
// Streaming and editing consume CPU cores, reducing the gaming FPS ceiling
const UC_CPU_MULTIPLIER = {
  gaming:    1.00,
  streaming: 0.82,  // ~18% CPU headroom consumed by encoder
  editing:   0.70,  // heavy CPU utilisation during render/export
};

// ── Core calculation ──────────────────────────────────────────────────────────
function calcBottleneck(cpuFPS, gpuFPS) {
  // actual FPS you'll see = the lower of the two
  // if GPU fps < CPU ceiling → GPU is the active limiter (normal at high res)
  // if CPU ceiling < GPU fps → CPU is preventing the GPU from reaching potential
  if (gpuFPS <= cpuFPS) {
    // GPU is the active limiter
    const pct = Math.round((cpuFPS - gpuFPS) / cpuFPS * 100);
    return { type: "gpu_limited", pct, fps: gpuFPS };
  } else {
    // CPU is bottlenecking the GPU
    const pct = Math.round((gpuFPS - cpuFPS) / gpuFPS * 100);
    return { type: "cpu_bottleneck", pct, fps: cpuFPS };
  }
}

// ── Result tier ───────────────────────────────────────────────────────────────
// GPU-limited is the normal, expected state — framed neutrally/positively.
// CPU bottleneck is the concerning state — framed as a problem.
function getTier(type, pct) {
  if (type === "gpu_limited") {
    // GPU-limited = GPU is the active renderer. This is the DESIRED state.
    // Only flag it as a concern when the GPU is dramatically slower than the CPU.
    if (pct <= 15) return { label: "WELL MATCHED",            cssClass: "safe",     color: "var(--safe)",     summary: "Both components are evenly matched. Excellent balance." };
    if (pct <= 40) return { label: "GPU-LIMITED",              cssClass: "safe",     color: "var(--safe)",     summary: "Your GPU is the active limiter — this is the expected, healthy state for gaming." };
    if (pct <= 60) return { label: "GPU-LIMITED",              cssClass: "warm",     color: "var(--warm)",     summary: "GPU is a notable constraint at this resolution. Upgrading the GPU gives more FPS." };
    if (pct <= 75) return { label: "GPU UPGRADE RECOMMENDED",  cssClass: "hot",      color: "var(--hot)",      summary: "Your CPU has significant unused headroom. A GPU upgrade would be the highest-impact change." };
    return               { label: "GPU FAR TOO SLOW",         cssClass: "critical", color: "var(--critical)", summary: "The GPU is severely holding back this CPU. Upgrade the GPU as a priority." };
  } else {
    // CPU bottleneck = CPU is preventing the GPU from reaching its potential. Concerning.
    if (pct <= 10) return { label: "WELL MATCHED",       cssClass: "safe",     color: "var(--safe)",     summary: "Very close match. Negligible CPU limitation — within normal range." };
    if (pct <= 20) return { label: "MILD CPU LIMIT",     cssClass: "safe",     color: "var(--safe)",     summary: "Minor CPU limitation. Common at 1080p with fast GPUs — not a meaningful concern." };
    if (pct <= 35) return { label: "CPU BOTTLENECK",     cssClass: "warm",     color: "var(--warm)",     summary: "CPU is noticeably limiting GPU output. A CPU upgrade would unlock more FPS." };
    if (pct <= 55) return { label: "HEAVY CPU LIMIT",    cssClass: "hot",      color: "var(--hot)",      summary: "CPU is a significant bottleneck. Considerable GPU performance is going unused." };
    return               { label: "SEVERE CPU LIMIT",   cssClass: "critical", color: "var(--critical)", summary: "The CPU is critically bottlenecking this GPU. Prioritise a CPU upgrade." };
  }
}

// ── Balance bar (correct direction) ──────────────────────────────────────────
// marker at centre = balanced
// marker left of centre = CPU is the bottleneck (CPU is slower)
// marker right of centre = GPU is the limiter (GPU is slower)
function buildBalanceBar(cpuFPS, gpuFPS) {
  const diff    = gpuFPS - cpuFPS; // positive = GPU slower (GPU limited), negative = CPU slower
  const maximum = Math.max(cpuFPS, gpuFPS);
  const ratio   = Math.max(-1, Math.min(1, diff / maximum));
  // ratio > 0 = GPU limited → marker shifts RIGHT (toward GPU label)
  // ratio < 0 = CPU bottleneck → marker shifts LEFT (toward CPU label)
  const markerX = 50 + (ratio * 36);

  const absPct  = Math.abs(ratio) * 100;
  let fillColor;
  if      (absPct < 10) fillColor = "var(--safe)";
  else if (absPct < 28) fillColor = "var(--safe)";
  else if (absPct < 45) fillColor = "var(--warm)";
  else if (absPct < 65) fillColor = "var(--hot)";
  else                  fillColor = "var(--critical)";

  const fillStart = ratio >= 0 ? 50 : markerX;
  const fillWidth = Math.abs(ratio) * 36;

  return `<svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block;">
    <rect x="20" y="20" width="160" height="7" rx="3.5" fill="#2a2a32"/>
    <rect x="${fillStart}" y="20" width="${fillWidth}" height="7" rx="2" fill="${fillColor}" opacity="0.45"/>
    <rect x="99" y="15" width="2" height="17" rx="1" fill="#444456"/>
    <circle cx="${markerX}" cy="23.5" r="9" fill="${fillColor}" opacity="0.3"/>
    <circle cx="${markerX}" cy="23.5" r="6" fill="${fillColor}"/>
    <text x="10" y="44" text-anchor="middle" fill="#8888a0" font-family="JetBrains Mono,monospace" font-size="7.5" letter-spacing="0.5">CPU</text>
    <text x="190" y="44" text-anchor="middle" fill="#8888a0" font-family="JetBrains Mono,monospace" font-size="7.5" letter-spacing="0.5">GPU</text>
    <text x="100" y="44" text-anchor="middle" fill="#555568" font-family="JetBrains Mono,monospace" font-size="6.5">BALANCED</text>
  </svg>`;
}

// ── Resolution result card ─────────────────────────────────────────────────
function resCard(res, result) {
  const tier = getTier(result.type, result.pct);
  const isGPULimited  = result.type === "gpu_limited";
  const limitLabel    = isGPULimited ? "GPU-limited" : "CPU-limited";
  const upgradeHint   = isGPULimited ? "→ GPU upgrade" : "→ CPU upgrade";

  return `<div style="background:var(--surface2); border:1px solid ${tier.color}33; border-top:2px solid ${tier.color}; border-radius:8px; padding:0.875rem 0.875rem;">
    <div style="font-family:'JetBrains Mono',monospace; font-size:0.65rem; letter-spacing:0.1em; text-transform:uppercase; color:#8888a0; margin-bottom:0.35rem;">${res}</div>
    <div style="font-family:'Bebas Neue',sans-serif; font-size:1.95rem; color:${tier.color}; line-height:1; margin-bottom:0.1rem;">${result.pct}%</div>
    <div style="font-family:'JetBrains Mono',monospace; font-size:0.68rem; color:${tier.color}; margin-bottom:0.35rem;">${limitLabel}</div>
    <div style="font-family:'JetBrains Mono',monospace; font-size:0.72rem; color:var(--safe); margin-bottom:0.3rem;">~${result.fps} FPS</div>
    <div style="font-size:0.72rem; color:#555568; line-height:1.4;">${result.pct > 15 ? upgradeHint : "✓ Good match"}</div>
  </div>`;
}

// ── Advice builder ────────────────────────────────────────────────────────────
function buildAdvice(cpuKey, gpuKey, useCase, r1080, r1440, r4k) {
  const cpu = CPU_FPS[cpuKey];
  const gpu = GPU_FPS[gpuKey];
  const tips = [];

  const cpuBottlenecks = [r1080, r1440, r4k].filter(r => r.type === "cpu_bottleneck" && r.pct > 20).length;
  const severeGPULimit = [r1080, r1440, r4k].filter(r => r.type === "gpu_limited" && r.pct > 45).length;

  // ── CPU bottleneck tips ─────────────────────────────────────────────────
  if (cpuBottlenecks >= 2) {
    tips.push(`Your <strong style="color:var(--text);">${cpuKey}</strong> is noticeably holding back your <strong style="color:var(--text);">${gpuKey}</strong>. Upgrading the CPU would unlock more GPU performance.`);
  }
  if (r1080.type === "cpu_bottleneck" && r1080.pct > 25 && r1440.type !== "cpu_bottleneck") {
    tips.push(`The CPU bottleneck is most visible at 1080p. Playing at 1440p would shift more load to the GPU and reduce this gap significantly.`);
  }
  if (r1440.type === "cpu_bottleneck" && r1440.pct > 20) {
    tips.push(`Even at 1440p your CPU is limiting FPS — this means your GPU is waiting on the CPU rather than rendering at full potential. Frames-per-second gains from a GPU upgrade would be partially offset.`);
  }

  // ── GPU-limited tips ────────────────────────────────────────────────────
  if (r1080.type === "gpu_limited" && r1080.pct > 0) {
    tips.push(`At 1080p your GPU is the active limiter — this is the expected state. Your CPU has headroom, which means frame times are stable and consistent.`);
  }
  if (severeGPULimit >= 2) {
    tips.push(`Your <strong style="color:var(--text);">${gpuKey}</strong> is significantly constraining this CPU across multiple resolutions. A GPU upgrade is the highest-impact way to improve FPS.`);
  }

  // ── 4K note ─────────────────────────────────────────────────────────────
  if (r4k.type === "gpu_limited") {
    tips.push(`At 4K every GPU becomes the bottleneck — this is completely normal. CPU choice barely affects 4K frame rates; your GPU is doing all the work.`);
  }

  // ── VRAM note ───────────────────────────────────────────────────────────
  if (gpu.vram < 8) {
    tips.push(`Your GPU has <strong style="color:var(--text);">${gpu.vram}GB VRAM</strong>. Modern games at 1440p+ can exceed this, causing stuttering or forced texture quality reductions. This is a separate constraint from the CPU/GPU balance.`);
  }

  // ── Use case notes ───────────────────────────────────────────────────────
  if (useCase === "streaming") {
    const cStr = r1440.type === "cpu_bottleneck" ? "worsened" : "introduced a mild";
    tips.push(`Streaming has ${cStr} CPU bottleneck by consuming ~18% of CPU capacity for encoding. A 6-core or better CPU handles this well; 4-core CPUs may drop frames.`);
  }
  if (useCase === "editing") {
    tips.push(`For video editing and rendering, CPU core count and RAM speed matter more than gaming metrics. GPU encode acceleration (NVENC, AMD VCE) also contributes — check if your GPU supports hardware encoding.`);
  }

  // ── Balanced note ───────────────────────────────────────────────────────
  if (cpuBottlenecks === 0 && severeGPULimit === 0 && tips.length === 0) {
    tips.push(`<strong style="color:var(--text);">${cpuKey}</strong> and <strong style="color:var(--text);">${gpuKey}</strong> are a solid pairing. Neither component is dramatically holding back the other.`);
  }

  // ── Always: explain the GPU-limited normal state ─────────────────────────
  if (!tips.some(t => t.includes("GPU-limited") || t.includes("active limiter") || t.includes("all the work"))) {
    if (r1440.type === "gpu_limited" && r1440.pct <= 30) {
      tips.push(`Being "GPU-limited" at 1440p is the desired state — it means your GPU is fully utilised and your CPU isn't wasting cycles waiting. This is what good PC balance looks like.`);
    }
  }

  return tips;
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
function checkBottleneck() {
  const cpuEl    = document.getElementById("bn-cpu");
  const gpuEl    = document.getElementById("bn-gpu");
  const ucEl     = document.getElementById("bn-usecase");
  const errorEl  = document.getElementById("bn-error");
  const resultEl = document.getElementById("bn-result");
  const defEl    = document.getElementById("bn-default");

  errorEl.textContent = "";
  errorEl.style.display = "none";

  const cpuKey  = cpuEl.value;
  const gpuKey  = gpuEl.value;
  const useCase = ucEl.value;

  if (!cpuKey) { errorEl.textContent = "Please select your CPU."; errorEl.style.display = "block"; return; }
  if (!gpuKey) { errorEl.textContent = "Please select your GPU."; errorEl.style.display = "block"; return; }

  const cpuBase = CPU_FPS[cpuKey];
  const gpu     = GPU_FPS[gpuKey];
  const cpuEff  = Math.round(cpuBase * UC_CPU_MULTIPLIER[useCase]);

  const r1080 = calcBottleneck(cpuEff, gpu.f1080);
  const r1440 = calcBottleneck(cpuEff, gpu.f1440);
  const r4k   = calcBottleneck(cpuEff, gpu.f4k);

  // Overall verdict = 1440p as the reference resolution
  const overallTier = getTier(r1440.type, r1440.pct);

  const bar    = buildBalanceBar(cpuEff, gpu.f1440);
  const advice = buildAdvice(cpuKey, gpuKey, useCase, r1080, r1440, r4k);
  const ucLabel = { gaming: "Gaming", streaming: "Gaming + Streaming", editing: "Video Editing" }[useCase];

  const adviceHTML = advice.map(a =>
    `<div class="suggestion-item"><div class="dot"></div><span>${a}</span></div>`
  ).join("");

  resultEl.innerHTML = `
    <div style="margin-bottom:1.1rem;">
      <div style="font-family:'JetBrains Mono',monospace; font-size:0.65rem; letter-spacing:0.1em; text-transform:uppercase; color:#8888a0; margin-bottom:0.15rem;">Verdict at 1440p · ${ucLabel}</div>
      <div style="font-family:'Bebas Neue',sans-serif; font-size:2.6rem; letter-spacing:0.04em; color:${overallTier.color}; line-height:1;">${overallTier.label}</div>
      <div style="font-size:0.82rem; color:#8888a0; margin-top:0.25rem;">${overallTier.summary}</div>
    </div>

    <!-- Balance bar at 1440p -->
    <div style="margin-bottom:1.25rem;">
      <div style="font-family:'JetBrains Mono',monospace; font-size:0.62rem; letter-spacing:0.1em; text-transform:uppercase; color:#8888a0; margin-bottom:0.35rem;">Balance at 1440p — marker left = CPU limits; right = GPU limits</div>
      ${bar}
    </div>

    <!-- Per-resolution cards -->
    <div style="font-family:'JetBrains Mono',monospace; font-size:0.62rem; letter-spacing:0.1em; text-transform:uppercase; color:#8888a0; margin-bottom:0.5rem;">Bottleneck % &amp; Est. FPS by Resolution</div>
    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:0.6rem; margin-bottom:1.2rem;">
      ${resCard("1080p", r1080)}
      ${resCard("1440p", r1440)}
      ${resCard("4K",    r4k)}
    </div>

    <!-- Performance index -->
    <div style="background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:0.875rem 1rem; margin-bottom:1.2rem;">
      <div style="font-family:'JetBrains Mono',monospace; font-size:0.62rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--accent); margin-bottom:0.6rem;">Performance Index</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
        <div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:0.6rem; color:#8888a0; margin-bottom:0.2rem;">CPU FPS CEILING</div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:1.05rem; color:var(--text);">
            ${cpuEff} FPS
            ${useCase !== "gaming" ? `<span style="font-size:0.7rem; color:#555568;"> (${cpuBase} base − ${useCase} load)</span>` : ""}
          </div>
          <div style="font-size:0.7rem; color:#555568;">${cpuKey}</div>
        </div>
        <div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:0.6rem; color:#8888a0; margin-bottom:0.2rem;">GPU OUTPUT (1440p)</div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:1.05rem; color:var(--text);">${gpu.f1440} FPS</div>
          <div style="font-size:0.7rem; color:#555568;">${gpuKey} · ${gpu.vram}GB VRAM</div>
        </div>
      </div>
    </div>

    <!-- Advice -->
    <div style="font-family:'JetBrains Mono',monospace; font-size:0.62rem; letter-spacing:0.1em; text-transform:uppercase; color:#8888a0; margin-bottom:0.5rem;">Analysis</div>
    <div class="${overallTier.cssClass}">${adviceHTML}</div>

    <div style="font-size:0.7rem; color:#555568; margin-top:1rem; padding-top:0.75rem; border-top:1px solid var(--border); line-height:1.6;">
      FPS estimates are averages across popular AAA titles at high/ultra settings. Actual values vary significantly by game, driver version, and system configuration.
    </div>`;

  resultEl.className = "result-box " + overallTier.cssClass + " show";
  if (defEl) defEl.style.display = "none";
  setTimeout(() => resultEl.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
}
