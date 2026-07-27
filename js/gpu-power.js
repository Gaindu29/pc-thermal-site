/**
 * TempCore - GPU Power Connector & Cable Checker
 *
 * Answers the questions builders actually ask before plugging in a modern GPU:
 *   - What power connector does my card use? (12VHPWR / 12V-2x6 / 8-pin PCIe)
 *   - How many 8-pin cables do I need if I use the bundled adapter?
 *   - Does my PSU have the right native cable, or do I need an adapter?
 *   - Is my PSU wattage enough given the card's transient spikes?
 *   - What do I do about the 12VHPWR melting risk on RTX 40/50 series?
 *
 * Data sources:
 *   Board power (TGP) and recommended PSU: NVIDIA / AMD / Intel official product
 *     pages and reviewer sustained-power testing (GamersNexus, TechPowerUp) 2020-2026.
 *   Connector specs: PCI-SIG PCIe 5.0 (12VHPWR) & 5.1 (12V-2x6), Intel ATX 3.0 / 3.1.
 *
 * Connector types:
 *   "12v-2x6"  16-pin, up to 600W. PCIe 5.1 / ATX 3.1. Current standard (RTX 50 series).
 *              Shorter sense pins + longer conductor terminals reduce the seating risk
 *              that affected the original 12VHPWR.
 *   "12vhpwr"  16-pin, up to 600W. PCIe 5.0 / ATX 3.0. Original design (RTX 40, RTX 3090 Ti).
 *              Reported melting when partially seated or with cheap adapters.
 *   "8pin-N"   N x 8-pin PCIe (150W each, 75W from the slot).
 *   "6pin-1"   single 6-pin PCIe (75W).
 */

/* ── GPU power database ────────────────────────────────────────────────────────
   tgp   = total graphics power / board power in watts
   conn  = connector the reference / Founders card uses
   pcie8 = number of 8-pin PCIe cables needed when using the bundled adapter
           (for 16-pin cards) or directly (for 8-pin cards)
   psu   = manufacturer-recommended minimum PSU wattage (whole system)
   spike = typical transient spike ceiling (brief microsecond excursions)
   note  = seating / AIB-variance / melting context where relevant                */
