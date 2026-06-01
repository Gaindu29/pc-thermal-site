/**
 * TempCore — PSU Wattage Calculator
 * psu-calc.js
 *
 * Power draw values based on:
 * - Manufacturer TDP specifications
 * - Real-world gaming load measurements (GamersNexus, Tom's Hardware, AnandTech)
 * - CPU "gaming TDP" = realistic sustained power during gaming
 *   (Intel K-series run significantly above base TDP when boosting)
 */

// ── CPU GAMING POWER DRAW (watts) ─────────────────────────────────────────────
// Realistic sustained gaming load — NOT idle, NOT base TDP, NOT burst/turbo max
// Intel K-series genuinely draw 150–250W during sustained gaming due to boost
const CPU_W = {
  // ── Intel 14th Gen ───────────────────────────────────────────────────────
  "Core i9-14900K":   185,  // gaming average ~160-200W; MTP is 253W burst
  "Core i9-14900KF":  185,
  "Core i7-14700K":   170,  // gaming average ~145-185W
  "Core i7-14700KF":  170,
  "Core i5-14600K":   135,  // gaming average ~110-150W
  "Core i5-14600KF":  135,
  // ── Intel 13th Gen ───────────────────────────────────────────────────────
  "Core i9-13900K":   180,
  "Core i9-13900KF":  180,
  "Core i7-13700K":   165,
  "Core i7-13700KF":  165,
  "Core i7-13700":    154,  // non-K, lower boost
  "Core i5-13600K":   130,
  "Core i5-13600KF":  130,
  "Core i5-13500":     95,
  "Core i5-13400":     85,
  "Core i5-13400F":    85,
  "Core i3-13100":     89,
  "Core i3-13100F":    89,
  // ── Intel 12th Gen ───────────────────────────────────────────────────────
  "Core i9-12900K":   170,
  "Core i9-12900KF":  170,
  "Core i7-12700K":   145,
  "Core i7-12700KF":  145,
  "Core i7-12700":    180,
  "Core i5-12600K":   115,
  "Core i5-12600KF":  115,
  "Core i5-12600":    117,
  "Core i5-12400":    117,
  "Core i5-12400F":   117,
  "Core i3-12100":     89,
  "Core i3-12100F":    89,
  // ── Intel 11th / 10th Gen ────────────────────────────────────────────────
  "Core i9-11900K":   125,  // Rocket Lake, efficient
  "Core i7-11700K":   125,
  "Core i5-11600K":   125,
  "Core i9-10900K":   125,
  "Core i7-10700K":   125,
  "Core i5-10600K":   125,
  "Core i5-10400":     65,
  "Core i5-10400F":    65,
  // ── AMD Ryzen 7000 (Zen 4) ────────────────────────────────────────────────
  "Ryzen 9 7950X3D":  120,  // 3D V-Cache limits boost — runs cooler
  "Ryzen 9 7950X":    170,
  "Ryzen 9 7900X3D":  120,
  "Ryzen 9 7900X":    170,
  "Ryzen 9 7900":      65,
  "Ryzen 7 7800X3D":   95,  // very efficient for gaming despite 120W TDP
  "Ryzen 7 7700X":    105,
  "Ryzen 7 7700":      65,
  "Ryzen 5 7600X":    105,
  "Ryzen 5 7600":      65,
  "Ryzen 5 7500F":     65,
  // ── AMD Ryzen 5000 (Zen 3) ────────────────────────────────────────────────
  "Ryzen 9 5950X":    105,
  "Ryzen 9 5900X":    105,
  "Ryzen 7 5800X3D":  105,
  "Ryzen 7 5800X":    105,
  "Ryzen 7 5700X":     65,
  "Ryzen 5 5600X":     65,
  "Ryzen 5 5600":      65,
  "Ryzen 5 5600G":     65,
  "Ryzen 5 5500":      65,
  "Ryzen 3 5300G":     65,
  // ── AMD Ryzen 3000 (Zen 2) ────────────────────────────────────────────────
  "Ryzen 9 3900XT":   105,
  "Ryzen 9 3900X":    105,
  "Ryzen 7 3800XT":   105,
  "Ryzen 7 3800X":    105,
  "Ryzen 7 3700X":     65,
  "Ryzen 5 3600XT":    65,
  "Ryzen 5 3600X":     65,
  "Ryzen 5 3600":      65,
  "Ryzen 3 3300X":     65,
  "Ryzen 3 3100":      65,
  // ── AMD Ryzen 2000 ────────────────────────────────────────────────────────
  "Ryzen 7 2700X":    105,
  "Ryzen 7 2700":      65,
  "Ryzen 5 2600X":     95,
  "Ryzen 5 2600":      65,
};

