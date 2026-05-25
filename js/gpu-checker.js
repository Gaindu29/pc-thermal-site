/**
 * ThermalCore — GPU Temperature Checker Logic
 * gpu-checker.js
 */

// GPU database: model → { label, tjMax, safeGaming, warnGaming }
const GPU_DATA = {
  // NVIDIA RTX 40 Series
  "RTX 4090":   { tjMax: 89,  safeGaming: 80, warnGaming: 85 },
  "RTX 4080 Super": { tjMax: 89,  safeGaming: 80, warnGaming: 85 },
  "RTX 4080":   { tjMax: 89,  safeGaming: 80, warnGaming: 85 },
  "RTX 4070 Ti Super": { tjMax: 89,  safeGaming: 82, warnGaming: 86 },
  "RTX 4070 Ti":{ tjMax: 89,  safeGaming: 82, warnGaming: 86 },
  "RTX 4070 Super": { tjMax: 89,  safeGaming: 83, warnGaming: 87 },
  "RTX 4070":   { tjMax: 89,  safeGaming: 83, warnGaming: 87 },
  "RTX 4060 Ti":{ tjMax: 89,  safeGaming: 83, warnGaming: 87 },
  "RTX 4060":   { tjMax: 89,  safeGaming: 83, warnGaming: 87 },
  "RTX 4050 (Laptop)": { tjMax: 87, safeGaming: 80, warnGaming: 85 },
  "RTX 4060 (Laptop)": { tjMax: 87, safeGaming: 80, warnGaming: 85 },
  "RTX 4070 (Laptop)": { tjMax: 87, safeGaming: 80, warnGaming: 85 },
  "RTX 4080 (Laptop)": { tjMax: 87, safeGaming: 83, warnGaming: 86 },
  "RTX 4090 (Laptop)": { tjMax: 87, safeGaming: 83, warnGaming: 86 },

  // NVIDIA RTX 30 Series
  "RTX 3090 Ti":{ tjMax: 93,  safeGaming: 83, warnGaming: 88 },
  "RTX 3090":   { tjMax: 93,  safeGaming: 83, warnGaming: 88 },
  "RTX 3080 Ti":{ tjMax: 93,  safeGaming: 83, warnGaming: 88 },
  "RTX 3080":   { tjMax: 93,  safeGaming: 83, warnGaming: 88 },
  "RTX 3070 Ti":{ tjMax: 93,  safeGaming: 84, warnGaming: 89 },
  "RTX 3070":   { tjMax: 93,  safeGaming: 84, warnGaming: 89 },
  "RTX 3060 Ti":{ tjMax: 93,  safeGaming: 84, warnGaming: 89 },
  "RTX 3060":   { tjMax: 93,  safeGaming: 85, warnGaming: 90 },
  "RTX 3050":   { tjMax: 93,  safeGaming: 85, warnGaming: 90 },
  "RTX 3060 (Laptop)": { tjMax: 87, safeGaming: 80, warnGaming: 85 },
  "RTX 3070 (Laptop)": { tjMax: 87, safeGaming: 80, warnGaming: 85 },
  "RTX 3080 (Laptop)": { tjMax: 87, safeGaming: 83, warnGaming: 86 },

  // NVIDIA GTX 16 / 10 Series
  "GTX 1660 Ti":{ tjMax: 97, safeGaming: 84, warnGaming: 90 },
  "GTX 1660 Super":{ tjMax: 97, safeGaming: 84, warnGaming: 90 },
  "GTX 1660":   { tjMax: 97, safeGaming: 84, warnGaming: 90 },
  "GTX 1650":   { tjMax: 97, safeGaming: 85, warnGaming: 91 },
  "GTX 1080 Ti":{ tjMax: 91, safeGaming: 83, warnGaming: 87 },
  "GTX 1080":   { tjMax: 94, safeGaming: 84, warnGaming: 89 },
  "GTX 1070 Ti":{ tjMax: 94, safeGaming: 84, warnGaming: 89 },
  "GTX 1070":   { tjMax: 94, safeGaming: 84, warnGaming: 89 },
  "GTX 1060":   { tjMax: 97, safeGaming: 85, warnGaming: 91 },
  "GTX 1050 Ti":{ tjMax: 97, safeGaming: 85, warnGaming: 91 },

  // AMD RX 7000 Series
  "RX 7900 XTX":{ tjMax: 110, safeGaming: 85, warnGaming: 95 },
  "RX 7900 XT": { tjMax: 110, safeGaming: 85, warnGaming: 95 },
  "RX 7800 XT": { tjMax: 110, safeGaming: 85, warnGaming: 95 },
  "RX 7700 XT": { tjMax: 110, safeGaming: 85, warnGaming: 95 },
  "RX 7600":    { tjMax: 110, safeGaming: 85, warnGaming: 95 },

  // AMD RX 6000 Series
  "RX 6950 XT": { tjMax: 110, safeGaming: 85, warnGaming: 95 },
  "RX 6900 XT": { tjMax: 110, safeGaming: 85, warnGaming: 95 },
  "RX 6800 XT": { tjMax: 110, safeGaming: 85, warnGaming: 95 },
  "RX 6800":    { tjMax: 110, safeGaming: 85, warnGaming: 95 },
  "RX 6750 XT": { tjMax: 110, safeGaming: 85, warnGaming: 95 },
  "RX 6700 XT": { tjMax: 110, safeGaming: 85, warnGaming: 95 },
  "RX 6700":    { tjMax: 110, safeGaming: 85, warnGaming: 95 },
  "RX 6650 XT": { tjMax: 110, safeGaming: 85, warnGaming: 95 },
  "RX 6600 XT": { tjMax: 110, safeGaming: 85, warnGaming: 95 },
  "RX 6600":    { tjMax: 110, safeGaming: 85, warnGaming: 95 },
  "RX 6500 XT": { tjMax: 110, safeGaming: 85, warnGaming: 95 },
};

