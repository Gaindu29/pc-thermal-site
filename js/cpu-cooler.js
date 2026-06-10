/**
 * TempCore — CPU Cooler Adequacy Checker
 *
 * Data sources:
 *   CPU thermal requirements: Intel ARK, AMD product pages, GamersNexus sustained load testing 2023–2026
 *   Cooler TDP ratings: Manufacturer specifications (Noctua, be quiet!, DeepCool, Thermalright, ARCTIC, etc.)
 *
 * Logic: match cooler's rated TDP against the CPU's sustained thermal requirement.
 *   req = the wattage the cooler must handle during sustained load (gaming/workload)
 *   This accounts for Intel K-series MTP values, AMD PPT limits, etc.
 */

// ── CPU Thermal Requirements ─────────────────────────────────────────────────
// "req" = sustained power the cooler must handle (worst-case sustained load)
// "gaming" = typical gaming power draw (usually lower than req)
// "note" = why req and gaming may differ
const CPU_COOLING = {
  // ── Intel Core Ultra 200 (Arrow Lake) ─────────────────────────────────────
  "Core Ultra 9 285K":  { req: 250, gaming: 180, note: "PL2/MTP can reach 250W in sustained all-core workloads." },
  "Core Ultra 7 265K":  { req: 250, gaming: 155, note: "Same MTP as 285K — large cooler recommended." },
  "Core Ultra 7 265KF": { req: 250, gaming: 155 },
  "Core Ultra 5 245K":  { req: 159, gaming: 125 },
  "Core Ultra 5 245KF": { req: 159, gaming: 125 },

  // ── Intel 14th Gen ─────────────────────────────────────────────────────────
  "Core i9-14900K":    { req: 253, gaming: 185, note: "Intel MTP (Maximum Turbo Power) is 253W. Needs a 250W+ cooler for stable all-core sustained loads." },
  "Core i9-14900KF":   { req: 253, gaming: 185 },
  "Core i7-14700K":    { req: 253, gaming: 170, note: "Despite lower gaming load, MTP spec matches i9. A strong dual-tower or 360mm AIO is needed to avoid throttling under sustained all-core." },
  "Core i7-14700KF":   { req: 253, gaming: 170 },
  "Core i5-14600K":    { req: 181, gaming: 135 },
  "Core i5-14600KF":   { req: 181, gaming: 135 },
  "Core i5-14500":     { req: 154, gaming: 95 },
  "Core i5-14400":     { req: 148, gaming: 85 },
  "Core i5-14400F":    { req: 148, gaming: 85 },
  "Core i3-14100":     { req: 110, gaming: 89 },
  "Core i3-14100F":    { req: 110, gaming: 89 },

  // ── Intel 13th Gen ─────────────────────────────────────────────────────────
  "Core i9-13900K":    { req: 253, gaming: 180, note: "Same MTP as 14900K. Needs 250W+ cooler." },
  "Core i9-13900KF":   { req: 253, gaming: 180 },
  "Core i7-13700K":    { req: 253, gaming: 165 },
  "Core i7-13700KF":   { req: 253, gaming: 165 },
  "Core i7-13700":     { req: 154, gaming: 155 },
  "Core i5-13600K":    { req: 181, gaming: 130 },
  "Core i5-13600KF":   { req: 181, gaming: 130 },
  "Core i5-13500":     { req: 154, gaming: 95 },
  "Core i5-13400":     { req: 148, gaming: 85 },
  "Core i5-13400F":    { req: 148, gaming: 85 },
  "Core i3-13100":     { req: 110, gaming: 89 },
  "Core i3-13100F":    { req: 110, gaming: 89 },

  // ── Intel 12th Gen ─────────────────────────────────────────────────────────
  "Core i9-12900K":    { req: 241, gaming: 170, note: "PL2 241W. Needs 240W+ cooler for no throttling." },
  "Core i9-12900KF":   { req: 241, gaming: 170 },
  "Core i7-12700K":    { req: 190, gaming: 145 },
  "Core i7-12700KF":   { req: 190, gaming: 145 },
  "Core i7-12700":     { req: 180, gaming: 180 },
  "Core i5-12600K":    { req: 150, gaming: 115 },
  "Core i5-12600KF":   { req: 150, gaming: 115 },
  "Core i5-12400":     { req: 117, gaming: 117 },
  "Core i5-12400F":    { req: 117, gaming: 117 },
  "Core i3-12100":     { req: 89,  gaming: 89 },
  "Core i3-12100F":    { req: 89,  gaming: 89 },

  // ── Intel 11th / 10th Gen ──────────────────────────────────────────────────
  "Core i9-11900K":    { req: 251, gaming: 125, note: "Rocket Lake PL2 is 251W but actual gaming loads are much lower." },
  "Core i7-11700K":    { req: 251, gaming: 125 },
  "Core i5-11600K":    { req: 125, gaming: 125 },
  "Core i9-10900K":    { req: 250, gaming: 125 },
  "Core i7-10700K":    { req: 229, gaming: 125 },
  "Core i5-10600K":    { req: 125, gaming: 125 },
  "Core i5-10400":     { req: 65,  gaming: 65 },
  "Core i5-10400F":    { req: 65,  gaming: 65 },

  // ── AMD Ryzen 9000 (Zen 5) ────────────────────────────────────────────────
  "Ryzen 9 9950X":     { req: 200, gaming: 130, note: "PPT limit 200W (170W TDP). Strong air cooler or 280mm+ AIO recommended." },
  "Ryzen 9 9900X":     { req: 162, gaming: 95 },
  "Ryzen 7 9800X3D":   { req: 120, gaming: 80, note: "3D V-Cache limits peak boost for thermal safety. Runs significantly cooler than 9950X." },
  "Ryzen 7 9700X":     { req: 88,  gaming: 65, note: "65W TDP / 88W PPT. Runs cool — most mid-range air coolers are more than adequate." },
  "Ryzen 5 9600X":     { req: 88,  gaming: 65 },

  // ── AMD Ryzen 7000 (Zen 4) ────────────────────────────────────────────────
  "Ryzen 9 7950X3D":   { req: 162, gaming: 120, note: "PPT 162W. 3D V-Cache on one CCD is kept cool — the other CCD can boost harder." },
  "Ryzen 9 7950X":     { req: 230, gaming: 170, note: "PPT 230W. One of the hottest AMD chips — 280mm AIO minimum." },
  "Ryzen 9 7900X3D":   { req: 162, gaming: 120 },
  "Ryzen 9 7900X":     { req: 230, gaming: 170 },
  "Ryzen 9 7900":      { req: 88,  gaming: 65, note: "65W TDP/88W PPT. Runs cool with even a budget air cooler." },
  "Ryzen 7 7800X3D":   { req: 120, gaming: 95, note: "3D V-Cache limits boost. Runs much cooler than standard Zen 4 — a quality single-tower is sufficient." },
  "Ryzen 7 7700X":     { req: 142, gaming: 105 },
  "Ryzen 7 7700":      { req: 88,  gaming: 65 },
  "Ryzen 5 7600X":     { req: 142, gaming: 105 },
  "Ryzen 5 7600":      { req: 88,  gaming: 65 },
  "Ryzen 5 7500F":     { req: 88,  gaming: 65 },

  // ── AMD Ryzen 5000 (Zen 3) ────────────────────────────────────────────────
  "Ryzen 9 5950X":     { req: 142, gaming: 105 },
  "Ryzen 9 5900X":     { req: 142, gaming: 105 },
  "Ryzen 7 5800X3D":   { req: 105, gaming: 105, note: "3D V-Cache prevents voltage/frequency curve optimisation — stays within 105W PPT." },
  "Ryzen 7 5800X":     { req: 105, gaming: 105 },
  "Ryzen 7 5700X":     { req: 88,  gaming: 65 },
  "Ryzen 5 5600X":     { req: 88,  gaming: 65 },
  "Ryzen 5 5600":      { req: 88,  gaming: 65 },
  "Ryzen 5 5600G":     { req: 65,  gaming: 65 },
  "Ryzen 5 5500":      { req: 88,  gaming: 65 },

  // ── AMD Ryzen 3000 (Zen 2) ────────────────────────────────────────────────
  "Ryzen 9 3900XT":    { req: 105, gaming: 105 },
  "Ryzen 9 3900X":     { req: 105, gaming: 105 },
  "Ryzen 7 3800XT":    { req: 105, gaming: 105 },
  "Ryzen 7 3800X":     { req: 105, gaming: 105 },
  "Ryzen 7 3700X":     { req: 88,  gaming: 65 },
  "Ryzen 5 3600X":     { req: 88,  gaming: 65 },
  "Ryzen 5 3600":      { req: 88,  gaming: 65 },
};

