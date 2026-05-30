/* ==========================================================================
   TempCore — PC Builder Recommendation Engine
   --------------------------------------------------------------------------
   Approximate USD street prices, 2026. Real prices vary — the affiliate links
   reflect the live price at click-through.
   --------------------------------------------------------------------------
   Affiliate link convention:
     - aff:  shortened amzn.to link (TempCore affiliate, existing)
     - search: amazon.com search URL — needs replacing with an affiliate link
   ========================================================================== */

/* ---------- CPU DATABASE ---------- */
var CPUS = [
  // Entry — AM4
  { name: "AMD Ryzen 5 5500",          brand: "amd",   socket: "AM4",  price: 95,  perf: 55, tdp: 65,  igpu: false, aff: "https://www.amazon.com/s?k=AMD+Ryzen+5+5500" },
  { name: "AMD Ryzen 5 5600",          brand: "amd",   socket: "AM4",  price: 125, perf: 62, tdp: 65,  igpu: false, aff: "https://www.amazon.com/s?k=AMD+Ryzen+5+5600" },
  { name: "Intel Core i3-13100F",      brand: "intel", socket: "LGA1700", price: 110, perf: 56, tdp: 60,  igpu: false, aff: "https://www.amazon.com/s?k=Intel+Core+i3-13100F" },
  { name: "Intel Core i5-12400F",      brand: "intel", socket: "LGA1700", price: 140, perf: 64, tdp: 65,  igpu: false, aff: "https://www.amazon.com/s?k=Intel+Core+i5-12400F" },

  // Mid — AM5 / LGA1700
  { name: "AMD Ryzen 5 7600",          brand: "amd",   socket: "AM5",  price: 200, perf: 75, tdp: 65,  igpu: true,  aff: "https://amzn.to/4u9w4CC" },
  { name: "AMD Ryzen 5 7600X",         brand: "amd",   socket: "AM5",  price: 220, perf: 78, tdp: 105, igpu: true,  aff: "https://www.amazon.com/s?k=AMD+Ryzen+5+7600X" },
  { name: "Intel Core i5-13400F",      brand: "intel", socket: "LGA1700", price: 180, perf: 72, tdp: 65,  igpu: false, aff: "https://www.amazon.com/s?k=Intel+Core+i5-13400F" },
  { name: "Intel Core i5-13600K",      brand: "intel", socket: "LGA1700", price: 280, perf: 84, tdp: 125, igpu: true,  aff: "https://amzn.to/4o8f8Lp" },
  { name: "Intel Core i5-14600KF",     brand: "intel", socket: "LGA1700", price: 290, perf: 86, tdp: 125, igpu: false, aff: "https://www.amazon.com/s?k=Intel+Core+i5-14600KF" },

  // Upper Mid
  { name: "AMD Ryzen 7 5800X3D",       brand: "amd",   socket: "AM4",  price: 300, perf: 82, tdp: 105, igpu: false, aff: "https://www.amazon.com/s?k=AMD+Ryzen+7+5800X3D" },
  { name: "AMD Ryzen 7 7700",          brand: "amd",   socket: "AM5",  price: 300, perf: 86, tdp: 65,  igpu: true,  aff: "https://www.amazon.com/s?k=AMD+Ryzen+7+7700" },
  { name: "AMD Ryzen 7 7700X",         brand: "amd",   socket: "AM5",  price: 330, perf: 88, tdp: 105, igpu: true,  aff: "https://amzn.to/4nVbV1w" },
  { name: "Intel Core i7-13700K",      brand: "intel", socket: "LGA1700", price: 390, perf: 92, tdp: 125, igpu: true,  aff: "https://www.amazon.com/s?k=Intel+Core+i7-13700K" },
  { name: "Intel Core i7-14700K",      brand: "intel", socket: "LGA1700", price: 410, perf: 95, tdp: 125, igpu: true,  aff: "https://www.amazon.com/s?k=Intel+Core+i7-14700K" },

  // High
  { name: "AMD Ryzen 7 7800X3D",       brand: "amd",   socket: "AM5",  price: 430, perf: 96, tdp: 120, igpu: true,  aff: "https://www.amazon.com/s?k=AMD+Ryzen+7+7800X3D" },
  { name: "AMD Ryzen 9 7900X",         brand: "amd",   socket: "AM5",  price: 430, perf: 94, tdp: 170, igpu: true,  aff: "https://www.amazon.com/s?k=AMD+Ryzen+9+7900X" },
  { name: "AMD Ryzen 9 9900X",         brand: "amd",   socket: "AM5",  price: 470, perf: 97, tdp: 120, igpu: true,  aff: "https://www.amazon.com/s?k=AMD+Ryzen+9+9900X" },

  // Enthusiast
  { name: "Intel Core i9-14900K",      brand: "intel", socket: "LGA1700", price: 580, perf: 100, tdp: 125, igpu: true, aff: "https://www.amazon.com/s?k=Intel+Core+i9-14900K" },
  { name: "AMD Ryzen 9 7950X3D",       brand: "amd",   socket: "AM5",  price: 590, perf: 102, tdp: 120, igpu: true, aff: "https://www.amazon.com/s?k=AMD+Ryzen+9+7950X3D" },
  { name: "AMD Ryzen 9 9950X3D",       brand: "amd",   socket: "AM5",  price: 700, perf: 110, tdp: 170, igpu: true, aff: "https://www.amazon.com/s?k=AMD+Ryzen+9+9950X3D" }
];

