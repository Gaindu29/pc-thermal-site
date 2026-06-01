/* TempCore — Layout (sidebar, theme toggle, mobile drawer)
   ─────────────────────────────────────────────────────────
   Single source of truth for site chrome. Each page just needs:
     <div id="tc-sidebar-mount"></div>
   in <body>, plus this script. Active link is detected from URL.

   Persistence:
     localStorage.tc_theme    = "dark" | "light"
     localStorage.tc_sidebar  = "expanded" | "collapsed"
*/
(function () {
  'use strict';

  // ── Path prefix resolver (root vs /tools/ vs /articles/) ──
  function prefix() {
    var p = window.location.pathname;
    if (p.indexOf('/tools/')    !== -1) return '../';
    if (p.indexOf('/articles/') !== -1) return '../';
    return './';
  }

  // ── Nav model ────────────────────────────────────────────
  var P = prefix();
  var TOOLS = [
    { href: P + 'tools/pc-builder.html',         label: 'PC Builder',     icon: 'cpu' },
    { href: P + 'tools/fps-estimator.html',      label: 'FPS Estimator',  icon: 'monitor' },
    { href: P + 'tools/gpu-temp-checker.html',   label: 'GPU Temp',       icon: 'thermometer' },
    { href: P + 'tools/psu-calculator.html',     label: 'PSU Calculator', icon: 'bolt' },
    { href: P + 'tools/ssd-health-checker.html', label: 'SSD Health',     icon: 'database' },
    { href: P + 'tools/bottleneck-checker.html', label: 'Bottleneck',     icon: 'link' }
  ];
  var GUIDES = [
    { href: P + 'articles/overclocking-guide.html', label: 'Overclocking',   icon: 'book' },
    { href: P + 'articles/gpu-temp-guide.html',     label: 'GPU Temps',      icon: 'flame' },
    { href: P + 'articles/gpu-damage-temps.html',   label: 'GPU Damage',     icon: 'alert' },
    { href: P + 'articles/laptop-temps-guide.html', label: 'Laptop Cooling', icon: 'laptop' },
    { href: P + 'articles/is-75c-safe.html',        label: 'Is 75°C safe?',  icon: 'help' }
  ];
  var EXTRAS = [
    { href: P + 'about.html', label: 'About', icon: 'info' }
  ];

  // ── Lightweight inline icon set (stroked, no deps) ───────
  var ICONS = {
    cpu:         '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>',
    monitor:     '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    thermometer: '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4 4 0 1 0 5 0z"/>',
    bolt:        '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>',
    database:    '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6"/>',
    link:        '<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
    book:        '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    flame:       '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.4 0 2.5-1.1 2.5-2.5 0-1.5-1-2.4-2-3.4-1.5-1.5-3-3-3-5.6 0-1.4 1.1-2.5 2.5-2.5 1.4 0 2.5 1.1 2.5 2.5 0 1.5 1 2.4 2 3.4 1.5 1.5 3 3 3 5.6 0 3.6-2.9 6.5-6.5 6.5S5 18.1 5 14.5"/>',
    alert:       '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/>',
    laptop:      '<path d="M2 18h20M4 4h16a1 1 0 0 1 1 1v12H3V5a1 1 0 0 1 1-1z"/>',
    help:        '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>',
    info:        '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    sun:         '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
    moon:        '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    collapse:    '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M14 9l-3 3 3 3"/>',
    expand:      '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M11 9l3 3-3 3"/>',
    menu:        '<path d="M3 6h18M3 12h18M3 18h18"/>',
    close:       '<path d="M18 6L6 18M6 6l12 12"/>'
  };

  function svgIcon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }

  // ── Active link detection ────────────────────────────────
  function isActive(href) {
    var current = window.location.pathname.split('/').pop() || 'index.html';
    var target  = href.split('/').pop();
    return current === target;
  }

  function renderLink(item) {
    var cls = 'tc-sidebar-link' + (isActive(item.href) ? ' active' : '');
    return '<a href="' + item.href + '" class="' + cls + '">' +
             svgIcon(item.icon) +
             '<span class="tc-sidebar-label">' + item.label + '</span>' +
           '</a>';
  }

  function renderSidebar() {
    var html = '';
    html += '<a href="' + P + 'index.html" class="tc-sidebar-logo">';
    html += '<span class="tc-sidebar-dot"></span><span>TempCore</span>';
    html += '</a>';

    html += '<div class="tc-sidebar-section tc-sidebar-label">Tools</div>';
    TOOLS.forEach(function (i) { html += renderLink(i); });

    html += '<div class="tc-sidebar-section tc-sidebar-label">Guides</div>';
    GUIDES.forEach(function (i) { html += renderLink(i); });

    html += '<div class="tc-sidebar-spacer"></div>';

    html += '<div class="tc-sidebar-footer">';
    EXTRAS.forEach(function (i) { html += renderLink(i); });
    html += '<button type="button" class="tc-sidebar-link" id="tc-theme-toggle" style="background:transparent; border:none; cursor:pointer; text-align:left; width:100%; font-family:inherit;">' +
              '<span id="tc-theme-icon">' + svgIcon('sun') + '</span>' +
              '<span class="tc-sidebar-label" id="tc-theme-label">Light theme</span>' +
            '</button>';
    html += '<button type="button" class="tc-sidebar-link tc-desktop-only" id="tc-collapse-toggle" style="background:transparent; border:none; cursor:pointer; text-align:left; width:100%; font-family:inherit;">' +
              '<span id="tc-collapse-icon">' + svgIcon('collapse') + '</span>' +
              '<span class="tc-sidebar-label" id="tc-collapse-label">Collapse</span>' +
            '</button>';
    html += '</div>';

    return html;
  }

  // ── Mobile top bar ───────────────────────────────────────
  function renderMobileBar() {
    return '<a href="' + P + 'index.html" class="tc-mobile-logo">' +
             '<span class="tc-sidebar-dot"></span>TempCore' +
           '</a>' +
           '<button type="button" class="tc-mobile-btn" id="tc-mobile-open" aria-label="Open menu">' +
             svgIcon('menu') +
           '</button>';
  }

  // ── Theme application ────────────────────────────────────
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var iconEl  = document.getElementById('tc-theme-icon');
    var labelEl = document.getElementById('tc-theme-label');
    if (iconEl)  iconEl.innerHTML  = svgIcon(theme === 'dark' ? 'sun' : 'moon');
    if (labelEl) labelEl.textContent = theme === 'dark' ? 'Light theme' : 'Dark theme';
  }

  function applySidebar(state) {
    // state: "expanded" | "collapsed" | "open" (mobile only)
    document.documentElement.setAttribute('data-sidebar', state);
    var iconEl  = document.getElementById('tc-collapse-icon');
    var labelEl = document.getElementById('tc-collapse-label');
    if (iconEl)  iconEl.innerHTML  = svgIcon(state === 'collapsed' ? 'expand' : 'collapse');
    if (labelEl) labelEl.textContent = state === 'collapsed' ? 'Expand' : 'Collapse';
  }

  // ── Mount ────────────────────────────────────────────────
  function mount() {
    var host = document.getElementById('tc-sidebar-mount');
    if (!host) return;

    host.innerHTML =
      '<aside class="tc-sidebar" aria-label="Site navigation">' + renderSidebar() + '</aside>' +
      '<div class="tc-sidebar-overlay" id="tc-sidebar-overlay"></div>' +
      '<div class="tc-mobile-bar">' + renderMobileBar() + '</div>';

    // Init theme: localStorage > inline pre-paint default > system preference
    var saved = (function () { try { return localStorage.getItem('tc_theme'); } catch (e) { return null; } })();
    var theme = saved || document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(theme);

    // Init sidebar state (desktop only — mobile is always "expanded" semantically; "open" is transient)
    var savedSb = (function () { try { return localStorage.getItem('tc_sidebar'); } catch (e) { return null; } })();
    applySidebar(savedSb === 'collapsed' ? 'collapsed' : 'expanded');

    // ── Wire events ────────────────────────────────────────
    var themeBtn = document.getElementById('tc-theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('tc_theme', next); } catch (e) {}
    });

    var collapseBtn = document.getElementById('tc-collapse-toggle');
    if (collapseBtn) collapseBtn.addEventListener('click', function () {
      var cur  = document.documentElement.getAttribute('data-sidebar');
      var next = cur === 'collapsed' ? 'expanded' : 'collapsed';
      applySidebar(next);
      try { localStorage.setItem('tc_sidebar', next); } catch (e) {}
    });

    var openBtn  = document.getElementById('tc-mobile-open');
    var overlay  = document.getElementById('tc-sidebar-overlay');
    if (openBtn)  openBtn.addEventListener('click', function () { applySidebar('open'); });
    if (overlay)  overlay.addEventListener('click', function () {
      var saved = (function () { try { return localStorage.getItem('tc_sidebar'); } catch (e) { return null; } })();
      applySidebar(saved === 'collapsed' ? 'collapsed' : 'expanded');
    });

    // Close drawer when nav link clicked on mobile
    document.querySelectorAll('.tc-sidebar-link').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768 && document.documentElement.getAttribute('data-sidebar') === 'open') {
          applySidebar('expanded');
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
