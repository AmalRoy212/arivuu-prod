(function () {
  'use strict';

  window.Arivuu = window.Arivuu || {};

  var ICONS = {
    users:
      '<svg class="icon-xl audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    book:
      '<svg class="icon-xl audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>',
    smile:
      '<svg class="icon-xl audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2M9 9h.01M15 9h.01"/></svg>',
    heart:
      '<svg class="icon-xl audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
    phone:
      '<svg class="icon-xl audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>'
  };

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function getWorkshopsData() {
    return window.ARIVUU_WORKSHOPS || { items: [] };
  }

  function workshopIcon(item) {
    return ICONS[item.icon] || ICONS.users;
  }

  function audienceClass(accent) {
    return accent === 'biolume' ? 'bg-biolume/10 text-biolume' : 'bg-nebula/10 text-nebula';
  }

  function renderCompactCard(item) {
    return (
      '<button type="button" class="workshop-card-compact glass-card glass-card-hover reveal group" data-workshop-id="' +
        escapeHtml(item.id) +
        '" aria-haspopup="dialog" aria-label="View details for ' + escapeHtml(item.title) + '">' +
        '<div class="audience-icon audience-icon-sm workshop-card-compact-icon">' + workshopIcon(item) + '</div>' +
        '<h3 class="workshop-card-compact-title">' + escapeHtml(item.title) + '</h3>' +
      '</button>'
    );
  }

  function findWorkshopById(id) {
    var items = getWorkshopsData().items || [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) return items[i];
    }
    return null;
  }

  function renderWorkshopDetailBody(item) {
    var accent = item.accent === 'biolume' ? 'biolume' : 'nebula';
    return (
      '<div class="workshop-detail-modal">' +
        '<div class="workshop-detail-modal-top">' +
          '<div class="audience-icon audience-icon-md">' + workshopIcon(item) + '</div>' +
          (item.audience
            ? '<span class="text-xs font-medium px-2.5 py-1.5 rounded-full ' + audienceClass(accent) + '">' +
                escapeHtml(item.audience) +
              '</span>'
            : '') +
        '</div>' +
        '<p class="workshop-detail-modal-desc">' + escapeHtml(item.description || '') + '</p>' +
      '</div>'
    );
  }

  function openWorkshopDetail(item) {
    if (!item) return;
    var overlay = document.getElementById('content-modal');
    var titleEl = document.getElementById('content-modal-title');
    var bodyEl = document.getElementById('content-modal-body');
    var panel = overlay && overlay.querySelector('.content-modal-panel');
    if (!overlay || !titleEl || !bodyEl) return;

    titleEl.textContent = item.title || 'Workshop details';
    bodyEl.innerHTML = renderWorkshopDetailBody(item);
    if (panel) panel.classList.add('content-modal-panel--workshop');

    window.Arivuu = window.Arivuu || {};
    window.Arivuu._modalTrigger = document.activeElement;
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    if (window.Arivuu.lockBodyScroll) window.Arivuu.lockBodyScroll();
    else document.body.style.overflow = 'hidden';
  }

  function bindWorkshopCardClicks(root) {
    if (!root) return;
    root.querySelectorAll('[data-workshop-id]').forEach(function (card) {
      if (card.dataset.workshopBound === '1') return;
      card.dataset.workshopBound = '1';
      card.addEventListener('click', function () {
        var item = findWorkshopById(card.getAttribute('data-workshop-id'));
        openWorkshopDetail(item);
      });
    });
  }

  function renderFullCard(item) {
    var accent = item.accent === 'biolume' ? 'biolume' : 'nebula';
    return (
      '<article class="workshop-card-full glass-card glass-card-hover reveal group">' +
        '<div class="workshop-card-full-top">' +
          '<div class="audience-icon audience-icon-md">' + workshopIcon(item) + '</div>' +
          (item.audience
            ? '<span class="text-xs font-medium px-2.5 py-1.5 rounded-full ' + audienceClass(accent) + '">' +
                escapeHtml(item.audience) +
              '</span>'
            : '') +
        '</div>' +
        '<h3 class="workshop-card-full-title">' + escapeHtml(item.title) + '</h3>' +
        '<p class="workshop-card-full-desc">' + escapeHtml(item.description || '') + '</p>' +
      '</article>'
    );
  }

  function renderHomeWorkshopsSection() {
    var data = getWorkshopsData();
    var items = data.items || [];
    var cards = items.map(renderCompactCard).join('');

    return (
      '<section id="workshops-section" class="section-padding bg-surface-deep relative overflow-x-clip">' +
        '<div class="max-w-7xl mx-auto">' +
          '<div class="text-center mb-14 reveal">' +
            '<span class="text-biolume text-xs font-medium tracking-[0.15em] uppercase">' +
              escapeHtml(data.eyebrow || 'Events & Seminars') +
            '</span>' +
            '<h2 class="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-stardust mt-4">' +
              (data.titleHtml || 'Workshops &amp; <span class="gradient-text">Seminars</span>') +
            '</h2>' +
            '<p class="text-muted-text text-sm mt-4 max-w-xl mx-auto">' +
              escapeHtml(data.intro || '') +
            '</p>' +
          '</div>' +
          '<div class="workshop-card-compact-grid">' + cards + '</div>' +
          '<div class="workshop-view-all-wrap reveal">' +
            '<a href="#/workshops" class="pill-button workshop-view-all-btn">View all</a>' +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function renderSubjectOptions(items, selected) {
    return (items || [])
      .map(function (item) {
        var title = item.title || '';
        var isSelected = selected && selected === title ? ' selected' : '';
        return '<option value="' + escapeHtml(title) + '"' + isSelected + '>' + escapeHtml(title) + '</option>';
      })
      .join('');
  }

  function renderWorkshopsContactForm(data) {
    var items = data.items || [];
    var inputClass =
      'w-full px-4 py-3 rounded-xl border border-nebula/25 bg-white text-sm text-stardust placeholder:text-muted-text focus:outline-none focus:border-nebula/50 focus:ring-2 focus:ring-nebula/15';
    var labelClass = 'block text-xs font-medium text-muted-text mb-1.5';

    return (
      '<section class="section-padding !pt-4 bg-void" aria-labelledby="workshops-contact-title">' +
        '<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-16">' +
          '<div class="text-center mb-8">' +
            '<h2 id="workshops-contact-title" class="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-stardust">Enquire about a <span class="gradient-text">workshop</span></h2>' +
            '<p class="text-muted-text text-sm mt-3">' +
              escapeHtml(data.contactIntro || '') +
            '</p>' +
          '</div>' +
          '<form id="contact-form" class="glass-card p-6 sm:p-8 space-y-5" novalidate>' +
            '<div class="grid sm:grid-cols-2 gap-5">' +
              '<div>' +
                '<label for="contact-name" class="' + labelClass + '">Full name</label>' +
                '<input id="contact-name" name="name" type="text" required class="' + inputClass + '" placeholder="Your name" autocomplete="name" />' +
              '</div>' +
              '<div>' +
                '<label for="contact-email-input" class="' + labelClass + '">Email</label>' +
                '<input id="contact-email-input" name="email" type="email" required class="' + inputClass + '" placeholder="you@example.com" autocomplete="email" inputmode="email" />' +
              '</div>' +
              '<div class="sm:col-span-2">' +
                '<label for="contact-phone-input" class="' + labelClass + '">Mobile number</label>' +
                '<input id="contact-phone-input" name="phone" type="tel" required class="' + inputClass + '" placeholder="+91 98765 43210" autocomplete="tel" inputmode="tel" />' +
              '</div>' +
            '</div>' +
            '<div>' +
              '<label for="contact-subject" class="' + labelClass + '">I\'m enquiring about</label>' +
              '<select id="contact-subject" name="subject" class="' + inputClass + '">' +
                renderSubjectOptions(items) +
              '</select>' +
            '</div>' +
            '<div>' +
              '<label for="contact-message" class="' + labelClass + '">Message</label>' +
              '<textarea id="contact-message" name="message" rows="5" required class="' + inputClass + ' resize-y" placeholder="Tell us how we can help..."></textarea>' +
            '</div>' +
            '<div id="contact-form-status" class="hidden text-sm rounded-xl px-4 py-3" role="status"></div>' +
            '<button type="submit" class="w-full sm:w-auto px-8 py-3 rounded-full bg-nebula text-white text-sm font-medium hover:bg-nebula/80 transition-all duration-300 shadow-accent-md">Send message</button>' +
          '</form>' +
        '</div>' +
      '</section>'
    );
  }

  function renderWorkshopsPage() {
    var data = getWorkshopsData();
    var items = data.items || [];
    var cards = items.map(renderFullCard).join('');
    var heroDecor = window.Arivuu.renderPageHeroDecor ? window.Arivuu.renderPageHeroDecor() : '';

    return (
      '<header class="page-hero bg-surface-deep border-b border-nebula/10" data-hero-decor="1">' +
        heroDecor +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-10 sm:py-16 relative">' +
          '<nav class="page-breadcrumbs mb-6" aria-label="Breadcrumb">' +
            '<a href="#/">Home</a><span>/</span>' +
            '<span class="page-breadcrumbs-current">Workshops &amp; Seminars</span>' +
          '</nav>' +
          '<span class="text-biolume text-xs font-medium tracking-[0.15em] uppercase">' +
            escapeHtml(data.pageEyebrow || data.eyebrow || 'Events & Seminars') +
          '</span>' +
          '<h1 class="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-stardust mt-3 leading-tight">' +
            (data.pageTitleHtml || data.titleHtml || 'Workshops &amp; <span class="gradient-text">Seminars</span>') +
          '</h1>' +
          '<p class="text-muted-text text-sm sm:text-base mt-4 max-w-2xl leading-relaxed">' +
            escapeHtml(data.pageIntro || data.intro || '') +
          '</p>' +
        '</div>' +
      '</header>' +

      '<section class="section-padding bg-void" aria-labelledby="workshops-list-title">' +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">' +
          '<h2 id="workshops-list-title" class="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-stardust text-center mb-10">Our <span class="gradient-text">Workshops</span></h2>' +
          '<div class="workshop-card-full-grid">' + cards + '</div>' +
        '</div>' +
      '</section>' +

      renderWorkshopsContactForm(data)
    );
  }

  function mountHomeWorkshops() {
    var mount = document.getElementById('workshops-mount');
    if (!mount) return;

    var hasInteractiveCards = !!mount.querySelector('[data-workshop-id]');
    if (!(mount.dataset.mounted === '1' && mount.querySelector('#workshops-section') && hasInteractiveCards)) {
      mount.innerHTML = renderHomeWorkshopsSection();
      mount.dataset.mounted = '1';
    }

    // Section often mounts after scroll-reveal init (e.g. institution/guide).
    // Without .show, .reveal stays opacity:0 but still occupies layout — huge empty gap.
    mount.querySelectorAll('.reveal, .reveal-x-left, .reveal-x-right').forEach(function (el) {
      el.classList.add('show');
    });

    bindWorkshopCardClicks(mount);
  }

  function renderWorkshopsPageIntoMount() {
    var mount = document.getElementById('workshops-page-mount');
    if (!mount) return;

    mount.innerHTML = renderWorkshopsPage();

    mount.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('show');
    });

    if (window.Arivuu.bindContactForm) {
      window.Arivuu.bindContactForm(
        document.getElementById('contact-form'),
        document.getElementById('contact-form-status')
      );
    }

    if (window.Arivuu.initMain) window.Arivuu.initMain('workshops');
    if (window.Arivuu.lockPageScrollTop) window.Arivuu.lockPageScrollTop();

    if (window.Arivuu.setPageSEO) {
      window.Arivuu.setPageSEO('/workshops', {
        title: 'Workshops & Seminars | Arivuu',
        description:
          'Explore Arivuu career guidance workshops and seminars for students, parents, and educators — then enquire about the session that fits your needs.'
      });
    }
  }

  window.Arivuu.initWorkshops = function (page) {
    if (page === 'workshops') {
      renderWorkshopsPageIntoMount();
      return;
    }
    mountHomeWorkshops();
  };

  window.Arivuu.renderHomeWorkshopsSection = renderHomeWorkshopsSection;
  window.Arivuu.mountHomeWorkshops = mountHomeWorkshops;
})();