const GPU_POWER = {
  // ── NVIDIA RTX 50 (Blackwell, 2025) - 12V-2x6 ──────────────────────────────
  "RTX 5090":      { tgp: 575, conn: "12v-2x6", pcie8: 4, psu: 1000, spike: 900, note: "Highest-draw consumer GPU. Use a native 12V-2x6 cable from an ATX 3.1 PSU - avoid daisy-chaining adapters. Transients briefly exceed 600W." },
  "RTX 5080":      { tgp: 360, conn: "12v-2x6", pcie8: 3, psu: 850,  spike: 550 },
  "RTX 5070 Ti":   { tgp: 300, conn: "12v-2x6", pcie8: 2, psu: 750,  spike: 450 },
  "RTX 5070":      { tgp: 250, conn: "12v-2x6", pcie8: 2, psu: 650,  spike: 380, note: "Founders Edition uses 12V-2x6; many AIB RTX 5070 models use 2x standard 8-pin instead." },
  "RTX 5060 Ti":   { tgp: 180, conn: "8pin-1",  pcie8: 1, psu: 550,  spike: 260, note: "Most models use a single 8-pin; some higher-clocked AIB cards use 2x 8-pin." },
  "RTX 5060":      { tgp: 145, conn: "8pin-1",  pcie8: 1, psu: 550,  spike: 210 },

  // ── NVIDIA RTX 40 (Ada Lovelace, 2022-2024) - 12VHPWR ──────────────────────
  "RTX 4090":      { tgp: 450, conn: "12vhpwr", pcie8: 4, psu: 1000, spike: 600, note: "The card most associated with 12VHPWR melting. Seat the connector fully until it clicks and keep the cable straight for the first 35mm." },
  "RTX 4080 Super":{ tgp: 320, conn: "12vhpwr", pcie8: 3, psu: 850,  spike: 480 },
  "RTX 4080":      { tgp: 320, conn: "12vhpwr", pcie8: 3, psu: 750,  spike: 480 },
  "RTX 4070 Ti Super":{ tgp: 285, conn: "12vhpwr", pcie8: 3, psu: 750, spike: 420 },
  "RTX 4070 Ti":   { tgp: 285, conn: "12vhpwr", pcie8: 2, psu: 700,  spike: 420 },
  "RTX 4070 Super":{ tgp: 220, conn: "12vhpwr", pcie8: 2, psu: 650,  spike: 320 },
  "RTX 4070":      { tgp: 200, conn: "12vhpwr", pcie8: 2, psu: 650,  spike: 300, note: "Founders Edition uses 12VHPWR; several AIB RTX 4070 models use a single 8-pin or 2x 8-pin instead." },
  "RTX 4060 Ti":   { tgp: 160, conn: "8pin-1",  pcie8: 1, psu: 550,  spike: 230 },
  "RTX 4060":      { tgp: 115, conn: "8pin-1",  pcie8: 1, psu: 550,  spike: 170 },

  // ── NVIDIA RTX 30 (Ampere, 2020-2022) ──────────────────────────────────────
  "RTX 3090 Ti":   { tgp: 450, conn: "12vhpwr", pcie8: 3, psu: 850,  spike: 650, note: "First card to use 12VHPWR. Reference/AIB cards also shipped with a 3x 8-pin adapter." },
  "RTX 3090":      { tgp: 350, conn: "8pin-3",  pcie8: 3, psu: 750,  spike: 550, note: "Founders Edition uses a proprietary 12-pin adapter; AIB cards use 3x 8-pin." },
  "RTX 3080 Ti":   { tgp: 350, conn: "8pin-3",  pcie8: 3, psu: 750,  spike: 550 },
  "RTX 3080":      { tgp: 320, conn: "8pin-2",  pcie8: 2, psu: 750,  spike: 490, note: "Founders Edition uses a 12-pin adapter; AIB cards typically use 2-3x 8-pin." },
  "RTX 3070 Ti":   { tgp: 290, conn: "8pin-2",  pcie8: 2, psu: 750,  spike: 380 },
  "RTX 3070":      { tgp: 220, conn: "8pin-2",  pcie8: 2, psu: 650,  spike: 300 },
  "RTX 3060 Ti":   { tgp: 200, conn: "8pin-1",  pcie8: 1, psu: 600,  spike: 280 },
  "RTX 3060":      { tgp: 170, conn: "8pin-1",  pcie8: 1, psu: 550,  spike: 240 },

  // ── AMD Radeon RX 9000 (RDNA 4, 2025) - standard 8-pin ─────────────────────
  "RX 9070 XT":    { tgp: 304, conn: "8pin-2",  pcie8: 2, psu: 750,  spike: 430, note: "AMD stayed on standard 8-pin PCIe - no 12VHPWR. The reference design uses 2x 8-pin; some overclocked AIB models add a 3rd 8-pin." },
  "RX 9070":       { tgp: 220, conn: "8pin-2",  pcie8: 2, psu: 650,  spike: 300 },
  "RX 9060 XT":    { tgp: 182, conn: "8pin-1",  pcie8: 1, psu: 550,  spike: 260 },

  // ── AMD Radeon RX 7000 (RDNA 3, 2022-2023) ─────────────────────────────────
  "RX 7900 XTX":   { tgp: 355, conn: "8pin-3",  pcie8: 3, psu: 800,  spike: 560, note: "Known for large transient spikes - ATX 3.x PSU or extra wattage headroom recommended." },
  "RX 7900 XT":    { tgp: 315, conn: "8pin-3",  pcie8: 3, psu: 750,  spike: 480 },
  "RX 7900 GRE":   { tgp: 260, conn: "8pin-2",  pcie8: 2, psu: 700,  spike: 360 },
  "RX 7800 XT":    { tgp: 263, conn: "8pin-2",  pcie8: 2, psu: 700,  spike: 360 },
  "RX 7700 XT":    { tgp: 245, conn: "8pin-2",  pcie8: 2, psu: 650,  spike: 340 },
  "RX 7600 XT":    { tgp: 190, conn: "8pin-1",  pcie8: 1, psu: 550,  spike: 260 },
  "RX 7600":       { tgp: 165, conn: "8pin-1",  pcie8: 1, psu: 550,  spike: 230 },

  // ── AMD Radeon RX 6000 (RDNA 2) ────────────────────────────────────────────
  "RX 6950 XT":    { tgp: 335, conn: "8pin-3",  pcie8: 3, psu: 850,  spike: 500 },
  "RX 6800 XT":    { tgp: 300, conn: "8pin-2",  pcie8: 2, psu: 750,  spike: 420 },
  "RX 6700 XT":    { tgp: 230, conn: "8pin-2",  pcie8: 2, psu: 650,  spike: 320 },
  "RX 6600":       { tgp: 132, conn: "8pin-1",  pcie8: 1, psu: 500,  spike: 190 },

  // ── Intel Arc ──────────────────────────────────────────────────────────────
  "Arc B580":      { tgp: 190, conn: "8pin-2",  pcie8: 2, psu: 600,  spike: 260 },
  "Arc B570":      { tgp: 150, conn: "8pin-1",  pcie8: 1, psu: 550,  spike: 210 },
  "Arc A770":      { tgp: 225, conn: "8pin-2",  pcie8: 2, psu: 600,  spike: 310 },
  "Arc A750":      { tgp: 225, conn: "8pin-2",  pcie8: 2, psu: 600,  spike: 310 },
};