/* ---------- GPU DATABASE ---------- */
/* perf is a relative gaming score where RTX 4060 = 50. vram in GB. */
var GPUS = [
  { name: "AMD Radeon RX 6600",        price: 200, perf: 42, vram: 8,  tdp: 132, aff: "https://www.amazon.com/s?k=AMD+Radeon+RX+6600" },
  { name: "NVIDIA RTX 3060 12GB",      price: 240, perf: 46, vram: 12, tdp: 170, aff: "https://www.amazon.com/s?k=NVIDIA+RTX+3060+12GB" },
  { name: "NVIDIA RTX 4060",           price: 280, perf: 50, vram: 8,  tdp: 115, aff: "https://amzn.to/4dUBxHy" },
  { name: "AMD Radeon RX 7600 XT",     price: 320, perf: 53, vram: 16, tdp: 190, aff: "https://amzn.to/43J9Axn" },
  { name: "NVIDIA RTX 5060",           price: 340, perf: 60, vram: 8,  tdp: 150, aff: "https://www.amazon.com/s?k=NVIDIA+RTX+5060" },
  { name: "NVIDIA RTX 4060 Ti",        price: 400, perf: 62, vram: 8,  tdp: 160, aff: "https://amzn.to/3PxJGtn" },
  { name: "AMD Radeon RX 7700 XT",     price: 430, perf: 70, vram: 12, tdp: 245, aff: "https://amzn.to/4fQwxpG" },
  { name: "NVIDIA RTX 5060 Ti 16GB",   price: 460, perf: 72, vram: 16, tdp: 180, aff: "https://www.amazon.com/s?k=NVIDIA+RTX+5060+Ti+16GB" },
  { name: "AMD Radeon RX 7800 XT",     price: 520, perf: 80, vram: 16, tdp: 263, aff: "https://www.amazon.com/s?k=AMD+Radeon+RX+7800+XT" },
  { name: "NVIDIA RTX 4070",           price: 540, perf: 78, vram: 12, tdp: 200, aff: "https://amzn.to/4x0ekMw" },
  { name: "NVIDIA RTX 5070",           price: 580, perf: 88, vram: 12, tdp: 250, aff: "https://www.amazon.com/s?k=NVIDIA+RTX+5070" },
  { name: "NVIDIA RTX 4070 Super",     price: 600, perf: 86, vram: 12, tdp: 220, aff: "https://www.amazon.com/s?k=NVIDIA+RTX+4070+Super" },
  { name: "AMD Radeon RX 7900 GRE",    price: 580, perf: 88, vram: 16, tdp: 260, aff: "https://www.amazon.com/s?k=AMD+Radeon+RX+7900+GRE" },
  { name: "AMD Radeon RX 7900 XT",     price: 680, perf: 95, vram: 20, tdp: 315, aff: "https://www.amazon.com/s?k=AMD+Radeon+RX+7900+XT" },
  { name: "NVIDIA RTX 5070 Ti",        price: 770, perf: 102, vram: 16, tdp: 300, aff: "https://www.amazon.com/s?k=NVIDIA+RTX+5070+Ti" },
  { name: "NVIDIA RTX 4070 Ti Super",  price: 800, perf: 100, vram: 16, tdp: 285, aff: "https://www.amazon.com/s?k=NVIDIA+RTX+4070+Ti+Super" },
  { name: "AMD Radeon RX 7900 XTX",    price: 890, perf: 110, vram: 24, tdp: 355, aff: "https://www.amazon.com/s?k=AMD+Radeon+RX+7900+XTX" },
  { name: "NVIDIA RTX 4080 Super",     price: 1000, perf: 115, vram: 16, tdp: 320, aff: "https://www.amazon.com/s?k=NVIDIA+RTX+4080+Super" },
  { name: "NVIDIA RTX 5080",           price: 1100, perf: 130, vram: 16, tdp: 360, aff: "https://www.amazon.com/s?k=NVIDIA+RTX+5080" },
  { name: "NVIDIA RTX 4090",           price: 1700, perf: 150, vram: 24, tdp: 450, aff: "https://www.amazon.com/s?k=NVIDIA+RTX+4090" },
  { name: "NVIDIA RTX 5090",           price: 2200, perf: 180, vram: 32, tdp: 575, aff: "https://www.amazon.com/s?k=NVIDIA+RTX+5090" }
];

/* ---------- MOTHERBOARD DATABASE ---------- */
var MOBOS = [
  { name: "MSI A520M-A PRO",           price: 70,  socket: "AM4",     formFactor: "mATX", wifi: false, tier: 1, aff: "https://www.amazon.com/s?k=MSI+A520M-A+PRO" },
  { name: "ASUS PRIME B450M-A II",     price: 80,  socket: "AM4",     formFactor: "mATX", wifi: false, tier: 1, aff: "https://www.amazon.com/s?k=ASUS+PRIME+B450M-A+II" },
  { name: "MSI B550M PRO-VDH WiFi",    price: 120, socket: "AM4",     formFactor: "mATX", wifi: true,  tier: 2, aff: "https://www.amazon.com/s?k=MSI+B550M+PRO-VDH+WiFi" },
  { name: "ASRock B550 Phantom Gaming 4", price: 110, socket: "AM4",  formFactor: "ATX",  wifi: false, tier: 2, aff: "https://www.amazon.com/s?k=ASRock+B550+Phantom+Gaming+4" },

  { name: "MSI PRO B760M-A WiFi DDR4", price: 130, socket: "LGA1700", formFactor: "mATX", wifi: true,  tier: 2, aff: "https://www.amazon.com/s?k=MSI+PRO+B760M-A+WiFi+DDR4" },
  { name: "ASUS PRIME B760-PLUS D4",   price: 150, socket: "LGA1700", formFactor: "ATX",  wifi: false, tier: 2, aff: "https://www.amazon.com/s?k=ASUS+PRIME+B760-PLUS+D4" },
  { name: "MSI MAG B760 TOMAHAWK WiFi",price: 200, socket: "LGA1700", formFactor: "ATX",  wifi: true,  tier: 3, aff: "https://www.amazon.com/s?k=MSI+MAG+B760+TOMAHAWK+WiFi" },
  { name: "Gigabyte Z790 AORUS Elite AX", price: 280, socket: "LGA1700", formFactor: "ATX", wifi: true, tier: 4, aff: "https://www.amazon.com/s?k=Gigabyte+Z790+AORUS+Elite+AX" },

  { name: "MSI PRO B650M-A WiFi",      price: 160, socket: "AM5",     formFactor: "mATX", wifi: true,  tier: 2, aff: "https://www.amazon.com/s?k=MSI+PRO+B650M-A+WiFi" },
  { name: "ASRock B650 PG Lightning",  price: 170, socket: "AM5",     formFactor: "ATX",  wifi: false, tier: 2, aff: "https://www.amazon.com/s?k=ASRock+B650+PG+Lightning" },
  { name: "MSI MAG B650 TOMAHAWK WiFi",price: 220, socket: "AM5",     formFactor: "ATX",  wifi: true,  tier: 3, aff: "https://www.amazon.com/s?k=MSI+MAG+B650+TOMAHAWK+WiFi" },
  { name: "ASUS ROG STRIX B650E-F WiFi",price: 270, socket: "AM5",    formFactor: "ATX",  wifi: true,  tier: 3, aff: "https://www.amazon.com/s?k=ASUS+ROG+STRIX+B650E-F+WiFi" },
  { name: "ASUS ROG STRIX X670E-E WiFi",price: 400, socket: "AM5",    formFactor: "ATX",  wifi: true,  tier: 4, aff: "https://www.amazon.com/s?k=ASUS+ROG+STRIX+X670E-E+WiFi" }
];

/* ---------- RAM DATABASE ---------- */
var RAMS = [
  { name: "Corsair Vengeance LPX 16GB DDR4-3200 (2x8GB)",   price: 40,  size: 16,  type: "DDR4", aff: "https://amzn.to/4vmVEVW" },
  { name: "Crucial 16GB DDR4-3200 (2x8GB)",                  price: 38,  size: 16,  type: "DDR4", aff: "https://www.amazon.com/s?k=Crucial+16GB+DDR4-3200+2x8GB" },
  { name: "Corsair Vengeance 32GB DDR4-3600 (2x16GB)",       price: 70,  size: 32,  type: "DDR4", aff: "https://www.amazon.com/s?k=Corsair+Vengeance+32GB+DDR4-3600" },
  { name: "G.Skill Ripjaws V 32GB DDR4-3600 (2x16GB)",       price: 75,  size: 32,  type: "DDR4", aff: "https://www.amazon.com/s?k=G.Skill+Ripjaws+V+32GB+DDR4-3600" },
  { name: "G.Skill Flare X5 16GB DDR5-5600 (2x8GB)",         price: 55,  size: 16,  type: "DDR5", aff: "https://www.amazon.com/s?k=G.Skill+Flare+X5+16GB+DDR5-5600" },
  { name: "Corsair Vengeance 32GB DDR5-6000 (2x16GB)",       price: 95,  size: 32,  type: "DDR5", aff: "https://amzn.to/4uIgTl3" },
  { name: "G.Skill Trident Z5 32GB DDR5-6000 CL30 (2x16GB)", price: 110, size: 32,  type: "DDR5", aff: "https://amzn.to/4u9PlEb" },
  { name: "Corsair Vengeance 64GB DDR5-6000 (2x32GB)",       price: 200, size: 64,  type: "DDR5", aff: "https://www.amazon.com/s?k=Corsair+Vengeance+64GB+DDR5-6000" },
  { name: "G.Skill Trident Z5 64GB DDR5-6400 (2x32GB)",      price: 230, size: 64,  type: "DDR5", aff: "https://www.amazon.com/s?k=G.Skill+Trident+Z5+64GB+DDR5-6400" }
];