// Default fallback for generic / unlisted GPUs
const DEFAULT_GPU = { tjMax: 95, safeGaming: 83, warnGaming: 89 };

// Status tier definitions
const TIERS = {
  safe:     { label: "SAFE",     emoji: "✅", color: "safe" },
  warm:     { label: "WARM",     emoji: "⚠️", color: "warm" },
  hot:      { label: "TOO HOT",  emoji: "🔥", color: "hot"  },
  critical: { label: "CRITICAL", emoji: "🚨", color: "critical" },
};

const SUGGESTIONS = {
  safe: [
    "Your GPU is running at a healthy temperature. No action needed.",
    "Thermals are well within the safe zone — keep up the good airflow.",
    "Performance is not being thermally throttled at this temperature.",
    "Continue monitoring over long gaming sessions to ensure temps stay stable.",
  ],
  warm: [
    "Temperatures are elevated but within acceptable limits for most GPUs.",
    "Check that your case has adequate airflow — at least one intake and one exhaust fan.",
    "Consider cleaning dust filters and GPU heatsink fins with compressed air.",
    "Reapplying quality thermal paste to the GPU die can lower temps by 5–10°C.",
    "Undervolting your GPU in MSI Afterburner can reduce heat without losing performance.",
  ],
  hot: [
    "Your GPU is running hot and may start thermal throttling to protect itself.",
    "Immediately check case airflow — poor cable management blocks air circulation.",
    "Clean all dust from GPU fans, heatsink, and case filters right away.",
    "Ramp up GPU fan speed manually in MSI Afterburner or AMD Adrenalin.",
    "Consider an undervolt: reduces heat output while maintaining clock speeds.",
    "Check for a power limit setting — reducing TDP by 10–15% can significantly lower temps.",
    "If on a laptop, use a quality cooling pad and ensure vents are unobstructed.",
  ],
  critical: [
    "STOP gaming immediately. This temperature risks permanent GPU damage.",
    "Ensure the GPU fans are spinning — a failed fan can cause thermal shutdown.",
    "Check if any heatsink screws are loose, which can break thermal contact.",
    "The thermal paste on the GPU die may have dried out and needs immediate replacement.",
    "Clean the entire GPU and case of dust buildup — this is likely contributing heavily.",
    "If the problem persists after cleaning, the GPU cooler may need replacement.",
    "Reduce in-game settings to lower GPU workload while you diagnose the issue.",
  ],
};

