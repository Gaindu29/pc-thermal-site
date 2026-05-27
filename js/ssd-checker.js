/**
 * ThermalCore — SSD Health Checker (v2)
 * Inputs: drive type + temperature only
 */

const SSD_PROFILES = {
  nvme: {
    label:    "NVMe M.2 (Desktop)",
    safe:     55,
    warm:     70,
    hot:      79,
    tjMax:    80,
    idle:     "30–45°C",
    gaming:   "50–65°C",
    note:     "NVMe runs significantly hotter than SATA by design. A heatsink reduces temps 10–20°C.",
  },
  laptop_nvme: {
    label:    "NVMe M.2 (Laptop)",
    safe:     58,
    warm:     72,
    hot:      80,
    tjMax:    85,
    idle:     "35–48°C",
    gaming:   "55–72°C",
    note:     "Laptop NVMe drives run hot due to confined chassis. Cooling pads and open vents help.",
  },
  sata: {
    label:    "SATA SSD (2.5\" or M.2 SATA)",
    safe:     45,
    warm:     55,
    hot:      63,
    tjMax:    70,
    idle:     "20–35°C",
    gaming:   "35–50°C",
    note:     "SATA SSDs run much cooler than NVMe. Temps above 50°C suggest poor case airflow.",
  },
};

const TIERS = {
  safe:     { label: "SAFE",     cssClass: "safe",     emoji: "✅" },
  warm:     { label: "WARM",     cssClass: "warm",     emoji: "⚠️" },
  hot:      { label: "TOO HOT",  cssClass: "hot",      emoji: "🔥" },
  critical: { label: "CRITICAL", cssClass: "critical", emoji: "🚨" },
};

const SUGGESTIONS = {
  safe: [
    "SSD temperature is in the healthy operating range — no action needed.",
    "Read and write speeds are at full capacity with no thermal throttling.",
    "Continue monitoring temperature during intensive tasks like large file transfers.",
  ],
  warm: [
    "Temperature is elevated. Ensure good airflow over the SSD or its heatsink.",
    "For NVMe drives: a passive aluminium M.2 heatsink ($8–15) can drop temps by 10–20°C.",
    "Check that case fans are directing airflow past the M.2 slot.",
    "Reduce ambient room temperature if possible — it directly affects SSD temps.",
  ],
  hot: [
    "SSD may be thermally throttling — this directly reduces read and write speeds.",
    "Add or replace an NVMe heatsink immediately. Single-sided aluminium models work well.",
    "Improve overall case airflow: add a front intake fan directed toward the motherboard.",
    "Check if a nearby GPU or other component is radiating heat toward the drive.",
    "On laptops: ensure all bottom vents are unobstructed and use a cooling pad.",
    "Move the drive to a different M.2 slot if one is better positioned for airflow.",
  ],
  critical: [
    "CRITICAL: Stop intensive disk activity immediately. Thermal throttling is severe.",
    "Sustained operation at this temperature risks data corruption and hardware damage.",
    "Add an M.2 heatsink as the first priority — bare NVMe at this temp is unsustainable.",
    "Check BIOS thermal throttle settings — some boards have NVMe thermal limits you can review.",
    "If a heatsink is already fitted, check that the thermal pad has full contact with the drive.",
    "Back up your data immediately in case of drive failure.",
  ],
};

function getTier(temp, profile) {
  if (temp <= profile.safe) return "safe";
  if (temp <= profile.warm) return "warm";
  if (temp <= profile.hot)  return "hot";
  return "critical";
}

function thermoPercent(temp, tjMax) {
  return Math.min(100, Math.max(0, ((temp - 15) / (tjMax - 15)) * 100));
}

const TIER_COLORS = {
  safe:     "var(--safe)",
  warm:     "var(--warm)",
  hot:      "var(--hot)",
  critical: "var(--critical)",
};

