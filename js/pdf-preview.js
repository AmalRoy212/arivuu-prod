(function () {
  'use strict';

  window.Arivuu = window.Arivuu || {};

  function getModal() {
    return document.getElementById('pdf-preview-modal');
  }

  function getFrame() {
    return document.getElementById('pdf-preview-frame');
  }

  function pdfViewUrl(url) {
    if (!url) return 'about:blank';
    var hash = 'toolbar=0&navpanes=0&scrollbar=1&view=FitH';
    return url.indexOf('#') === -1 ? url + '#' + hash : url + '&' + hash;
  }

  function closePdfPreview() {
    var modal = getModal();
    var frame = getFrame();
    if (!modal) return;

    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (frame) {
      frame.src = 'about:blank';
    }

    document.removeEventListener('keydown', onModalKeydown, true);
  }

  function openPdfPreview(url, title) {
    var modal = getModal();
    var frame = getFrame();
    var titleEl = document.getElementById('pdf-preview-title');
    if (!modal || !frame) return;

    if (titleEl) titleEl.textContent = title || 'Sample report';
    protectPdfFrame(frame);
    frame.src = pdfViewUrl(url);
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onModalKeydown, true);
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

    frame.addEventListener(
      'contextmenu',
      function (e) {
        e.preventDefault();
      }
    );

    frame.addEventListener(
      'load',
      function () {
        try {
          var doc = frame.contentDocument || (frame.contentWindow && frame.contentWindow.document);
          protectPdfDocument(doc);
        } catch (err) {
          /* Cross-origin PDF viewer — parent handlers still apply */
        }
      }
    );
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
      var modal = getModal();
      if (modal && !modal.classList.contains('hidden')) {
        closePdfPreview();
      }
    });

    var body = document.getElementById('pdf-preview-body');
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
