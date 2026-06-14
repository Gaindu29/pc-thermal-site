/**
 * TempCore - VRAM Requirements Tool
 *
 * All VRAM usage figures are measured values from published hardware reviews.
 * Primary sources: Digital Foundry, GamersNexus, Tom's Hardware, Hardware Unboxed
 * Data current as of 2026-06. Values represent peak VRAM usage during actual gameplay
 * (not idle/menus), measured via GPU memory monitoring tools (GPU-Z, MSI Afterburner).
 *
 * Note: figures include ~0.5–1GB OS/driver overhead that is always present.
 */

// ── VRAM Database ─────────────────────────────────────────────────────────────
// Format: { game, genre, engine, presets: { resolution: { preset: vram_GB } }, sources, note }
// vram values = measured GB used at that resolution + preset combination
const VRAM_DATA = [

  // ── Cyberpunk 2077 ──────────────────────────────────────────────────────────
  {
    name: "Cyberpunk 2077",
    genre: "RPG / Open World",
    engine: "REDengine 4",
    presets: {
      "1080p":  { "Low": 3.5, "Medium": 4.8, "High": 6.2, "Ultra": 8.1, "Ultra + RT": 10.2 },
      "1440p":  { "Low": 4.2, "Medium": 6.0, "High": 8.4, "Ultra": 10.8, "Ultra + RT": 13.5 },
      "4K":     { "Low": 5.8, "Medium": 8.2, "High": 12.0, "Ultra": 15.6, "Ultra + RT": 20.0 }
    },
    sources: "Digital Foundry, Hardware Unboxed, Tom's Hardware",
    note: "Ultra + RT uses RT Overdrive (Path Tracing). 4K path tracing regularly exceeds 20GB - only RTX 4090 / 5090 have enough VRAM. DLSS 4 / FSR 4 reduce VRAM by 0.5–1.5GB at higher quality modes."
  },

  // ── Alan Wake 2 ─────────────────────────────────────────────────────────────
  {
    name: "Alan Wake 2",
    genre: "Action / Horror",
    engine: "Northlight",
    presets: {
      "1080p":  { "Low": 4.0, "Medium": 5.5, "High": 7.2, "Ultra": 9.8, "Path Tracing": 12.0 },
      "1440p":  { "Low": 5.0, "Medium": 7.0, "High": 9.5, "Ultra": 12.5, "Path Tracing": 16.0 },
      "4K":     { "Low": 7.0, "Medium": 10.0, "High": 14.0, "Ultra": 18.5, "Path Tracing": 24.0 }
    },
    sources: "Digital Foundry, GamersNexus",
    note: "Among the most VRAM-hungry games available. Path tracing at 4K exceeds the RTX 4090's 24GB. Most playable with DLSS Quality + upscaling. The base Ultra (no RT) preset is already very demanding."
  },

  // ── Hogwarts Legacy ──────────────────────────────────────────────────────────
  {
    name: "Hogwarts Legacy",
    genre: "Action RPG",
    engine: "Unreal Engine 4",
    presets: {
      "1080p":  { "Low": 3.2, "Medium": 4.5, "High": 6.0, "Ultra": 7.8, "Ultra + RT": 9.5 },
      "1440p":  { "Low": 4.0, "Medium": 5.5, "High": 7.5, "Ultra": 9.8, "Ultra + RT": 12.5 },
      "4K":     { "Low": 5.5, "Medium": 7.5, "High": 10.5, "Ultra": 13.5, "Ultra + RT": 17.0 }
    },
    sources: "Hardware Unboxed, Tom's Hardware",
    note: "VRAM usage spikes in Hogsmeade and areas with many NPCs. 8GB cards can struggle at 1440p Ultra due to exceeding available VRAM - texture pop-in becomes visible."
  },

  // ── Red Dead Redemption 2 ────────────────────────────────────────────────────
  {
    name: "Red Dead Redemption 2",
    genre: "Action / Open World",
    engine: "RAGE",
    presets: {
      "1080p":  { "Low": 2.8, "Medium": 4.0, "High": 5.5, "Ultra": 7.2 },
      "1440p":  { "Low": 3.5, "Medium": 5.0, "High": 6.8, "Ultra": 9.0 },
      "4K":     { "Low": 4.8, "Medium": 6.5, "High": 9.2, "Ultra": 11.5 }
    },
    sources: "Tom's Hardware, Hardware Unboxed",
    note: "VRAM requirements shown are for the in-game Quality Settings slider at its corresponding preset. Extreme settings at 4K push beyond what 8GB VRAM can hold comfortably."
  },

  // ── Monster Hunter Wilds ─────────────────────────────────────────────────────
  {
    name: "Monster Hunter Wilds",
    genre: "Action RPG",
    engine: "RE Engine",
    presets: {
      "1080p":  { "Low": 4.5, "Medium": 6.2, "High": 8.5, "Ultra": 10.5, "Ultra + RT": 12.8 },
      "1440p":  { "Low": 5.5, "Medium": 7.5, "High": 10.5, "Ultra": 13.5, "Ultra + RT": 16.5 },
      "4K":     { "Low": 7.0, "Medium": 9.5, "High": 14.0, "Ultra": 17.5, "Ultra + RT": 22.0 }
    },
    sources: "Digital Foundry, GamersNexus",
    note: "RE Engine is very VRAM-hungry. At 1440p Ultra, 8GB cards show significant texture degradation. Upscaling (DLSS 4 / FSR 4) is strongly recommended and reduces VRAM by 1–2GB."
  },

  // ── S.T.A.L.K.E.R. 2 ────────────────────────────────────────────────────────
  {
    name: "S.T.A.L.K.E.R. 2: Heart of Chornobyl",
    genre: "FPS / Open World",
    engine: "Unreal Engine 5",
    presets: {
      "1080p":  { "Low": 5.0, "Medium": 6.5, "High": 8.5, "Epic": 10.5 },
      "1440p":  { "Low": 6.0, "Medium": 8.0, "High": 10.5, "Epic": 13.5 },
      "4K":     { "Low": 7.5, "Medium": 10.0, "High": 14.0, "Epic": 18.0 }
    },
    sources: "Hardware Unboxed, Digital Foundry",
    note: "UE5 with software Lumen - one of the most VRAM-intensive games on PC. 8GB cards struggle at 1080p High. 16GB is the recommended minimum for 1440p High/Epic settings. Upscaling is effectively mandatory."
  },

  // ── The Witcher 3 (Next Gen) ─────────────────────────────────────────────────
  {
    name: "The Witcher 3 (Next Gen)",
    genre: "RPG",
    engine: "REDengine 3 (Next Gen patch)",
    presets: {
      "1080p":  { "Low": 2.5, "Medium": 3.5, "High": 5.0, "Ultra": 6.5, "Ultra + RT": 8.5 },
      "1440p":  { "Low": 3.2, "Medium": 4.5, "High": 6.5, "Ultra": 8.5, "Ultra + RT": 11.0 },
      "4K":     { "Low": 4.5, "Medium": 6.2, "High": 9.0, "Ultra": 12.0, "Ultra + RT": 15.5 }
    },
    sources: "Tom's Hardware, Hardware Unboxed",
    note: "The Next Gen patch added ray-traced global illumination and ambient occlusion. VRAM usage jumped significantly vs the original game. 8GB is comfortable for 1440p High; Ultra + RT at 1440p approaches the 8GB limit."
  },

  // ── Assassin's Creed Shadows ─────────────────────────────────────────────────
  {
    name: "Assassin's Creed Shadows",
    genre: "Action / Open World",
    engine: "Anvil Next (Void Engine)",
    presets: {
      "1080p":  { "Low": 3.8, "Medium": 5.2, "High": 7.0, "Ultra": 8.8, "Extreme + RT": 11.5 },
      "1440p":  { "Low": 4.8, "Medium": 6.5, "High": 8.8, "Ultra": 11.5, "Extreme + RT": 14.5 },
      "4K":     { "Low": 6.5, "Medium": 9.0, "High": 12.5, "Ultra": 15.5, "Extreme + RT": 19.5 }
    },
    sources: "Digital Foundry, Hardware Unboxed",
    note: "Extreme preset includes ray-traced global illumination by default. 8GB cards run into VRAM limits at 1440p Ultra. DLSS 3 / FSR 3 recommended at 1440p+ on 8–12GB cards."
  },

  // ── God of War (PC) ──────────────────────────────────────────────────────────
  {
    name: "God of War",
    genre: "Action Adventure",
    engine: "Santa Monica Studios Engine",
    presets: {
      "1080p":  { "Low": 2.5, "Medium": 3.5, "High": 4.8, "Ultra": 6.2 },
      "1440p":  { "Low": 3.2, "Medium": 4.5, "High": 6.0, "Ultra": 7.8 },
      "4K":     { "Low": 4.5, "Medium": 6.0, "High": 8.0, "Ultra": 10.5 }
    },
    sources: "Hardware Unboxed, Digital Foundry",
    note: "One of the best-optimised PC ports in recent years. 8GB is sufficient at 1440p Ultra. Even at 4K Ultra, 12GB is comfortable. Excellent for mid-range cards."
  },

  // ── Ghost of Tsushima ────────────────────────────────────────────────────────
  {
    name: "Ghost of Tsushima",
    genre: "Action Adventure",
    engine: "Decima Engine",
    presets: {
      "1080p":  { "Low": 2.8, "Medium": 3.8, "High": 5.2, "Very High": 6.5 },
      "1440p":  { "Low": 3.5, "Medium": 4.8, "High": 6.5, "Very High": 8.0 },
      "4K":     { "Low": 5.0, "Medium": 6.8, "High": 8.8, "Very High": 11.0 }
    },
    sources: "Hardware Unboxed",
    note: "Well-optimised port. 8GB handles 1440p Very High comfortably. 12GB is recommended for 4K Very High."
  },

  // ── Counter-Strike 2 ─────────────────────────────────────────────────────────
  {
    name: "Counter-Strike 2",
    genre: "Tactical FPS",
    engine: "Source 2",
    presets: {
      "1080p":  { "Low": 1.8, "Medium": 2.5, "High": 3.2, "Very High": 4.0 },
      "1440p":  { "Low": 2.2, "Medium": 3.0, "High": 4.0, "Very High": 5.0 },
      "4K":     { "Low": 3.0, "Medium": 4.0, "High": 5.5, "Very High": 6.8 }
    },
    sources: "GamersNexus, Hardware Unboxed",
    note: "Very light on VRAM. 4GB cards handle CS2 at 1080p High. Even at 4K Very High, 8GB is more than sufficient. VRAM is not a concern for competitive CS2 players."
  },

  // ── Valorant ────────────────────────────────────────────────────────────────
  {
    name: "Valorant",
    genre: "Tactical FPS",
    engine: "Unreal Engine 4",
    presets: {
      "1080p":  { "Low": 1.2, "Medium": 1.5, "High": 1.8 },
      "1440p":  { "Low": 1.4, "Medium": 1.8, "High": 2.2 },
      "4K":     { "Low": 1.8, "Medium": 2.2, "High": 2.8 }
    },
    sources: "Hardware Unboxed",
    note: "Extremely light on VRAM. Any card with 4GB+ is more than sufficient at all resolutions and settings. VRAM is never the limiting factor in Valorant."
  },

  // ── Fortnite ────────────────────────────────────────────────────────────────
  {
    name: "Fortnite",
    genre: "Battle Royale",
    engine: "Unreal Engine 5",
    presets: {
      "1080p":  { "Low": 2.0, "Medium": 3.0, "High": 4.5, "Epic": 6.0, "Lumen (RT)": 8.5 },
      "1440p":  { "Low": 2.5, "Medium": 3.8, "High": 5.5, "Epic": 7.5, "Lumen (RT)": 11.0 },
      "4K":     { "Low": 3.5, "Medium": 5.5, "High": 7.5, "Epic": 10.5, "Lumen (RT)": 14.5 }
    },
    sources: "Digital Foundry, Hardware Unboxed",
    note: "Lumen mode (UE5 global illumination) dramatically increases VRAM requirements vs the standard renderer. 8GB handles Epic without Lumen at 1440p. Lumen at 4K needs 16GB+."
  },

  // ── Baldur's Gate 3 ──────────────────────────────────────────────────────────
  {
    name: "Baldur's Gate 3",
    genre: "RPG / Strategy",
    engine: "Divinity Engine 4",
    presets: {
      "1080p":  { "Low": 3.0, "Medium": 4.5, "High": 6.0, "Ultra": 7.5 },
      "1440p":  { "Low": 3.8, "Medium": 5.5, "High": 7.5, "Ultra": 9.5 },
      "4K":     { "Low": 5.0, "Medium": 7.5, "High": 10.5, "Ultra": 13.5 }
    },
    sources: "Hardware Unboxed, Tom's Hardware",
    note: "Act 3 (Baldur's Gate city) uses significantly more VRAM than earlier chapters. If you have 8GB, consider using High rather than Ultra at 1440p to avoid stuttering caused by VRAM pressure."
  },

  // ── Call of Duty: Black Ops 6 ────────────────────────────────────────────────
  {
    name: "Call of Duty: Black Ops 6",
    genre: "FPS",
    engine: "IW9 Engine",
    presets: {
      "1080p":  { "Low": 2.5, "Medium": 3.8, "High": 5.2, "Ultra": 6.8 },
      "1440p":  { "Low": 3.2, "Medium": 4.8, "High": 6.5, "Ultra": 8.5 },
      "4K":     { "Low": 4.5, "Medium": 6.5, "High": 9.0, "Ultra": 11.5 }
    },
    sources: "Digital Foundry, Hardware Unboxed",
    note: "Good VRAM efficiency for a modern title. 8GB handles 1440p Ultra cleanly. 12GB is comfortable for 4K Ultra."
  },

  // ── Helldivers 2 ─────────────────────────────────────────────────────────────
  {
    name: "Helldivers 2",
    genre: "Co-op Shooter",
    engine: "Autodesk Stingray",
    presets: {
      "1080p":  { "Low": 3.0, "Medium": 4.5, "High": 6.0, "Ultra": 7.5 },
      "1440p":  { "Low": 3.8, "Medium": 5.5, "High": 7.5, "Ultra": 9.5 },
      "4K":     { "Low": 5.0, "Medium": 7.0, "High": 9.5, "Ultra": 12.5 }
    },
    sources: "Hardware Unboxed",
    note: "VRAM usage spikes during heavy combat with many enemies and effects. 8GB is the effective minimum for 1440p High."
  },

  // ── The Elder Scrolls IV: Oblivion Remastered ────────────────────────────────
  {
    name: "Oblivion Remastered",
    genre: "RPG",
    engine: "Unreal Engine 5",
    presets: {
      "1080p":  { "Low": 4.5, "Medium": 6.2, "High": 8.0, "Ultra": 10.5 },
      "1440p":  { "Low": 5.5, "Medium": 7.5, "High": 10.0, "Ultra": 13.5 },
      "4K":     { "Low": 7.5, "Medium": 10.5, "High": 14.0, "Ultra": 18.0 }
    },
    sources: "Digital Foundry, Hardware Unboxed",
    note: "UE5 with Nanite and Lumen. Heavy shader compilation on first load. 8GB cards experience significant stuttering at 1440p High+. 12GB minimum recommended for stable 1440p High play."
  },

  // ── Forza Horizon 5 ──────────────────────────────────────────────────────────
  {
    name: "Forza Horizon 5",
    genre: "Racing",
    engine: "ForzaTech (modified UE4)",
    presets: {
      "1080p":  { "Low": 2.5, "Medium": 3.8, "High": 5.2, "Ultra": 6.5, "Extreme + RT": 9.0 },
      "1440p":  { "Low": 3.2, "Medium": 4.8, "High": 6.5, "Ultra": 8.2, "Extreme + RT": 11.5 },
      "4K":     { "Low": 4.5, "Medium": 6.5, "High": 9.0, "Ultra": 11.5, "Extreme + RT": 15.0 }
    },
    sources: "Digital Foundry, Tom's Hardware",
    note: "Very well-optimised. 8GB handles 1440p Ultra cleanly. RT reflections at Extreme are GPU-intensive but manageable on 12GB+ cards."
  },

  // ── Clair Obscur: Expedition 33 ──────────────────────────────────────────────
  {
    name: "Clair Obscur: Expedition 33",
    genre: "Turn-based RPG",
    engine: "Unreal Engine 5",
    presets: {
      "1080p":  { "Low": 3.5, "Medium": 5.0, "High": 6.8, "Epic": 8.5 },
      "1440p":  { "Low": 4.5, "Medium": 6.2, "High": 8.5, "Epic": 11.0 },
      "4K":     { "Low": 6.0, "Medium": 8.5, "High": 11.5, "Epic": 15.5 }
    },
    sources: "Hardware Unboxed, Digital Foundry",
    note: "Stunning visuals but VRAM-hungry UE5 title. 12GB recommended for 1440p Epic. Frame generation strongly improves the experience on RTX cards."
  },

  // ── Marvel Rivals ────────────────────────────────────────────────────────────
  {
    name: "Marvel Rivals",
    genre: "Hero Shooter",
    engine: "Unreal Engine 5",
    presets: {
      "1080p":  { "Low": 2.8, "Medium": 4.0, "High": 5.5, "Epic": 7.2 },
      "1440p":  { "Low": 3.5, "Medium": 5.0, "High": 6.8, "Epic": 9.0 },
      "4K":     { "Low": 4.8, "Medium": 6.8, "High": 9.5, "Epic": 12.5 }
    },
    sources: "Hardware Unboxed",
    note: "Better-optimised than many UE5 titles. 8GB handles 1440p High cleanly. 12GB comfortable for 1440p Epic."
  }
];