// ── Cooler Database ──────────────────────────────────────────────────────────
// tdp = manufacturer-rated TDP (W). Source: product pages / datasheets.
// type: "air" | "aio" | "stock"
const COOLERS = [
  // ── Stock / Bundled ─────────────────────────────────────────────────────
  { name: "Intel Laminar RM1 / RS1 (boxed)",       type:"stock", tdp: 65,  note:"Bundled with non-K Core i3–i5–i7 65W CPUs. Not suitable for K-series or anything above 65W." },
  { name: "AMD Wraith Stealth (boxed)",             type:"stock", tdp: 45,  note:"Bundled with Ryzen 3/5 65W chips. Only suitable for CPUs with ≤65W TDP." },
  { name: "AMD Wraith Spire (boxed)",               type:"stock", tdp: 95,  note:"Bundled with some Ryzen 7 3000 chips. Fine for 65–95W TDP CPUs." },
  { name: "AMD Wraith Prism (boxed)",               type:"stock", tdp: 105, note:"Bundled with Ryzen 9 3900X and similar. Can handle up to 105W." },

  // ── Budget Air (single tower, 120mm) ────────────────────────────────────
  { name: "Cooler Master Hyper 212 Black (120mm)",  type:"air",   tdp: 150, note:"Industry standard budget cooler since 2008. Reliable for 65–130W CPUs." },
  { name: "DeepCool AG200",                         type:"air",   tdp: 100 },
  { name: "Thermalright AXP90-X36 (low-profile)",  type:"air",   tdp: 95,  note:"Low-profile 36mm cooler for small form factor builds." },
  { name: "Scythe Katana 6 (120mm)",                type:"air",   tdp: 130 },
  { name: "ARCTIC Freezer 13 (92mm)",               type:"air",   tdp: 115 },
  { name: "be quiet! Pure Rock 2 (120mm)",          type:"air",   tdp: 150 },

  // ── Mid-range Air (single tower, 120–140mm) ─────────────────────────────
  { name: "Noctua NH-U12S chromax.black",           type:"air",   tdp: 160 },
  { name: "Thermalright Assassin X 120 R SE",       type:"air",   tdp: 220 },
  { name: "DeepCool AK400 (120mm)",                 type:"air",   tdp: 220, note:"Excellent value. Handles most CPUs up to 220W TDP comfortably." },
  { name: "DeepCool AK500 (120mm)",                 type:"air",   tdp: 220 },
  { name: "ARCTIC Freezer 34 eSports DUO",          type:"air",   tdp: 200 },
  { name: "ARCTIC Freezer 36 A-RGB (120mm)",        type:"air",   tdp: 250 },
  { name: "Scythe Mugen 6 ARGB (120mm)",            type:"air",   tdp: 225 },
  { name: "be quiet! Shadow Rock 3 (120mm)",        type:"air",   tdp: 190 },
  { name: "be quiet! Dark Rock 4 (135mm)",          type:"air",   tdp: 200 },
  { name: "Corsair A500 (dual 120mm)",              type:"air",   tdp: 250, note:"Dual-tower with 120mm fans. Wide compatibility." },

  // ── High-end Air (dual tower, 120–140mm) ────────────────────────────────
  { name: "Noctua NH-D15 (dual 140mm)",             type:"air",   tdp: 250, note:"The air cooler benchmark. Handles everything including i9-14900K at reduced fan noise." },
  { name: "Noctua NH-D15S (single 140mm)",          type:"air",   tdp: 220 },
  { name: "Noctua NH-U14S (140mm)",                 type:"air",   tdp: 200 },
  { name: "Noctua NH-U12A (triple 120mm push-pull)",type:"air",   tdp: 250, note:"Three fans in push-pull. Competitive with 240mm AIOs." },
  { name: "DeepCool AK620 (dual 120mm)",            type:"air",   tdp: 260, note:"Excellent price-to-performance. Handles i9-14900K in gaming loads." },
  { name: "Thermalright Phantom Spirit 120 SE",     type:"air",   tdp: 260 },
  { name: "Thermalright Peerless Assassin 120 SE",  type:"air",   tdp: 260, note:"Outstanding value — consistently outperforms many 240mm AIOs." },
  { name: "Thermalright Silver Soul 135 (dual 135mm)", type:"air",tdp: 280 },
  { name: "be quiet! Dark Rock Pro 4 (dual 135mm)", type:"air",   tdp: 250, note:"Silent operation. Excellent for silent builds with high-TDP CPUs." },
  { name: "Scythe Fuma 3 (dual 120mm)",             type:"air",   tdp: 260 },
  { name: "Cooler Master MasterAir MA824 Stealth",  type:"air",   tdp: 260 },

  // ── 120 / 240mm AIO ─────────────────────────────────────────────────────
  { name: "Corsair iCUE H60x (120mm AIO)",          type:"aio",   tdp: 175, radiator:"120mm", note:"Entry-level AIO. Only suitable for 65–125W CPUs." },
  { name: "NZXT Kraken X53 (240mm)",                type:"aio",   tdp: 250, radiator:"240mm" },
  { name: "Corsair iCUE H100i (240mm)",             type:"aio",   tdp: 250, radiator:"240mm" },
  { name: "be quiet! Silent Loop 3 240 (240mm)",    type:"aio",   tdp: 250, radiator:"240mm" },
  { name: "ARCTIC Liquid Freezer III 240 (240mm)",  type:"aio",   tdp: 280, radiator:"240mm", note:"Pump and fan design keep this 240mm competitive with many 280mm units." },
  { name: "DeepCool LT520 (240mm)",                 type:"aio",   tdp: 280, radiator:"240mm" },
  { name: "EK-Nucleus AIO CR240 (240mm)",           type:"aio",   tdp: 280, radiator:"240mm" },
  { name: "Lian Li Galahad II Trinity 240 (240mm)", type:"aio",   tdp: 280, radiator:"240mm" },

  // ── 280mm AIO ────────────────────────────────────────────────────────────
  { name: "NZXT Kraken X63 (280mm)",                type:"aio",   tdp: 300, radiator:"280mm" },
  { name: "Corsair iCUE H115i (280mm)",             type:"aio",   tdp: 300, radiator:"280mm" },
  { name: "be quiet! Silent Loop 3 280 (280mm)",    type:"aio",   tdp: 300, radiator:"280mm" },
  { name: "ARCTIC Liquid Freezer III 280 (280mm)",  type:"aio",   tdp: 310, radiator:"280mm" },
  { name: "EK-Nucleus AIO CR280 (280mm)",           type:"aio",   tdp: 300, radiator:"280mm" },

  // ── 360mm AIO ────────────────────────────────────────────────────────────
  { name: "NZXT Kraken Elite 360 (360mm)",          type:"aio",   tdp: 340, radiator:"360mm", note:"Handles any consumer CPU including i9-14900K under full AVX load." },
  { name: "NZXT Kraken X73 RGB (360mm)",            type:"aio",   tdp: 340, radiator:"360mm" },
  { name: "Corsair iCUE H150i Elite (360mm)",       type:"aio",   tdp: 350, radiator:"360mm" },
  { name: "be quiet! Silent Loop 3 360 (360mm)",    type:"aio",   tdp: 350, radiator:"360mm" },
  { name: "ARCTIC Liquid Freezer III 360 (360mm)",  type:"aio",   tdp: 350, radiator:"360mm" },
  { name: "DeepCool LT720 (360mm)",                 type:"aio",   tdp: 350, radiator:"360mm" },
  { name: "EK-Nucleus AIO CR360 (360mm)",           type:"aio",   tdp: 350, radiator:"360mm" },
  { name: "Lian Li Galahad II 360 (360mm)",         type:"aio",   tdp: 350, radiator:"360mm" },
  { name: "MSI MEG CoreLiquid S360 (360mm)",        type:"aio",   tdp: 360, radiator:"360mm" },
];

