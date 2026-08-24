/**
 * On Windows desktops, shrink the page ~like one Ctrl+− (browser zoom 90%).
 * Mac / mobile keep 100%.
 */
(function () {
  'use strict';

  var WINDOWS_ZOOM = '0.9'; // one Ctrl+− step in Chrome/Edge

  function detectOS() {
    var uaData = navigator.userAgentData;
    if (uaData && typeof uaData.platform === 'string' && uaData.platform) {
      var p = uaData.platform.toLowerCase();
      if (p.indexOf('win') !== -1) return 'windows';
      if (p.indexOf('mac') !== -1) return 'mac';
      if (uaData.mobile) return 'mobile';
      return p || 'other';
    }

    var ua = navigator.userAgent || '';
    var platform = navigator.platform || '';
    var isIPad = /iPad/i.test(ua) || (/Mac/i.test(platform) && navigator.maxTouchPoints > 1);
    if (isIPad || /iPhone|iPod|Android|Mobile/i.test(ua)) return 'mobile';
    if (/Win/i.test(platform) || /Windows NT/i.test(ua)) return 'windows';
    if (/Mac/i.test(platform) || /Macintosh/i.test(ua)) return 'mac';
    if (/Linux/i.test(platform)) return 'linux';
    return 'other';
  }

  function screenInfo() {
    return {
      screen: (screen.width || 0) + 'x' + (screen.height || 0),
      viewport: (window.innerWidth || 0) + 'x' + (window.innerHeight || 0),
      dpr: window.devicePixelRatio || 1
    };
  }

  function apply() {
    var os = detectOS();
    var size = screenInfo();
    var root = document.documentElement;

    console.log('[Arivuu] OS:', os);
    console.log('[Arivuu] Screen:', size.screen, '| Viewport:', size.viewport, '| DPR:', size.dpr);

    if (os === 'windows') {
      root.style.zoom = WINDOWS_ZOOM;
      root.setAttribute('data-os', 'windows');
      root.setAttribute('data-os-zoom', WINDOWS_ZOOM);
      console.log('[Arivuu] Applied Windows zoom:', WINDOWS_ZOOM, '(like Ctrl+−)');
    } else {
      root.style.zoom = '';
      root.setAttribute('data-os', os);
      root.removeAttribute('data-os-zoom');
    }

    window.Arivuu = window.Arivuu || {};
    window.Arivuu.detectedOS = os;
    window.Arivuu.screenInfo = size;
  }

  apply();
})();