/* ---------- STORAGE DATABASE ---------- */
var SSDS = [
  { name: "Crucial MX500 500GB SATA",         price: 50,  size: 500,  type: "SATA",  tier: 1, aff: "https://www.amazon.com/s?k=Crucial+MX500+500GB" },
  { name: "WD Blue SN570 500GB NVMe",         price: 45,  size: 500,  type: "NVMe",  tier: 1, aff: "https://www.amazon.com/s?k=WD+Blue+SN570+500GB+NVMe" },
  { name: "Crucial MX500 1TB SATA",           price: 75,  size: 1000, type: "SATA",  tier: 1, aff: "https://amzn.to/4fbk13Y" },
  { name: "Samsung 870 EVO 1TB SATA",         price: 85,  size: 1000, type: "SATA",  tier: 1, aff: "https://amzn.to/49xtOOd" },
  { name: "WD Blue SN570 1TB NVMe",           price: 65,  size: 1000, type: "NVMe",  tier: 2, aff: "https://amzn.to/43J9fe5" },
  { name: "Crucial P3 Plus 1TB NVMe Gen4",    price: 75,  size: 1000, type: "NVMe",  tier: 2, aff: "https://www.amazon.com/s?k=Crucial+P3+Plus+1TB+NVMe" },
  { name: "Samsung 990 Pro 1TB NVMe Gen4",    price: 110, size: 1000, type: "NVMe",  tier: 3, aff: "https://amzn.to/4xej7KG" },
  { name: "WD Black SN850X 1TB NVMe Gen4",    price: 110, size: 1000, type: "NVMe",  tier: 3, aff: "https://www.amazon.com/s?k=WD+Black+SN850X+1TB" },
  { name: "Crucial P3 Plus 2TB NVMe Gen4",    price: 130, size: 2000, type: "NVMe",  tier: 2, aff: "https://www.amazon.com/s?k=Crucial+P3+Plus+2TB+NVMe" },
  { name: "Samsung 990 Pro 2TB NVMe Gen4",    price: 200, size: 2000, type: "NVMe",  tier: 3, aff: "https://www.amazon.com/s?k=Samsung+990+Pro+2TB" },
  { name: "WD Black SN850X 2TB NVMe Gen4",    price: 200, size: 2000, type: "NVMe",  tier: 3, aff: "https://www.amazon.com/s?k=WD+Black+SN850X+2TB" }
];

/* ---------- CASE DATABASE ---------- */
var CASES = [
  { name: "Cooler Master MasterBox Q300L",     price: 50,  rgb: false, glass: false, tier: 1, aff: "https://www.amazon.com/s?k=Cooler+Master+MasterBox+Q300L" },
  { name: "Montech AIR 100 ARGB",              price: 65,  rgb: true,  glass: true,  tier: 2, aff: "https://www.amazon.com/s?k=Montech+AIR+100+ARGB" },
  { name: "NZXT H510 Flow",                    price: 80,  rgb: false, glass: true,  tier: 2, aff: "https://www.amazon.com/s?k=NZXT+H510+Flow" },
  { name: "Phanteks Eclipse G360A",            price: 90,  rgb: true,  glass: true,  tier: 2, aff: "https://www.amazon.com/s?k=Phanteks+Eclipse+G360A" },
  { name: "Lian Li Lancool 216",               price: 110, rgb: true,  glass: true,  tier: 3, aff: "https://www.amazon.com/s?k=Lian+Li+Lancool+216" },
  { name: "Fractal Design North",              price: 140, rgb: false, glass: true,  tier: 3, aff: "https://www.amazon.com/s?k=Fractal+Design+North" },
  { name: "Lian Li O11 Dynamic EVO",           price: 170, rgb: false, glass: true,  tier: 4, aff: "https://www.amazon.com/s?k=Lian+Li+O11+Dynamic+EVO" },
  { name: "Hyte Y60",                          price: 200, rgb: false, glass: true,  tier: 4, aff: "https://www.amazon.com/s?k=Hyte+Y60" }
];

/* ---------- CPU COOLER DATABASE ---------- */
var COOLERS = [
  { name: "Stock cooler (included)",                    price: 0,   maxTdp: 95,  type: "air", aff: null },
  { name: "ID-COOLING SE-224-XT Black",                 price: 30,  maxTdp: 180, type: "air", aff: "https://www.amazon.com/s?k=ID-COOLING+SE-224-XT" },
  { name: "Thermalright Peerless Assassin 120 SE",      price: 40,  maxTdp: 245, type: "air", aff: "https://amzn.to/3RDUuqr" },
  { name: "be quiet! Pure Rock 2 Black",                price: 50,  maxTdp: 150, type: "air", aff: "https://www.amazon.com/s?k=be+quiet+Pure+Rock+2+Black" },
  { name: "Noctua NH-U12A",                             price: 110, maxTdp: 230, type: "air", aff: "https://www.amazon.com/s?k=Noctua+NH-U12A" },
  { name: "Arctic Liquid Freezer III 240",              price: 90,  maxTdp: 280, type: "aio", aff: "https://www.amazon.com/s?k=Arctic+Liquid+Freezer+III+240" },
  { name: "Arctic Liquid Freezer III 360",              price: 130, maxTdp: 350, type: "aio", aff: "https://www.amazon.com/s?k=Arctic+Liquid+Freezer+III+360" },
  { name: "Corsair iCUE H150i ELITE LCD XT",            price: 220, maxTdp: 350, type: "aio", aff: "https://www.amazon.com/s?k=Corsair+iCUE+H150i+ELITE+LCD+XT" }
];

/* ---------- PSU DATABASE ---------- */
var PSUS = [
  { name: "EVGA 600 BR Bronze",                price: 55,  watts: 600,  rating: "80+ Bronze",   aff: "https://www.amazon.com/s?k=EVGA+600+BR" },
  { name: "Corsair CV650 Bronze",              price: 70,  watts: 650,  rating: "80+ Bronze",   aff: "https://www.amazon.com/s?k=Corsair+CV650" },
  { name: "be quiet! Pure Power 12 M 650W",    price: 90,  watts: 650,  rating: "80+ Gold",     aff: "https://www.amazon.com/s?k=be+quiet+Pure+Power+12+M+650W" },
  { name: "Corsair RM650x",                    price: 110, watts: 650,  rating: "80+ Gold",     aff: "https://www.amazon.com/s?k=Corsair+RM650x" },
  { name: "Seasonic Focus GX-750",             price: 115, watts: 750,  rating: "80+ Gold",     aff: "https://www.amazon.com/s?k=Seasonic+Focus+GX-750" },
  { name: "Corsair RM750x",                    price: 125, watts: 750,  rating: "80+ Gold",     aff: "https://www.amazon.com/s?k=Corsair+RM750x" },
  { name: "Seasonic Focus GX-850",             price: 130, watts: 850,  rating: "80+ Gold",     aff: "https://amzn.to/4uJxcxY" },
  { name: "Corsair RM850x",                    price: 140, watts: 850,  rating: "80+ Gold",     aff: "https://amzn.to/4dULZif" },
  { name: "Seasonic Focus GX-1000",            price: 170, watts: 1000, rating: "80+ Gold",     aff: "https://www.amazon.com/s?k=Seasonic+Focus+GX-1000" },
  { name: "Corsair HX1000",                    price: 185, watts: 1000, rating: "80+ Platinum", aff: "https://www.amazon.com/s?k=Corsair+HX1000" },
  { name: "Corsair HX1200",                    price: 230, watts: 1200, rating: "80+ Platinum", aff: "https://www.amazon.com/s?k=Corsair+HX1200" }
];

