/* TempCore – Layout v2
   ──────────────────────────────────────────────────────────────
   Renders a sticky top navbar (desktop hover-dropdowns + mobile
   slide-in drawer) on every page. HTML only needs:

       <div id="tc-sidebar-mount"></div>

   plus  <script src="…/js/layout.js"></script>.

   Persistence (localStorage):
       tc_theme   "dark" | "light"   colour theme
*/
(function () {
  'use strict';

  /* ── Path prefix ───────────────────────────────────────────── */
  function prefix() {
    var p = window.location.pathname;
    if (p.indexOf('/tools/')    !== -1) return '../';
    if (p.indexOf('/articles/') !== -1) return '../';
    return './';
  }
  var P = prefix();

  /* ── Nav data ──────────────────────────────────────────────── */
  var TOOLS = [
    { href: P + 'tools/vram-checker.html',        label: 'VRAM Check',     desc: 'Measured usage for 20+ games',    icon: 'layers'      },
    { href: P + 'tools/pc-builder.html',           label: 'PC Builder',     desc: 'Budget-aware build recommender', icon: 'cpu'         },
    { href: P + 'tools/gpu-temp-checker.html',     label: 'GPU Temp',       desc: 'TJ Max for 60+ GPU models',      icon: 'thermometer' },
    { href: P + 'tools/cpu-cooler-checker.html',   label: 'CPU Cooler',     desc: 'Cooler vs CPU TDP match',        icon: 'wind'        },
    { href: P + 'tools/psu-calculator.html',       label: 'PSU Calculator', desc: 'Exact wattage sizing',           icon: 'bolt'        },
    { href: P + 'tools/ssd-health-checker.html',   label: 'SSD Health',     desc: 'Temp + lifespan estimator',      icon: 'database'    },
    { href: P + 'tools/fps-estimator.html',        label: 'FPS Estimator',  desc: 'GPU benchmark FPS ranges',       icon: 'monitor'     }
  ];

  var ARTICLE_GROUPS = [
    {
      label: 'Trending',
      items: [
        { href: P + 'articles/rtx-5070-vs-rx-9070-xt.html', label: 'RTX 5070 vs RX 9070 XT', icon: 'zap'      },
        { href: P + 'articles/16gb-vs-32gb-ram-gaming.html', label: '16GB vs 32GB RAM',        icon: 'database' },
        { href: P + 'articles/dlss-4-vs-fsr-4.html',         label: 'DLSS 4 vs FSR 4',         icon: 'monitor'  },
        { href: P + 'articles/how-to-fix-gpu-stuttering.html',label: 'Fix GPU Stuttering',      icon: 'alert'    },
        { href: P + 'articles/rtx-5060-8gb-vram.html',       label: 'RTX 5060 8GB VRAM',       icon: 'zap'      },
        { href: P + 'articles/amd-vs-intel-2026.html',        label: 'AMD vs Intel 2026',       icon: 'cpu'      },
        { href: P + 'articles/ddr5-vs-ddr4-2026.html',        label: 'DDR5 vs DDR4 2026',       icon: 'database' }
      ]
    },
    {
      label: 'Guides',
      items: [
        { href: P + 'articles/gpu-undervolting-guide.html',       label: 'GPU Undervolting',   icon: 'zap'     },
        { href: P + 'articles/vram-guide.html',                    label: 'VRAM Guide',         icon: 'layers'  },
        { href: P + 'articles/cpu-cooler-guide.html',              label: 'CPU Cooler Guide',   icon: 'wind'    },
        { href: P + 'articles/case-airflow-guide.html',            label: 'Case Airflow',       icon: 'air'     },
        { href: P + 'articles/pc-monitoring-tools-guide.html',     label: 'Monitoring Tools',   icon: 'monitor' },
        { href: P + 'articles/how-to-stress-test-pc.html',         label: 'Stress Testing',     icon: 'alert'   },
        { href: P + 'articles/overclocking-guide.html',            label: 'Overclocking',       icon: 'book'    },
        { href: P + 'articles/best-thermal-paste-2026.html',       label: 'Thermal Paste',      icon: 'droplet' },
        { href: P + 'articles/pcie5-ssd-heatsinks.html',           label: 'PCIe 5 Heatsinks',  icon: 'shield'  }
      ]
    },
    {
      label: 'Temperatures',
      items: [
        { href: P + 'articles/cpu-temperature-guide.html', label: 'CPU Temperatures', icon: 'cpu-small' },
        { href: P + 'articles/gpu-temp-guide.html',        label: 'GPU Temperatures', icon: 'flame'     },
        { href: P + 'articles/is-75c-safe.html',           label: 'Is 75°C Safe?',    icon: 'help'      },
        { href: P + 'articles/laptop-temps-guide.html',    label: 'Laptop Thermals',  icon: 'laptop'    },
        { href: P + 'articles/gpu-damage-temps.html',      label: 'GPU Damage Temps', icon: 'alert'     }
      ]
    }
  ];

  /* ── Icons ─────────────────────────────────────────────────── */
  var ICONS = {
    cpu:         '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>',
    'cpu-small': '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M10 6V3M14 6V3M10 21v-3M14 21v-3M6 10H3M6 14H3M21 10h-3M21 14h-3"/>',
    monitor:     '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    thermometer: '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4 4 0 1 0 5 0z"/>',
    bolt:        '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>',
    database:    '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6"/>',
    book:        '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    flame:       '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.4 0 2.5-1.1 2.5-2.5 0-1.5-1-2.4-2-3.4-1.5-1.5-3-3-3-5.6 0-1.4 1.1-2.5 2.5-2.5 1.4 0 2.5 1.1 2.5 2.5 0 1.5 1 2.4 2 3.4 1.5 1.5 3 3 3 5.6 0 3.6-2.9 6.5-6.5 6.5S5 18.1 5 14.5"/>',
    alert:       '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/>',
    laptop:      '<path d="M2 18h20M4 4h16a1 1 0 0 1 1 1v12H3V5a1 1 0 0 1 1-1z"/>',
    shield:      '<path d="M12 2L4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z"/>',
    droplet:     '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
    help:        '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>',
    info:        '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    sun:         '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
    moon:        '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    menu:        '<path d="M3 6h18M3 12h18M3 18h18"/>',
    close:       '<path d="M18 6L6 18M6 6l12 12"/>',
    wind:        '<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2M9.6 4.4A2 2 0 1 1 11 8H2M12.6 19.6A2 2 0 1 0 14 16H2"/>',
    layers:      '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 12l10 5 10-5"/><path d="M2 17l10 5 10-5"/>',
    zap:         '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    air:         '<path d="M9 5a4 4 0 0 1 4 4 4 4 0 0 1-4 4H5"/><path d="M9 13a4 4 0 0 1 4 4 4 4 0 0 1-4 4H5"/><path d="M18 10a2 2 0 0 0-2-2 2 2 0 0 0-2 2 2 2 0 0 0 2 2h8"/>'
  };

  function svgIcon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }

  /* ── Active link ───────────────────────────────────────────── */
  function isActive(href) {
    var cur = window.location.pathname.split('/').pop() || 'index.html';
    return cur === href.split('/').pop();
  }

  /* ── Desktop: Tools dropdown ───────────────────────────────── */
  function renderToolsDropdown() {
    var html = '<div class="tc-nav-dropdown">';
    html += '<button type="button" class="tc-nav-link" aria-haspopup="true">Tools <span class="tc-chevron" aria-hidden="true">›</span></button>';
    html += '<div class="tc-dropdown-panel" role="menu">';
    TOOLS.forEach(function (t) {
      var cls = 'tc-dropdown-link' + (isActive(t.href) ? ' active' : '');
      html += '<a href="' + t.href + '" class="' + cls + '" role="menuitem">' +
                '<span class="tc-dropdown-icon">' + svgIcon(t.icon) + '</span>' +
                '<span class="tc-dropdown-text">' +
                  '<span class="tc-dropdown-name">' + t.label + '</span>' +
                  '<span class="tc-dropdown-desc">' + t.desc + '</span>' +
                '</span>' +
              '</a>';
    });
    html += '</div></div>';
    return html;
  }

  /* ── Desktop: Articles dropdown ────────────────────────────── */
  function renderArticlesDropdown() {
    var html = '<div class="tc-nav-dropdown">';
    html += '<button type="button" class="tc-nav-link" aria-haspopup="true">Articles <span class="tc-chevron" aria-hidden="true">›</span></button>';
    html += '<div class="tc-dropdown-panel tc-dropdown-panel--articles" role="menu">';
    ARTICLE_GROUPS.forEach(function (group) {
      html += '<div class="tc-dropdown-col">';
      html += '<div class="tc-dropdown-group-label">' + group.label + '</div>';
      group.items.forEach(function (a) {
        var cls = 'tc-dropdown-link tc-dropdown-link--article' + (isActive(a.href) ? ' active' : '');
        html += '<a href="' + a.href + '" class="' + cls + '" role="menuitem">' +
                  '<span class="tc-dropdown-icon">' + svgIcon(a.icon) + '</span>' +
                  a.label +
                '</a>';
      });
      html += '</div>';
    });
    html += '</div></div>';
    return html;
  }

  /* ── Navbar HTML ───────────────────────────────────────────── */
  function renderNavbar() {
    var aboutActive = isActive(P + 'about.html') ? ' active' : '';
    return '<nav class="tc-navbar" aria-label="Main navigation">' +
      '<div class="tc-navbar-inner">' +

        '<a href="' + P + 'index.html" class="tc-nav-logo">' +
          '<span class="tc-nav-dot"></span>TempCore' +
        '</a>' +

        '<div class="tc-nav-links tc-desktop-only">' +
          renderToolsDropdown() +
          renderArticlesDropdown() +
          '<a href="' + P + 'about.html" class="tc-nav-link' + aboutActive + '">About</a>' +
        '</div>' +

        '<div class="tc-nav-actions">' +
          '<button type="button" class="tc-nav-btn" id="tc-theme-toggle" aria-label="Toggle theme">' + svgIcon('sun') + '</button>' +
          '<button type="button" class="tc-nav-btn tc-mobile-only" id="tc-mobile-open" aria-label="Open menu" aria-expanded="false">' + svgIcon('menu') + '</button>' +
        '</div>' +

      '</div>' +
    '</nav>';
  }

  /* ── Mobile menu HTML ──────────────────────────────────────── */
  function renderMobileMenu() {
    var html = '<div class="tc-mobile-menu" id="tc-mobile-menu" aria-label="Mobile navigation" aria-hidden="true">';

    html += '<div class="tc-mobile-section-label">Tools</div>';
    TOOLS.forEach(function (t) {
      html += '<a href="' + t.href + '" class="tc-mobile-link">' +
                '<span class="tc-mobile-icon">' + svgIcon(t.icon) + '</span>' +
                '<span>' + t.label + '</span>' +
              '</a>';
    });

    ARTICLE_GROUPS.forEach(function (group) {
      html += '<div class="tc-mobile-section-label">' + group.label + '</div>';
      group.items.forEach(function (a) {
        html += '<a href="' + a.href + '" class="tc-mobile-link tc-mobile-link--sm">' +
                  '<span class="tc-mobile-icon">' + svgIcon(a.icon) + '</span>' +
                  a.label +
                '</a>';
      });
    });

    html += '<div class="tc-mobile-section-label">More</div>';
    html += '<a href="' + P + 'about.html" class="tc-mobile-link"><span class="tc-mobile-icon">' + svgIcon('info') + '</span><span>About</span></a>';
    html += '</div>';
    html += '<div class="tc-mobile-overlay" id="tc-mobile-overlay"></div>';
    return html;
  }

  /* ── Theme ─────────────────────────────────────────────────── */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var btn = document.getElementById('tc-theme-toggle');
    if (btn) {
      btn.innerHTML = svgIcon(theme === 'dark' ? 'sun' : 'moon');
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } }

  /* ── Mount ─────────────────────────────────────────────────── */
  function mount() {
    var host = document.getElementById('tc-sidebar-mount');
    if (!host) return;

    host.innerHTML = renderNavbar() + renderMobileMenu();

    /* Theme */
    var theme = lsGet('tc_theme') || document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(theme);

    var themeBtn = document.getElementById('tc-theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      lsSet('tc_theme', next);
    });

    /* Mobile drawer */
    var openBtn  = document.getElementById('tc-mobile-open');
    var menu     = document.getElementById('tc-mobile-menu');
    var overlay  = document.getElementById('tc-mobile-overlay');

    function openMenu() {
      menu.classList.add('open');
      overlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
      if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
      if (menu)    menu.setAttribute('aria-hidden', 'false');
    }
    function closeMenu() {
      menu.classList.remove('open');
      overlay.style.display = 'none';
      document.body.style.overflow = '';
      if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
      if (menu)    menu.setAttribute('aria-hidden', 'true');
    }

    if (openBtn) openBtn.addEventListener('click', openMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    /* Close drawer on any nav link tap */
    if (menu) Array.prototype.forEach.call(menu.querySelectorAll('a'), function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