/**
 * Determine tier based on GPU data and input temperature
 */
function getTier(temp, gpuData) {
  const { safeGaming, warnGaming, tjMax } = gpuData;
  if (temp <= safeGaming)           return "safe";
  if (temp <= warnGaming)           return "warm";
  if (temp <= tjMax - 2)            return "hot";
  return "critical";
}

/**
 * Calculate thermometer fill percentage (0–100)
 */
function getThermoPercent(temp, tjMax) {
  const min = 30;
  const pct = ((temp - min) / (tjMax - min)) * 100;
  return Math.min(100, Math.max(0, pct));
}

/**
 * Get fill color for the thermo bar
 */
function getThermoColor(tier) {
  const map = { safe: "#22d47e", warm: "#ffaa00", hot: "#ff6422", critical: "#ff2244" };
  return map[tier] || "#22d47e";
}

/**
 * Main check function — called by the form
 */
function checkTemperature() {
  const gpuSelect = document.getElementById("gpu-select");
  const tempInput = document.getElementById("temp-input");
  const resultBox = document.getElementById("result-box");
  const errorBox  = document.getElementById("error-box");

  const selectedGPU = gpuSelect.value;
  const tempRaw     = tempInput.value.trim();

  // Clear previous errors
  if (errorBox) errorBox.textContent = "";

  // Validate
  if (!selectedGPU) {
    showError("Please select your GPU model.");
    return;
  }
  const temp = parseInt(tempRaw, 10);
  if (!tempRaw || isNaN(temp)) {
    showError("Please enter a valid temperature.");
    return;
  }
  if (temp < 0 || temp > 200) {
    showError("Temperature must be between 0°C and 200°C.");
    return;
  }

  const gpuData = GPU_DATA[selectedGPU] || DEFAULT_GPU;
  const tier    = getTier(temp, gpuData);
  const tierDef = TIERS[tier];
  const suggestions = SUGGESTIONS[tier];

  // Build result HTML
  const thermoW   = getThermoPercent(temp, gpuData.tjMax);
  const thermoCol = getThermoColor(tier);

  const suggestionsHTML = suggestions.map(s => `
    <div class="suggestion-item">
      <div class="dot"></div>
      <span>${s}</span>
    </div>
  `).join("");

  resultBox.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; flex-wrap:wrap; margin-bottom:1rem;">
      <div>
        <div class="result-status">${tierDef.label}</div>
        <div style="color:#8888a0; font-family:'IBM Plex Mono',monospace; font-size:0.75rem; margin-top:0.2rem;">${selectedGPU}</div>
      </div>
      <div class="result-temp-display">${temp}°C</div>
    </div>

    <div class="thermo-bar">
      <div class="thermo-fill" id="thermo-fill" style="width:0%; background:${thermoCol};"></div>
    </div>
    <div style="display:flex; justify-content:space-between; font-family:'IBM Plex Mono',monospace; font-size:0.65rem; color:#8888a0; margin-bottom:1.25rem;">
      <span>30°C</span>
      <span>TJ Max: ${gpuData.tjMax}°C</span>
    </div>

    <div style="font-family:'IBM Plex Mono',monospace; font-size:0.7rem; letter-spacing:0.1em; text-transform:uppercase; color:#8888a0; margin-bottom:0.5rem;">Suggestions</div>
    <div>${suggestionsHTML}</div>
  `;

  resultBox.className = `result-box ${tier} show`;

  // Animate thermo fill after a short delay
  setTimeout(() => {
    const fill = document.getElementById("thermo-fill");
    if (fill) fill.style.width = thermoW + "%";
  }, 80);

  // Scroll into view smoothly
  setTimeout(() => resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
}

function showError(msg) {
  const errorBox = document.getElementById("error-box");
  if (errorBox) {
    errorBox.textContent = msg;
    errorBox.style.display = "block";
  }
}

// Allow Enter key on temp input
document.addEventListener("DOMContentLoaded", () => {
  const tempInput = document.getElementById("temp-input");
  if (tempInput) {
    tempInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") checkTemperature();
    });
  }
});