/* ==========================================================================
   RECOMMENDATION ENGINE
   ========================================================================== */

/* Budget allocation profiles per use case. Values are fractions of total budget.
   The profile drives initial picks; the algorithm rebalances if total over/under. */
var ALLOCATIONS = {
  gaming_1080p:    { gpu: 0.32, cpu: 0.18, mobo: 0.10, ram: 0.07, ssd: 0.08, psu: 0.09, cooler: 0.06, case: 0.10 },
  gaming_1440p:    { gpu: 0.40, cpu: 0.17, mobo: 0.09, ram: 0.07, ssd: 0.07, psu: 0.08, cooler: 0.05, case: 0.07 },
  gaming_4k:       { gpu: 0.48, cpu: 0.14, mobo: 0.08, ram: 0.06, ssd: 0.07, psu: 0.08, cooler: 0.04, case: 0.05 },
  creation:        { gpu: 0.28, cpu: 0.25, mobo: 0.09, ram: 0.13, ssd: 0.10, psu: 0.07, cooler: 0.04, case: 0.04 },
  streaming:       { gpu: 0.32, cpu: 0.24, mobo: 0.09, ram: 0.11, ssd: 0.07, psu: 0.07, cooler: 0.05, case: 0.05 },
  productivity:    { gpu: 0.10, cpu: 0.26, mobo: 0.12, ram: 0.13, ssd: 0.13, psu: 0.10, cooler: 0.07, case: 0.09 },
  ai_ml:           { gpu: 0.50, cpu: 0.16, mobo: 0.08, ram: 0.13, ssd: 0.05, psu: 0.04, cooler: 0.02, case: 0.02 }
};

/* Resolve a use case key. Resolution only relevant when goal is "gaming". */
function getAllocKey(goal, resolution) {
  if (goal === "gaming") {
    if (resolution === "4k")   return "gaming_4k";
    if (resolution === "1440p") return "gaming_1440p";
    return "gaming_1080p";
  }
  return goal;
}

/* Pick the best (highest perf or price-equivalent) item from a sorted list whose
   price <= maxPrice and which passes the predicate. Items are assumed sorted ascending. */
function pickBest(list, maxPrice, predicate) {
  var best = null;
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    if (item.price > maxPrice) continue;
    if (predicate && !predicate(item)) continue;
    best = item;
  }
  return best;
}

/* Pick the cheapest item that satisfies a predicate, regardless of allocation. */
function pickCheapest(list, predicate) {
  for (var i = 0; i < list.length; i++) {
    if (!predicate || predicate(list[i])) return list[i];
  }
  return null;
}

/* Sort helper — returns a price-ascending copy. */
function byPrice(arr) {
  return arr.slice().sort(function(a, b) { return a.price - b.price; });
}

function pickCPU(budget, prefs) {
  var sorted = byPrice(CPUS);
  var pred = function(c) {
    if (prefs.cpuBrand && prefs.cpuBrand !== "either" && c.brand !== prefs.cpuBrand) return false;
    // For productivity with iGPU-only path, require iGPU
    if (prefs.requireIGPU && !c.igpu) return false;
    return true;
  };
  return pickBest(sorted, budget, pred) || pickCheapest(sorted, pred) || sorted[0];
}

function pickGPU(budget, prefs) {
  var sorted = byPrice(GPUS);
  var pred = function(g) {
    // AI/ML: bias toward NVIDIA (CUDA) and require >=12GB VRAM if budget allows >=$500
    if (prefs.goal === "ai_ml") {
      if (!/NVIDIA/.test(g.name)) return false;
    }
    return true;
  };
  var pick = pickBest(sorted, budget, pred);
  if (!pick) pick = pickCheapest(sorted, pred);
  return pick;
}

function pickMobo(budget, prefs) {
  var sorted = byPrice(MOBOS);
  var pred = function(m) {
    if (m.socket !== prefs.cpuSocket) return false;
    if (prefs.wifi && !m.wifi) return false;
    return true;
  };
  var pick = pickBest(sorted, budget, pred);
  if (!pick) pick = pickCheapest(sorted, pred);
  return pick;
}

function pickRAM(budget, prefs) {
  var sorted = byPrice(RAMS);
  var pred = function(r) {
    // AM5 / LGA1700 with K-series modern -> DDR5. AM4 / 12th-gen non-K -> DDR4 OK.
    // Simplification: AM5 = DDR5 only. LGA1700 = either (depends on mobo) — we picked DDR4 mobos for cheap LGA1700.
    if (prefs.cpuSocket === "AM5" && r.type !== "DDR5") return false;
    if (prefs.cpuSocket === "AM4" && r.type !== "DDR4") return false;
    if (prefs.cpuSocket === "LGA1700") {
      // Allow DDR4 for cheap builds; allow DDR5 if mobo supports it (we'd need richer mobo data).
      // Simplification: tie to mobo name — DDR4 mobos in our list have "D4" or "DDR4" in name.
      if (prefs.moboDDR4 && r.type !== "DDR4") return false;
      if (!prefs.moboDDR4 && r.type !== "DDR5") return false;
    }
    // Use case sizing
    if (prefs.goal === "productivity") {
      if (r.size < 16) return false;
    } else if (prefs.goal === "creation" || prefs.goal === "ai_ml") {
      if (r.size < 32) return false;
    } else if (prefs.goal === "streaming") {
      if (r.size < 32) return false;
    } else {
      // gaming
      if (r.size < 16) return false;
    }
    return true;
  };
  var pick = pickBest(sorted, budget, pred);
  if (!pick) pick = pickCheapest(sorted, pred);
  return pick;
}

function pickSSD(budget, prefs) {
  var sorted = byPrice(SSDS);
  var pred = function(s) {
    if (s.size < prefs.minStorage) return false;
    return true;
  };
  // Prefer NVMe when budget allows
  var nvmePred = function(s) { return pred(s) && s.type === "NVMe"; };
  var pick = pickBest(sorted, budget, nvmePred);
  if (!pick) pick = pickBest(sorted, budget, pred);
  if (!pick) pick = pickCheapest(sorted, pred);
  return pick;
}

function pickCase(budget, prefs) {
  var sorted = byPrice(CASES);
  var pred = function(c) {
    if (prefs.rgb === "rgb" && !c.rgb) return false;
    if (prefs.rgb === "none" && c.rgb) return false;
    return true;
  };
  var pick = pickBest(sorted, budget, pred);
  if (!pick) pick = pickBest(sorted, budget);
  if (!pick) pick = sorted[0];
  return pick;
}