// ── Verdict tiers ────────────────────────────────────────────────────────────
// cooler_tdp vs cpu_req
//   > req * 1.25 → EXCELLENT  (25%+ headroom)
//   > req * 1.05 → GOOD       (5–25% headroom)
//   > req * 0.88 → BORDERLINE (within 12% — may throttle under sustained stress)
//   ≤ req * 0.88 → INADEQUATE (will throttle; not recommended)
function getVerdict(coolerTDP, cpuReq) {
  if (coolerTDP >= cpuReq * 1.25) return "excellent";
  if (coolerTDP >= cpuReq * 1.05) return "good";
  if (coolerTDP >= cpuReq * 0.88) return "borderline";
  return "inadequate";
}

const VERDICT_STYLES = {
  excellent:  { label: "EXCELLENT",   cssClass: "safe",     color: "var(--safe)",     summary: "Your cooler has ample headroom. Temps will stay low even during sustained all-core loads." },
  good:       { label: "ADEQUATE",    cssClass: "safe",     color: "var(--safe)",     summary: "Your cooler is sufficient for this CPU under gaming and typical workloads." },
  borderline: { label: "BORDERLINE",  cssClass: "warm",     color: "var(--warm)",     summary: "Your cooler is marginally rated for this CPU. Gaming should be fine, but sustained all-core loads may throttle." },
  inadequate: { label: "INADEQUATE",  cssClass: "critical", color: "var(--critical)", summary: "Your cooler is not rated for this CPU's thermal requirements. Thermal throttling is likely under sustained load." },
};

