/**
 * Screen layout profile: mac (taller / 16:10) vs windows (shorter / 16:9).
 * Sets html[data-layout="mac"|"windows"]. Mac keeps default styles.
 * DEV_MODE: optional override via localStorage + navbar toggle.
 */
(function () {
  'use strict';

  window.Arivuu = window.Arivuu || {};

  var STORAGE_KEY = 'arivuu-layout-profile';
  var LAYOUTS = { mac: 'mac', windows: 'windows' };

  function envFlag(key) {
    var env = window.ARIVUU_ENV || {};
    var v = env[key];
    return v === true || v === 'true';
  }

  function isLocalHost() {
    var host = window.location.hostname || '';
    return host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
  }

  /** Toggle / overrides only on local + DEV_MODE — never on Vercel/production. */
  function isDevMode() {
    return envFlag('DEV_MODE') && isLocalHost();
  }

  function readOverride() {
    if (!isDevMode()) return null;
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      if (v === LAYOUTS.mac || v === LAYOUTS.windows) return v;
    } catch (e) {}
    return null;
  }

  function writeOverride(layout) {
    try {
      if (!layout) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, layout);
    } catch (e) {}
  }

  /** Detect OS + viewport ratio. Windows / short 16:9 → windows; else mac. */
  function detectLayout() {
    var ua = navigator.userAgent || '';
    var platform = navigator.platform || '';
    var isWindows = /Win/i.test(platform) || /Windows NT/i.test(ua);
    var isMacOS = /Mac/i.test(platform) && !/iPhone|iPad|iPod/i.test(ua);

    var w = window.innerWidth || 0;
    var h = window.innerHeight || 0;
    var ratio = w / Math.max(h, 1);

    // Phones/tablets: keep default (mac) responsive stack
    if (w < 1024) return LAYOUTS.mac;

    // Short-wide laptop ratio (~16:9 and below ~920px tall) → windows fit
    var isShortWide = ratio >= 1.68 && h <= 920;

    if (isWindows) return LAYOUTS.windows;
    if (isMacOS) return isShortWide ? LAYOUTS.windows : LAYOUTS.mac;
    return isShortWide ? LAYOUTS.windows : LAYOUTS.mac;
  }

  function applyLayout(layout, meta) {
    var next = layout === LAYOUTS.windows ? LAYOUTS.windows : LAYOUTS.mac;
    var root = document.documentElement;
    root.setAttribute('data-layout', next);
    root.setAttribute('data-layout-source', (meta && meta.source) || 'auto');
    window.Arivuu.layoutProfile = next;
    window.dispatchEvent(new CustomEvent('arivuu:layout-change', {
      detail: { layout: next, source: (meta && meta.source) || 'auto' }
    }));
    syncToggleButton();
  }

  function resolveAndApply(source) {
    var override = readOverride();
    if (override) {
      applyLayout(override, { source: 'override' });
      return override;
    }
    var detected = detectLayout();
    applyLayout(detected, { source: source || 'auto' });
    return detected;
  }

  function setLayout(layout) {
    if (layout !== LAYOUTS.mac && layout !== LAYOUTS.windows) return;
    if (isDevMode()) writeOverride(layout);
    applyLayout(layout, { source: isDevMode() ? 'override' : 'manual' });
  }

  function toggleLayout() {
    var current = document.documentElement.getAttribute('data-layout') || LAYOUTS.mac;
    setLayout(current === LAYOUTS.windows ? LAYOUTS.mac : LAYOUTS.windows);
  }

  function clearOverride() {
    writeOverride(null);
    resolveAndApply('auto');
  }

  function syncToggleButton() {
    var btn = document.getElementById('layout-profile-toggle');
    if (!btn) return;
    var layout = document.documentElement.getAttribute('data-layout') || LAYOUTS.mac;
    var label = layout === LAYOUTS.windows ? 'Windows' : 'Mac';
    btn.setAttribute('data-layout-active', layout);
    btn.setAttribute('aria-label', 'Layout profile: ' + label + ' (click to switch)');
    btn.title = 'Layout: ' + label + ' — click to switch (DEV)';
    var text = btn.querySelector('[data-layout-label]');
    if (text) text.textContent = label;
  }

  function renderToggleHtml() {
    if (!isDevMode()) return '';
    var layout = document.documentElement.getAttribute('data-layout') || LAYOUTS.mac;
    var label = layout === LAYOUTS.windows ? 'Windows' : 'Mac';
    return (
      '<button type="button" id="layout-profile-toggle" class="layout-profile-toggle" ' +
        'data-layout-active="' + label.toLowerCase() + '" ' +
        'aria-label="Layout profile: ' + label + ' (click to switch)" ' +
        'title="Layout: ' + label + ' — click to switch (DEV)">' +
        '<span class="layout-profile-toggle-prefix">Layout</span>' +
        '<span data-layout-label>' + label + '</span>' +
      '</button>'
    );
  }

  function bindToggle() {
    var btn = document.getElementById('layout-profile-toggle');
    if (!btn || btn.getAttribute('data-bound') === '1') return;
    btn.setAttribute('data-bound', '1');
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      toggleLayout();
    });
    syncToggleButton();
  }

  // Apply ASAP (script may run in <head>)
  resolveAndApply('boot');

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    if (readOverride()) {
      syncToggleButton();
      return;
    }
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resolveAndApply('resize');
    }, 120);
  });

  window.Arivuu.layoutProfiles = LAYOUTS;
  window.Arivuu.detectLayoutProfile = detectLayout;
  window.Arivuu.getLayoutProfile = function () {
    return document.documentElement.getAttribute('data-layout') || LAYOUTS.mac;
  };
  window.Arivuu.setLayoutProfile = setLayout;
  window.Arivuu.toggleLayoutProfile = toggleLayout;
  window.Arivuu.clearLayoutProfileOverride = clearOverride;
  window.Arivuu.isLayoutDevMode = isDevMode;
  window.Arivuu.renderLayoutToggle = renderToggleHtml;
  window.Arivuu.bindLayoutToggle = bindToggle;
  window.Arivuu.syncLayoutToggle = syncToggleButton;
})();