// ── GPU POWER DRAW (watts) ────────────────────────────────────────────────────
// Manufacturer rated TDP — this is the sustained gaming power draw
// Sources: NVIDIA/AMD product pages + hardware review measurements
const GPU_W = {
  // ── NVIDIA RTX 50 Series (Blackwell) — Official TDP ────────────────────────
  // Source: NVIDIA official specs, GamersNexus Jan 2025
  "RTX 5090":         575,  // Official NVIDIA spec — highest consumer GPU TDP ever
  "RTX 5080":         360,  // Official NVIDIA spec
  "RTX 5070 Ti":      300,  // Official NVIDIA spec
  "RTX 5070":         250,  // Official NVIDIA spec
  "RTX 5060 Ti 16GB": 165,  // Same TDP as RTX 4060 Ti — GDDR7 offsets performance gains
  "RTX 5060 Ti":      165,
  "RTX 5060":         145,  // Estimated based on lineup position

  // ── NVIDIA RTX 40 Series ─────────────────────────────────────────────────
  "RTX 4090":           450,
  "RTX 4080 Super":     320,
  "RTX 4080":           320,
  "RTX 4070 Ti Super":  285,
  "RTX 4070 Ti":        285,
  "RTX 4070 Super":     220,
  "RTX 4070":           200,
  "RTX 4060 Ti 16GB":   165,
  "RTX 4060 Ti":        160,
  "RTX 4060":           115,
  // RTX 40 Laptop (lower TGP)
  "RTX 4090 (Laptop)":  175,
  "RTX 4080 (Laptop)":  150,
  "RTX 4070 (Laptop)":  125,
  "RTX 4060 (Laptop)":  115,
  "RTX 4050 (Laptop)":   80,
  // ── NVIDIA RTX 30 Series ─────────────────────────────────────────────────
  "RTX 3090 Ti":        450,
  "RTX 3090":           350,
  "RTX 3080 Ti":        350,
  "RTX 3080 12GB":      350,
  "RTX 3080 10GB":      320,
  "RTX 3070 Ti":        290,
  "RTX 3070":           220,
  "RTX 3060 Ti":        200,
  "RTX 3060":           170,
  "RTX 3050":           130,
  // ── NVIDIA GTX ───────────────────────────────────────────────────────────
  "GTX 1080 Ti":        250,
  "GTX 1080":           180,
  "GTX 1070 Ti":        180,
  "GTX 1070":           150,
  "GTX 1660 Ti":        120,
  "GTX 1660 Super":     125,
  "GTX 1660":           120,
  "GTX 1650 Super":     100,
  "GTX 1650":            75,
  "GTX 1060 6GB":       120,
  "GTX 1060 3GB":       120,
  "GTX 1050 Ti":         75,
  // ── AMD RX 7000 ──────────────────────────────────────────────────────────
  "RX 7900 XTX":        355,
  "RX 7900 XT":         315,
  "RX 7900 GRE":        260,
  "RX 7800 XT":         263,
  "RX 7700 XT":         245,
  "RX 7600 XT":         190,
  "RX 7600":            165,
  // ── AMD RX 6000 ──────────────────────────────────────────────────────────
  "RX 6950 XT":         335,
  "RX 6900 XT":         300,
  "RX 6800 XT":         300,
  "RX 6800":            250,
  "RX 6750 XT":         250,
  "RX 6700 XT":         230,
  "RX 6700":            175,
  "RX 6650 XT":         180,
  "RX 6600 XT":         160,
  "RX 6600":            132,
  "RX 6500 XT":          80,
  "RX 6400":             53,
};