function pickCooler(budget, prefs) {
  var sorted = byPrice(COOLERS);
  var pred = function(c) { return c.maxTdp >= prefs.cpuTDP; };
  // For high TDP CPUs (>=170W) bias toward AIO
  var aioPred = function(c) { return c.type === "aio" && c.maxTdp >= prefs.cpuTDP; };
  if (prefs.cpuTDP >= 170) {
    var aio = pickBest(sorted, budget, aioPred);
    if (aio) return aio;
  }
  var pick = pickBest(sorted, budget, pred);
  if (!pick) pick = pickCheapest(sorted, pred);
  return pick || sorted[0];
}

function pickPSU(budget, prefs) {
  // PSU isn't a "spend more for more performance" component — pick the cheapest
  // quality unit that comfortably meets the watts requirement. We compute the
  // headroom-included requirement (25% over peak draw) and prefer the smallest
  // common-tier PSU that hits it.
  var sorted = byPrice(PSUS);
  var requiredWatts = Math.ceil((prefs.cpuTDP + prefs.gpuTDP + 80) * 1.25 / 50) * 50;
  if (requiredWatts < 500) requiredWatts = 500;
  // Round up to nearest standard tier (650 / 750 / 850 / 1000 / 1200)
  var tiers = [600, 650, 750, 850, 1000, 1200];
  var targetTier = tiers[tiers.length - 1];
  for (var t = 0; t < tiers.length; t++) {
    if (tiers[t] >= requiredWatts) { targetTier = tiers[t]; break; }
  }
  // Find cheapest PSU at or above target tier
  var pred = function(p) { return p.watts >= targetTier; };
  var pick = pickCheapest(sorted, pred);
  // If budget allows for a Gold-rated upgrade at same tier, prefer it
  if (pick && pick.rating && pick.rating.indexOf("Bronze") !== -1) {
    var goldSameTier = pickCheapest(sorted, function(p) {
      return p.watts === pick.watts && p.rating.indexOf("Gold") !== -1 && p.price <= budget;
    });
    if (goldSameTier) pick = goldSameTier;
  }
  return pick || sorted[sorted.length - 1];
}