/* Grouped, in the order they should appear in the dropdown */
const GPU_GROUPS = [
  { label: "NVIDIA RTX 50 (Blackwell)", keys: ["RTX 5090","RTX 5080","RTX 5070 Ti","RTX 5070","RTX 5060 Ti","RTX 5060"] },
  { label: "NVIDIA RTX 40 (Ada Lovelace)", keys: ["RTX 4090","RTX 4080 Super","RTX 4080","RTX 4070 Ti Super","RTX 4070 Ti","RTX 4070 Super","RTX 4070","RTX 4060 Ti","RTX 4060"] },
  { label: "NVIDIA RTX 30 (Ampere)", keys: ["RTX 3090 Ti","RTX 3090","RTX 3080 Ti","RTX 3080","RTX 3070 Ti","RTX 3070","RTX 3060 Ti","RTX 3060"] },
  { label: "AMD Radeon RX 9000 (RDNA 4)", keys: ["RX 9070 XT","RX 9070","RX 9060 XT"] },
  { label: "AMD Radeon RX 7000 (RDNA 3)", keys: ["RX 7900 XTX","RX 7900 XT","RX 7900 GRE","RX 7800 XT","RX 7700 XT","RX 7600 XT","RX 7600"] },
  { label: "AMD Radeon RX 6000 (RDNA 2)", keys: ["RX 6950 XT","RX 6800 XT","RX 6700 XT","RX 6600"] },
  { label: "Intel Arc", keys: ["Arc B580","Arc B570","Arc A770","Arc A750"] },
];

/* ── Connector metadata ───────────────────────────────────────────────────────*/
const CONNECTORS = {
  "12v-2x6": { label: "12V-2x6 (16-pin)", short: "12V-2x6", max: 600, std: "PCIe 5.1 / ATX 3.1", sixteen: true },
  "12vhpwr": { label: "12VHPWR (16-pin)", short: "12VHPWR", max: 600, std: "PCIe 5.0 / ATX 3.0", sixteen: true },
  "8pin-4":  { label: "4x 8-pin PCIe", short: "4x 8-pin", max: 600, std: "PCIe", sixteen: false },
  "8pin-3":  { label: "3x 8-pin PCIe", short: "3x 8-pin", max: 525, std: "PCIe", sixteen: false },
  "8pin-2":  { label: "2x 8-pin PCIe", short: "2x 8-pin", max: 375, std: "PCIe", sixteen: false },
  "8pin-1":  { label: "1x 8-pin PCIe", short: "1x 8-pin", max: 225, std: "PCIe", sixteen: false },
  "6pin-1":  { label: "1x 6-pin PCIe", short: "1x 6-pin", max: 150, std: "PCIe", sixteen: false },
};

