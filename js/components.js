/* ==========================================================================
   TempCore - PC Builder Component Database
   --------------------------------------------------------------------------
   This file contains all component data (prices, specs, affiliate links).
   It is intentionally separated from the recommendation engine so prices
   can be updated without touching engine code.

   PRICING NOTES
   --------------------------------------------------------------------------
   Prices are USD street prices observed on Amazon / Newegg / Micro Center.
   May 2026 prices reflect the ongoing AI-driven DRAM and NAND shortage:
     - DDR5 memory roughly 2x mid-2024 pricing
     - NVMe SSDs roughly 2-3x mid-2024 pricing
     - GPUs inflated 15-50% above MSRP for cards with 12GB+ VRAM
     - CPUs and PSUs relatively stable
   Expect ±20% volatility week-to-week. Always verify on Amazon at checkout.

   UPDATING
   --------------------------------------------------------------------------
   When refreshing prices: update the `lastUpdated` date below, then update
   the `price` field on each component. The `confidence` field flags how
   recently each entry was directly verified.

   Confidence levels:
     - high: directly verified in current update cycle
     - medium: extrapolated from same-family pricing
     - low: needs verification next cycle
   ========================================================================== */

window.COMPONENTS_DATA = {

  lastUpdated: "2026-05-31",
  priceNote: "Prices reflect May 2026 market. The ongoing DRAM/NAND shortage means RAM, SSD, and GPU prices are 2-3x mid-2024 levels and can move ±20% week-to-week. Always verify the live price on Amazon before purchasing.",

  /* ---------- CPU DATABASE ---------- */
  CPUS: [
    // Entry - AM4
    { name: "AMD Ryzen 5 5500",          brand: "amd",   socket: "AM4",     price: 100, perf: 55,  tdp: 65,  igpu: false, confidence: "high",   aff: "https://www.amazon.com/s?k=AMD+Ryzen+5+5500&tag=tempcore-20" },
    { name: "AMD Ryzen 5 5600",          brand: "amd",   socket: "AM4",     price: 130, perf: 62,  tdp: 65,  igpu: false, confidence: "high",   aff: "https://www.amazon.com/s?k=AMD+Ryzen+5+5600&tag=tempcore-20" },
    { name: "Intel Core i3-13100F",      brand: "intel", socket: "LGA1700", price: 110, perf: 56,  tdp: 60,  igpu: false, confidence: "medium", aff: "https://www.amazon.com/s?k=Intel+Core+i3-13100F&tag=tempcore-20" },
    { name: "Intel Core i5-12400F",      brand: "intel", socket: "LGA1700", price: 140, perf: 64,  tdp: 65,  igpu: false, confidence: "high",   aff: "https://www.amazon.com/s?k=Intel+Core+i5-12400F&tag=tempcore-20" },

    // Mid - AM5 / LGA1700
    { name: "AMD Ryzen 5 7600",          brand: "amd",   socket: "AM5",     price: 185, perf: 75,  tdp: 65,  igpu: true,  confidence: "high",   aff: "https://amzn.to/4u9w4CC" },
    { name: "AMD Ryzen 5 7600X",         brand: "amd",   socket: "AM5",     price: 210, perf: 78,  tdp: 105, igpu: true,  confidence: "high",   aff: "https://www.amazon.com/s?k=AMD+Ryzen+5+7600X&tag=tempcore-20" },
    { name: "Intel Core i5-13400F",      brand: "intel", socket: "LGA1700", price: 175, perf: 72,  tdp: 65,  igpu: false, confidence: "medium", aff: "https://www.amazon.com/s?k=Intel+Core+i5-13400F&tag=tempcore-20" },
    { name: "AMD Ryzen 5 9600X",         brand: "amd",   socket: "AM5",     price: 230, perf: 82,  tdp: 65,  igpu: true,  confidence: "high",   aff: "https://www.amazon.com/s?k=AMD+Ryzen+5+9600X&tag=tempcore-20" },
    { name: "Intel Core i5-13600K",      brand: "intel", socket: "LGA1700", price: 260, perf: 84,  tdp: 125, igpu: true,  confidence: "high",   aff: "https://amzn.to/4o8f8Lp" },
    { name: "Intel Core i5-14600KF",     brand: "intel", socket: "LGA1700", price: 275, perf: 86,  tdp: 125, igpu: false, confidence: "high",   aff: "https://www.amazon.com/s?k=Intel+Core+i5-14600KF&tag=tempcore-20" },
    { name: "Intel Core Ultra 5 245K",   brand: "intel", socket: "LGA1851", price: 290, perf: 88,  tdp: 125, igpu: true,  confidence: "medium", aff: "https://www.amazon.com/s?k=Intel+Core+Ultra+5+245K&tag=tempcore-20" },

    // Upper Mid
    { name: "AMD Ryzen 7 5800X3D",       brand: "amd",   socket: "AM4",     price: 290, perf: 82,  tdp: 105, igpu: false, confidence: "medium", aff: "https://www.amazon.com/s?k=AMD+Ryzen+7+5800X3D&tag=tempcore-20" },
    { name: "AMD Ryzen 7 7700",          brand: "amd",   socket: "AM5",     price: 280, perf: 86,  tdp: 65,  igpu: true,  confidence: "high",   aff: "https://www.amazon.com/s?k=AMD+Ryzen+7+7700&tag=tempcore-20" },
    { name: "AMD Ryzen 7 7700X",         brand: "amd",   socket: "AM5",     price: 305, perf: 88,  tdp: 105, igpu: true,  confidence: "high",   aff: "https://amzn.to/4nVbV1w" },
    { name: "AMD Ryzen 7 9700X",         brand: "amd",   socket: "AM5",     price: 330, perf: 92,  tdp: 65,  igpu: true,  confidence: "high",   aff: "https://www.amazon.com/s?k=AMD+Ryzen+7+9700X&tag=tempcore-20" },
    { name: "Intel Core i7-13700K",      brand: "intel", socket: "LGA1700", price: 360, perf: 92,  tdp: 125, igpu: true,  confidence: "medium", aff: "https://www.amazon.com/s?k=Intel+Core+i7-13700K&tag=tempcore-20" },
    { name: "Intel Core i7-14700K",      brand: "intel", socket: "LGA1700", price: 385, perf: 95,  tdp: 125, igpu: true,  confidence: "high",   aff: "https://www.amazon.com/s?k=Intel+Core+i7-14700K&tag=tempcore-20" },
    { name: "Intel Core Ultra 7 265K",   brand: "intel", socket: "LGA1851", price: 395, perf: 97,  tdp: 125, igpu: true,  confidence: "high",   aff: "https://www.amazon.com/s?k=Intel+Core+Ultra+7+265K&tag=tempcore-20" },

    // High - gaming-focused X3D
    { name: "AMD Ryzen 7 7800X3D",       brand: "amd",   socket: "AM5",     price: 360, perf: 96,  tdp: 120, igpu: true,  confidence: "high",   aff: "https://www.amazon.com/s?k=AMD+Ryzen+7+7800X3D&tag=tempcore-20" },
    { name: "AMD Ryzen 7 9800X3D",       brand: "amd",   socket: "AM5",     price: 440, perf: 105, tdp: 120, igpu: true,  confidence: "high",   aff: "https://www.amazon.com/s?k=AMD+Ryzen+7+9800X3D&tag=tempcore-20" },
    { name: "AMD Ryzen 9 7900X",         brand: "amd",   socket: "AM5",     price: 400, perf: 94,  tdp: 170, igpu: true,  confidence: "medium", aff: "https://www.amazon.com/s?k=AMD+Ryzen+9+7900X&tag=tempcore-20" },
    { name: "AMD Ryzen 9 9900X",         brand: "amd",   socket: "AM5",     price: 430, perf: 99,  tdp: 120, igpu: true,  confidence: "high",   aff: "https://www.amazon.com/s?k=AMD+Ryzen+9+9900X&tag=tempcore-20" },

    // Enthusiast
    { name: "Intel Core i9-14900K",      brand: "intel", socket: "LGA1700", price: 540, perf: 100, tdp: 125, igpu: true,  confidence: "medium", aff: "https://www.amazon.com/s?k=Intel+Core+i9-14900K&tag=tempcore-20" },
    { name: "Intel Core Ultra 9 285K",   brand: "intel", socket: "LGA1851", price: 560, perf: 103, tdp: 125, igpu: true,  confidence: "medium", aff: "https://www.amazon.com/s?k=Intel+Core+Ultra+9+285K&tag=tempcore-20" },
    { name: "AMD Ryzen 9 7950X3D",       brand: "amd",   socket: "AM5",     price: 580, perf: 104, tdp: 120, igpu: true,  confidence: "medium", aff: "https://www.amazon.com/s?k=AMD+Ryzen+9+7950X3D&tag=tempcore-20" },
    { name: "AMD Ryzen 9 9950X3D",       brand: "amd",   socket: "AM5",     price: 700, perf: 112, tdp: 170, igpu: true,  confidence: "high",   aff: "https://www.amazon.com/s?k=AMD+Ryzen+9+9950X3D&tag=tempcore-20" }
  ],

  /* ---------- GPU DATABASE ----------
     perf is a relative gaming score where RTX 4060 ≈ 50. vram in GB.
     Prices include the May 2026 inflation from the AI-driven memory crisis. */
  GPUS: [
    // Entry
    { name: "AMD Radeon RX 6600",        price: 210,  perf: 42,  vram: 8,  tdp: 132, confidence: "medium", aff: "https://www.amazon.com/s?k=AMD+Radeon+RX+6600&tag=tempcore-20" },
    { name: "Intel Arc B580",            price: 290,  perf: 52,  vram: 12, tdp: 190, confidence: "high",   aff: "https://www.amazon.com/s?k=Intel+Arc+B580&tag=tempcore-20" },
    { name: "AMD Radeon RX 7600",        price: 290,  perf: 47,  vram: 8,  tdp: 165, confidence: "high",   aff: "https://www.amazon.com/s?k=AMD+Radeon+RX+7600&tag=tempcore-20" },
    { name: "NVIDIA RTX 4060",           price: 320,  perf: 50,  vram: 8,  tdp: 115, confidence: "high",   aff: "https://amzn.to/4dUBxHy" },
    { name: "AMD Radeon RX 7600 XT",     price: 340,  perf: 53,  vram: 16, tdp: 190, confidence: "high",   aff: "https://amzn.to/43J9Axn" },
    { name: "NVIDIA RTX 5060",           price: 360,  perf: 60,  vram: 8,  tdp: 150, confidence: "high",   aff: "https://www.amazon.com/s?k=NVIDIA+RTX+5060&tag=tempcore-20" },

    // Lower Mid
    { name: "NVIDIA RTX 4060 Ti",        price: 420,  perf: 62,  vram: 8,  tdp: 160, confidence: "high",   aff: "https://amzn.to/3PxJGtn" },
    { name: "NVIDIA RTX 5060 Ti 16GB",   price: 430,  perf: 72,  vram: 16, tdp: 180, confidence: "high",   aff: "https://www.amazon.com/s?k=NVIDIA+RTX+5060+Ti+16GB&tag=tempcore-20" },
    { name: "AMD Radeon RX 7700 XT",     price: 460,  perf: 70,  vram: 12, tdp: 245, confidence: "high",   aff: "https://amzn.to/4fQwxpG" },
    { name: "AMD Radeon RX 7800 XT",     price: 480,  perf: 80,  vram: 16, tdp: 263, confidence: "high",   aff: "https://www.amazon.com/s?k=AMD+Radeon+RX+7800+XT&tag=tempcore-20" },

    // Upper Mid - sweet spot
    { name: "AMD Radeon RX 9070",        price: 580,  perf: 92,  vram: 16, tdp: 220, confidence: "high",   aff: "https://www.amazon.com/s?k=AMD+Radeon+RX+9070&tag=tempcore-20" },
    { name: "NVIDIA RTX 5070",           price: 640,  perf: 88,  vram: 12, tdp: 250, confidence: "high",   aff: "https://www.amazon.com/s?k=NVIDIA+RTX+5070&tag=tempcore-20" },
    { name: "AMD Radeon RX 9070 XT",     price: 660,  perf: 100, vram: 16, tdp: 304, confidence: "high",   aff: "https://www.amazon.com/s?k=AMD+Radeon+RX+9070+XT&tag=tempcore-20" },
    { name: "NVIDIA RTX 4070",           price: 700,  perf: 78,  vram: 12, tdp: 200, confidence: "high",   aff: "https://amzn.to/4x0ekMw" },
    { name: "NVIDIA RTX 4070 Super",     price: 720,  perf: 86,  vram: 12, tdp: 220, confidence: "high",   aff: "https://www.amazon.com/s?k=NVIDIA+RTX+4070+Super&tag=tempcore-20" },
    { name: "AMD Radeon RX 7900 XT",     price: 740,  perf: 95,  vram: 20, tdp: 315, confidence: "medium", aff: "https://www.amazon.com/s?k=AMD+Radeon+RX+7900+XT&tag=tempcore-20" },

    // High
    { name: "NVIDIA RTX 5070 Ti",        price: 850,  perf: 102, vram: 16, tdp: 300, confidence: "high",   aff: "https://www.amazon.com/s?k=NVIDIA+RTX+5070+Ti&tag=tempcore-20" },
    { name: "NVIDIA RTX 4070 Ti Super",  price: 1180, perf: 100, vram: 16, tdp: 285, confidence: "high",   aff: "https://www.amazon.com/s?k=NVIDIA+RTX+4070+Ti+Super&tag=tempcore-20" },
    { name: "AMD Radeon RX 7900 XTX",    price: 1150, perf: 110, vram: 24, tdp: 355, confidence: "high",   aff: "https://www.amazon.com/s?k=AMD+Radeon+RX+7900+XTX&tag=tempcore-20" },

    // Enthusiast / Flagship
    { name: "NVIDIA RTX 5080",           price: 1300, perf: 130, vram: 16, tdp: 360, confidence: "high",   aff: "https://www.amazon.com/s?k=NVIDIA+RTX+5080&tag=tempcore-20" },
    { name: "NVIDIA RTX 4080 Super",     price: 1400, perf: 115, vram: 16, tdp: 320, confidence: "medium", aff: "https://www.amazon.com/s?k=NVIDIA+RTX+4080+Super&tag=tempcore-20" },
    { name: "NVIDIA RTX 4090",           price: 2500, perf: 150, vram: 24, tdp: 450, confidence: "high",   aff: "https://www.amazon.com/s?k=NVIDIA+RTX+4090&tag=tempcore-20" },
    { name: "NVIDIA RTX 5090",           price: 3200, perf: 180, vram: 32, tdp: 575, confidence: "high",   aff: "https://www.amazon.com/s?k=NVIDIA+RTX+5090&tag=tempcore-20" }
  ],

  /* ---------- MOTHERBOARD DATABASE ---------- */
  MOBOS: [
    // AM4 - entry/legacy
    { name: "MSI A520M-A PRO",              price: 75,  socket: "AM4",     formFactor: "mATX", wifi: false, tier: 1, confidence: "medium", aff: "https://www.amazon.com/s?k=MSI+A520M-A+PRO&tag=tempcore-20" },
    { name: "ASUS PRIME B450M-A II",        price: 85,  socket: "AM4",     formFactor: "mATX", wifi: false, tier: 1, confidence: "medium", aff: "https://www.amazon.com/s?k=ASUS+PRIME+B450M-A+II&tag=tempcore-20" },
    { name: "MSI B550M PRO-VDH WiFi",       price: 120, socket: "AM4",     formFactor: "mATX", wifi: true,  tier: 2, confidence: "medium", aff: "https://www.amazon.com/s?k=MSI+B550M+PRO-VDH+WiFi&tag=tempcore-20" },
    { name: "ASRock B550 Phantom Gaming 4", price: 115, socket: "AM4",     formFactor: "ATX",  wifi: false, tier: 2, confidence: "medium", aff: "https://www.amazon.com/s?k=ASRock+B550+Phantom+Gaming+4&tag=tempcore-20" },

    // LGA1700 - mid
    { name: "MSI PRO B760M-A WiFi DDR4",    price: 140, socket: "LGA1700", formFactor: "mATX", wifi: true,  tier: 2, confidence: "medium", aff: "https://www.amazon.com/s?k=MSI+PRO+B760M-A+WiFi+DDR4&tag=tempcore-20" },
    { name: "MSI MAG B760 TOMAHAWK WiFi",   price: 200, socket: "LGA1700", formFactor: "ATX",  wifi: true,  tier: 3, confidence: "medium", aff: "https://www.amazon.com/s?k=MSI+MAG+B760+TOMAHAWK+WiFi&tag=tempcore-20" },
    { name: "ASUS ROG STRIX Z790-A WiFi",   price: 380, socket: "LGA1700", formFactor: "ATX",  wifi: true,  tier: 4, confidence: "medium", aff: "https://www.amazon.com/s?k=ASUS+ROG+STRIX+Z790-A+WiFi&tag=tempcore-20" },

    // LGA1851 - current Intel
    { name: "MSI PRO B860-A WiFi",          price: 220, socket: "LGA1851", formFactor: "ATX",  wifi: true,  tier: 3, confidence: "medium", aff: "https://www.amazon.com/s?k=MSI+PRO+B860-A+WiFi&tag=tempcore-20" },
    { name: "ASUS ROG STRIX Z890-A WiFi",   price: 420, socket: "LGA1851", formFactor: "ATX",  wifi: true,  tier: 4, confidence: "medium", aff: "https://www.amazon.com/s?k=ASUS+ROG+STRIX+Z890-A+WiFi&tag=tempcore-20" },

    // AM5 - current AMD
    { name: "MSI PRO B650M-A WiFi",         price: 165, socket: "AM5",     formFactor: "mATX", wifi: true,  tier: 2, confidence: "medium", aff: "https://www.amazon.com/s?k=MSI+PRO+B650M-A+WiFi&tag=tempcore-20" },
    { name: "ASRock B650M Pro RS",          price: 145, socket: "AM5",     formFactor: "mATX", wifi: false, tier: 2, confidence: "medium", aff: "https://www.amazon.com/s?k=ASRock+B650M+Pro+RS&tag=tempcore-20" },
    { name: "MSI MAG B650 TOMAHAWK WiFi",   price: 230, socket: "AM5",     formFactor: "ATX",  wifi: true,  tier: 3, confidence: "medium", aff: "https://www.amazon.com/s?k=MSI+MAG+B650+TOMAHAWK+WiFi&tag=tempcore-20" },
    { name: "Gigabyte B850 AORUS ELITE",    price: 260, socket: "AM5",     formFactor: "ATX",  wifi: true,  tier: 3, confidence: "high",   aff: "https://www.amazon.com/s?k=Gigabyte+B850+AORUS+ELITE&tag=tempcore-20" },
    { name: "ASUS ROG STRIX B650E-F WiFi",  price: 290, socket: "AM5",     formFactor: "ATX",  wifi: true,  tier: 3, confidence: "medium", aff: "https://www.amazon.com/s?k=ASUS+ROG+STRIX+B650E-F+WiFi&tag=tempcore-20" },
    { name: "ASUS ROG STRIX X670E-E WiFi",  price: 420, socket: "AM5",     formFactor: "ATX",  wifi: true,  tier: 4, confidence: "medium", aff: "https://www.amazon.com/s?k=ASUS+ROG+STRIX+X670E-E+WiFi&tag=tempcore-20" }
  ],

  /* ---------- RAM DATABASE ----------
     2026 DRAM crisis: DDR5 prices ~2x mid-2024 levels. Update frequently. */
  RAMS: [
    { name: "Corsair Vengeance LPX 16GB DDR4-3200 (2x8GB)",   price: 65,  size: 16, type: "DDR4", confidence: "medium", aff: "https://amzn.to/4vmVEVW" },
    { name: "G.Skill Ripjaws V 16GB DDR4-3600 (2x8GB)",       price: 70,  size: 16, type: "DDR4", confidence: "medium", aff: "https://www.amazon.com/s?k=G.Skill+Ripjaws+V+16GB+DDR4-3600&tag=tempcore-20" },
    { name: "Corsair Vengeance 32GB DDR4-3600 (2x16GB)",      price: 110, size: 32, type: "DDR4", confidence: "medium", aff: "https://www.amazon.com/s?k=Corsair+Vengeance+32GB+DDR4-3600&tag=tempcore-20" },
    { name: "G.Skill Ripjaws V 32GB DDR4-3600 (2x16GB)",      price: 115, size: 32, type: "DDR4", confidence: "medium", aff: "https://www.amazon.com/s?k=G.Skill+Ripjaws+V+32GB+DDR4-3600&tag=tempcore-20" },
    { name: "G.Skill Flare X5 16GB DDR5-5600 (2x8GB)",        price: 95,  size: 16, type: "DDR5", confidence: "medium", aff: "https://www.amazon.com/s?k=G.Skill+Flare+X5+16GB+DDR5-5600&tag=tempcore-20" },
    { name: "Corsair Vengeance 32GB DDR5-6000 (2x16GB)",      price: 195, size: 32, type: "DDR5", confidence: "high",   aff: "https://amzn.to/4uIgTl3" },
    { name: "G.Skill Trident Z5 32GB DDR5-6000 CL30 (2x16GB)",price: 220, size: 32, type: "DDR5", confidence: "high",   aff: "https://amzn.to/4u9PlEb" },
    { name: "Corsair Vengeance 64GB DDR5-6000 (2x32GB)",      price: 420, size: 64, type: "DDR5", confidence: "high",   aff: "https://www.amazon.com/s?k=Corsair+Vengeance+64GB+DDR5-6000&tag=tempcore-20" },
    { name: "G.Skill Trident Z5 64GB DDR5-6400 (2x32GB)",     price: 490, size: 64, type: "DDR5", confidence: "high",   aff: "https://www.amazon.com/s?k=G.Skill+Trident+Z5+64GB+DDR5-6400&tag=tempcore-20" }
  ],

  /* ---------- STORAGE DATABASE ----------
     2026 NAND crisis: NVMe SSDs ~2-3x mid-2024 levels.
     Crucial brand wound down consumer market in Feb 2026 - listings remain
     in channel stock but priced higher than equivalent Samsung/WD. */
  SSDS: [
    { name: "WD Blue SN570 500GB NVMe",         price: 75,  size: 500,  type: "NVMe",  tier: 1, confidence: "medium", aff: "https://www.amazon.com/s?k=WD+Blue+SN570+500GB+NVMe&tag=tempcore-20" },
    { name: "Samsung 870 EVO 1TB SATA",         price: 110, size: 1000, type: "SATA",  tier: 1, confidence: "high",   aff: "https://amzn.to/49xtOOd" },
    { name: "WD Blue SN570 1TB NVMe",           price: 120, size: 1000, type: "NVMe",  tier: 2, confidence: "high",   aff: "https://amzn.to/43J9fe5" },
    { name: "Kingston NV3 1TB NVMe Gen4",       price: 125, size: 1000, type: "NVMe",  tier: 2, confidence: "medium", aff: "https://www.amazon.com/s?k=Kingston+NV3+1TB+NVMe&tag=tempcore-20" },
    { name: "WD Black SN770 1TB NVMe Gen4",     price: 165, size: 1000, type: "NVMe",  tier: 2, confidence: "medium", aff: "https://www.amazon.com/s?k=WD+Black+SN770+1TB&tag=tempcore-20" },
    { name: "Samsung 990 Pro 1TB NVMe Gen4",    price: 200, size: 1000, type: "NVMe",  tier: 3, confidence: "high",   aff: "https://amzn.to/4xej7KG" },
    { name: "WD Black SN850X 1TB NVMe Gen4",    price: 210, size: 1000, type: "NVMe",  tier: 3, confidence: "high",   aff: "https://www.amazon.com/s?k=WD+Black+SN850X+1TB&tag=tempcore-20" },
    { name: "Kingston NV3 2TB NVMe Gen4",       price: 240, size: 2000, type: "NVMe",  tier: 2, confidence: "medium", aff: "https://www.amazon.com/s?k=Kingston+NV3+2TB+NVMe&tag=tempcore-20" },
    { name: "WD Black SN7100 2TB NVMe Gen4",    price: 355, size: 2000, type: "NVMe",  tier: 2, confidence: "high",   aff: "https://www.amazon.com/s?k=WD+Black+SN7100+2TB&tag=tempcore-20" },
    { name: "Samsung 990 Pro 2TB NVMe Gen4",    price: 400, size: 2000, type: "NVMe",  tier: 3, confidence: "high",   aff: "https://www.amazon.com/s?k=Samsung+990+Pro+2TB&tag=tempcore-20" },
    { name: "WD Black SN850X 2TB NVMe Gen4",    price: 470, size: 2000, type: "NVMe",  tier: 3, confidence: "high",   aff: "https://www.amazon.com/s?k=WD+Black+SN850X+2TB&tag=tempcore-20" }
  ],

  /* ---------- CASE DATABASE ----------
     Cases largely unaffected by component shortages. ±5-10% from 2024. */
  CASES: [
    { name: "Cooler Master MasterBox Q300L",     price: 55,  rgb: false, glass: false, tier: 1, confidence: "medium", aff: "https://www.amazon.com/s?k=Cooler+Master+MasterBox+Q300L&tag=tempcore-20" },
    { name: "Montech AIR 100 ARGB",              price: 70,  rgb: true,  glass: true,  tier: 2, confidence: "medium", aff: "https://www.amazon.com/s?k=Montech+AIR+100+ARGB&tag=tempcore-20" },
    { name: "NZXT H510 Flow",                    price: 85,  rgb: false, glass: true,  tier: 2, confidence: "medium", aff: "https://www.amazon.com/s?k=NZXT+H510+Flow&tag=tempcore-20" },
    { name: "Phanteks Eclipse G360A",            price: 95,  rgb: true,  glass: true,  tier: 2, confidence: "medium", aff: "https://www.amazon.com/s?k=Phanteks+Eclipse+G360A&tag=tempcore-20" },
    { name: "Lian Li Lancool 216",               price: 115, rgb: true,  glass: true,  tier: 3, confidence: "medium", aff: "https://www.amazon.com/s?k=Lian+Li+Lancool+216&tag=tempcore-20" },
    { name: "Fractal Design North",              price: 150, rgb: false, glass: true,  tier: 3, confidence: "medium", aff: "https://www.amazon.com/s?k=Fractal+Design+North&tag=tempcore-20" },
    { name: "Lian Li O11 Dynamic EVO",           price: 180, rgb: false, glass: true,  tier: 4, confidence: "medium", aff: "https://www.amazon.com/s?k=Lian+Li+O11+Dynamic+EVO&tag=tempcore-20" },
    { name: "Hyte Y60",                          price: 210, rgb: false, glass: true,  tier: 4, confidence: "medium", aff: "https://www.amazon.com/s?k=Hyte+Y60&tag=tempcore-20" }
  ],

  /* ---------- CPU COOLER DATABASE ----------
     Coolers largely unaffected by component shortages. */
  COOLERS: [
    { name: "Stock cooler (included)",                  price: 0,   maxTdp: 95,  type: "air", confidence: "high",   aff: null },
    { name: "ID-COOLING SE-224-XT Black",               price: 35,  maxTdp: 180, type: "air", confidence: "medium", aff: "https://www.amazon.com/s?k=ID-COOLING+SE-224-XT&tag=tempcore-20" },
    { name: "Thermalright Peerless Assassin 120 SE",    price: 45,  maxTdp: 245, type: "air", confidence: "high",   aff: "https://amzn.to/3RDUuqr" },
    { name: "be quiet! Pure Rock 2 Black",              price: 55,  maxTdp: 150, type: "air", confidence: "medium", aff: "https://www.amazon.com/s?k=be+quiet+Pure+Rock+2+Black&tag=tempcore-20" },
    { name: "Noctua NH-U12A",                           price: 115, maxTdp: 230, type: "air", confidence: "medium", aff: "https://www.amazon.com/s?k=Noctua+NH-U12A&tag=tempcore-20" },
    { name: "Arctic Liquid Freezer III 240",            price: 100, maxTdp: 280, type: "aio", confidence: "high",   aff: "https://www.amazon.com/s?k=Arctic+Liquid+Freezer+III+240&tag=tempcore-20" },
    { name: "Arctic Liquid Freezer III 360",            price: 140, maxTdp: 350, type: "aio", confidence: "high",   aff: "https://www.amazon.com/s?k=Arctic+Liquid+Freezer+III+360&tag=tempcore-20" },
    { name: "Corsair iCUE H150i ELITE LCD XT",          price: 230, maxTdp: 350, type: "aio", confidence: "medium", aff: "https://www.amazon.com/s?k=Corsair+iCUE+H150i+ELITE+LCD+XT&tag=tempcore-20" }
  ],

  /* ---------- PSU DATABASE ----------
     PSU prices roughly stable through the shortage. */
  PSUS: [
    { name: "EVGA 600 BR Bronze",                price: 60,  watts: 600,  rating: "80+ Bronze",   confidence: "medium", aff: "https://www.amazon.com/s?k=EVGA+600+BR&tag=tempcore-20" },
    { name: "Corsair CV650 Bronze",              price: 75,  watts: 650,  rating: "80+ Bronze",   confidence: "medium", aff: "https://www.amazon.com/s?k=Corsair+CV650&tag=tempcore-20" },
    { name: "be quiet! Pure Power 12 M 650W",    price: 95,  watts: 650,  rating: "80+ Gold",     confidence: "medium", aff: "https://www.amazon.com/s?k=be+quiet+Pure+Power+12+M+650W&tag=tempcore-20" },
    { name: "Corsair RM650x",                    price: 115, watts: 650,  rating: "80+ Gold",     confidence: "medium", aff: "https://www.amazon.com/s?k=Corsair+RM650x&tag=tempcore-20" },
    { name: "Seasonic Focus GX-750",             price: 120, watts: 750,  rating: "80+ Gold",     confidence: "medium", aff: "https://www.amazon.com/s?k=Seasonic+Focus+GX-750&tag=tempcore-20" },
    { name: "Corsair RM750x",                    price: 130, watts: 750,  rating: "80+ Gold",     confidence: "medium", aff: "https://www.amazon.com/s?k=Corsair+RM750x&tag=tempcore-20" },
    { name: "Seasonic Focus GX-850",             price: 140, watts: 850,  rating: "80+ Gold",     confidence: "high",   aff: "https://amzn.to/4uJxcxY" },
    { name: "Corsair RM850x",                    price: 150, watts: 850,  rating: "80+ Gold",     confidence: "high",   aff: "https://amzn.to/4dULZif" },
    { name: "Seasonic Focus GX-1000",            price: 180, watts: 1000, rating: "80+ Gold",     confidence: "medium", aff: "https://www.amazon.com/s?k=Seasonic+Focus+GX-1000&tag=tempcore-20" },
    { name: "Corsair HX1000",                    price: 195, watts: 1000, rating: "80+ Platinum", confidence: "medium", aff: "https://www.amazon.com/s?k=Corsair+HX1000&tag=tempcore-20" },
    { name: "Corsair HX1200",                    price: 240, watts: 1200, rating: "80+ Platinum", confidence: "medium", aff: "https://www.amazon.com/s?k=Corsair+HX1200&tag=tempcore-20" },
    { name: "Seasonic PRIME PX-1300",            price: 320, watts: 1300, rating: "80+ Platinum", confidence: "medium", aff: "https://www.amazon.com/s?k=Seasonic+PRIME+PX-1300&tag=tempcore-20" }
  ]

};