// ── COMPONENT POWER CONSTANTS ─────────────────────────────────────────────────
const COMP = {
  mobo:       65,   // motherboard average (ATX mid-range)
  ram_ddr4:    4,   // per stick DDR4
  ram_ddr5:    5,   // per stick DDR5 (slightly higher)
  nvme:        8,   // NVMe SSD (PCIe 4.0 high performance)
  sata_ssd:    3,   // SATA SSD
  hdd:        10,   // HDD active average
  fan:         3,   // 120mm/140mm case fan
  aio_120:    10,   // extra overhead vs air (pump + additional fan)
  aio_240:    14,
  aio_360:    18,
  rgb:        12,   // average RGB strip/header load
  optical:    20,   // optical drive
  oc_cpu:   0.15,   // +15% for CPU overclocking
  oc_gpu:   0.10,   // +10% for GPU overclocking
};

// ── PSU RECOMMENDATION DATABASE ───────────────────────────────────────────────
// Real models, accurate specs, affiliate-ready links
// Sorted: best value / best overall first within each tier
const PSU_DB = [
  {
    maxW: 550,
    wattage: "550W",
    picks: [
      { name: "Seasonic Focus GX-550", rating: "80+ Gold", modular: "Fully Modular",  price: "~$90",  link: "https://www.amazon.com/s?k=Seasonic+Focus+GX+550&tag=tempcore-20", note: "Excellent build quality, 10-year warranty" },
      { name: "Corsair RM550x",        rating: "80+ Gold", modular: "Fully Modular",  price: "~$95",  link: "https://www.amazon.com/s?k=Corsair+RM550x&tag=tempcore-20", note: "Zero RPM fan mode, very quiet" },
      { name: "be quiet! Pure Power 12 M 550W", rating: "80+ Gold", modular: "Semi-Modular", price: "~$75", link: "https://www.amazon.com/s?k=be+quiet+Pure+Power+12+M+550W&tag=tempcore-20", note: "Silent and reliable budget-friendly option" },
    ]
  },
  {
    maxW: 650,
    wattage: "650W",
    picks: [
      { name: "Seasonic Focus GX-650", rating: "80+ Gold",     modular: "Fully Modular", price: "~$100", link: "https://www.amazon.com/s?k=Seasonic+Focus+GX+650&tag=tempcore-20", note: "Best-in-class reliability, highly recommended" },
      { name: "Corsair RM650x",        rating: "80+ Gold",     modular: "Fully Modular", price: "~$110", link: "https://www.amazon.com/s?k=Corsair+RM650x&tag=tempcore-20",       note: "Hybrid fan mode, whisper-quiet operation" },
      { name: "EVGA SuperNOVA 650 G6", rating: "80+ Gold",     modular: "Fully Modular", price: "~$95",  link: "https://www.amazon.com/s?k=EVGA+SuperNOVA+650+G6&tag=tempcore-20", note: "Compact form factor, good for smaller cases" },
    ]
  },
  {
    maxW: 750,
    wattage: "750W",
    picks: [
      { name: "Seasonic Focus GX-750", rating: "80+ Gold",     modular: "Fully Modular", price: "~$115", link: "https://www.amazon.com/s?k=Seasonic+Focus+GX+750&tag=tempcore-20",      note: "Tier-1 OEM, excellent long-term reliability" },
      { name: "Corsair RM750x",        rating: "80+ Gold",     modular: "Fully Modular", price: "~$120", link: "https://www.amazon.com/s?k=Corsair+RM750x&tag=tempcore-20",             note: "Top pick for mid-high end gaming builds" },
      { name: "be quiet! Straight Power 11 750W", rating: "80+ Platinum", modular: "Fully Modular", price: "~$130", link: "https://www.amazon.com/s?k=be+quiet+Straight+Power+11+750W&tag=tempcore-20", note: "Platinum efficiency, premium silent operation" },
    ]
  },
  {
    maxW: 850,
    wattage: "850W",
    picks: [
      { name: "Seasonic Focus GX-850", rating: "80+ Gold",     modular: "Fully Modular", price: "~$130", link: "https://www.amazon.com/s?k=Seasonic+Focus+GX+850&tag=tempcore-20",  note: "Strong choice for RTX 4080 / RX 7900 builds" },
      { name: "Corsair RM850x",        rating: "80+ Gold",     modular: "Fully Modular", price: "~$140", link: "https://www.amazon.com/s?k=Corsair+RM850x&tag=tempcore-20",          note: "Popular for high-end mid-tower builds" },
      { name: "EVGA SuperNOVA 850 G6", rating: "80+ Gold",     modular: "Fully Modular", price: "~$130", link: "https://www.amazon.com/s?k=EVGA+SuperNOVA+850+G6&tag=tempcore-20",   note: "Compact design, suits tight builds" },
    ]
  },
  {
    maxW: 1000,
    wattage: "1000W",
    picks: [
      { name: "Seasonic Focus GX-1000",    rating: "80+ Gold",     modular: "Fully Modular", price: "~$170", link: "https://www.amazon.com/s?k=Seasonic+Focus+GX+1000&tag=tempcore-20", note: "Best value 1000W Gold option" },
      { name: "Corsair HX1000",            rating: "80+ Platinum", modular: "Fully Modular", price: "~$185", link: "https://www.amazon.com/s?k=Corsair+HX1000&tag=tempcore-20",          note: "Platinum efficiency — worth it for high-draw builds" },
      { name: "be quiet! Dark Power 13 1000W", rating: "80+ Titanium", modular: "Fully Modular", price: "~$240", link: "https://www.amazon.com/s?k=be+quiet+Dark+Power+13+1000W&tag=tempcore-20", note: "Premium build, near-silent, Titanium rated" },
    ]
  },
  {
    maxW: 9999,
    wattage: "1200W+",
    picks: [
      { name: "Corsair HX1200",        rating: "80+ Platinum", modular: "Fully Modular", price: "~$230", link: "https://www.amazon.com/s?k=Corsair+HX1200&tag=tempcore-20",          note: "Recommended for RTX 4090 overclocked systems" },
      { name: "Seasonic Prime TX-1000", rating: "80+ Titanium", modular: "Fully Modular", price: "~$280", link: "https://www.amazon.com/s?k=Seasonic+Prime+TX+1000&tag=tempcore-20",   note: "Tier-1 Titanium — the best efficiency available" },
      { name: "be quiet! Dark Power Pro 12 1200W", rating: "80+ Titanium", modular: "Fully Modular", price: "~$300", link: "https://www.amazon.com/s?k=be+quiet+Dark+Power+Pro+12+1200W&tag=tempcore-20", note: "Extreme headroom for workstation / dual-GPU builds" },
    ]
  },
];