const VERDICT_TIPS = {
  excellent: [
    "Plenty of thermal headroom — you can even overclock or remove power limits if desired.",
    "Fans can run at lower speeds while maintaining safe temperatures, keeping your system quiet.",
    "This combination leaves room for a future CPU upgrade on the same socket.",
  ],
  good: [
    "Normal gaming sessions will keep temps well under TJ Max.",
    "Long-duration workloads (compiling, rendering, stress tests) may push temps higher — consider setting a manual fan curve.",
    "If you push AVX loads (e.g., Handbrake, Blender), monitor temps in HWiNFO64 to confirm stability.",
  ],
  borderline: [
    "For gaming-only use this pairing is usually fine — gaming TDP is lower than the sustained max.",
    "Avoid running stress test tools like Prime95 for extended periods without monitoring.",
    "Consider reducing the CPU's power limit (PL1/PL2 on Intel, PPT on AMD) to 80% — same gaming performance, lower temps.",
    "Ensure case airflow is good: the cooler needs fresh, cool air to work near its rated limit.",
    "Reapplying quality thermal paste (Noctua NT-H2, Thermal Grizzly Kryonaut) can help by 3–6°C.",
  ],
  inadequate: [
    "Upgrade your cooler before extended gaming or workload sessions.",
    "The CPU will thermal throttle — clock speeds drop to protect the chip, reducing performance.",
    "A mid-range air cooler (e.g., DeepCool AK400, Thermalright Peerless Assassin 120 SE) costs $35–50 and resolves this completely.",
    "In the meantime: reduce the CPU's power limit. On Intel, disable PL2/Turbo Boost. On AMD, reduce PPT in BIOS.",
  ],
};