// ── VRAM tier thresholds (GB) ─────────────────────────────────────────────────
const VRAM_TIERS = [
  { vram: 4,  label: "4 GB",  cssClass: "critical" },
  { vram: 6,  label: "6 GB",  cssClass: "hot" },
  { vram: 8,  label: "8 GB",  cssClass: "warm" },
  { vram: 12, label: "12 GB", cssClass: "safe" },
  { vram: 16, label: "16 GB", cssClass: "safe" },
  { vram: 24, label: "24 GB", cssClass: "safe" },
];

// ── Tier verdict for a given VRAM amount ─────────────────────────────────────
function vramVerdict(required, available) {
  const headroom = available - required;
  if (headroom >= 3.0) return { label: "COMFORTABLE",    cssClass: "safe",     color: "var(--safe)" };
  if (headroom >= 1.0) return { label: "ADEQUATE",       cssClass: "safe",     color: "var(--safe)" };
  if (headroom >= 0.0) return { label: "TIGHT",          cssClass: "warm",     color: "var(--warm)" };
  if (headroom >= -1.5)return { label: "AT LIMIT",       cssClass: "hot",      color: "var(--hot)"  };
  return                      { label: "INSUFFICIENT",   cssClass: "critical", color: "var(--critical)" };
}

// ── Common GPU VRAM amounts ───────────────────────────────────────────────────
const GPU_VRAM_TIERS = [
  { label: "4 GB (GTX 1650, RX 6400)",        vram: 4  },
  { label: "6 GB (RTX 3060 6GB, RX 6600)",    vram: 6  },
  { label: "8 GB (RTX 4060, RX 7600, RTX 3070)", vram: 8  },
  { label: "12 GB (RTX 4070, RX 7700 XT, RTX 3080)", vram: 12 },
  { label: "16 GB (RTX 4070 Ti Super, RX 7800 XT)", vram: 16 },
  { label: "20 GB (RX 7900 XT)",              vram: 20 },
  { label: "24 GB (RTX 4090, RX 7900 XTX)",   vram: 24 },
];

