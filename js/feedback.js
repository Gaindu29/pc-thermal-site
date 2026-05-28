/**
 * TempCore — Global Feedback System
 * Self-contained: injects button + modal into any page automatically.
 * Set WEB3FORMS_KEY after registering at https://web3forms.com
 */
(function () {
  'use strict';

  // ── Config ─────────────────────────────────────────────────────────────────
  // 1. Go to https://web3forms.com  2. Enter your email  3. Paste key here
  var WEB3FORMS_KEY = 'aead9c6d-b081-403e-b272-63979d6f7a63';

  // ── State ──────────────────────────────────────────────────────────────────
  var _tab = 'calibrate';

  // ── Styles ─────────────────────────────────────────────────────────────────
  var css = [
    '#fb-float{',
      'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9000;',
      'background:#141418;border:1px solid #2a2a32;color:#8888a0;',
      'font-family:"JetBrains Mono",monospace;font-size:0.72rem;',
      'padding:0.45rem 0.9rem;border-radius:20px;cursor:pointer;',
      'display:flex;align-items:center;gap:0.35rem;',
      'box-shadow:0 4px 20px rgba(0,0,0,0.5);transition:all 0.2s;',
    '}',
    '#fb-float:hover{border-color:rgba(0,200,255,0.4);color:#00c8ff;}',

    '#fb-overlay{',
      'display:none;position:fixed;inset:0;z-index:9100;',
      'background:rgba(0,0,0,0.72);backdrop-filter:blur(6px);',
      '-webkit-backdrop-filter:blur(6px);',
      'align-items:center;justify-content:center;padding:1rem;',
    '}',
    '#fb-overlay.open{display:flex;}',

    '#fb-modal{',
      'background:#141418;border:1px solid #2a2a32;border-radius:12px;',
      'width:100%;max-width:460px;max-height:88vh;overflow-y:auto;',
      'box-shadow:0 24px 60px rgba(0,0,0,0.7);',
    '}',

    '#fb-header{',
      'display:flex;justify-content:space-between;align-items:center;',
      'padding:1rem 1.25rem;border-bottom:1px solid #2a2a32;',
    '}',
    '#fb-header h3{font-family:"Inter",sans-serif;font-size:0.95rem;font-weight:600;color:#e8e8f0;margin:0;}',
    '#fb-header p{font-family:"JetBrains Mono",monospace;font-size:0.65rem;',
      'letter-spacing:0.08em;text-transform:uppercase;color:#00c8ff;margin:0 0 0.15rem;}',
    '#fb-close-btn{',
      'background:#1c1c22;border:1px solid #2a2a32;color:#8888a0;',
      'width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:0.85rem;',
      'display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.15s;',
    '}',
    '#fb-close-btn:hover{border-color:#3a3a48;color:#e8e8f0;}',

    '#fb-tabs{display:flex;border-bottom:1px solid #2a2a32;}',
    '.fb-tab-btn{',
      'flex:1;padding:0.6rem 0.25rem;background:transparent;border:none;',
      'border-bottom:2px solid transparent;font-family:"JetBrains Mono",monospace;',
      'font-size:0.68rem;color:#8888a0;cursor:pointer;transition:all 0.15s;',
    '}',
    '.fb-tab-btn:hover{color:#e8e8f0;}',
    '.fb-tab-btn.active{color:#00c8ff;border-bottom-color:#00c8ff;background:rgba(0,200,255,0.04);}',

    '#fb-body{padding:1.25rem;}',

    '.fb-label{',
      'display:block;font-family:"JetBrains Mono",monospace;',
      'font-size:0.65rem;letter-spacing:0.08em;text-transform:uppercase;',
      'color:#8888a0;margin-bottom:0.3rem;',
    '}',
    '.fb-input,.fb-select,.fb-textarea{',
      'width:100%;background:#1c1c22;border:1px solid #2a2a32;border-radius:6px;',
      'padding:0.5rem 0.7rem;color:#e8e8f0;font-family:"Inter",sans-serif;',
      'font-size:0.85rem;outline:none;transition:border-color 0.15s;',
      'box-sizing:border-box;',
    '}',
    '.fb-input:focus,.fb-select:focus,.fb-textarea:focus{border-color:rgba(0,200,255,0.45);}',
    '.fb-select{cursor:pointer;}',
    '.fb-select option{background:#141418;}',
    '.fb-textarea{resize:vertical;line-height:1.6;}',
    '.fb-field{margin-bottom:0.875rem;}',

    '.fb-context{',
      'background:#1c1c22;border:1px solid #2a2a32;border-radius:6px;',
      'padding:0.5rem 0.75rem;font-family:"JetBrains Mono",monospace;',
      'font-size:0.72rem;color:#8888a0;line-height:1.75;margin-bottom:0.875rem;',
    '}',
    '.fb-context span{color:#00c8ff;}',

    '#fb-submit-row{display:flex;align-items:center;gap:0.75rem;margin-top:1rem;flex-wrap:wrap;}',
    '#fb-submit-btn{',
      'background:#00c8ff;color:#0c0c0e;border:none;border-radius:7px;',
      'padding:0.55rem 1.25rem;font-family:"JetBrains Mono",monospace;',
      'font-size:0.78rem;font-weight:600;cursor:pointer;transition:opacity 0.15s;',
    '}',
    '#fb-submit-btn:hover{opacity:0.85;}',
    '#fb-submit-btn:disabled{opacity:0.5;cursor:not-allowed;}',
    '#fb-status{font-family:"JetBrains Mono",monospace;font-size:0.72rem;color:#8888a0;flex:1;line-height:1.5;}',
    '#fb-footer-note{font-size:0.7rem;color:#555568;margin-top:0.75rem;line-height:1.5;}',
  ].join('');

  // ── Modal HTML ─────────────────────────────────────────────────────────────
  var MODAL_HTML = [
    '<div id="fb-modal">',
      '<div id="fb-header">',
        '<div>',
          '<p>Help improve TempCore</p>',
          '<h3>Send Feedback</h3>',
        '</div>',
        '<button id="fb-close-btn" onclick="window.closeFB()">&#x2715;</button>',
      '</div>',

      '<div id="fb-tabs">',
        '<button class="fb-tab-btn active" id="fbtn-calibrate" onclick="window.switchFBTab(\'calibrate\')">&#x1F4CA; Calibrate</button>',
        '<button class="fb-tab-btn"        id="fbtn-missing"   onclick="window.switchFBTab(\'missing\')">&#x1F527; Missing HW</button>',
        '<button class="fb-tab-btn"        id="fbtn-general"   onclick="window.switchFBTab(\'general\')">&#x1F4A1; Suggestion</button>',
      '</div>',

      '<div id="fb-body">',

        // Tab: Calibrate
        '<div id="fbtab-calibrate">',
          '<p style="font-size:0.82rem;color:#8888a0;line-height:1.6;margin:0 0 0.875rem;">',
            'Your real FPS helps us validate GPU multipliers. Every data point is reviewed.',
          '</p>',
          '<div id="fb-estimate-context" class="fb-context" style="display:none;"></div>',
          '<div class="fb-field">',
            '<label class="fb-label">Your actual FPS *</label>',
            '<input type="number" id="fb-actual-fps" class="fb-input" min="1" max="999" placeholder="e.g. 42">',
          '</div>',
          '<div class="fb-field">',
            '<label class="fb-label">It was</label>',
            '<select id="fb-direction" class="fb-select">',
              '<option value="lower">Lower than TempCore\'s estimate</option>',
              '<option value="higher">Higher than TempCore\'s estimate</option>',
              '<option value="unstable">Unstable / inconsistent</option>',
              '<option value="thermal">Thermal throttling reduced FPS</option>',
              '<option value="cpu_limit">More CPU-limited than expected</option>',
            '</select>',
          '</div>',
          '<div class="fb-field">',
            '<label class="fb-label">Notes <span style="text-transform:none;letter-spacing:0;font-family:\'Inter\',sans-serif;font-weight:400;">(optional — MUX switch state, driver, thermals...)</span></label>',
            '<textarea id="fb-cal-notes" class="fb-textarea" rows="2" placeholder="e.g. MUX was off, temps hit 95°C after 10 min, single-channel RAM..."></textarea>',
          '</div>',
        '</div>',

        // Tab: Missing HW
        '<div id="fbtab-missing" style="display:none;">',
          '<p style="font-size:0.82rem;color:#8888a0;line-height:1.6;margin:0 0 0.875rem;">',
            'Missing a GPU, CPU, or laptop model? We add hardware within 4&#8211;6 weeks of benchmark availability.',
          '</p>',
          '<div class="fb-field">',
            '<label class="fb-label">What\'s missing?</label>',
            '<select id="fb-hw-type" class="fb-select">',
              '<option value="Desktop GPU">Desktop GPU</option>',
              '<option value="Laptop GPU">Laptop GPU</option>',
              '<option value="Desktop CPU">Desktop CPU</option>',
              '<option value="Laptop CPU">Laptop CPU</option>',
              '<option value="Laptop Model">Laptop Model (brand + TGP)</option>',
              '<option value="Game">Game title</option>',
            '</select>',
          '</div>',
          '<div class="fb-field">',
            '<label class="fb-label">Brand &amp; model name *</label>',
            '<input type="text" id="fb-hw-model" class="fb-input" placeholder="e.g. RTX 5070 Ti  /  ASUS TUF A16 2025">',
          '</div>',
          '<div class="fb-field">',
            '<label class="fb-label">Extra info <span style="text-transform:none;letter-spacing:0;font-family:\'Inter\',sans-serif;font-weight:400;">(TGP, TDP, benchmark link...)</span></label>',
            '<textarea id="fb-hw-notes" class="fb-textarea" rows="2" placeholder="e.g. runs at 285W, benchmarks at gamersnexus.net show ~15% above RTX 5070..."></textarea>',
          '</div>',
        '</div>',

        // Tab: General
        '<div id="fbtab-general" style="display:none;">',
          '<p style="font-size:0.82rem;color:#8888a0;line-height:1.6;margin:0 0 0.875rem;">',
            'Bug reports, feature requests, accuracy concerns &#8212; all read personally.',
          '</p>',
          '<div class="fb-field">',
            '<label class="fb-label">Type</label>',
            '<select id="fb-general-type" class="fb-select">',
              '<option value="Bug Report">Bug Report</option>',
              '<option value="Feature Request">Feature Request</option>',
              '<option value="Accuracy Concern">Accuracy Concern</option>',
              '<option value="General Feedback">General Feedback</option>',
            '</select>',
          '</div>',
          '<div class="fb-field">',
            '<label class="fb-label">Message *</label>',
            '<textarea id="fb-general-msg" class="fb-textarea" rows="4" placeholder="Tell us what\'s wrong, what\'s missing, or what you\'d like to see..."></textarea>',
          '</div>',
        '</div>',

        // Submit
        '<div id="fb-submit-row">',
          '<button id="fb-submit-btn" onclick="window.submitFB()">Send Feedback</button>',
          '<span id="fb-status"></span>',
        '</div>',
        '<p id="fb-footer-note">No account needed. Goes directly to the TempCore team. We don\'t share submissions.</p>',

      '</div>',
    '</div>',
  ].join('');

  // ── Inject styles & HTML ────────────────────────────────────────────────────
  function inject() {
    // Styles
    var styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // Floating button
    var btn = document.createElement('button');
    btn.id = 'fb-float';
    btn.innerHTML = '&#x1F4AC; Feedback';
    btn.onclick = function () { window.openFB('general'); };
    document.body.appendChild(btn);

    // Modal overlay
    var overlay = document.createElement('div');
    overlay.id = 'fb-overlay';
    overlay.innerHTML = MODAL_HTML;
    overlay.onclick = function (e) { if (e.target === overlay) window.closeFB(); };
    document.body.appendChild(overlay);
  }

  // ── Public API ──────────────────────────────────────────────────────────────
  window.openFB = function (tab) {
    window.switchFBTab(tab || 'general');

    // Pre-fill calibrate context if estimate data exists
    var contextEl = document.getElementById('fb-estimate-context');
    var est = window.lastEstimate || null;
    if (contextEl) {
      if (est) {
        contextEl.style.display = 'block';
        contextEl.innerHTML =
          est.gpu + ' &nbsp;&bull;&nbsp; ' + est.cpu +
          (est.laptopModel ? ' &nbsp;&bull;&nbsp; ' + est.laptopModel : '') +
          '<br>' + est.game + ' &nbsp;&bull;&nbsp; ' + est.resolution +
          ' ' + est.quality + ' &nbsp;&bull;&nbsp; ' +
          '<span>Est. ' + est.estimatedFPS + ' FPS</span>';
      } else {
        contextEl.style.display = 'none';
      }
    }

    document.getElementById('fb-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeFB = function () {
    document.getElementById('fb-overlay').classList.remove('open');
    document.body.style.overflow = '';
    var statusEl = document.getElementById('fb-status');
    var btn = document.getElementById('fb-submit-btn');
    if (statusEl) statusEl.textContent = '';
    if (btn) { btn.disabled = false; btn.textContent = 'Send Feedback'; }
  };

  window.switchFBTab = function (tab) {
    _tab = tab;
    ['calibrate', 'missing', 'general'].forEach(function (t) {
      var panel = document.getElementById('fbtab-' + t);
      var tbtn  = document.getElementById('fbtn-'  + t);
      if (panel) panel.style.display = (t === tab) ? 'block' : 'none';
      if (tbtn)  tbtn.classList.toggle('active', t === tab);
    });
  };

  window.submitFB = function () {
    var statusEl  = document.getElementById('fb-status');
    var submitBtn = document.getElementById('fb-submit-btn');
    var subject, message;

    statusEl.textContent = '';
    statusEl.style.color = '#8888a0';

    if (_tab === 'calibrate') {
      var actualFPS = (document.getElementById('fb-actual-fps').value || '').trim();
      var direction = document.getElementById('fb-direction').value;
      var notes     = (document.getElementById('fb-cal-notes').value || '').trim();
      var est       = window.lastEstimate || null;

      if (!actualFPS) { statusEl.style.color = '#ff2244'; statusEl.textContent = 'Please enter your actual FPS.'; return; }

      var dirLabel = { lower:'Lower than estimated', higher:'Higher than estimated',
                       unstable:'Unstable / inconsistent', thermal:'Thermal throttling',
                       cpu_limit:'More CPU-limited than expected' }[direction] || direction;

      subject = 'TempCore Calibration' + (est ? ' [' + est.game + ' / ' + est.gpu + ']' : '');
      message = 'FEEDBACK TYPE: FPS Calibration\n' +
                '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
      if (est) {
        message += 'HARDWARE\n' +
          'GPU: ' + est.gpu + '\nCPU: ' + est.cpu + '\nPlatform: ' + est.platform +
          (est.laptopModel ? '\nLaptop: ' + est.laptopModel : '') +
          (est.tgp ? '\nTGP: ' + est.tgp : '') +
          '\nRAM: ' + est.ram + ' ' + est.ramType + '\n\n' +
          'GAME & SETTINGS\nGame: ' + est.game + '\nResolution: ' + est.resolution +
          '\nQuality: ' + est.quality + '\n\n' +
          'ESTIMATE vs REALITY\nTempCore estimate: ' + est.estimatedFPS + ' FPS\n';
      }
      message += 'User actual FPS: ' + actualFPS + '\nDirection: ' + dirLabel +
                 (notes ? '\n\nNOTES\n' + notes : '') +
                 '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSubmitted: ' + new Date().toISOString();

    } else if (_tab === 'missing') {
      var hwType  = document.getElementById('fb-hw-type').value;
      var hwModel = (document.getElementById('fb-hw-model').value || '').trim();
      var hwNotes = (document.getElementById('fb-hw-notes').value || '').trim();
      if (!hwModel) { statusEl.style.color = '#ff2244'; statusEl.textContent = 'Please enter the model name.'; return; }
      subject = 'TempCore Missing HW: ' + hwModel;
      message = 'FEEDBACK TYPE: Missing Hardware\n' +
                '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
                'TYPE: ' + hwType + '\nMODEL: ' + hwModel +
                (hwNotes ? '\n\nINFO\n' + hwNotes : '') +
                '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSubmitted: ' + new Date().toISOString();

    } else {
      var genType = document.getElementById('fb-general-type').value;
      var genMsg  = (document.getElementById('fb-general-msg').value || '').trim();
      if (!genMsg) { statusEl.style.color = '#ff2244'; statusEl.textContent = 'Please write something.'; return; }
      subject = 'TempCore ' + genType;
      message = 'FEEDBACK TYPE: ' + genType + '\n' +
                '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
                genMsg + '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSubmitted: ' + new Date().toISOString();
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ access_key: WEB3FORMS_KEY, subject: subject,
                             from_name: 'TempCore Feedback', message: message, botcheck: false })
    })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (d.success) {
        submitBtn.textContent = 'Sent ✓';
        statusEl.style.color = '#22d47e';
        statusEl.textContent = 'Thanks — every submission is reviewed.';
        setTimeout(window.closeFB, 2800);
      } else {
        throw new Error('API error');
      }
    })
    .catch(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Feedback';
      statusEl.style.color = '#ff2244';
      statusEl.textContent = 'Failed to send. Check connection and try again.';
    });
  };

  // Close on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.closeFB();
  });

  // ── Boot ───────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

})();