/* ── PSU cable standards ──────────────────────────────────────────────────────*/
const PSU_STDS = {
  atx31: { label: "ATX 3.1 (native 12V-2x6 cable)", native16: "12v-2x6", atx3: true },
  atx30: { label: "ATX 3.0 (native 12VHPWR cable)", native16: "12vhpwr", atx3: true },
  atx2x: { label: "ATX 2.x / older (8-pin PCIe only)", native16: null, atx3: false },
};

const CPU_TIERS = {
  low:  { label: "Low - 65W (i3/i5 non-K, Ryzen 5/7 non-X)", w: 90 },
  mid:  { label: "Mid - 125W (i5/i7 K, Ryzen 7/9)", w: 160 },
  high: { label: "High - 200W+ (i9-14900K, Ryzen 9 X)", w: 250 },
};

/* ── Verdict styling (shared visual language with other tools) ────────────────*/
const GP_STYLES = {
  excellent:  { label: "IDEAL SETUP",  cssClass: "safe",     color: "var(--safe)" },
  good:       { label: "COMPATIBLE",   cssClass: "safe",     color: "var(--safe)" },
  borderline: { label: "USABLE",       cssClass: "warm",     color: "var(--warm)" },
  inadequate: { label: "NOT ENOUGH",   cssClass: "critical", color: "var(--critical)" },
};

/* ── PSU wattage verdict ──────────────────────────────────────────────────────*/
function psuVerdict(psuW, recommended) {
  if (psuW >= recommended * 1.2)  return "excellent";
  if (psuW >= recommended)        return "good";
  if (psuW >= recommended * 0.9)  return "borderline";
  return "inadequate";
}

function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }

/* ── Main check ───────────────────────────────────────────────────────────────*/
function checkGpuPower() {
  const gpuEl = document.getElementById("gp-gpu");
  const psuEl = document.getElementById("gp-psu");
  const stdEl = document.getElementById("gp-std");
  const cpuEl = document.getElementById("gp-cpu");
  const errEl = document.getElementById("gp-error");
  const resEl = document.getElementById("gp-result");
  const defEl = document.getElementById("gp-default");

  errEl.textContent = ""; errEl.style.display = "none";

  const gpuKey = gpuEl.value;
  const psuW   = parseInt(psuEl.value, 10);
  const stdKey = stdEl.value;
  const cpuKey = cpuEl.value || "mid";

  if (!gpuKey)       { errEl.textContent = "Please select your GPU.";            errEl.style.display = "block"; return; }
  if (isNaN(psuW))   { errEl.textContent = "Please select your PSU wattage.";    errEl.style.display = "block"; return; }
  if (!stdKey)       { errEl.textContent = "Please select your PSU cable type."; errEl.style.display = "block"; return; }

  const gpu  = GPU_POWER[gpuKey];
  const std  = PSU_STDS[stdKey];
  const conn = CONNECTORS[gpu.conn];
  const cpu  = CPU_TIERS[cpuKey] || CPU_TIERS.mid;
  const is16 = conn.sixteen;

  // Recommended PSU for this exact combo (start from vendor spec, adjust for CPU tier)
  let recommended = gpu.psu;
  if (cpuKey === "high") recommended += 100;
  else if (cpuKey === "low") recommended = Math.max(gpu.psu - 50, Math.ceil((gpu.tgp + cpu.w + 90) / 50) * 50);
  const estTotal = gpu.tgp + cpu.w + 90; // +90W for board, RAM, drives, fans

  const wVerdict = psuVerdict(psuW, recommended);

  // ── Connector / cabling verdict ────────────────────────────────────────────
  let cableTitle, cableColor, cableBody, cableClass;
  if (is16) {
    if (std.native16 === gpu.conn) {
      cableClass = "safe"; cableColor = "var(--safe)";
      cableTitle = "Native " + conn.short + " cable available";
      cableBody = "Your ATX 3.x PSU includes a native " + conn.short + " cable. <strong>Use that single cable</strong> - do not use the multi-8-pin adapter bundled with the GPU. A native cable is the most reliable connection.";
    } else if (std.atx3) {
      cableClass = "warm"; cableColor = "var(--warm)";
      cableTitle = "Native 16-pin cable, but different revision";
      cableBody = "Your PSU provides a native " + CONNECTORS[std.native16].short + " cable and your GPU expects " + conn.short + ". They are physically compatible and safe to connect. If buying a replacement cable, match it to your <strong>PSU brand and model</strong> - never mix cables between PSU brands.";
    } else {
      cableClass = "warm"; cableColor = "var(--warm)";
      cableTitle = "Adapter required (no native 16-pin cable)";
      cableBody = "Your ATX 2.x PSU has no native 16-pin cable, so you must use the <strong>bundled " + gpu.pcie8 + "x 8-pin → " + conn.short + " adapter</strong> that ships with the GPU. This works, but the cleanest long-term fix is an ATX 3.1 PSU with a native 12V-2x6 cable. Plug each 8-pin into a <em>separate</em> PSU cable where possible.";
    }
  } else {
    cableClass = "safe"; cableColor = "var(--safe)";
    cableTitle = "Standard 8-pin PCIe - no adapter needed";
    cableBody = "This card uses <strong>" + conn.label + "</strong> - the standard connector every modern PSU supplies. No 16-pin adapter or ATX 3.x cable is required.";
    if (gpu.pcie8 >= 3) {
      cableBody += " Because it needs " + gpu.pcie8 + " connectors, use <strong>separate PSU cables</strong> rather than one cable with two pigtailed plugs.";
    }
  }

  // ── PCIe cable requirement line ────────────────────────────────────────────
  let cableReq;
  if (is16) {
    if (std.native16) cableReq = "1x native " + conn.short + " cable  <span style='color:#555568'>(or " + gpu.pcie8 + "x 8-pin via the bundled adapter)</span>";
    else cableReq = gpu.pcie8 + "x 8-pin PCIe  <span style='color:#555568'>(into the bundled " + conn.short + " adapter)</span>";
  } else {
    cableReq = gpu.pcie8 + "x 8-pin PCIe";
  }

  // ── Tips ───────────────────────────────────────────────────────────────────
  const tips = [];
  if (is16) {
    tips.push("Push the 16-pin connector in until you feel and hear it <strong>click</strong>. A partially seated plug is the single biggest cause of 12VHPWR overheating.");
    tips.push("Keep the cable straight for the first ~35mm out of the connector - avoid sharp bends right at the plug.");
    if (gpu.conn === "12vhpwr") {
      tips.push("The original 12VHPWR (yours) is the revision linked to melting reports. The newer 12V-2x6 fixes this with shorter sense pins - a native 12V-2x6 cable from an ATX 3.1 PSU is the safest option.");
    } else {
      tips.push("The 12V-2x6 connector on your card is the improved revision - noticeably more forgiving than the original 12VHPWR, but full seating still matters.");
    }
    if (!std.atx3) {
      tips.push("Avoid third-party 8-pin-to-16-pin adapters. Use the one bundled with your GPU, or upgrade to an ATX 3.1 PSU with a native cable.");
    }
    if (gpu.tgp >= 400) {
      tips.push("On a " + gpu.tgp + "W card, periodically check that the connector is not warm to the touch or discolored after heavy gaming.");
    }
  } else {
    tips.push("Seat each 8-pin PCIe plug fully - the clip should latch onto the tab.");
    if (gpu.pcie8 >= 2) {
      tips.push("Use dedicated PCIe cables from the PSU. Daisy-chained (pigtail) connectors are rated for lower current and are best avoided on cards over ~225W.");
    }
    tips.push("Do not use CPU/EPS (4+4-pin) cables in a GPU - they are keyed differently and wiring them in can damage the card.");
  }

  // Wattage-specific tips
  if (wVerdict === "inadequate") {
    tips.unshift("Your " + psuW + "W PSU is below the recommended " + recommended + "W for this combination. Upgrade the PSU before running the card under load.");
  } else if (wVerdict === "borderline") {
    tips.unshift("Your " + psuW + "W PSU is close to the limit. It will run, but you have little headroom for transient spikes or future upgrades - " + recommended + "W+ is the comfortable target.");
  }
  if (!std.atx3 && gpu.spike >= 450) {
    tips.push("This card has large transient spikes (up to ~" + gpu.spike + "W for microseconds). ATX 2.x PSUs can trip their protection on these - an ATX 3.x unit is designed to ride them out.");
  }
  if (gpu.note) tips.push("Card note: " + gpu.note);

  const tipsHTML = tips.map(function (t) {
    return '<div class="suggestion-item"><div class="dot"></div><span>' + t + '</span></div>';
  }).join("");

  const wStyle = GP_STYLES[wVerdict];
  const wMargin = Math.round((psuW / recommended - 1) * 100);
  const wMarginStr = (wMargin >= 0 ? "+" : "") + wMargin + "%";
  const barPsu = Math.min(100, Math.round(psuW / Math.max(psuW, recommended) * 100));
  const barRec = Math.min(100, Math.round(recommended / Math.max(psuW, recommended) * 100));

  resEl.innerHTML =
    '<div style="display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; flex-wrap:wrap; margin-bottom:1.25rem;">' +
      '<div>' +
        '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.6rem; text-transform:uppercase; letter-spacing:0.12em; color:#8888a0; margin-bottom:0.35rem;">' + esc(gpuKey) + ' &middot; ' + conn.std + '</div>' +
        '<div style="font-family:\'Instrument Serif\',serif; font-size:2.6rem; color:' + wStyle.color + '; line-height:1;">' + wStyle.label + '</div>' +
        '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.72rem; color:#8888a0; margin-top:0.3rem; max-width:440px; line-height:1.55;">' +
          'This GPU uses <strong style="color:var(--text);">' + conn.label + '</strong>. Your ' + psuW + 'W PSU vs a recommended ' + recommended + 'W for a ' + esc(cpu.label.split(" -")[0].toLowerCase()) + '-tier CPU pairing.' +
        '</div>' +
      '</div>' +
      '<div style="text-align:right; flex-shrink:0;">' +
        '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.6rem; text-transform:uppercase; color:#8888a0; margin-bottom:0.15rem;">PSU Headroom</div>' +
        '<div style="font-family:\'JetBrains Mono\',monospace; font-size:2rem; font-weight:700; color:' + wStyle.color + '; line-height:1;">' + wMarginStr + '</div>' +
      '</div>' +
    '</div>' +

    // Connector requirement card
    '<div style="background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:1rem 1.1rem; margin-bottom:1rem;">' +
      '<div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.6rem;">' +
        '<span style="width:8px;height:8px;border-radius:2px;background:' + cableColor + ';display:inline-block;"></span>' +
        '<span style="font-family:\'JetBrains Mono\',monospace; font-size:0.7rem; font-weight:600; color:' + cableColor + ';">' + esc(cableTitle) + '</span>' +
      '</div>' +
      '<div style="font-size:0.82rem; color:#b0b0c8; line-height:1.65; margin-bottom:0.75rem;">' + cableBody + '</div>' +
      '<div style="display:flex; justify-content:space-between; font-family:\'JetBrains Mono\',monospace; font-size:0.72rem; padding-top:0.6rem; border-top:1px solid var(--border);">' +
        '<span style="color:#8888a0;">Cables to connect</span><span style="color:var(--text); font-weight:600;">' + cableReq + '</span>' +
      '</div>' +
    '</div>' +

    // Power stat row
    '<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:0.6rem; margin-bottom:1rem;">' +
      '<div style="background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:0.75rem; text-align:center;">' +
        '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.56rem; text-transform:uppercase; color:#8888a0; margin-bottom:0.25rem;">GPU Board Power</div>' +
        '<div style="font-family:\'JetBrains Mono\',monospace; font-size:1.1rem; font-weight:700; color:var(--text);">' + gpu.tgp + 'W</div>' +
      '</div>' +
      '<div style="background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:0.75rem; text-align:center;">' +
        '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.56rem; text-transform:uppercase; color:#8888a0; margin-bottom:0.25rem;">Transient Spike</div>' +
        '<div style="font-family:\'JetBrains Mono\',monospace; font-size:1.1rem; font-weight:700; color:var(--warm);">~' + gpu.spike + 'W</div>' +
      '</div>' +
      '<div style="background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:0.75rem; text-align:center;">' +
        '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.56rem; text-transform:uppercase; color:#8888a0; margin-bottom:0.25rem;">Est. System Draw</div>' +
        '<div style="font-family:\'JetBrains Mono\',monospace; font-size:1.1rem; font-weight:700; color:var(--text);">~' + estTotal + 'W</div>' +
      '</div>' +
    '</div>' +

    // PSU comparison bars
    '<div style="background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:1rem 1.1rem; margin-bottom:1.25rem;">' +
      '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.62rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--accent); margin-bottom:0.75rem;">PSU Wattage vs Recommended</div>' +
      '<div style="margin-bottom:0.8rem;">' +
        '<div style="display:flex; justify-content:space-between; font-family:\'JetBrains Mono\',monospace; font-size:0.65rem; color:#8888a0; margin-bottom:0.3rem;"><span>Your PSU</span><span style="color:' + wStyle.color + '; font-weight:600;">' + psuW + 'W</span></div>' +
        '<div style="background:#2a2a32; border-radius:4px; height:8px; overflow:hidden;"><div style="width:' + barPsu + '%; height:100%; background:' + wStyle.color + '; border-radius:4px; transition:width 0.6s ease;"></div></div>' +
      '</div>' +
      '<div>' +
        '<div style="display:flex; justify-content:space-between; font-family:\'JetBrains Mono\',monospace; font-size:0.65rem; color:#8888a0; margin-bottom:0.3rem;"><span>Recommended</span><span style="color:var(--text); font-weight:600;">' + recommended + 'W</span></div>' +
        '<div style="background:#2a2a32; border-radius:4px; height:8px; overflow:hidden;"><div style="width:' + barRec + '%; height:100%; background:#444456; border-radius:4px;"></div></div>' +
      '</div>' +
    '</div>' +

    '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.62rem; text-transform:uppercase; letter-spacing:0.1em; color:#8888a0; margin-bottom:0.5rem;">Cabling & Safety Notes</div>' +
    '<div class="' + cableClass + '">' + tipsHTML + '</div>' +

    '<div style="font-size:0.7rem; color:#555568; margin-top:1rem; padding-top:0.75rem; border-top:1px solid var(--border); line-height:1.6;">' +
      'Board power (TGP) and recommended PSU wattage are manufacturer specifications. Transient spikes are brief (microsecond) excursions measured in reviewer testing and are handled natively by ATX 3.0/3.1 power supplies. Founders Edition and AIB (partner) cards can use different connectors - always check the plug on your specific card.' +
    '</div>';

  resEl.className = "result-box " + wStyle.cssClass + " show";
  if (defEl) defEl.style.display = "none";
  setTimeout(function () { resEl.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 100);
}

/* ── Populate dropdowns ───────────────────────────────────────────────────────*/
document.addEventListener("DOMContentLoaded", function () {
  var gpuEl = document.getElementById("gp-gpu");
  if (gpuEl) {
    GPU_GROUPS.forEach(function (g) {
      var og = document.createElement("optgroup");
      og.label = g.label;
      g.keys.forEach(function (k) {
        if (GPU_POWER[k]) {
          var o = document.createElement("option");
          o.value = k;
          o.textContent = k + "  (" + GPU_POWER[k].tgp + "W)";
          og.appendChild(o);
        }
      });
      gpuEl.appendChild(og);
    });
  }

  var stdEl = document.getElementById("gp-std");
  if (stdEl) {
    Object.keys(PSU_STDS).forEach(function (k) {
      var o = document.createElement("option");
      o.value = k; o.textContent = PSU_STDS[k].label;
      stdEl.appendChild(o);
    });
  }

  var cpuEl = document.getElementById("gp-cpu");
  if (cpuEl) {
    Object.keys(CPU_TIERS).forEach(function (k) {
      var o = document.createElement("option");
      o.value = k; o.textContent = CPU_TIERS[k].label;
      if (k === "mid") o.selected = true;
      cpuEl.appendChild(o);
    });
  }

  var psuEl = document.getElementById("gp-psu");
  if (psuEl) {
    [450, 500, 550, 600, 650, 750, 850, 1000, 1200, 1300, 1600].forEach(function (w) {
      var o = document.createElement("option");
      o.value = w; o.textContent = w + "W";
      psuEl.appendChild(o);
    });
  }
});
