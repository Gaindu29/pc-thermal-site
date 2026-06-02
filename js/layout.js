/* TempCore — Layout
   ─────────────────────────────────────────────────────────────
   Renders the sidebar, theme toggle, collapse control, and mobile
   drawer on every page. The HTML for each page only needs:

       <div id="tc-sidebar-mount"></div>

   in <body>, plus a <script src="…/js/layout.js"></script>.

   Persistence (all writes/reads are localStorage):
       tc_theme    "dark" | "light"   user-selected colour theme
       tc_sidebar  "expanded" | "collapsed"   desktop sidebar state

   Default state on first visit is "collapsed" so the content area
   gets full width. Mobile uses a "open" transient state instead.
*/
(function () {
  'use strict';

  // ── Path prefix (root vs /tools/ vs /articles/) ─────────────
  function prefix() {
    var p = window.location.pathname;
    if (p.indexOf('/tools/')    !== -1) return '../';
    if (p.indexOf('/articles/') !== -1) return '../';
    return './';
  }

  var P = prefix();

  // ── Nav model ───────────────────────────────────────────────
  var TOOLS = [
    { href: P + 'tools/pc-builder.html',         label: 'PC Builder',     icon: 'cpu' },
    { href: P + 'tools/fps-estimator.html',      label: 'FPS Estimator',  icon: 'monitor' },
    { href: P + 'tools/gpu-temp-checker.html',   label: 'GPU Temp',       icon: 'thermometer' },
    { href: P + 'tools/psu-calculator.html',     label: 'PSU Calculator', icon: 'bolt' },
    { href: P + 'tools/ssd-health-checker.html', label: 'SSD Health',     icon: 'database' },
    { href: P + 'tools/bottleneck-checker.html', label: 'Bottleneck',     icon: 'link' }
  ];

  var ARTICLES = [
    { href: P + 'articles/overclocking-guide.html',   label: 'Overclocking Guide',  icon: 'book' },
    { href: P + 'articles/cpu-temperature-guide.html', label: 'CPU Temperatures',   icon: 'cpu-small' },
    { href: P + 'articles/gpu-temp-guide.html',       label: 'GPU Temperatures',    icon: 'flame' },
    { href: P + 'articles/gpu-damage-temps.html',     label: 'GPU Damage Temps',    icon: 'alert' },
    { href: P + 'articles/laptop-temps-guide.html',   label: 'Laptop Cooling',      icon: 'laptop' },
    { href: P + 'articles/pcie5-ssd-heatsinks.html',  label: 'PCIe 5 Heatsinks',    icon: 'shield' },
    { href: P + 'articles/best-thermal-paste-2026.html', label: 'Thermal Paste 2026', icon: 'droplet' },
    { href: P + 'articles/is-75c-safe.html',          label: 'Is 75°C safe?',       icon: 'help' }
  ];

  var EXTRAS = [
    { href: P + 'about.html', label: 'About', icon: 'info' }
  ];

  // ── Inline stroke-only icon set ─────────────────────────────
  var ICONS = {
    cpu:         '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>',
    'cpu-small': '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M10 6V3M14 6V3M10 21v-3M14 21v-3M6 10H3M6 14H3M21 10h-3M21 14h-3"/>',
    monitor:     '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    thermometer: '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4 4 0 1 0 5 0z"/>',
    bolt:        '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>',
    database:    '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6"/>',
    link:        '<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
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
    collapse:    '<path d="M15 18l-6-6 6-6"/>',
    expand:      '<path d="M9 18l6-6-6-6"/>',
    menu:        '<path d="M3 6h18M3 12h18M3 18h18"/>'
  };

  function svgIcon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }

  // ── Active link detection ───────────────────────────────────
  function isActive(href) {
    var current = window.location.pathname.split('/').pop() || 'index.html';
    var target  = href.split('/').pop();
    return current === target;
  }

  function renderLink(item) {
    var cls = 'tc-sidebar-link' + (isActive(item.href) ? ' active' : '');
    return '<a href="' + item.href + '" class="' + cls + '" title="' + item.label + '">' +
             svgIcon(item.icon) +
             '<span class="tc-sidebar-label">' + item.label + '</span>' +
           '</a>';
  }

  function renderToggleButton(id, iconName, labelText, extraClass) {
    return '<button type="button" class="tc-sidebar-link ' + (extraClass || '') + '" id="' + id + '" title="' + labelText + '">' +
             '<span class="tc-sidebar-link-icon" id="' + id + '-icon">' + svgIcon(iconName) + '</span>' +
             '<span class="tc-sidebar-label" id="' + id + '-label">' + labelText + '</span>' +
           '</button>';
  }

  function renderSidebar() {
    var html = '';

    // Header: logo + expand/collapse toggle (top of sidebar)
    html += '<div class="tc-sidebar-header">';
    html +=   '<a href="' + P + 'index.html" class="tc-sidebar-logo" title="TempCore home">';
    html +=     '<span class="tc-sidebar-dot"></span><span class="tc-sidebar-label">TempCore</span>';
    html +=   '</a>';
    html +=   '<button type="button" class="tc-sidebar-link tc-collapse-btn tc-desktop-only" id="tc-collapse-toggle" title="Expand sidebar" aria-label="Toggle sidebar">' +
                '<span class="tc-sidebar-link-icon" id="tc-collapse-toggle-icon">' + svgIcon('expand') + '</span>' +
              '</button>';
    html += '</div>';

    // TOOLS group
    html += '<div class="tc-sidebar-group">';
    html +=   '<div class="tc-sidebar-section tc-sidebar-label">Tools</div>';
    TOOLS.forEach(function (i) { html += renderLink(i); });
    html += '</div>';

    // ARTICLES group (separated by a visible divider, even when collapsed)
    html += '<hr class="tc-sidebar-divider" aria-hidden="true">';
    html += '<div class="tc-sidebar-group">';
    html +=   '<div class="tc-sidebar-section tc-sidebar-label">Articles</div>';
    ARTICLES.forEach(function (i) { html += renderLink(i); });
    html += '</div>';

    html += '<div class="tc-sidebar-spacer"></div>';

    // Footer: extras + theme toggle
    html += '<div class="tc-sidebar-footer">';
    EXTRAS.forEach(function (i) { html += renderLink(i); });
    html += renderToggleButton('tc-theme-toggle', 'sun', 'Light theme');
    html += '</div>';

    return html;
  }

  function renderMobileBar() {
    return '<button type="button" class="tc-mobile-btn" id="tc-mobile-open" aria-label="Open menu">' +
             svgIcon('menu') +
           '</button>' +
           '<a href="' + P + 'index.html" class="tc-mobile-logo">' +
             '<span class="tc-sidebar-dot"></span>TempCore' +
           '</a>' +
           '<span style="width:38px"></span>';
  }

  // ── State application ───────────────────────────────────────
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var iconEl  = document.getElementById('tc-theme-toggle-icon');
    var labelEl = document.getElementById('tc-theme-toggle-label');
    var btnEl   = document.getElementById('tc-theme-toggle');
    if (iconEl)  iconEl.innerHTML  = svgIcon(theme === 'dark' ? 'sun' : 'moon');
    if (labelEl) labelEl.textContent = theme === 'dark' ? 'Light theme' : 'Dark theme';
    if (btnEl)   btnEl.title       = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  }

  function applySidebar(state) {
    // "expanded" | "collapsed" | "open" (mobile drawer)
    document.documentElement.setAttribute('data-sidebar', state);
    var iconEl = document.getElementById('tc-collapse-toggle-icon');
    var btnEl  = document.getElementById('tc-collapse-toggle');
    var isCollapsed = (state === 'collapsed');
    if (iconEl) iconEl.innerHTML = svgIcon(isCollapsed ? 'expand' : 'collapse');
    if (btnEl)  btnEl.title      = isCollapsed ? 'Expand sidebar' : 'Collapse sidebar';
  }

  function lsGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function lsSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* private mode etc. */ }
  }

  // ── Mount ───────────────────────────────────────────────────
  function mount() {
    var host = document.getElementById('tc-sidebar-mount');
    if (!host) return;

    host.innerHTML =
      '<aside class="tc-sidebar" aria-label="Site navigation">' + renderSidebar() + '</aside>' +
      '<div class="tc-sidebar-overlay" id="tc-sidebar-overlay"></div>' +
      '<div class="tc-mobile-bar">' + renderMobileBar() + '</div>';

    // Initialise theme: saved → pre-paint default → system preference → 'dark'
    var savedTheme = lsGet('tc_theme');
    var theme = savedTheme || document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(theme);

    // Initialise sidebar: saved → 'collapsed' (new default)
    var savedSidebar = lsGet('tc_sidebar');
    applySidebar(savedSidebar === 'expanded' ? 'expanded' : 'collapsed');

    // Theme toggle
    var themeBtn = document.getElementById('tc-theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      lsSet('tc_theme', next);
    });

    // Collapse / expand toggle (desktop)
    var collapseBtn = document.getElementById('tc-collapse-toggle');
    if (collapseBtn) collapseBtn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-sidebar');
      var next    = current === 'collapsed' ? 'expanded' : 'collapsed';
      applySidebar(next);
      lsSet('tc_sidebar', next);
    });

    // Mobile drawer open/close
    var openBtn = document.getElementById('tc-mobile-open');
    var overlay = document.getElementById('tc-sidebar-overlay');
    if (openBtn) openBtn.addEventListener('click', function () { applySidebar('open'); });
    if (overlay) overlay.addEventListener('click', function () {
      var saved = lsGet('tc_sidebar');
      applySidebar(saved === 'expanded' ? 'expanded' : 'collapsed');
    });

    // Auto-close drawer when a nav link is tapped on mobile
    Array.prototype.forEach.call(document.querySelectorAll('.tc-sidebar-link'), function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768 && document.documentElement.getAttribute('data-sidebar') === 'open') {
          applySidebar('collapsed');
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
