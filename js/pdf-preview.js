(function () {
  'use strict';

  window.Arivuu = window.Arivuu || {};

  var PDFJS_VERSION = '3.11.174';
  var PDFJS_CDN = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@' + PDFJS_VERSION + '/build/';
  var pdfJsLoadPromise = null;
  var activeRenderToken = 0;
  var activePdfDoc = null;

  function getModal() {
    return document.getElementById('pdf-preview-modal');
  }

  function getFrame() {
    return document.getElementById('pdf-preview-frame');
  }

  function getPages() {
    return document.getElementById('pdf-preview-pages');
  }

  function getBody() {
    return document.getElementById('pdf-preview-body');
  }

  function loadPdfJs() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (pdfJsLoadPromise) return pdfJsLoadPromise;

    pdfJsLoadPromise = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = PDFJS_CDN + 'pdf.min.js';
      script.async = true;
      script.onload = function () {
        if (!window.pdfjsLib) {
          reject(new Error('pdf.js failed to initialize'));
          return;
        }
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_CDN + 'pdf.worker.min.js';
        resolve(window.pdfjsLib);
      };
      script.onerror = function () {
        pdfJsLoadPromise = null;
        reject(new Error('Failed to load pdf.js'));
      };
      document.head.appendChild(script);
    });

    return pdfJsLoadPromise;
  }

  function setLoadingState(message) {
    var pages = getPages();
    if (!pages) return;
    pages.innerHTML =
      '<div class="pdf-preview-status" role="status">' +
      (message || 'Loading preview…') +
      '</div>';
  }

  function setErrorState(message) {
    var pages = getPages();
    if (!pages) return;
    pages.innerHTML =
      '<div class="pdf-preview-status pdf-preview-status-error" role="alert">' +
      (message || 'Unable to load this preview on your device.') +
      '</div>';
  }

  function destroyActivePdf() {
    activeRenderToken += 1;
    if (activePdfDoc) {
      try {
        activePdfDoc.destroy();
      } catch (err) {
        /* ignore */
      }
      activePdfDoc = null;
    }
  }

  function closePdfPreview() {
    var modal = getModal();
    var frame = getFrame();
    var pages = getPages();
    var body = getBody();
    if (!modal) return;

    destroyActivePdf();

    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    if (window.Arivuu.unlockBodyScroll) window.Arivuu.unlockBodyScroll();
    else document.body.style.overflow = '';

    if (frame) {
      frame.src = 'about:blank';
      frame.classList.add('hidden');
    }
    if (pages) {
      pages.innerHTML = '';
      pages.classList.remove('hidden');
    }
    if (body) body.scrollTop = 0;

    document.removeEventListener('keydown', onModalKeydown, true);
  }

  function pageScaleForWidth(page, width) {
    var viewport = page.getViewport({ scale: 1 });
    if (!viewport.width) return 1;
    return Math.max(0.5, width / viewport.width);
  }

  function renderPage(pdf, pageNumber, container, token, cssWidth) {
    return pdf.getPage(pageNumber).then(function (page) {
      if (token !== activeRenderToken) return null;

      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var scale = pageScaleForWidth(page, cssWidth);
      var viewport = page.getViewport({ scale: scale });
      var outputScale = dpr;

      var wrap = document.createElement('div');
      wrap.className = 'pdf-preview-page';
      wrap.setAttribute('data-page', String(pageNumber));

      var canvas = document.createElement('canvas');
      canvas.className = 'pdf-preview-page-canvas';
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = Math.floor(viewport.width) + 'px';
      canvas.style.height = Math.floor(viewport.height) + 'px';

      var ctx = canvas.getContext('2d', { alpha: false });
      var transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

      wrap.appendChild(canvas);
      container.appendChild(wrap);

      return page
        .render({
          canvasContext: ctx,
          viewport: viewport,
          transform: transform
        })
        .promise.then(function () {
          if (token !== activeRenderToken) {
            wrap.remove();
            return null;
          }
          return wrap;
        });
    });
  }

  function renderPdfIntoPages(url, token) {
    var pages = getPages();
    var body = getBody();
    if (!pages || !body) return Promise.resolve();

    setLoadingState('Loading preview…');

    return loadPdfJs().then(function (pdfjsLib) {
      if (token !== activeRenderToken) return null;

      return pdfjsLib.getDocument({ url: url, withCredentials: false }).promise.then(function (pdf) {
        if (token !== activeRenderToken) {
          pdf.destroy();
          return null;
        }

        activePdfDoc = pdf;
        pages.innerHTML = '';

        var cssWidth = Math.max(280, Math.floor(body.clientWidth || pages.clientWidth || window.innerWidth) - 8);
        var chain = Promise.resolve();

        for (var i = 1; i <= pdf.numPages; i += 1) {
          (function (pageNumber) {
            chain = chain.then(function () {
              if (token !== activeRenderToken) return null;
              return renderPage(pdf, pageNumber, pages, token, cssWidth);
            });
          })(i);
        }

        return chain;
      });
    });
  }

  function openPdfPreview(url, title) {
    var modal = getModal();
    var frame = getFrame();
    var pages = getPages();
    var body = getBody();
    var titleEl = document.getElementById('pdf-preview-title');
    if (!modal || !url) return;

    destroyActivePdf();
    var token = activeRenderToken;

    if (titleEl) titleEl.textContent = title || 'Sample report';
    if (body) body.scrollTop = 0;

    /* Always canvas-render in the modal — native PDF iframes blank after page 1 on phones */
    if (frame) {
      frame.src = 'about:blank';
      frame.classList.add('hidden');
    }
    if (pages) pages.classList.remove('hidden');

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    if (window.Arivuu.lockBodyScroll) window.Arivuu.lockBodyScroll();
    else document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onModalKeydown, true);

    protectPdfFrame(frame);

    renderPdfIntoPages(url, token).catch(function () {
      if (token !== activeRenderToken) return;
      setErrorState('Unable to load this preview. Try again, or use Download for the full PDF.');
    });
  }

  function isModalOpen() {
    var modal = getModal();
    return modal && !modal.classList.contains('hidden');
  }

  function blockSaveShortcut(e) {
    if (!(e.metaKey || e.ctrlKey)) return;
    var key = String(e.key || '').toLowerCase();
    if (key === 's' || key === 'p') {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function onModalKeydown(e) {
    if (!isModalOpen()) return;
    blockSaveShortcut(e);
  }

  function protectPdfDocument(doc) {
    if (!doc || doc.__arivuuPdfProtected) return;
    doc.__arivuuPdfProtected = true;

    doc.addEventListener(
      'contextmenu',
      function (e) {
        e.preventDefault();
      },
      true
    );

    doc.addEventListener(
      'keydown',
      function (e) {
        blockSaveShortcut(e);
      },
      true
    );
  }

  function protectPdfFrame(frame) {
    if (!frame || frame.dataset.pdfProtected === '1') return;
    frame.dataset.pdfProtected = '1';

    frame.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });

    frame.addEventListener('load', function () {
      try {
        var doc = frame.contentDocument || (frame.contentWindow && frame.contentWindow.document);
        protectPdfDocument(doc);
      } catch (err) {
        /* Cross-origin PDF viewer — parent handlers still apply */
      }
    });
  }

  function bindPdfPreviewModal() {
    if (document.body.dataset.pdfPreviewBound === '1') return;
    document.body.dataset.pdfPreviewBound = '1';

    var modal = getModal();
    var frame = getFrame();
    protectPdfFrame(frame);

    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-close-pdf-preview]')) {
        e.preventDefault();
        closePdfPreview();
        return;
      }

      var trigger = e.target.closest('[data-open-pdf-preview]');
      if (!trigger) return;

      e.preventDefault();
      openPdfPreview(trigger.getAttribute('data-pdf-url'), trigger.getAttribute('data-pdf-title'));
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var openModal = getModal();
      if (openModal && !openModal.classList.contains('hidden')) {
        closePdfPreview();
      }
    });

    var body = getBody();
    if (body) {
      body.addEventListener('contextmenu', function (e) {
        e.preventDefault();
      });

      body.addEventListener('mousedown', function (e) {
        if (e.button === 2) e.preventDefault();
      });
    }

    if (modal) {
      modal.addEventListener('contextmenu', function (e) {
        if (isModalOpen()) e.preventDefault();
      });
    }
  }

  window.Arivuu.openPdfPreview = openPdfPreview;
  window.Arivuu.closePdfPreview = closePdfPreview;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindPdfPreviewModal);
  } else {
    bindPdfPreviewModal();
  }
})();