/* Main build function. Returns {ok, build, total, warnings}. */
function buildPC(input) {
  var budget = Math.max(0, input.budget || 0);
  var goal = input.goal || "gaming";
  var resolution = input.resolution || "1080p";
  var minStorage = input.storage || 1000;
  var cpuBrand = input.cpuBrand || "either";
  var rgb = input.rgb || "any";
  var wifi = !!input.wifi;

  if (budget < 500) {
    return {
      ok: false,
      reason: "Budget too low. A complete PC tower starts around $500. Below that, consider buying a used or prebuilt system."
    };
  }

  var allocKey = getAllocKey(goal, resolution);
  var alloc = ALLOCATIONS[allocKey];
  var warnings = [];

  // Step 1: pick CPU first (drives socket and TDP)
  var cpuBudget = budget * alloc.cpu;
  var requireIGPU = (goal === "productivity" && budget < 700);
  var cpu = pickCPU(cpuBudget, { cpuBrand: cpuBrand, requireIGPU: requireIGPU });

  // Step 2: pick GPU
  var gpuBudget = budget * alloc.gpu;
  var gpu = null;
  if (goal === "productivity" && budget < 700 && cpu.igpu) {
    // Skip discrete GPU for low-budget productivity builds — use iGPU instead
    gpu = null;
  } else {
    gpu = pickGPU(gpuBudget, { goal: goal });
    if (goal === "ai_ml" && (!gpu || gpu.vram < 12)) {
      // Force at least 12GB VRAM for AI/ML by giving it more budget
      var aiGpu = pickBest(byPrice(GPUS), gpuBudget * 1.4, function(g) { return /NVIDIA/.test(g.name) && g.vram >= 12; });
      if (aiGpu) {
        gpu = aiGpu;
        warnings.push("AI/ML workloads benefit from \u226512 GB VRAM and CUDA. Budget shifted toward the GPU.");
      }
    }
  }

  // Step 3: pick motherboard (socket-matched)
  var mobo = pickMobo(budget * alloc.mobo, { cpuSocket: cpu.socket, wifi: wifi });
  if (!mobo) {
    // Try without wifi requirement
    mobo = pickMobo(budget * alloc.mobo, { cpuSocket: cpu.socket, wifi: false });
    if (wifi) warnings.push("Could not fit a Wi-Fi motherboard in this budget tier. A USB Wi-Fi adapter (~$15) is a workaround.");
  }
  var moboDDR4 = mobo && /D4|DDR4/.test(mobo.name);

  // Step 4: pick RAM
  var ram = pickRAM(budget * alloc.ram, {
    cpuSocket: cpu.socket,
    moboDDR4: moboDDR4,
    goal: goal
  });

  // Step 5: pick SSD
  var ssd = pickSSD(budget * alloc.ssd, { minStorage: minStorage });

  // Step 6: pick case
  var caseItem = pickCase(budget * alloc.case, { rgb: rgb });

  // Step 7: pick cooler (driven by CPU TDP)
  var cooler = pickCooler(budget * alloc.cooler, { cpuTDP: cpu.tdp });
  // Stock cooler only OK for sub-95W non-K CPUs that ship with one (AMD non-X and Intel non-K)
  var hasStockCooler = (cpu.tdp <= 65 && /Ryzen 5 5500|Ryzen 5 5600 |Ryzen 5 7600 |Ryzen 7 7700 |i5-12400F|i5-13400F|i3-13100F/.test(cpu.name + " "));
  if (cooler.price === 0 && !hasStockCooler) {
    cooler = pickCheapest(byPrice(COOLERS), function(c) { return c.price > 0 && c.maxTdp >= cpu.tdp; });
  }

  // Step 8: pick PSU (driven by total power draw)
  var gpuTDP = gpu ? gpu.tdp : 0;
  var psu = pickPSU(budget * alloc.psu, { cpuTDP: cpu.tdp, gpuTDP: gpuTDP });

  // Calculate total
  var picks = { cpu: cpu, gpu: gpu, mobo: mobo, ram: ram, ssd: ssd, case: caseItem, cooler: cooler, psu: psu };
  var total = 0;
  for (var k in picks) if (picks[k]) total += picks[k].price;

  // Step 9: If over budget, downgrade in priority order
  var downgradeOrder = ["case", "cooler", "mobo", "ssd", "psu", "ram", "cpu", "gpu"];
  var attempts = 0;
  while (total > budget && attempts < 20) {
    attempts++;
    var changed = false;
    for (var i = 0; i < downgradeOrder.length; i++) {
      var cat = downgradeOrder[i];
      var current = picks[cat];
      if (!current) continue;
      var pool = byPrice(getPool(cat));
      // Find a cheaper alternative that still passes predicates
      var cheaper = findCheaperAlternative(cat, current, picks, {
        cpuBrand: cpuBrand, rgb: rgb, wifi: wifi, goal: goal, minStorage: minStorage,
        moboDDR4: moboDDR4
      });
      if (cheaper && cheaper.price < current.price) {
        picks[cat] = cheaper;
        total = total - current.price + cheaper.price;
        changed = true;
        if (total <= budget) break;
      }
    }
    if (!changed) break;
  }

  // Step 10: If well under budget (>=15% headroom), upgrade GPU then CPU
  var headroom = budget - total;
  var upgradeAttempts = 0;
  while (headroom >= budget * 0.10 && upgradeAttempts < 10) {
    upgradeAttempts++;
    var upgraded = false;
    // Try upgrading GPU
    if (picks.gpu) {
      var betterGPU = findBetterAlternative("gpu", picks.gpu, headroom, picks, { goal: goal });
      if (betterGPU) {
        total = total - picks.gpu.price + betterGPU.price;
        picks.gpu = betterGPU;
        // Re-check PSU
        var newPsu = pickPSU(budget, { cpuTDP: picks.cpu.tdp, gpuTDP: betterGPU.tdp });
        if (newPsu.price !== picks.psu.price) {
          total = total - picks.psu.price + newPsu.price;
          picks.psu = newPsu;
        }
        headroom = budget - total;
        upgraded = true;
        continue;
      }
    }
    // Try upgrading CPU
    var betterCPU = findBetterAlternative("cpu", picks.cpu, headroom, picks, {
      cpuBrand: cpuBrand, requireIGPU: requireIGPU
    });
    if (betterCPU && betterCPU.socket === picks.cpu.socket) {
      total = total - picks.cpu.price + betterCPU.price;
      picks.cpu = betterCPU;
      // Re-check cooler
      if (picks.cooler.maxTdp < betterCPU.tdp) {
        var newCooler = pickCooler(budget, { cpuTDP: betterCPU.tdp });
        if (newCooler) {
          total = total - picks.cooler.price + newCooler.price;
          picks.cooler = newCooler;
        }
      }
      headroom = budget - total;
      upgraded = true;
      continue;
    }
    if (!upgraded) break;
  }

  // ===== Performance reality checks: warn on borderline configurations =====
  if (goal === "gaming" && picks.gpu) {
    if (resolution === "4k") {
      if (budget < 1500 || picks.gpu.vram < 12 || picks.gpu.tdp < 200) {
        warnings.push("4K gaming really wants a budget of $1800+ and a GPU in the RTX 4070 Super class (12+ GB VRAM, 250W+ TDP) or better. At this tier expect to use DLSS/FSR Quality mode, drop to the High preset, or step down to 1440p in the most demanding AAA titles. 1440p will give a much better experience for the money — consider it.");
      } else if (picks.gpu.price < 700) {
        warnings.push("This GPU handles 4K, but in the most demanding new titles you may need to use the High preset (not Ultra) or enable DLSS/FSR Quality to hold 60+ FPS.");
      }
    } else if (resolution === "1440p") {
      if (picks.gpu.vram < 8) {
        warnings.push("Under 8 GB VRAM is borderline at 1440p in modern AAA games. Expect to use Medium textures in the newest titles.");
      } else if (picks.gpu.vram === 8 && picks.gpu.price < 350) {
        warnings.push("8 GB VRAM is getting tight at 1440p in the newest AAA titles — expect Medium-High textures rather than Ultra. Fine for esports and most games up through 2024.");
      } else if (picks.gpu.price < 300) {
        warnings.push("This GPU is entry-tier for 1440p. Plan on the Medium-High preset rather than Ultra in newer AAA games to keep 60+ FPS.");
      }
    } else if (resolution === "1080p" && picks.gpu.price < 200) {
      warnings.push("This is a budget GPU — solid for esports and older AAA titles at 1080p High, but expect to drop to Medium in the newest releases.");
    }
  }

  if (goal === "ai_ml" && picks.gpu && picks.gpu.vram < 16) {
    warnings.push("This GPU has " + picks.gpu.vram + " GB VRAM — enough for Stable Diffusion 1.5/SDXL with optimizations and 7B LLMs (quantized). Larger models (13B+ unquantized, full SD3, fine-tuning) want 24 GB+. A 24 GB card (RTX 4090 / 5090) typically starts around $1700.");
  }

  if (goal === "streaming" && picks.cpu.price < 200) {
    warnings.push("Streaming while gaming benefits from a CPU with 8+ cores (Ryzen 7 / Core i7 class). At this CPU tier, use GPU-based encoding (NVENC on NVIDIA, AV1 on RX 7000+) rather than x264 software encoding to keep frame times consistent.");
  }

  if (goal === "creation" && picks.gpu && !/NVIDIA/.test(picks.gpu.name)) {
    warnings.push("Several creative apps (DaVinci Resolve Studio, Premiere, Blender Cycles, Topaz) run notably faster on NVIDIA thanks to CUDA / OptiX / NVENC. If your workflow leans on those, consider stepping over to an equivalently-priced NVIDIA card.");
  }

  if (picks.cooler && picks.cpu.tdp >= 105 && (picks.cooler.maxTdp - picks.cpu.tdp) < 30) {
    warnings.push("CPU cooler is rated " + picks.cooler.maxTdp + "W vs. a " + picks.cpu.tdp + "W CPU — workable but with little thermal headroom. Expect higher temps under sustained load; a beefier cooler would let the CPU boost longer.");
  }

  if (picks.ram && /16GB/.test(picks.ram.name) && (goal === "creation" || goal === "ai_ml" || goal === "streaming")) {
    var workName = goal === "ai_ml" ? "AI/ML" : (goal === "creation" ? "content creation" : "streaming");
    warnings.push("16 GB RAM is tight for " + workName + " work once you have multiple apps and browser tabs open. 32 GB is the practical baseline — a RAM upgrade is a good first-year purchase.");
  }

  // Calculate total power draw for the PSU info display
  var systemDraw = picks.cpu.tdp + (picks.gpu ? picks.gpu.tdp : 0) + 80;

  return {
    ok: true,
    picks: picks,
    total: total,
    budget: budget,
    headroom: budget - total,
    warnings: warnings,
    allocKey: allocKey,
    systemDraw: systemDraw,
    tier: getTierName(budget),
    iGpuOnly: !picks.gpu
  };
}

function getPool(cat) {
  if (cat === "cpu") return CPUS;
  if (cat === "gpu") return GPUS;
  if (cat === "mobo") return MOBOS;
  if (cat === "ram") return RAMS;
  if (cat === "ssd") return SSDS;
  if (cat === "case") return CASES;
  if (cat === "cooler") return COOLERS;
  if (cat === "psu") return PSUS;
  return [];
}

function findCheaperAlternative(cat, current, picks, opts) {
  var pool = byPrice(getPool(cat));
  for (var i = pool.length - 1; i >= 0; i--) {
    var item = pool[i];
    if (item.price >= current.price) continue;
    if (!isCompatible(cat, item, picks, opts)) continue;
    return item;
  }
  return null;
}

function findBetterAlternative(cat, current, extraBudget, picks, opts) {
  var pool = byPrice(getPool(cat));
  var maxPrice = current.price + extraBudget;
  var best = null;
  for (var i = 0; i < pool.length; i++) {
    var item = pool[i];
    if (item.price <= current.price) continue;
    if (item.price > maxPrice) continue;
    if (!isCompatible(cat, item, picks, opts)) continue;
    best = item;
  }
  return best;
}