function getPSURecommendation(recommendedW) {
  return PSU_DB.find(p => recommendedW <= p.maxW) || PSU_DB[PSU_DB.length - 1];
}

function roundUpTo50(w) {
  return Math.ceil(w / 50) * 50;
}

// ── BREAKDOWN COLORS ──────────────────────────────────────────────────────────
const COLORS = {
  cpu:     "#ff6422",
  gpu:     "#00c8ff",
  mobo:    "#aa66ff",
  ram:     "#22d47e",
  storage: "#ff88aa",
  cooling: "#66ccff",
  fans:    "#888899",
  extras:  "#ffcc44",
};

// ── MAIN CALCULATION ──────────────────────────────────────────────────────────
function calcPSU() {
  const errorEl  = document.getElementById("psu-error");
  const resultEl = document.getElementById("psu-result");
  const defEl    = document.getElementById("psu-default");

  errorEl.textContent = "";
  errorEl.style.display = "none";

  const cpuKey = document.getElementById("psu-cpu").value;
  const gpuKey = document.getElementById("psu-gpu").value;

  if (!cpuKey) { errorEl.textContent = "Please select your CPU."; errorEl.style.display = "block"; return; }
  if (!gpuKey) { errorEl.textContent = "Please select your GPU."; errorEl.style.display = "block"; return; }

  // ── Read inputs ──────────────────────────────────────────────────────────
  const ramType    = document.getElementById("psu-ram-type").value;
  const ramCount   = parseInt(document.getElementById("psu-ram-count").value) || 2;
  const nvmeCount  = parseInt(document.getElementById("psu-nvme").value) || 0;
  const sataCount  = parseInt(document.getElementById("psu-sata-ssd").value) || 0;
  const hddCount   = parseInt(document.getElementById("psu-hdd").value) || 0;
  const cooler     = document.getElementById("psu-cooler").value;
  const fanCount   = parseInt(document.getElementById("psu-fans").value) || 0;
  const ocLevel    = document.getElementById("psu-oc").value;
  const hasRGB     = document.getElementById("psu-rgb").checked;
  const hasOptical = document.getElementById("psu-optical").checked;

  // ── Calculate each component ─────────────────────────────────────────────
  const cpuW   = CPU_W[cpuKey]  || 65;
  const gpuW   = GPU_W[gpuKey]  || 150;
  const moboW  = COMP.mobo;
  const ramW   = ramCount * (ramType === "ddr5" ? COMP.ram_ddr5 : COMP.ram_ddr4);

  const storageW = (nvmeCount * COMP.nvme) + (sataCount * COMP.sata_ssd) + (hddCount * COMP.hdd);
  const coolerW  = cooler === "aio360" ? COMP.aio_360 : cooler === "aio240" ? COMP.aio_240 : cooler === "aio120" ? COMP.aio_120 : 0;
  const fansW    = fanCount * COMP.fan;
  const extrasW  = (hasRGB ? COMP.rgb : 0) + (hasOptical ? COMP.optical : 0);

  // OC adjustments
  let ocCpuExtra = 0, ocGpuExtra = 0;
  if (ocLevel === "cpu"  || ocLevel === "both") ocCpuExtra = Math.round(cpuW * COMP.oc_cpu);
  if (ocLevel === "gpu"  || ocLevel === "both") ocGpuExtra = Math.round(gpuW * COMP.oc_gpu);

  const cpuTotal = cpuW + ocCpuExtra;
  const gpuTotal = gpuW + ocGpuExtra;

  const breakdown = {
    cpu:     cpuTotal,
    gpu:     gpuTotal,
    mobo:    moboW,
    ram:     ramW,
    storage: storageW,
    cooling: coolerW,
    fans:    fansW,
    extras:  extrasW,
  };

  const totalW = Object.values(breakdown).reduce((a, b) => a + b, 0);

  // PSU sizing
  const minimumW    = roundUpTo50(totalW * 1.15);
  const recommendedW = roundUpTo50(totalW * 1.35);
  const futureW      = roundUpTo50(totalW * 1.60);

  const psURec = getPSURecommendation(recommendedW);

  // ── Build result HTML ────────────────────────────────────────────────────
  const breakdownBars = Object.entries(breakdown)
    .filter(([k, v]) => v > 0)
    .map(([key, w]) => {
      const pct   = Math.round(w / totalW * 100);
      const color = COLORS[key] || "#666";
      const label = { cpu:"CPU", gpu:"GPU", mobo:"Motherboard", ram:"RAM", storage:"Storage", cooling:"Cooling", fans:"Fans", extras:"Extras" }[key];
      return `<div style="flex:${pct}; min-width:2px; height:100%; background:${color}; position:relative;" title="${label}: ${w}W (${pct}%)"></div>`;
    }).join("");

  const breakdownRows = Object.entries(breakdown)
    .filter(([k, v]) => v > 0)
    .map(([key, w]) => {
      const pct   = Math.round(w / totalW * 100);
      const color = COLORS[key] || "#666";
      const label = { cpu:"CPU", gpu:"GPU", mobo:"Motherboard", ram:"RAM", storage:"Storage", cooling:"Cooling", fans:"Fans", extras:"Extras" }[key];
      const barW  = Math.max(3, pct);
      return `
        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.5rem;">
          <div style="width:10px; height:10px; border-radius:2px; background:${color}; flex-shrink:0;"></div>
          <div style="font-size:0.8rem; color:#b0b0c8; width:90px; flex-shrink:0;">${label}</div>
          <div style="flex:1; height:6px; background:var(--surface2); border-radius:3px; overflow:hidden;">
            <div style="width:${barW}%; height:100%; background:${color}; border-radius:3px;"></div>
          </div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:0.75rem; color:var(--text); width:45px; text-align:right; flex-shrink:0;">${w}W</div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:0.68rem; color:#555568; width:30px; text-align:right; flex-shrink:0;">${pct}%</div>
        </div>`;
    }).join("");

  const psPicksHTML = psURec.picks.map((p, i) => {
    const isBest = i === 0;
    return `
      <div style="background:var(--surface2); border:1px solid ${isBest ? "rgba(255,100,34,0.35)" : "var(--border)"}; border-radius:8px; padding:0.875rem 1rem; position:relative; ${isBest ? "border-top:2px solid var(--hot);" : ""}">
        ${isBest ? `<div style="position:absolute; top:-1px; left:0.875rem; font-family:'JetBrains Mono',monospace; font-size:0.6rem; letter-spacing:0.1em; text-transform:uppercase; background:var(--hot); color:#fff; padding:0.15rem 0.4rem; border-radius:0 0 4px 4px;">Top Pick</div>` : ""}
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem; ${isBest ? "margin-top:0.5rem;" : ""}">
          <div style="flex:1;">
            <div style="font-weight:600; font-size:0.85rem; color:var(--text); margin-bottom:0.2rem;">${p.name}</div>
            <div style="display:flex; flex-wrap:wrap; gap:0.3rem; margin-bottom:0.3rem;">
              <span style="font-family:'JetBrains Mono',monospace; font-size:0.62rem; background:rgba(34,212,126,0.08); color:var(--safe); border:1px solid rgba(34,212,126,0.2); padding:0.1rem 0.4rem; border-radius:4px;">${p.rating}</span>
              <span style="font-family:'JetBrains Mono',monospace; font-size:0.62rem; background:rgba(0,200,255,0.06); color:var(--accent); border:1px solid rgba(0,200,255,0.2); padding:0.1rem 0.4rem; border-radius:4px;">${p.modular}</span>
            </div>
            <div style="font-size:0.75rem; color:#8888a0; line-height:1.4;">${p.note}</div>
          </div>
          <div style="text-align:right; flex-shrink:0;">
            <div style="font-family:'JetBrains Mono',monospace; font-size:0.9rem; color:var(--safe); font-weight:600; margin-bottom:0.3rem;">${p.price}</div>
            <a href="${p.link}" target="_blank" rel="noopener noreferrer"
               style="display:inline-block; background:var(--hot); color:#fff; font-family:'JetBrains Mono',monospace; font-size:0.65rem; letter-spacing:0.06em; text-transform:uppercase; padding:0.3rem 0.6rem; border-radius:4px; text-decoration:none; white-space:nowrap;">
              Amazon →
            </a>
          </div>
        </div>
      </div>`;
  }).join("");

  const ocNote = ocLevel !== "none"
    ? `<div style="background:rgba(255,170,0,0.06); border:1px solid rgba(255,170,0,0.2); border-left:3px solid var(--warm); border-radius:6px; padding:0.65rem 0.875rem; font-size:0.8rem; color:#b0b0c8; margin-bottom:1rem; line-height:1.6;">
        Overclock included: +${ocCpuExtra}W CPU${ocGpuExtra > 0 ? `, +${ocGpuExtra}W GPU` : ""} added to estimate.
       </div>`
    : "";

  resultEl.innerHTML = `
    <!-- Total draw -->
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:1rem;">
      <div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.65rem; letter-spacing:0.1em; text-transform:uppercase; color:#8888a0;">Estimated System Draw</div>
        <div style="font-family:'Bebas Neue',sans-serif; font-size:3.5rem; color:var(--text); line-height:1;">${totalW}<span style="font-size:1.5rem; color:#8888a0;"> W</span></div>
        <div style="font-size:0.8rem; color:#8888a0;">${cpuKey} + ${gpuKey}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.6rem; text-transform:uppercase; color:#8888a0; margin-bottom:0.25rem;">GPU accounts for</div>
        <div style="font-family:'Bebas Neue',sans-serif; font-size:2rem; color:var(--accent); line-height:1;">${Math.round(gpuTotal/totalW*100)}%</div>
        <div style="font-size:0.72rem; color:#555568;">of total draw</div>
      </div>
    </div>

    ${ocNote}

    <!-- Stacked bar -->
    <div style="height:18px; border-radius:6px; overflow:hidden; display:flex; margin-bottom:0.5rem; gap:1px;">
      ${breakdownBars}
    </div>

    <!-- Breakdown list -->
    <div style="margin-bottom:1.25rem;">${breakdownRows}</div>

    <!-- PSU size cards -->
    <div style="font-family:'JetBrains Mono',monospace; font-size:0.65rem; letter-spacing:0.1em; text-transform:uppercase; color:#8888a0; margin-bottom:0.5rem;">PSU Size Recommendations</div>
    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:0.6rem; margin-bottom:1.25rem;">
      <div style="background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:0.875rem 0.875rem; opacity:0.7;">
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.6rem; text-transform:uppercase; color:#8888a0; margin-bottom:0.3rem;">Minimum</div>
        <div style="font-family:'Bebas Neue',sans-serif; font-size:1.9rem; color:var(--warm); line-height:1;">${minimumW}W</div>
        <div style="font-size:0.72rem; color:#555568; margin-top:0.2rem;">10% headroom</div>
        <div style="font-size:0.72rem; color:#555568;">Works, not ideal</div>
      </div>
      <div style="background:var(--surface2); border:2px solid var(--safe); border-radius:8px; padding:0.875rem 0.875rem; position:relative;">
        <div style="position:absolute; top:-1px; left:50%; transform:translateX(-50%); font-family:'JetBrains Mono',monospace; font-size:0.58rem; letter-spacing:0.08em; text-transform:uppercase; background:var(--safe); color:#000; padding:0.1rem 0.4rem; border-radius:0 0 4px 4px; white-space:nowrap;">Recommended</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.6rem; text-transform:uppercase; color:#8888a0; margin-bottom:0.3rem; margin-top:0.5rem;">Ideal</div>
        <div style="font-family:'Bebas Neue',sans-serif; font-size:1.9rem; color:var(--safe); line-height:1;">${recommendedW}W</div>
        <div style="font-size:0.72rem; color:var(--safe); margin-top:0.2rem;">30% headroom</div>
        <div style="font-size:0.72rem; color:#555568;">Optimal efficiency</div>
      </div>
      <div style="background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:0.875rem 0.875rem; opacity:0.7;">
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.6rem; text-transform:uppercase; color:#8888a0; margin-bottom:0.3rem;">Future-Proof</div>
        <div style="font-family:'Bebas Neue',sans-serif; font-size:1.9rem; color:var(--accent); line-height:1;">${futureW}W</div>
        <div style="font-size:0.72rem; color:#555568; margin-top:0.2rem;">50% headroom</div>
        <div style="font-size:0.72rem; color:#555568;">Upgrade-ready</div>
      </div>
    </div>

    <!-- Why 30% headroom explainer -->
    <div style="background:rgba(34,212,126,0.05); border:1px solid rgba(34,212,126,0.15); border-left:3px solid var(--safe); border-radius:6px; padding:0.75rem 1rem; font-size:0.8rem; color:#b0b0c8; margin-bottom:1.25rem; line-height:1.65;">
      <strong style="color:var(--text);">Why 30% headroom?</strong> PSUs are most efficient at 50–80% load. 
      A ${recommendedW}W PSU runs at <strong style="color:var(--text);">${Math.round(totalW/recommendedW*100)}% load</strong> with your build — 
      ideal for efficiency, longevity, and quiet operation. Under 50% load, efficiency drops; over 80%, thermals and noise increase.
    </div>

    <!-- PSU picks -->
    <div style="font-family:'JetBrains Mono',monospace; font-size:0.65rem; letter-spacing:0.1em; text-transform:uppercase; color:#8888a0; margin-bottom:0.6rem;">Recommended ${psURec.wattage} PSU Units</div>
    <div style="display:flex; flex-direction:column; gap:0.5rem;">${psPicksHTML}</div>

    <div style="font-size:0.7rem; color:#555568; margin-top:0.875rem; line-height:1.6;">
      Prices are approximate and may vary. Power estimates are based on manufacturer TDP and real-world gaming measurements. Actual system draw varies by workload, settings, and component revisions.
    </div>`;

  resultEl.className = "result-box safe show";
  if (defEl) defEl.style.display = "none";
  setTimeout(() => resultEl.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
}