function checkSSD() {
  const typeEl   = document.getElementById("ssd-type");
  const tempEl   = document.getElementById("ssd-temp");
  const errorEl  = document.getElementById("ssd-error");
  const resultEl = document.getElementById("ssd-result");
  const defaultEl= document.getElementById("ssd-default");

  // Clear error
  errorEl.textContent = "";
  errorEl.style.display = "none";

  // Validate drive type
  const driveType = typeEl.value;
  if (!driveType) {
    errorEl.textContent = "Please select your drive type.";
    errorEl.style.display = "block";
    return;
  }

  // Validate temperature
  const tempStr = tempEl.value.trim();
  const temp    = parseInt(tempStr, 10);
  if (!tempStr || isNaN(temp) || temp < 0 || temp > 200) {
    errorEl.textContent = "Please enter a valid temperature between 0 and 200°C.";
    errorEl.style.display = "block";
    return;
  }

  const profile     = SSD_PROFILES[driveType];
  const tierKey     = getTier(temp, profile);
  const tier        = TIERS[tierKey];
  const color       = TIER_COLORS[tierKey];
  const fillPct     = thermoPercent(temp, profile.tjMax);
  const suggestions = SUGGESTIONS[tierKey];

  const suggestionsHTML = suggestions.map(s => `
    <div class="suggestion-item">
      <div class="dot"></div>
      <span>${s}</span>
    </div>`).join("");

  resultEl.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; flex-wrap:wrap; margin-bottom:1rem;">
      <div>
        <div style="font-family:'Bebas Neue',sans-serif; font-size:3rem; letter-spacing:0.05em; color:${color}; line-height:1;">${tier.label}</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.72rem; color:#8888a0; margin-top:0.2rem;">${profile.label}</div>
      </div>
      <div style="font-family:'JetBrains Mono',monospace; font-size:4rem; font-weight:600; color:${color}; line-height:1;">${temp}°C</div>
    </div>

    <div class="thermo-bar">
      <div id="ssd-thermo-fill" style="width:0%; height:100%; border-radius:100px; background:${color}; transition:width 0.6s cubic-bezier(0.34,1.2,0.64,1);"></div>
    </div>
    <div style="display:flex; justify-content:space-between; font-family:'JetBrains Mono',monospace; font-size:0.63rem; color:#8888a0; margin-bottom:1.25rem;">
      <span>15°C</span>
      <span>Max: ${profile.tjMax}°C</span>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem; margin-bottom:1.25rem;">
      <div style="background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:0.75rem 1rem;">
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.62rem; letter-spacing:0.1em; text-transform:uppercase; color:#8888a0; margin-bottom:0.25rem;">Normal Idle</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.9rem; color:var(--safe);">${profile.idle}</div>
      </div>
      <div style="background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:0.75rem 1rem;">
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.62rem; letter-spacing:0.1em; text-transform:uppercase; color:#8888a0; margin-bottom:0.25rem;">Under Load</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.9rem; color:var(--warm);">${profile.gaming}</div>
      </div>
    </div>

    <div style="background:var(--surface2); border-radius:8px; padding:0.75rem 1rem; margin-bottom:1.25rem; border:1px solid var(--border); font-size:0.82rem; color:#8888a0; line-height:1.6;">
      ${profile.note}
    </div>

    <div style="font-family:'JetBrains Mono',monospace; font-size:0.68rem; letter-spacing:0.1em; text-transform:uppercase; color:#8888a0; margin-bottom:0.5rem;">What to do</div>
    ${suggestionsHTML}
  `;

  resultEl.className = "result-box " + tier.cssClass + " show";

  // Hide default state
  if (defaultEl) defaultEl.style.display = "none";

  // Animate thermometer fill
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const fill = document.getElementById("ssd-thermo-fill");
      if (fill) fill.style.width = fillPct + "%";
    });
  });

  // Scroll result into view
  setTimeout(() => {
    resultEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 100);
}

// Allow Enter on temp input
document.addEventListener("DOMContentLoaded", function () {
  var tempInput = document.getElementById("ssd-temp");
  if (tempInput) {
    tempInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") checkSSD();
    });
  }

  var typeSelect = document.getElementById("ssd-type");
  if (typeSelect) {
    typeSelect.addEventListener("change", updateTempStrip);
  }
});

function updateTempStrip() {
  var driveType = document.getElementById("ssd-type").value;
  var strip = document.getElementById("temp-reference-strip");
  if (!strip || !driveType) return;
  var p = SSD_PROFILES[driveType];
  if (!p) return;
  strip.innerHTML =
    '<div class="temp-strip-segment" style="background:rgba(34,212,126,0.06); border-right:1px solid var(--border);">' +
      '<span style="color:var(--safe); font-weight:600;">&#8804;' + p.safe + '&#176;C</span>' +
      '<span style="color:#8888a0; font-size:0.6rem;">SAFE</span>' +
    '</div>' +
    '<div class="temp-strip-segment" style="background:rgba(255,170,0,0.06); border-right:1px solid var(--border);">' +
      '<span style="color:var(--warm); font-weight:600;">' + (p.safe + 1) + '&#8211;' + p.warm + '&#176;C</span>' +
      '<span style="color:#8888a0; font-size:0.6rem;">WARM</span>' +
    '</div>' +
    '<div class="temp-strip-segment" style="background:rgba(255,100,34,0.06); border-right:1px solid var(--border);">' +
      '<span style="color:var(--hot); font-weight:600;">' + (p.warm + 1) + '&#8211;' + p.hot + '&#176;C</span>' +
      '<span style="color:#8888a0; font-size:0.6rem;">HOT</span>' +
    '</div>' +
    '<div class="temp-strip-segment" style="background:rgba(255,34,68,0.06);">' +
      '<span style="color:var(--critical); font-weight:600;">' + (p.hot + 1) + '&#176;C+</span>' +
      '<span style="color:#8888a0; font-size:0.6rem;">CRITICAL</span>' +
    '</div>';
}


/* ═══════════════════════════════════════════════════════════════
   TAB SWITCHER
═══════════════════════════════════════════════════════════════ */
function switchTab(tab) {
  document.querySelectorAll(".ssd-tab-btn").forEach(function(b) {
    b.classList.remove("tab-active");
  });
  document.querySelectorAll(".ssd-tab-panel").forEach(function(p) {
    p.style.display = "none";
  });
  document.getElementById("tab-btn-" + tab).classList.add("tab-active");
  document.getElementById("tab-panel-" + tab).style.display = "block";
}


/* ═══════════════════════════════════════════════════════════════
   LIFESPAN ESTIMATOR DATA
   TBW = Terabytes Written (manufacturer rated endurance)
═══════════════════════════════════════════════════════════════ */
var SSD_TBW = {
  // ── Samsung SATA ──────────────────────────────────────────────
  "Samsung 870 EVO 250GB":    { tbw: 150,  type: "sata",  nand: "V-NAND TLC" },
  "Samsung 870 EVO 500GB":    { tbw: 300,  type: "sata",  nand: "V-NAND TLC" },
  "Samsung 870 EVO 1TB":      { tbw: 600,  type: "sata",  nand: "V-NAND TLC" },
  "Samsung 870 EVO 2TB":      { tbw: 1200, type: "sata",  nand: "V-NAND TLC" },
  "Samsung 870 EVO 4TB":      { tbw: 2400, type: "sata",  nand: "V-NAND TLC" },
  "Samsung 860 EVO 500GB":    { tbw: 300,  type: "sata",  nand: "V-NAND MLC" },
  "Samsung 860 EVO 1TB":      { tbw: 600,  type: "sata",  nand: "V-NAND MLC" },
  "Samsung 860 EVO 2TB":      { tbw: 1200, type: "sata",  nand: "V-NAND MLC" },
  // ── Crucial SATA ──────────────────────────────────────────────
  "Crucial MX500 250GB":      { tbw: 100,  type: "sata",  nand: "3D TLC" },
  "Crucial MX500 500GB":      { tbw: 180,  type: "sata",  nand: "3D TLC" },
  "Crucial MX500 1TB":        { tbw: 360,  type: "sata",  nand: "3D TLC" },
  "Crucial MX500 2TB":        { tbw: 700,  type: "sata",  nand: "3D TLC" },
  "Crucial BX500 240GB":      { tbw: 80,   type: "sata",  nand: "3D TLC" },
  "Crucial BX500 480GB":      { tbw: 120,  type: "sata",  nand: "3D TLC" },
  "Crucial BX500 1TB":        { tbw: 200,  type: "sata",  nand: "3D TLC" },
  // ── WD SATA ───────────────────────────────────────────────────
  "WD Blue 3D 250GB":         { tbw: 100,  type: "sata",  nand: "3D TLC" },
  "WD Blue 3D 500GB":         { tbw: 200,  type: "sata",  nand: "3D TLC" },
  "WD Blue 3D 1TB":           { tbw: 400,  type: "sata",  nand: "3D TLC" },
  "WD Blue 3D 2TB":           { tbw: 500,  type: "sata",  nand: "3D TLC" },
  // ── Kingston SATA ─────────────────────────────────────────────
  "Kingston A400 240GB":      { tbw: 80,   type: "sata",  nand: "TLC" },
  "Kingston A400 480GB":      { tbw: 160,  type: "sata",  nand: "TLC" },
  "Kingston A400 960GB":      { tbw: 300,  type: "sata",  nand: "TLC" },
  // ── Samsung NVMe ──────────────────────────────────────────────
  "Samsung 990 Pro 1TB":      { tbw: 600,  type: "nvme",  nand: "V-NAND TLC" },
  "Samsung 990 Pro 2TB":      { tbw: 1200, type: "nvme",  nand: "V-NAND TLC" },
  "Samsung 980 Pro 1TB":      { tbw: 600,  type: "nvme",  nand: "V-NAND MLC" },
  "Samsung 980 Pro 2TB":      { tbw: 1200, type: "nvme",  nand: "V-NAND MLC" },
  "Samsung 980 500GB":        { tbw: 300,  type: "nvme",  nand: "V-NAND TLC" },
  "Samsung 980 1TB":          { tbw: 600,  type: "nvme",  nand: "V-NAND TLC" },
  "Samsung 970 EVO Plus 500GB": { tbw: 300, type: "nvme", nand: "V-NAND MLC" },
  "Samsung 970 EVO Plus 1TB": { tbw: 600,  type: "nvme",  nand: "V-NAND MLC" },
  "Samsung 970 EVO Plus 2TB": { tbw: 1200, type: "nvme",  nand: "V-NAND MLC" },
  // ── WD NVMe ───────────────────────────────────────────────────
  "WD Black SN850X 1TB":      { tbw: 600,  type: "nvme",  nand: "3D TLC" },
  "WD Black SN850X 2TB":      { tbw: 1200, type: "nvme",  nand: "3D TLC" },
  "WD Black SN850X 4TB":      { tbw: 2400, type: "nvme",  nand: "3D TLC" },
  "WD Black SN770 500GB":     { tbw: 300,  type: "nvme",  nand: "3D TLC" },
  "WD Black SN770 1TB":       { tbw: 600,  type: "nvme",  nand: "3D TLC" },
  "WD Black SN770 2TB":       { tbw: 1200, type: "nvme",  nand: "3D TLC" },
  "WD Blue SN580 500GB":      { tbw: 300,  type: "nvme",  nand: "3D TLC" },
  "WD Blue SN580 1TB":        { tbw: 600,  type: "nvme",  nand: "3D TLC" },
  "WD Blue SN570 500GB":      { tbw: 300,  type: "nvme",  nand: "3D TLC" },
  "WD Blue SN570 1TB":        { tbw: 600,  type: "nvme",  nand: "3D TLC" },
  // ── Seagate NVMe ──────────────────────────────────────────────
  "Seagate FireCuda 530 500GB":  { tbw: 640,  type: "nvme", nand: "3D TLC" },
  "Seagate FireCuda 530 1TB":    { tbw: 1275, type: "nvme", nand: "3D TLC" },
  "Seagate FireCuda 530 2TB":    { tbw: 2550, type: "nvme", nand: "3D TLC" },
  "Seagate FireCuda 530 4TB":    { tbw: 5100, type: "nvme", nand: "3D TLC" },
  "Seagate Barracuda 510 256GB": { tbw: 160,  type: "nvme", nand: "3D TLC" },
  "Seagate Barracuda 510 512GB": { tbw: 320,  type: "nvme", nand: "3D TLC" },
  // ── Crucial NVMe ──────────────────────────────────────────────
  "Crucial T700 1TB":         { tbw: 600,  type: "nvme",  nand: "3D TLC" },
  "Crucial T700 2TB":         { tbw: 1200, type: "nvme",  nand: "3D TLC" },
  "Crucial T500 500GB":       { tbw: 300,  type: "nvme",  nand: "3D TLC" },
  "Crucial T500 1TB":         { tbw: 600,  type: "nvme",  nand: "3D TLC" },
  "Crucial T500 2TB":         { tbw: 1200, type: "nvme",  nand: "3D TLC" },
  "Crucial P5 Plus 500GB":    { tbw: 300,  type: "nvme",  nand: "3D TLC" },
  "Crucial P5 Plus 1TB":      { tbw: 600,  type: "nvme",  nand: "3D TLC" },
  "Crucial P3 Plus 500GB":    { tbw: 220,  type: "nvme",  nand: "3D QLC" },
  "Crucial P3 Plus 1TB":      { tbw: 440,  type: "nvme",  nand: "3D QLC" },
  "Crucial P3 Plus 2TB":      { tbw: 880,  type: "nvme",  nand: "3D QLC" },
  // ── Kingston NVMe ─────────────────────────────────────────────
  "Kingston KC3000 512GB":    { tbw: 400,  type: "nvme",  nand: "3D TLC" },
  "Kingston KC3000 1TB":      { tbw: 800,  type: "nvme",  nand: "3D TLC" },
  "Kingston KC3000 2TB":      { tbw: 1600, type: "nvme",  nand: "3D TLC" },
  "Kingston NV3 500GB":       { tbw: 200,  type: "nvme",  nand: "3D TLC" },
  "Kingston NV3 1TB":         { tbw: 400,  type: "nvme",  nand: "3D TLC" },
  "Kingston NV3 2TB":         { tbw: 800,  type: "nvme",  nand: "3D TLC" },
  // ── SK Hynix NVMe ─────────────────────────────────────────────
  "SK Hynix Platinum P41 500GB": { tbw: 400, type: "nvme", nand: "176L TLC" },
  "SK Hynix Platinum P41 1TB":   { tbw: 750, type: "nvme", nand: "176L TLC" },
  "SK Hynix Platinum P41 2TB":   { tbw: 1500, type: "nvme", nand: "176L TLC" },
  "SK Hynix Gold P31 500GB":  { tbw: 250,  type: "nvme",  nand: "128L TLC" },
  "SK Hynix Gold P31 1TB":    { tbw: 500,  type: "nvme",  nand: "128L TLC" },
  // ── Corsair NVMe ──────────────────────────────────────────────
  "Corsair MP600 Pro 1TB":    { tbw: 1400, type: "nvme",  nand: "3D TLC" },
  "Corsair MP600 Pro 2TB":    { tbw: 2800, type: "nvme",  nand: "3D TLC" },
  "Corsair MP600 GS 1TB":     { tbw: 600,  type: "nvme",  nand: "3D TLC" },
  "Corsair MP600 GS 2TB":     { tbw: 1200, type: "nvme",  nand: "3D TLC" },
};

/* ── Lifespan health tiers ─────────────────────────────────── */
function lifespanTier(pct) {
  if (pct <= 25)  return { key: "new",     label: "LIKE NEW",    cssClass: "safe",     color: "var(--safe)",     msg: "Drive is essentially new. You have years of rated life ahead." };
  if (pct <= 55)  return { key: "healthy", label: "HEALTHY",     cssClass: "safe",     color: "var(--safe)",     msg: "Drive is in good health. Continue using normally." };
  if (pct <= 75)  return { key: "aging",   label: "AGING",       cssClass: "warm",     color: "var(--warm)",     msg: "Drive has reached middle age. Maintain regular backups." };
  if (pct <= 90)  return { key: "late",    label: "LATE LIFE",   cssClass: "hot",      color: "var(--hot)",      msg: "Drive is approaching its rated limit. Back up data and plan a replacement." };
  return           { key: "eol",    label: "END OF LIFE", cssClass: "critical", color: "var(--critical)", msg: "Drive has exceeded its rated TBW. It may continue working, but back up immediately and replace soon." };
}

/* ── Daily write context labels ──────────────────────────────── */
function writeLevelLabel(gbPerDay) {
  if (gbPerDay < 3)   return "Light use (browsing, documents)";
  if (gbPerDay < 10)  return "Moderate use (gaming, downloads)";
  if (gbPerDay < 30)  return "Heavy use (video editing, VMs)";
  return                     "Extreme use (server / content creation)";
}

/* ── SVG arc gauge ───────────────────────────────────────────── */
function buildGauge(pct, color) {
  var clamped = Math.min(100, Math.max(0, pct));
  var r = 54;
  var cx = 70; var cy = 70;
  var circumference = 2 * Math.PI * r;
  // We use a 270-degree arc (from 135deg to 405deg)
  var arcLength = circumference * 0.75;
  var fillLength = arcLength * (clamped / 100);
  var gapLength  = circumference - arcLength;

  return '<svg viewBox="0 0 140 130" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:200px; display:block; margin:0 auto;">' +
    // Background track (270°)
    '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#2a2a32" stroke-width="10"' +
      ' stroke-dasharray="' + arcLength + ' ' + gapLength + '"' +
      ' stroke-dashoffset="' + (circumference * 0.125) + '"' +
      ' stroke-linecap="round" transform="rotate(-45 ' + cx + ' ' + cy + ')"/>' +
    // Fill arc
    '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="10"' +
      ' stroke-dasharray="' + fillLength + ' ' + (circumference - fillLength) + '"' +
      ' stroke-dashoffset="' + (circumference * 0.125) + '"' +
      ' stroke-linecap="round" transform="rotate(-45 ' + cx + ' ' + cy + ')"/>' +
    // Percentage text
    '<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" fill="' + color + '"' +
      ' font-family="JetBrains Mono,monospace" font-size="20" font-weight="600">' + Math.round(clamped) + '%</text>' +
    '<text x="' + cx + '" y="' + (cy + 16) + '" text-anchor="middle" fill="#8888a0"' +
      ' font-family="JetBrains Mono,monospace" font-size="9" letter-spacing="1">USED</text>' +
  '</svg>';
}

/* ── MAIN: Check Lifespan ──────────────────────────────────── */
function checkLifespan() {
  var modelEl  = document.getElementById("ls-model");
  var writtenEl= document.getElementById("ls-written");
  var unitEl   = document.getElementById("ls-unit");
  var dailyEl  = document.getElementById("ls-daily");
  var errorEl  = document.getElementById("ls-error");
  var resultEl = document.getElementById("ls-result");
  var defaultEl= document.getElementById("ls-default");

  errorEl.textContent = "";
  errorEl.style.display = "none";

  var model = modelEl.value;
  if (!model) {
    errorEl.textContent = "Please select your SSD model.";
    errorEl.style.display = "block";
    return;
  }

  var writtenRaw = writtenEl.value.trim();
  var written = parseFloat(writtenRaw);
  if (!writtenRaw || isNaN(written) || written < 0) {
    errorEl.textContent = "Please enter a valid amount written (e.g. 1200).";
    errorEl.style.display = "block";
    return;
  }

  // Convert to TB
  var unit = unitEl.value;
  var writtenTB = unit === "gb" ? written / 1000 : written;

  var dailyRaw = dailyEl ? dailyEl.value.trim() : "";
  var dailyGB  = dailyRaw ? parseFloat(dailyRaw) : null;
  if (dailyGB !== null && (isNaN(dailyGB) || dailyGB < 0)) {
    errorEl.textContent = "Daily writes must be a positive number (or leave blank).";
    errorEl.style.display = "block";
    return;
  }

  var ssd   = SSD_TBW[model];
  var ratedTBW   = ssd.tbw;
  var usedPct    = (writtenTB / ratedTBW) * 100;
  var remainTB   = Math.max(0, ratedTBW - writtenTB);
  var tier       = lifespanTier(usedPct);

  // Projection
  var projectionHTML = "";
  if (dailyGB && dailyGB > 0) {
    var dailyTB = dailyGB / 1000;
    var remainYears = remainTB > 0 ? (remainTB / dailyTB / 365) : 0;
    var totalYears  = ratedTBW / dailyTB / 365;
    projectionHTML =
      '<div style="background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:1rem 1.1rem; margin-bottom:1rem;">' +
        '<div style="font-family:\'IBM Plex Mono\',monospace; font-size:0.65rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--accent); margin-bottom:0.6rem;">Write Rate Projection</div>' +
        '<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.5rem;">' +
          '<div>' +
            '<div style="font-family:\'IBM Plex Mono\',monospace; font-size:0.6rem; text-transform:uppercase; color:#8888a0; margin-bottom:0.2rem;">Daily Writes</div>' +
            '<div style="font-family:\'IBM Plex Mono\',monospace; font-size:1rem; color:var(--text);">' + dailyGB.toFixed(1) + ' GB</div>' +
            '<div style="font-size:0.7rem; color:#555568;">' + writeLevelLabel(dailyGB) + '</div>' +
          '</div>' +
          '<div>' +
            '<div style="font-family:\'IBM Plex Mono\',monospace; font-size:0.6rem; text-transform:uppercase; color:#8888a0; margin-bottom:0.2rem;">Rated Life Total</div>' +
            '<div style="font-family:\'IBM Plex Mono\',monospace; font-size:1rem; color:var(--text);">' + totalYears.toFixed(1) + ' years</div>' +
            '<div style="font-size:0.7rem; color:#555568;">at this write rate</div>' +
          '</div>' +
          '<div>' +
            '<div style="font-family:\'IBM Plex Mono\',monospace; font-size:0.6rem; text-transform:uppercase; color:#8888a0; margin-bottom:0.2rem;">Est. Remaining</div>' +
            '<div style="font-family:\'IBM Plex Mono\',monospace; font-size:1rem; color:' + tier.color + ';">' + (remainTB > 0 ? remainYears.toFixed(1) + ' yrs' : '—') + '</div>' +
            '<div style="font-size:0.7rem; color:#555568;">of rated endurance</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  // Build stat cards
  var statsHTML =
    '<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:0.6rem; margin-bottom:1rem;">' +
      '<div style="background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:0.75rem; text-align:center;">' +
        '<div style="font-family:\'IBM Plex Mono\',monospace; font-size:0.58rem; letter-spacing:0.08em; text-transform:uppercase; color:#8888a0; margin-bottom:0.25rem;">Written</div>' +
        '<div style="font-family:\'IBM Plex Mono\',monospace; font-size:1rem; font-weight:600; color:var(--text);">' + writtenTB.toFixed(2) + ' TB</div>' +
      '</div>' +
      '<div style="background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:0.75rem; text-align:center;">' +
        '<div style="font-family:\'IBM Plex Mono\',monospace; font-size:0.58rem; letter-spacing:0.08em; text-transform:uppercase; color:#8888a0; margin-bottom:0.25rem;">Rated TBW</div>' +
        '<div style="font-family:\'IBM Plex Mono\',monospace; font-size:1rem; font-weight:600; color:var(--text);">' + ratedTBW + ' TB</div>' +
      '</div>' +
      '<div style="background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:0.75rem; text-align:center;">' +
        '<div style="font-family:\'IBM Plex Mono\',monospace; font-size:0.58rem; letter-spacing:0.08em; text-transform:uppercase; color:#8888a0; margin-bottom:0.25rem;">Remaining</div>' +
        '<div style="font-family:\'IBM Plex Mono\',monospace; font-size:1rem; font-weight:600; color:' + tier.color + ';">' + (remainTB > 0 ? remainTB.toFixed(0) + ' TB' : 'Exceeded') + '</div>' +
      '</div>' +
    '</div>';

  // NAND note
  var nandNote = "";
  if (ssd.nand === "3D QLC") {
    nandNote = '<div style="background:rgba(255,170,0,0.06); border:1px solid rgba(255,170,0,0.2); border-left:3px solid var(--warm); border-radius:6px; padding:0.75rem 1rem; font-size:0.8rem; color:#b0b0c8; line-height:1.6; margin-bottom:1rem;">⚠️ This drive uses <strong style="color:var(--text);">QLC NAND</strong>, which has lower write endurance than TLC. The rated TBW reflects this — stay within it more carefully than with a TLC drive.</div>';
  }

  // Beyond TBW note
  var beyondNote = usedPct > 100
    ? '<div style="background:rgba(255,34,68,0.06); border:1px solid rgba(255,34,68,0.2); border-left:3px solid var(--critical); border-radius:6px; padding:0.75rem 1rem; font-size:0.8rem; color:#b0b0c8; line-height:1.6; margin-bottom:1rem;">This drive has written more than its rated TBW. Many drives continue operating beyond this point — SSDs regularly outlast their ratings. However, you should treat this drive as end-of-life: maintain a current backup and replace it at your earliest convenience.</div>'
    : "";

  resultEl.innerHTML =
    '<div style="display:grid; grid-template-columns:auto 1fr; gap:1.25rem; align-items:center; margin-bottom:1.25rem;">' +
      '<div>' + buildGauge(usedPct, tier.color) + '</div>' +
      '<div>' +
        '<div style="font-family:\'Bebas Neue\',sans-serif; font-size:2.5rem; letter-spacing:0.05em; color:' + tier.color + '; line-height:1;">' + tier.label + '</div>' +
        '<div style="font-family:\'IBM Plex Mono\',monospace; font-size:0.72rem; color:#8888a0; margin-top:0.2rem; margin-bottom:0.6rem;">' + model + ' · ' + ssd.nand + '</div>' +
        '<div style="font-size:0.85rem; color:#b0b0c8; line-height:1.6;">' + tier.msg + '</div>' +
      '</div>' +
    '</div>' +
    beyondNote +
    nandNote +
    statsHTML +
    projectionHTML +
    '<div style="font-family:\'IBM Plex Mono\',monospace; font-size:0.62rem; color:#555568; line-height:1.6; margin-top:0.5rem; padding-top:0.75rem; border-top:1px solid var(--border);">' +
      '* TBW (Terabytes Written) is a conservative manufacturer estimate. Real-world endurance often exceeds it by 2–5×. ' +
      'Total Host Writes is found in CrystalDiskInfo under the SMART attributes section.' +
    '</div>';

  resultEl.className = "result-box " + tier.cssClass + " show";
  if (defaultEl) defaultEl.style.display = "none";
  setTimeout(function() {
    resultEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 100);
}