function isCompatible(cat, item, picks, opts) {
  if (cat === "cpu") {
    if (opts.cpuBrand && opts.cpuBrand !== "either" && item.brand !== opts.cpuBrand) return false;
    if (opts.requireIGPU && !item.igpu) return false;
    return true;
  }
  if (cat === "gpu") {
    if (opts.goal === "ai_ml" && !/NVIDIA/.test(item.name)) return false;
    return true;
  }
  if (cat === "mobo") {
    if (item.socket !== picks.cpu.socket) return false;
    if (opts.wifi && !item.wifi) return false;
    return true;
  }
  if (cat === "ram") {
    if (picks.cpu.socket === "AM5" && item.type !== "DDR5") return false;
    if (picks.cpu.socket === "AM4" && item.type !== "DDR4") return false;
    if (picks.cpu.socket === "LGA1700") {
      if (opts.moboDDR4 && item.type !== "DDR4") return false;
      if (!opts.moboDDR4 && item.type !== "DDR5") return false;
    }
    // size minimums by goal
    if (opts.goal === "creation" || opts.goal === "ai_ml" || opts.goal === "streaming") {
      if (item.size < 32) return false;
    } else {
      if (item.size < 16) return false;
    }
    return true;
  }
  if (cat === "ssd") {
    if (item.size < opts.minStorage) return false;
    return true;
  }
  if (cat === "case") {
    if (opts.rgb === "rgb" && !item.rgb) return false;
    if (opts.rgb === "none" && item.rgb) return false;
    return true;
  }
  if (cat === "cooler") {
    if (item.maxTdp < picks.cpu.tdp) return false;
    return true;
  }
  if (cat === "psu") {
    var watts = picks.cpu.tdp + (picks.gpu ? picks.gpu.tdp : 0) + 80;
    var required = Math.ceil(watts * 1.25 / 50) * 50;
    if (required < 500) required = 500;
    if (item.watts < required) return false;
    return true;
  }
  return true;
}

function getTierName(budget) {
  if (budget < 700)  return { label: "Entry", color: "var(--safe)" };
  if (budget < 1100) return { label: "Mid-Range", color: "var(--accent)" };
  if (budget < 1700) return { label: "High-End", color: "var(--warm)" };
  if (budget < 2500) return { label: "Enthusiast", color: "var(--hot)" };
  return { label: "Flagship", color: "var(--critical)" };
}

/* ==========================================================================
   DOM HANDLERS
   ========================================================================== */

function pcb_setChip(group, value) {
  var groups = {
    "cpuBrand":  ["either", "amd", "intel"],
    "rgb":       ["any", "none", "rgb"],
    "goal":      ["gaming", "creation", "streaming", "productivity", "ai_ml"]
  };
  var ids = groups[group];
  if (!ids) return;
  for (var i = 0; i < ids.length; i++) {
    var el = document.getElementById("pcb-" + group + "-" + ids[i]);
    if (el) el.classList.remove("active");
  }
  var sel = document.getElementById("pcb-" + group + "-" + value);
  if (sel) sel.classList.add("active");
  document.getElementById("pcb-" + group).value = value;

  if (group === "goal") {
    var resWrap = document.getElementById("pcb-resolution-wrap");
    if (resWrap) {
      resWrap.style.display = (value === "gaming") ? "block" : "none";
    }
  }
}

function pcb_setWifi(val) {
  document.getElementById("pcb-wifi").value = val ? "1" : "0";
  var box = document.getElementById("pcb-wifi-toggle");
  if (val) box.classList.add("on"); else box.classList.remove("on");
}

function pcb_compute() {
  var input = {
    budget:     parseInt(document.getElementById("pcb-budget").value || "0", 10),
    goal:       document.getElementById("pcb-goal").value || "gaming",
    resolution: document.getElementById("pcb-resolution").value || "1080p",
    storage:    parseInt(document.getElementById("pcb-storage").value || "1000", 10),
    cpuBrand:   document.getElementById("pcb-cpuBrand").value || "either",
    rgb:        document.getElementById("pcb-rgb").value || "any",
    wifi:       document.getElementById("pcb-wifi").value === "1"
  };

  var result = buildPC(input);
  pcb_render(result);
}

function pcb_render(result) {
  var defaultBox = document.getElementById("pcb-default");
  var resultBox  = document.getElementById("pcb-result");

  if (!result.ok) {
    if (defaultBox) defaultBox.style.display = "none";
    resultBox.className = "result-box hot show";
    resultBox.innerHTML =
      '<div class="result-status">Budget Too Low</div>' +
      '<p style="margin-top:0.75rem; color:#b0b0c8; line-height:1.65;">' + result.reason + '</p>';
    return;
  }

  if (defaultBox) defaultBox.style.display = "none";

  var tier = result.tier;
  var picks = result.picks;
  var total = result.total;
  var budget = result.budget;
  var headroomPct = Math.round((result.headroom / budget) * 100);

  var rows = [
    { cat: "CPU",         icon: iconCPU(),    item: picks.cpu },
    { cat: "GPU",         icon: iconGPU(),    item: picks.gpu },
    { cat: "Motherboard", icon: iconMobo(),   item: picks.mobo },
    { cat: "Memory",      icon: iconRAM(),    item: picks.ram },
    { cat: "Storage",     icon: iconSSD(),    item: picks.ssd },
    { cat: "CPU Cooler",  icon: iconCooler(), item: picks.cooler },
    { cat: "Case",        icon: iconCase(),   item: picks.case },
    { cat: "Power Supply",icon: iconPSU(),    item: picks.psu }
  ];

  var rowsHtml = "";
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    if (!r.item) {
      // GPU may be null (iGPU build)
      if (r.cat === "GPU") {
        rowsHtml += pcb_iGpuRow();
      }
      continue;
    }
    rowsHtml += pcb_componentRow(r.cat, r.icon, r.item);
  }

  var warningsHtml = "";
  if (result.warnings && result.warnings.length) {
    warningsHtml = '<div style="margin-top:1rem; padding:0.85rem 1rem; background:rgba(255,170,0,0.06); border:1px solid rgba(255,170,0,0.25); border-radius:6px; color:#b0b0c8; font-size:0.82rem; line-height:1.6;">';
    for (var w = 0; w < result.warnings.length; w++) {
      warningsHtml += '<div style="display:flex; gap:0.5rem; align-items:flex-start;"><span style="color:var(--warm); flex-shrink:0;">&#8226;</span><span>' + result.warnings[w] + '</span></div>';
    }
    warningsHtml += '</div>';
  }

  var alloc = result.allocKey.replace(/_/g, " ").replace(/\b\w/g, function(m){return m.toUpperCase();});

  var html =
    '<div style="display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; flex-wrap:wrap; margin-bottom:1rem;">' +
      '<div>' +
        '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.7rem; letter-spacing:0.12em; text-transform:uppercase; color:' + tier.color + '; margin-bottom:0.3rem;">' + tier.label + ' Build &middot; ' + alloc + '</div>' +
        '<div class="font-display" style="font-size:2.5rem; line-height:1; color:var(--text);">Your PC Build</div>' +
      '</div>' +
      '<div style="text-align:right;">' +
        '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.7rem; letter-spacing:0.1em; text-transform:uppercase; color:#8888a0; margin-bottom:0.2rem;">Total</div>' +
        '<div style="font-family:\'Bebas Neue\',sans-serif; font-size:2.2rem; line-height:1; color:var(--accent); letter-spacing:0.02em;">$' + total + '</div>' +
        '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.72rem; color:#8888a0; margin-top:0.2rem;">of $' + budget + ' &middot; $' + result.headroom + ' left</div>' +
      '</div>' +
    '</div>' +

    /* Budget progress bar */
    '<div style="height:6px; background:var(--surface2); border-radius:100px; overflow:hidden; margin-bottom:0.4rem;">' +
      '<div style="height:100%; width:' + Math.min(100, Math.round((total/budget)*100)) + '%; background:linear-gradient(90deg, var(--accent), var(--hot)); border-radius:100px;"></div>' +
    '</div>' +
    '<div style="display:flex; justify-content:space-between; font-family:\'JetBrains Mono\',monospace; font-size:0.65rem; color:#555568; margin-bottom:1.5rem;">' +
      '<span>SPENT ' + Math.round((total/budget)*100) + '%</span>' +
      '<span>HEADROOM ' + headroomPct + '%</span>' +
    '</div>' +

    /* Component rows */
    '<div>' + rowsHtml + '</div>' +

    /* Warnings */
    warningsHtml +

    /* System summary */
    '<div style="margin-top:1.25rem; padding:1rem 1.25rem; background:var(--surface2); border-radius:8px; display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">' +
      '<div>' +
        '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.62rem; letter-spacing:0.1em; text-transform:uppercase; color:#8888a0; margin-bottom:0.2rem;">Est. System Draw</div>' +
        '<div style="font-family:\'Bebas Neue\',sans-serif; font-size:1.5rem; color:var(--text);">' + result.systemDraw + ' W</div>' +
      '</div>' +
      '<div>' +
        '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.62rem; letter-spacing:0.1em; text-transform:uppercase; color:#8888a0; margin-bottom:0.2rem;">PSU Capacity</div>' +
        '<div style="font-family:\'Bebas Neue\',sans-serif; font-size:1.5rem; color:var(--text);">' + (picks.psu ? picks.psu.watts + " W" : "—") + '</div>' +
      '</div>' +
    '</div>' +

    /* Disclaimer */
    '<p style="margin-top:1rem; font-family:\'JetBrains Mono\',monospace; font-size:0.65rem; color:#555568; line-height:1.6;">Prices are approximate 2026 USD street prices and may vary. Verify current pricing at the retailer before purchasing. Budget excludes peripherals (monitor, keyboard, mouse, headset).</p>';

  resultBox.className = "result-box safe show";
  resultBox.innerHTML = html;

  // Track analytics event
  if (typeof gtag === "function") {
    gtag("event", "pc_build_generated", {
      budget: budget,
      goal: input_goal_from_dom(),
      total_price: total,
      tier: tier.label
    });
  }
}