// ── Gaming-load verdict (lower bar) ─────────────────────────────────────────
// Even if the cooler can't handle MTP/PPT, it might handle gaming loads fine
function getGamingNote(coolerTDP, cpuGaming, cpuReq) {
  if (coolerTDP >= cpuGaming * 1.2) {
    if (coolerTDP < cpuReq * 1.05) {
      return "For gaming specifically, your cooler should perform well — gaming power draw is lower than sustained all-core TDP.";
    }
  } else if (coolerTDP >= cpuGaming) {
    return "Gaming sessions should be manageable, but keep an eye on temps. Sustained non-gaming workloads may throttle.";
  }
  return null;
}

// ── Build advice ─────────────────────────────────────────────────────────────
function buildAdvice(cpuKey, coolerName, verdict, cpu, cooler) {
  const tips = VERDICT_TIPS[verdict].slice();
  const gamingNote = getGamingNote(cooler.tdp, cpu.gaming, cpu.req);
  if (gamingNote && (verdict === "borderline" || verdict === "inadequate")) {
    tips.unshift(gamingNote);
  }
  if (cpu.note) {
    tips.push("Note: " + cpu.note);
  }
  if (cooler.note) {
    tips.push("Cooler note: " + cooler.note);
  }
  return tips;
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
function checkCooler() {
  const cpuEl    = document.getElementById("cc-cpu");
  const coolerEl = document.getElementById("cc-cooler");
  const errorEl  = document.getElementById("cc-error");
  const resultEl = document.getElementById("cc-result");
  const defEl    = document.getElementById("cc-default");

  errorEl.textContent = "";
  errorEl.style.display = "none";

  const cpuKey    = cpuEl.value;
  const coolerIdx = parseInt(coolerEl.value, 10);

  if (!cpuKey)         { errorEl.textContent = "Please select your CPU.";    errorEl.style.display = "block"; return; }
  if (isNaN(coolerIdx)){ errorEl.textContent = "Please select your cooler."; errorEl.style.display = "block"; return; }

  const cpu    = CPU_COOLING[cpuKey];
  const cooler = COOLERS[coolerIdx];
  const verdict  = getVerdict(cooler.tdp, cpu.req);
  const vStyle   = VERDICT_STYLES[verdict];
  const tips     = buildAdvice(cpuKey, cooler.name, verdict, cpu, cooler);
  const margin   = Math.round((cooler.tdp / cpu.req - 1) * 100);
  const marginStr = margin >= 0 ? "+" + margin + "%" : margin + "%";

  const tipsHTML = tips.map(t =>
    `<div class="suggestion-item"><div class="dot"></div><span>${t}</span></div>`
  ).join("");

  const tdpBarW = Math.min(100, Math.round((cooler.tdp / Math.max(cooler.tdp, cpu.req)) * 100));
  const reqBarW = Math.min(100, Math.round((cpu.req   / Math.max(cooler.tdp, cpu.req)) * 100));

  resultEl.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; flex-wrap:wrap; margin-bottom:1.25rem;">
      <div>
        <div style="font-family:'Bebas Neue',sans-serif; font-size:2.8rem; letter-spacing:0.05em; color:${vStyle.color}; line-height:1;">${vStyle.label}</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.72rem; color:#8888a0; margin-top:0.2rem; max-width:420px; line-height:1.5;">${vStyle.summary}</div>
      </div>
      <div style="text-align:right; flex-shrink:0;">
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.6rem; text-transform:uppercase; color:#8888a0; margin-bottom:0.15rem;">Headroom</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:2rem; font-weight:700; color:${vStyle.color}; line-height:1;">${marginStr}</div>
      </div>
    </div>

    <!-- TDP comparison bars -->
    <div style="background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:1rem 1.1rem; margin-bottom:1.25rem;">
      <div style="font-family:'JetBrains Mono',monospace; font-size:0.62rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--accent); margin-bottom:0.75rem;">Thermal Rating Comparison</div>
      <div style="margin-bottom:0.8rem;">
        <div style="display:flex; justify-content:space-between; font-family:'JetBrains Mono',monospace; font-size:0.65rem; color:#8888a0; margin-bottom:0.3rem;">
          <span>Cooler rated TDP</span><span style="color:${vStyle.color}; font-weight:600;">${cooler.tdp}W</span>
        </div>
        <div style="background:#2a2a32; border-radius:4px; height:8px; overflow:hidden;">
          <div style="width:${tdpBarW}%; height:100%; background:${vStyle.color}; border-radius:4px; transition:width 0.6s ease;"></div>
        </div>
      </div>
      <div>
        <div style="display:flex; justify-content:space-between; font-family:'JetBrains Mono',monospace; font-size:0.65rem; color:#8888a0; margin-bottom:0.3rem;">
          <span>CPU sustained requirement</span><span style="color:var(--text); font-weight:600;">${cpu.req}W</span>
        </div>
        <div style="background:#2a2a32; border-radius:4px; height:8px; overflow:hidden;">
          <div style="width:${reqBarW}%; height:100%; background:#444456; border-radius:4px;"></div>
        </div>
      </div>
    </div>

    <!-- Gaming vs sustained context -->
    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.6rem; margin-bottom:1.25rem;">
      <div style="background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:0.75rem; text-align:center;">
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.58rem; text-transform:uppercase; color:#8888a0; margin-bottom:0.25rem;">Cooler Rated</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:1.1rem; font-weight:700; color:${vStyle.color};">${cooler.tdp}W</div>
      </div>
      <div style="background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:0.75rem; text-align:center;">
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.58rem; text-transform:uppercase; color:#8888a0; margin-bottom:0.25rem;">CPU Gaming Load</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:1.1rem; font-weight:700; color:var(--safe);">${cpu.gaming}W</div>
      </div>
      <div style="background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:0.75rem; text-align:center;">
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.58rem; text-transform:uppercase; color:#8888a0; margin-bottom:0.25rem;">CPU Sustained Max</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:1.1rem; font-weight:700; color:var(--text);">${cpu.req}W</div>
      </div>
    </div>

    <div style="font-family:'JetBrains Mono',monospace; font-size:0.62rem; text-transform:uppercase; letter-spacing:0.1em; color:#8888a0; margin-bottom:0.5rem;">Recommendations</div>
    <div class="${vStyle.cssClass}">${tipsHTML}</div>

    <div style="font-size:0.7rem; color:#555568; margin-top:1rem; padding-top:0.75rem; border-top:1px solid var(--border); line-height:1.6;">
      TDP ratings are manufacturer-published specifications. Real-world performance varies by ambient temperature, case airflow, and thermal paste quality.
      CPU "Sustained Max" = Intel MTP / AMD PPT — the worst-case sustained power draw.
      "Gaming Load" = typical sustained gaming power draw, which is usually significantly lower than the max spec.
    </div>
  `;

  resultEl.className = "result-box " + vStyle.cssClass + " show";
  if (defEl) defEl.style.display = "none";
  setTimeout(function() { resultEl.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 100);
}

// ── Populate dropdowns ────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function() {
  // CPU dropdown
  var cpuEl = document.getElementById("cc-cpu");
  if (cpuEl) {
    // Group by family
    var groups = [
      { label: "Intel Core Ultra 200 (Arrow Lake)", keys: ["Core Ultra 9 285K","Core Ultra 7 265K","Core Ultra 7 265KF","Core Ultra 5 245K","Core Ultra 5 245KF"] },
      { label: "Intel 14th Gen", keys: ["Core i9-14900K","Core i9-14900KF","Core i7-14700K","Core i7-14700KF","Core i5-14600K","Core i5-14600KF","Core i5-14500","Core i5-14400","Core i5-14400F","Core i3-14100","Core i3-14100F"] },
      { label: "Intel 13th Gen", keys: ["Core i9-13900K","Core i9-13900KF","Core i7-13700K","Core i7-13700KF","Core i7-13700","Core i5-13600K","Core i5-13600KF","Core i5-13500","Core i5-13400","Core i5-13400F","Core i3-13100","Core i3-13100F"] },
      { label: "Intel 12th Gen", keys: ["Core i9-12900K","Core i9-12900KF","Core i7-12700K","Core i7-12700KF","Core i7-12700","Core i5-12600K","Core i5-12600KF","Core i5-12400","Core i5-12400F","Core i3-12100","Core i3-12100F"] },
      { label: "Intel 11th / 10th Gen", keys: ["Core i9-11900K","Core i7-11700K","Core i5-11600K","Core i9-10900K","Core i7-10700K","Core i5-10600K","Core i5-10400","Core i5-10400F"] },
      { label: "AMD Ryzen 9000 (Zen 5)", keys: ["Ryzen 9 9950X","Ryzen 9 9900X","Ryzen 7 9800X3D","Ryzen 7 9700X","Ryzen 5 9600X"] },
      { label: "AMD Ryzen 7000 (Zen 4)", keys: ["Ryzen 9 7950X3D","Ryzen 9 7950X","Ryzen 9 7900X3D","Ryzen 9 7900X","Ryzen 9 7900","Ryzen 7 7800X3D","Ryzen 7 7700X","Ryzen 7 7700","Ryzen 5 7600X","Ryzen 5 7600","Ryzen 5 7500F"] },
      { label: "AMD Ryzen 5000 (Zen 3)", keys: ["Ryzen 9 5950X","Ryzen 9 5900X","Ryzen 7 5800X3D","Ryzen 7 5800X","Ryzen 7 5700X","Ryzen 5 5600X","Ryzen 5 5600","Ryzen 5 5600G","Ryzen 5 5500"] },
      { label: "AMD Ryzen 3000 (Zen 2)", keys: ["Ryzen 9 3900XT","Ryzen 9 3900X","Ryzen 7 3800XT","Ryzen 7 3800X","Ryzen 7 3700X","Ryzen 5 3600X","Ryzen 5 3600"] },
    ];
    groups.forEach(function(g) {
      var og = document.createElement("optgroup");
      og.label = g.label;
      g.keys.forEach(function(k) {
        if (CPU_COOLING[k]) {
          var o = document.createElement("option");
          o.value = k;
          o.textContent = k;
          og.appendChild(o);
        }
      });
      cpuEl.appendChild(og);
    });
  }

  // Cooler dropdown
  var coolerEl = document.getElementById("cc-cooler");
  if (coolerEl) {
    var types = [
      { label: "Stock / Boxed Coolers",          key: "stock" },
      { label: "Budget Air Coolers",              key: "budget_air" },
      { label: "Mid-range Air Coolers",           key: "mid_air" },
      { label: "High-end Air Coolers",            key: "high_air" },
      { label: "240mm AIO Liquid Coolers",        key: "aio_240" },
      { label: "280mm AIO Liquid Coolers",        key: "aio_280" },
      { label: "360mm AIO Liquid Coolers",        key: "aio_360" },
    ];
    // Assign display group
    var budget_air_names = ["Cooler Master Hyper 212 Black (120mm)","DeepCool AG200","Thermalright AXP90-X36 (low-profile)","Scythe Katana 6 (120mm)","ARCTIC Freezer 13 (92mm)","be quiet! Pure Rock 2 (120mm)"];
    var mid_air_names    = ["Noctua NH-U12S chromax.black","Thermalright Assassin X 120 R SE","DeepCool AK400 (120mm)","DeepCool AK500 (120mm)","ARCTIC Freezer 34 eSports DUO","ARCTIC Freezer 36 A-RGB (120mm)","Scythe Mugen 6 ARGB (120mm)","be quiet! Shadow Rock 3 (120mm)","be quiet! Dark Rock 4 (135mm)","Corsair A500 (dual 120mm)"];
    var high_air_names   = ["Noctua NH-D15 (dual 140mm)","Noctua NH-D15S (single 140mm)","Noctua NH-U14S (140mm)","Noctua NH-U12A (triple 120mm push-pull)","DeepCool AK620 (dual 120mm)","Thermalright Phantom Spirit 120 SE","Thermalright Peerless Assassin 120 SE","Thermalright Silver Soul 135 (dual 135mm)","be quiet! Dark Rock Pro 4 (dual 135mm)","Scythe Fuma 3 (dual 120mm)","Cooler Master MasterAir MA824 Stealth"];
    var aio_240_names    = ["Corsair iCUE H60x (120mm AIO)","NZXT Kraken X53 (240mm)","Corsair iCUE H100i (240mm)","be quiet! Silent Loop 3 240 (240mm)","ARCTIC Liquid Freezer III 240 (240mm)","DeepCool LT520 (240mm)","EK-Nucleus AIO CR240 (240mm)","Lian Li Galahad II Trinity 240 (240mm)"];
    var aio_280_names    = ["NZXT Kraken X63 (280mm)","Corsair iCUE H115i (280mm)","be quiet! Silent Loop 3 280 (280mm)","ARCTIC Liquid Freezer III 280 (280mm)","EK-Nucleus AIO CR280 (280mm)"];
    var aio_360_names    = ["NZXT Kraken Elite 360 (360mm)","NZXT Kraken X73 RGB (360mm)","Corsair iCUE H150i Elite (360mm)","be quiet! Silent Loop 3 360 (360mm)","ARCTIC Liquid Freezer III 360 (360mm)","DeepCool LT720 (360mm)","EK-Nucleus AIO CR360 (360mm)","Lian Li Galahad II 360 (360mm)","MSI MEG CoreLiquid S360 (360mm)"];

    var groupMap = { stock: [], budget_air: [], mid_air: [], high_air: [], aio_240: [], aio_280: [], aio_360: [] };
    COOLERS.forEach(function(c, i) {
      if (c.type === "stock") groupMap.stock.push(i);
      else if (budget_air_names.indexOf(c.name) !== -1) groupMap.budget_air.push(i);
      else if (mid_air_names.indexOf(c.name) !== -1)    groupMap.mid_air.push(i);
      else if (high_air_names.indexOf(c.name) !== -1)   groupMap.high_air.push(i);
      else if (aio_240_names.indexOf(c.name) !== -1)    groupMap.aio_240.push(i);
      else if (aio_280_names.indexOf(c.name) !== -1)    groupMap.aio_280.push(i);
      else if (aio_360_names.indexOf(c.name) !== -1)    groupMap.aio_360.push(i);
    });

    types.forEach(function(t) {
      var og = document.createElement("optgroup");
      og.label = t.label;
      groupMap[t.key].forEach(function(idx) {
        var o = document.createElement("option");
        o.value = idx;
        o.textContent = COOLERS[idx].name + " (" + COOLERS[idx].tdp + "W)";
        og.appendChild(o);
      });
      coolerEl.appendChild(og);
    });
  }
});