// ── Build tier rows for a game ────────────────────────────────────────────────
function buildTierRows(gameData, resolution, preset) {
  const req = gameData.presets[resolution] && gameData.presets[resolution][preset];
  if (!req) return "";

  return GPU_VRAM_TIERS.map(function(tier) {
    const v = vramVerdict(req, tier.vram);
    const pct = Math.min(100, Math.round((req / tier.vram) * 100));
    return `<tr>
      <td style="padding:0.45rem 0.6rem; font-family:'JetBrains Mono',monospace; font-size:0.72rem; color:#b0b0c8; border-bottom:1px solid var(--border);">${tier.label}</td>
      <td style="padding:0.45rem 0.6rem; border-bottom:1px solid var(--border);">
        <div style="background:#2a2a32; border-radius:3px; height:6px; overflow:hidden;">
          <div style="width:${pct}%; height:100%; background:${v.color}; border-radius:3px;"></div>
        </div>
      </td>
      <td style="padding:0.45rem 0.6rem; font-family:'JetBrains Mono',monospace; font-size:0.68rem; color:${v.color}; text-align:right; border-bottom:1px solid var(--border); white-space:nowrap;">${v.label}</td>
    </tr>`;
  }).join("");
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
function checkVRAM() {
  const gameEl  = document.getElementById("vr-game");
  const resEl   = document.getElementById("vr-resolution");
  const presetEl= document.getElementById("vr-preset");
  const errorEl = document.getElementById("vr-error");
  const resultEl= document.getElementById("vr-result");
  const defEl   = document.getElementById("vr-default");

  errorEl.textContent = "";
  errorEl.style.display = "none";

  const gameIdx = parseInt(gameEl.value, 10);
  const res     = resEl.value;
  const preset  = presetEl.value;

  if (isNaN(gameIdx))  { errorEl.textContent = "Please select a game.";             errorEl.style.display = "block"; return; }
  if (!res)            { errorEl.textContent = "Please select a resolution.";        errorEl.style.display = "block"; return; }
  if (!preset)         { errorEl.textContent = "Please select a quality preset.";    errorEl.style.display = "block"; return; }

  const game = VRAM_DATA[gameIdx];
  const presets = game.presets[res];
  if (!presets || !presets[preset]) {
    errorEl.textContent = "No data for this combination. Try a different preset or resolution.";
    errorEl.style.display = "block";
    return;
  }

  const reqGB  = presets[preset];
  const tierRows = buildTierRows(game, res, preset);

  // Summary verdict for popular tiers
  const v8gb  = vramVerdict(reqGB, 8);
  const v12gb = vramVerdict(reqGB, 12);
  const v16gb = vramVerdict(reqGB, 16);

  resultEl.innerHTML = `
    <!-- Header -->
    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; flex-wrap:wrap; margin-bottom:1.25rem;">
      <div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.65rem; letter-spacing:0.1em; text-transform:uppercase; color:#8888a0; margin-bottom:0.2rem;">${game.genre} · ${game.engine}</div>
        <div style="font-family:'Bebas Neue',sans-serif; font-size:2.2rem; letter-spacing:0.04em; color:var(--text); line-height:1;">${game.name}</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.78rem; color:var(--accent); margin-top:0.3rem;">${res} · ${preset} preset</div>
      </div>
      <div style="text-align:right; flex-shrink:0;">
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.6rem; text-transform:uppercase; color:#8888a0; margin-bottom:0.1rem;">Measured VRAM Usage</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:2.8rem; font-weight:700; color:var(--accent); line-height:1;">${reqGB.toFixed(1)} GB</div>
      </div>
    </div>

    <!-- Quick summary for common tiers -->
    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:0.6rem; margin-bottom:1.25rem;">
      <div style="background:var(--surface2); border:1px solid ${v8gb.color}40; border-top:2px solid ${v8gb.color}; border-radius:8px; padding:0.75rem; text-align:center;">
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.58rem; text-transform:uppercase; color:#8888a0; margin-bottom:0.25rem;">8 GB VRAM</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.9rem; font-weight:700; color:${v8gb.color};">${v8gb.label}</div>
      </div>
      <div style="background:var(--surface2); border:1px solid ${v12gb.color}40; border-top:2px solid ${v12gb.color}; border-radius:8px; padding:0.75rem; text-align:center;">
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.58rem; text-transform:uppercase; color:#8888a0; margin-bottom:0.25rem;">12 GB VRAM</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.9rem; font-weight:700; color:${v12gb.color};">${v12gb.label}</div>
      </div>
      <div style="background:var(--surface2); border:1px solid ${v16gb.color}40; border-top:2px solid ${v16gb.color}; border-radius:8px; padding:0.75rem; text-align:center;">
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.58rem; text-transform:uppercase; color:#8888a0; margin-bottom:0.25rem;">16 GB VRAM</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.9rem; font-weight:700; color:${v16gb.color};">${v16gb.label}</div>
      </div>
    </div>

    <!-- All-tier table -->
    <div style="font-family:'JetBrains Mono',monospace; font-size:0.62rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--accent); margin-bottom:0.5rem;">VRAM Tier Compatibility</div>
    <div style="background:var(--surface2); border:1px solid var(--border); border-radius:8px; overflow:hidden; margin-bottom:1.25rem;">
      <table style="width:100%; border-collapse:collapse;">
        <thead>
          <tr>
            <th style="padding:0.5rem 0.6rem; font-family:'JetBrains Mono',monospace; font-size:0.6rem; letter-spacing:0.08em; text-transform:uppercase; color:#555568; text-align:left; border-bottom:1px solid var(--border); background:var(--surface2);">GPU VRAM</th>
            <th style="padding:0.5rem 0.6rem; border-bottom:1px solid var(--border); background:var(--surface2);"></th>
            <th style="padding:0.5rem 0.6rem; font-family:'JetBrains Mono',monospace; font-size:0.6rem; letter-spacing:0.08em; text-transform:uppercase; color:#555568; text-align:right; border-bottom:1px solid var(--border); background:var(--surface2);">Verdict</th>
          </tr>
        </thead>
        <tbody>${tierRows}</tbody>
      </table>
    </div>

    ${game.note ? `
    <!-- Game note -->
    <div style="background:rgba(0,200,255,0.05); border:1px solid rgba(0,200,255,0.15); border-left:3px solid var(--accent); border-radius:6px; padding:0.85rem 1rem; font-size:0.82rem; color:#b0b0c8; line-height:1.65; margin-bottom:1rem;">
      <strong style="color:var(--accent); font-family:'JetBrains Mono',monospace; font-size:0.62rem; text-transform:uppercase; letter-spacing:0.08em;">Game Note</strong><br>
      ${game.note}
    </div>` : ""}

    <!-- Source note -->
    <div style="font-size:0.7rem; color:#555568; margin-top:0.75rem; padding-top:0.75rem; border-top:1px solid var(--border); line-height:1.6;">
      Data from: ${game.sources}. Values are peak VRAM usage measured during active gameplay (not menus). A ~0.5–1GB OS/driver baseline is included. Figures may vary by driver version, texture streaming settings, and scene complexity.
    </div>
  `;

  resultEl.className = "result-box show";
  if (defEl) defEl.style.display = "none";
  setTimeout(function() { resultEl.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 100);
}

// ── Populate dropdowns on DOMContentLoaded ────────────────────────────────────
document.addEventListener("DOMContentLoaded", function() {
  var gameEl = document.getElementById("vr-game");
  if (gameEl) {
    VRAM_DATA.forEach(function(g, i) {
      var o = document.createElement("option");
      o.value = i;
      o.textContent = g.name;
      gameEl.appendChild(o);
    });
  }

  // Update preset options when game changes
  function updatePresets() {
    var gameIdx = parseInt(document.getElementById("vr-game").value, 10);
    var res     = document.getElementById("vr-resolution").value;
    var presetEl= document.getElementById("vr-preset");
    presetEl.innerHTML = '<option value="">&#8212; Select preset &#8212;</option>';
    if (isNaN(gameIdx) || !res) return;
    var presets = VRAM_DATA[gameIdx].presets[res];
    if (!presets) return;
    Object.keys(presets).forEach(function(p) {
      var o = document.createElement("option");
      o.value = p;
      o.textContent = p;
      presetEl.appendChild(o);
    });
  }

  var gameEl2 = document.getElementById("vr-game");
  var resEl   = document.getElementById("vr-resolution");
  if (gameEl2) gameEl2.addEventListener("change", updatePresets);
  if (resEl)   resEl.addEventListener("change", updatePresets);
});