function input_goal_from_dom() {
  var el = document.getElementById("pcb-goal");
  return el ? el.value : "gaming";
}

function pcb_componentRow(cat, iconSvg, item) {
  return (
    '<a href="' + item.aff + '" target="_blank" rel="nofollow noopener" style="display:block; padding:0.85rem 1rem; border:1px solid var(--border); border-radius:8px; margin-bottom:0.5rem; text-decoration:none; background:rgba(255,255,255,0.01); transition:border-color 0.15s, background 0.15s;"' +
      ' onmouseover="this.style.borderColor=\'rgba(0,200,255,0.4)\'; this.style.background=\'rgba(0,200,255,0.03)\';"' +
      ' onmouseout="this.style.borderColor=\'var(--border)\'; this.style.background=\'rgba(255,255,255,0.01)\';">' +
      '<div style="display:flex; align-items:center; gap:0.85rem;">' +
        '<div style="flex-shrink:0; width:32px; height:32px; display:flex; align-items:center; justify-content:center; background:var(--surface2); border-radius:6px;">' + iconSvg + '</div>' +
        '<div style="flex:1; min-width:0;">' +
          '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.62rem; letter-spacing:0.1em; text-transform:uppercase; color:#8888a0; margin-bottom:0.15rem;">' + cat + '</div>' +
          '<div style="color:var(--text); font-weight:500; font-size:0.92rem; line-height:1.3; overflow:hidden; text-overflow:ellipsis;">' + item.name + '</div>' +
        '</div>' +
        '<div style="text-align:right; flex-shrink:0;">' +
          '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.95rem; color:var(--text); font-weight:600;">$' + item.price + '</div>' +
          '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.62rem; color:var(--accent); margin-top:0.1rem; letter-spacing:0.05em;">VIEW &#8599;</div>' +
        '</div>' +
      '</div>' +
    '</a>'
  );
}

function pcb_iGpuRow() {
  return (
    '<div style="display:block; padding:0.85rem 1rem; border:1px dashed var(--border); border-radius:8px; margin-bottom:0.5rem; background:rgba(255,255,255,0.01);">' +
      '<div style="display:flex; align-items:center; gap:0.85rem;">' +
        '<div style="flex-shrink:0; width:32px; height:32px; display:flex; align-items:center; justify-content:center; background:var(--surface2); border-radius:6px;">' + iconGPU() + '</div>' +
        '<div style="flex:1; min-width:0;">' +
          '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.62rem; letter-spacing:0.1em; text-transform:uppercase; color:#8888a0; margin-bottom:0.15rem;">GPU</div>' +
          '<div style="color:var(--text); font-weight:500; font-size:0.92rem; line-height:1.3;">Integrated graphics (no discrete GPU)</div>' +
          '<div style="color:#8888a0; font-size:0.75rem; margin-top:0.15rem;">Suitable for productivity, office, light media. Add a GPU later if needed.</div>' +
        '</div>' +
        '<div style="text-align:right; flex-shrink:0;">' +
          '<div style="font-family:\'JetBrains Mono\',monospace; font-size:0.95rem; color:#8888a0; font-weight:600;">$0</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

/* ---------- Simple inline SVG icons ---------- */
function iconCPU()    { return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="14" height="14" rx="1.5"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></svg>'; }
function iconGPU()    { return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="11" rx="1.5"/><circle cx="8" cy="12.5" r="2.2"/><circle cx="16" cy="12.5" r="2.2"/><line x1="2" y1="20" x2="6" y2="20"/></svg>'; }
function iconMobo()   { return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="1.5"/><rect x="7" y="7" width="6" height="6"/><line x1="15" y1="7" x2="18" y2="7"/><line x1="15" y1="11" x2="18" y2="11"/><line x1="7" y1="17" x2="13" y2="17"/></svg>'; }
function iconRAM()    { return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="8" width="20" height="9" rx="1"/><line x1="6" y1="11" x2="6" y2="14"/><line x1="10" y1="11" x2="10" y2="14"/><line x1="14" y1="11" x2="14" y2="14"/><line x1="18" y1="11" x2="18" y2="14"/></svg>'; }
function iconSSD()    { return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="1.5"/><circle cx="17" cy="12" r="1.6"/><line x1="6" y1="10" x2="13" y2="10"/><line x1="6" y1="14" x2="13" y2="14"/></svg>'; }
function iconCooler() { return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="1.6" fill="var(--accent)"/><path d="M12 3a5 5 0 0 1 0 9M12 21a5 5 0 0 1 0-9M3 12a5 5 0 0 1 9 0M21 12a5 5 0 0 1-9 0"/></svg>'; }
function iconCase()   { return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="1.5"/><line x1="9" y1="6" x2="15" y2="6"/><line x1="9" y1="9" x2="15" y2="9"/><circle cx="12" cy="17" r="1.6"/></svg>'; }
function iconPSU()    { return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="11" rx="1.5"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="14" y1="3" x2="14" y2="7"/><path d="M14 11l-2.5 4h3.5l-2.5 4"/></svg>'; }
