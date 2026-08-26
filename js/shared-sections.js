(function () {
  'use strict';

  window.Arivuu = window.Arivuu || {};

  var CARD_ICONS = {
    chart:
      '<svg class="flip-card-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>',
    compass:
      '<svg class="flip-card-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
    users:
      '<svg class="flip-card-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
  };

  var ECOSYSTEM_ICONS = {
    compass:
      '<svg class="service-feature-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
    chart:
      '<svg class="service-feature-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>',
    'user-check':
      '<svg class="service-feature-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>',
    briefcase:
      '<svg class="service-feature-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    activity:
      '<svg class="service-feature-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>',
    navigation:
      '<svg class="service-feature-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>',
    calendar:
      '<svg class="service-feature-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
    award:
      '<svg class="service-feature-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>'
  };

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  window.Arivuu.renderSheetDataError = function (options) {
    options = options || {};
    var retryId = options.retryId ? String(options.retryId) : '';
    var retryBtn = retryId
      ? '<button type="button" id="' + escapeHtml(retryId) + '" class="pill-button text-xs">Try again</button>'
      : '';
    var fullWidth = options.fullWidth ? ' sheet-data-error--full' : '';

    return (
      '<div class="sheet-data-error' + fullWidth + '">' +
        '<p>Couldn\'t load data at the moment. Please try again later.</p>' +
        retryBtn +
      '</div>'
    );
  };

  function renderFeatureSegments(segments) {
    return (segments || [])
      .map(function (part) {
        if (part.bold) {
          return '<strong class="text-stardust font-semibold">' + escapeHtml(part.text) + '</strong>';
        }
        return escapeHtml(part.text);
      })
      .join('');
  }

  function ecosystemCardTitle(title) {
    return String(title || '').replace(/\s*:\s*$/, '');
  }

  function renderCareerEcosystemCard(card, index) {
    var icon = ECOSYSTEM_ICONS[card.icon] || ECOSYSTEM_ICONS.compass;
    var title = ecosystemCardTitle(card.title);

    return (
      '<button type="button" class="career-ecosystem-card" data-ecosystem-card="' + index + '" aria-haspopup="dialog">' +
        '<span class="career-ecosystem-card-icon audience-icon audience-icon-sm">' + icon + '</span>' +
        '<span class="career-ecosystem-card-title">' + escapeHtml(title) + '</span>' +
        '<span class="career-ecosystem-card-num" aria-hidden="true">' + escapeHtml(String(card.num)) + '</span>' +
      '</button>'
    );
  }

  function renderCareerEcosystemFullCard(card) {
    var icon = ECOSYSTEM_ICONS[card.icon] || ECOSYSTEM_ICONS.compass;
    var title = ecosystemCardTitle(card.title);
    var body = card.segments
      ? renderFeatureSegments(card.segments)
      : escapeHtml(card.text || '');

    return (
      '<article class="service-feature-card">' +
        '<div class="service-feature-icon-wrap audience-icon audience-icon-md">' + icon + '</div>' +
        '<div class="service-feature-num" aria-hidden="true">' + escapeHtml(String(card.num)) + '</div>' +
        '<h3 class="service-feature-title">' + escapeHtml(title) + '</h3>' +
        '<p class="service-feature-text">' + body + '</p>' +
      '</article>'
    );
  }

  function openCareerEcosystemModal(card, trigger) {
    var overlay = document.getElementById('content-modal');
    var titleEl = document.getElementById('content-modal-title');
    var bodyEl = document.getElementById('content-modal-body');
    if (!overlay || !titleEl || !bodyEl || !card) return;

    var icon = ECOSYSTEM_ICONS[card.icon] || ECOSYSTEM_ICONS.compass;
    var title = ecosystemCardTitle(card.title);
    var body = card.segments
      ? renderFeatureSegments(card.segments)
      : escapeHtml(card.text || '');

    titleEl.textContent = title;
    bodyEl.innerHTML =
      '<div class="career-ecosystem-modal">' +
        '<div class="career-ecosystem-modal-top">' +
          '<div class="career-ecosystem-modal-icon audience-icon audience-icon-md">' + icon + '</div>' +
          '<span class="career-ecosystem-modal-num">' + escapeHtml(String(card.num)) + '</span>' +
        '</div>' +
        '<p class="career-ecosystem-modal-text">' + body + '</p>' +
      '</div>';

    window.Arivuu._modalTrigger = trigger || null;
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    if (window.Arivuu.lockBodyScroll) window.Arivuu.lockBodyScroll();
    else document.body.style.overflow = 'hidden';
  }

  function renderTakeTestButton() {
    return (
      '<div class="student-guide-cta-wrap">' +
        '<a href="https://growthpath.arivuu.com/" target="_blank" rel="noopener noreferrer" class="btn-premium btn-premium--test">' +
          '<span>Take a test</span>' +
          '<span class="btn-premium-icon btn-premium-icon--test" aria-hidden="true">' +
            '<svg class="btn-premium-clipboard" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
              '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>' +
              '<path class="btn-premium-check" d="m9 14 2 2 4-4"/>' +
            '</svg>' +
          '</span>' +
        '</a>' +
      '</div>'
    );
  }

  function bindCareerEcosystemSection() {
    if (document.documentElement.dataset.ecosystemClickBound === '1') return;
    document.documentElement.dataset.ecosystemClickBound = '1';

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-ecosystem-card]');
      if (!btn) return;

      var section = btn.closest('#career-ecosystem');
      if (!section || section.getAttribute('data-ecosystem-variant') === 'full') return;

      var cards =
        (window.ARIVUU_AUDIENCE_SERVICES &&
          window.ARIVUU_AUDIENCE_SERVICES.careerEcosystemSection &&
          window.ARIVUU_AUDIENCE_SERVICES.careerEcosystemSection.cards) ||
        [];
      var index = parseInt(btn.getAttribute('data-ecosystem-card'), 10);
      if (!isNaN(index) && cards[index]) openCareerEcosystemModal(cards[index], btn);
    });
  }

  function renderCareerEcosystemSection(options) {
    options = options || {};
    var audienceData = window.ARIVUU_AUDIENCE_SERVICES;
    var section = audienceData && audienceData.careerEcosystemSection;
    if (!section || !section.cards || !section.cards.length) return '';

    var useFullCards = options.variant === 'full';
    var cards = useFullCards
      ? section.cards.map(renderCareerEcosystemFullCard).join('')
      : section.cards.map(renderCareerEcosystemCard).join('');
    var gridClass = useFullCards ? 'service-features-grid' : 'career-ecosystem-grid';
    var afterCardsHtml = options.afterCardsHtml || '';

    return (
      '<section id="career-ecosystem" class="service-section career-ecosystem-section bg-void" aria-labelledby="career-ecosystem-title"' +
        (useFullCards ? ' data-ecosystem-variant="full"' : '') + '>' +
        '<div class="career-ecosystem-glow" aria-hidden="true"></div>' +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 relative">' +
          '<div class="career-ecosystem-header">' +
            '<h2 id="career-ecosystem-title" class="career-ecosystem-title font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-stardust">' +
              (section.headingHtml || escapeHtml(section.heading)) +
            '</h2>' +
            '<p class="career-ecosystem-intro">' + escapeHtml(section.intro) + '</p>' +
          '</div>' +
          '<div class="' + gridClass + '">' + cards + '</div>' +
          afterCardsHtml +
        '</div>' +
      '</section>'
    );
  }

  function mountHomePdfAndEcosystem() {
    var pdfMount = document.getElementById('pdf-sample-mount');
    if (pdfMount && !pdfMount.dataset.mounted) {
      var pdfMeta = window.ARIVUU_STUDENT_GUIDE && window.ARIVUU_STUDENT_GUIDE.pdfSection;
      if (window.Arivuu.renderPdfSampleSection && pdfMeta) {
        pdfMount.innerHTML = window.Arivuu.renderPdfSampleSection(pdfMeta);
        pdfMount.dataset.mounted = '1';
        if (window.Arivuu.bindPdfSampleSection) window.Arivuu.bindPdfSampleSection();
      }
    }

    var ecoMount = document.getElementById('career-ecosystem-mount');
    if (ecoMount) {
      if (!ecoMount.dataset.mounted || !ecoMount.querySelector('#career-ecosystem')) {
        ecoMount.innerHTML = renderCareerEcosystemSection({
          afterCardsHtml: renderTakeTestButton()
        });
        ecoMount.dataset.mounted = '1';
      }
      bindCareerEcosystemSection();
    }
  }

  function renderFeatureBar(items) {
    items = items || (window.ARIVUU_STUDENT_GUIDE && window.ARIVUU_STUDENT_GUIDE.featureBar) || [];
    var cells = items
      .map(function (item) {
        return '<div class="feature-highlights-item"><span>' + escapeHtml(item) + '</span></div>';
      })
      .join('');

    return (
      '<section class="feature-highlights-bar bg-surface-deep" aria-label="Key features">' +
        '<div class="feature-highlights-track">' + cells + '</div>' +
      '</section>'
    );
  }

  function renderFAQSection(options) {
    var data = window.ARIVUU_FAQ;
    if (!data) return '';
    options = options || {};
    var showJourneyCta = options.showJourneyCta === true;

    var items = (data.items || [])
      .map(function (item, index) {
        var answerHtml;
        if (item.isList) {
          answerHtml =
            '<ul class="faq-answer-list">' +
            item.answer
              .map(function (line) {
                return '<li>' + escapeHtml(line) + '</li>';
              })
              .join('') +
            '</ul>';
        } else {
          answerHtml = item.answer
            .map(function (para) {
              return '<p>' + escapeHtml(para) + '</p>';
            })
            .join('');
        }

        var indexLabel = String(index + 1).padStart(2, '0');

        return (
          '<div class="faq-item">' +
            '<button type="button" class="faq-question" aria-expanded="false" aria-controls="faq-answer-' + index + '" id="faq-question-' + index + '">' +
              '<span class="faq-index" aria-hidden="true">' + indexLabel + '</span>' +
              '<span class="faq-question-text">' + escapeHtml(item.question) + '</span>' +
              '<span class="faq-chevron" aria-hidden="true">' +
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>' +
              '</span>' +
            '</button>' +
            '<div class="faq-answer" id="faq-answer-' + index + '" role="region" aria-labelledby="faq-question-' + index + '" aria-hidden="true">' +
              '<div class="faq-answer-inner">' + answerHtml + '</div>' +
            '</div>' +
          '</div>'
        );
      })
      .join('');

    var eyebrow = data.eyebrow ? escapeHtml(data.eyebrow) : 'FAQ';
    var site = window.ARIVUU_SITE || {};
    var brand = site.name || 'Arivuu';
    var statsStudents = (site.stats && site.stats.students) || '55,000+';
    var journeyCta = showJourneyCta
      ? '<div class="faq-journey-cta glass-card">' +
          '<div class="faq-journey-cta-copy">' +
            '<h3 class="faq-journey-cta-title">Ready to Start Your Journey?</h3>' +
            '<p class="faq-journey-cta-text">Join ' + escapeHtml(statsStudents) + ' students who have found clarity with ' + escapeHtml(brand) + '.</p>' +
          '</div>' +
          '<div class="faq-journey-cta-actions">' +
            '<a href="#/contact" class="btn-outline btn-outline-neutral btn-outline-lg w-full sm:w-auto text-center">Book demo</a>' +
            '<button type="button" data-open-contact data-contact-title="Get in touch" data-contact-subject="General enquiry" class="w-full sm:w-auto text-center px-8 py-4 rounded-full bg-nebula text-white text-sm font-medium hover:bg-nebula/80 transition-all duration-300 shadow-accent-lg hover:shadow-accent-xl">Get in touch</button>' +
          '</div>' +
        '</div>'
      : '';

    return (
      '<section id="faq" class="faq-section section-padding bg-void" aria-labelledby="faq-title">' +
        '<div class="faq-section-glow" aria-hidden="true"></div>' +
        '<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">' +
          '<div class="faq-layout">' +
            '<div class="faq-aside">' +
              '<span class="faq-eyebrow text-biolume text-xs font-medium tracking-[0.15em] uppercase">' + eyebrow + '</span>' +
              '<h2 id="faq-title" class="faq-title font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-medium text-stardust mt-4 leading-tight">' +
                'Got <span class="gradient-text">Questions?</span>' +
              '</h2>' +
              '<p class="faq-intro">' + escapeHtml(data.intro) + '</p>' +
              '<div class="faq-aside-card glass-card">' +
                '<div class="faq-aside-icon" aria-hidden="true">' +
                  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
                '</div>' +
                '<div>' +
                  '<p class="faq-aside-card-title">Still need help?</p>' +
                  '<p class="faq-aside-card-text">Our counsellors are happy to walk you through assessments, reports, and next steps.</p>' +
                  '<a href="#/contact" class="faq-aside-link">Talk to Arivuu</a>' +
                '</div>' +
              '</div>' +
              journeyCta +
            '</div>' +
            '<div class="faq-list">' + items + '</div>' +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function renderHomeTestimonialSlides() {
    var items = window.ARIVUU_HOME_TESTIMONIALS || [];
    return items.map(function (item) {
      return renderTestimonialSlide(item.quote, item.name, item.role, item.stars);
    }).join('');
  }

  function renderTestimonialsSection() {
    return (
      '<section id="testimonials" class="section-padding bg-void relative overflow-x-clip">' +
        '<div class="max-w-7xl mx-auto w-full">' +
          '<div class="min-w-0">' +
            '<div class="text-center mb-6 sm:mb-8">' +
              '<span class="text-biolume text-xs font-medium tracking-[0.15em] uppercase">Success Stories</span>' +
              '<h2 class="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-stardust mt-4 leading-tight">What Our <span class="gradient-text">Community Says</span></h2>' +
            '</div>' +
            '<div class="relative min-w-0 px-9 sm:px-6 md:px-8 lg:px-0">' +
              '<div id="testimonial-carousel" class="carousel-viewport w-full py-6 sm:py-8 -my-4 sm:-my-6">' +
                '<div id="carousel-track" class="carousel-track">' +
                  renderHomeTestimonialSlides() +
                '</div>' +
              '</div>' +
              '<button id="carousel-prev" type="button" class="btn-outline-icon btn-outline-icon-sm btn-outline-icon-surface carousel-nav-btn carousel-nav-btn--prev" aria-label="Previous testimonial">' +
                '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>' +
              '</button>' +
              '<button id="carousel-next" type="button" class="btn-outline-icon btn-outline-icon-sm btn-outline-icon-surface carousel-nav-btn carousel-nav-btn--next" aria-label="Next testimonial">' +
                '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>' +
              '</button>' +
            '</div>' +
            '<div id="carousel-dots" class="flex justify-center gap-2 mt-4 sm:mt-6 px-2"></div>' +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function starSvg(filled) {
    var cls = filled
      ? 'w-3.5 h-3.5 text-yellow-400 fill-yellow-400'
      : 'w-3.5 h-3.5 text-nebula/25 fill-nebula/25';
    return '<svg class="' + cls + '" viewBox="0 0 24 24" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
  }

  function starsHtml(count) {
    var n = Math.max(1, Math.min(5, parseInt(count, 10) || 5));
    var html = '';
    for (var i = 0; i < 5; i++) html += starSvg(i < n);
    return html;
  }

  function userAvatarHtml(name) {
    return (
      '<div class="home-testimonial-avatar" aria-hidden="true" title="' + escapeHtml(name) + '">' +
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>' +
          '<circle cx="12" cy="7" r="4"/>' +
        '</svg>' +
      '</div>'
    );
  }

  function renderTestimonialSlide(quote, name, role, stars) {
    return (
      '<div class="carousel-slide">' +
        '<div class="review-card glass-card glass-card-hover p-5 sm:p-6 h-full min-h-[280px] sm:min-h-[320px] lg:min-h-[340px] flex flex-col relative z-0 hover:z-10">' +
          '<div class="audience-icon audience-icon-sm audience-icon--round mb-5">' +
            '<svg class="icon audience-icon-svg-fill" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>' +
          '</div>' +
          '<p class="text-stardust/90 text-sm leading-relaxed flex-1">' + escapeHtml(quote) + '</p>' +
          '<div class="flex items-center gap-3 mt-6 pt-5 border-t border-nebula/12">' +
            userAvatarHtml(name) +
            '<div>' +
              '<p class="text-sm font-medium text-stardust">' + escapeHtml(name) + '</p>' +
              '<p class="text-xs text-muted-text">' + escapeHtml(role) + '</p>' +
              '<div class="flex gap-0.5 mt-1.5" aria-label="' + (stars || 5) + ' out of 5 stars">' + starsHtml(stars) + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function bindFAQ() {
    document.querySelectorAll('.faq-question').forEach(function (btn) {
      if (btn.dataset.bound === '1') return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        var item = btn.closest('.faq-item');
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        var section = btn.closest('.faq-section');

        if (section && !expanded) {
          section.querySelectorAll('.faq-item.is-open').forEach(function (openItem) {
            if (openItem === item) return;
            openItem.classList.remove('is-open');
            var openBtn = openItem.querySelector('.faq-question');
            var openPanel = openItem.querySelector('.faq-answer');
            if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
            if (openPanel) openPanel.setAttribute('aria-hidden', 'true');
          });
        }

        btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        if (item) item.classList.toggle('is-open', !expanded);
        if (panel) panel.setAttribute('aria-hidden', expanded ? 'true' : 'false');
      });
    });
  }

  function mountFAQ(target) {
    if (!target || target.dataset.mounted === '1') return;
    target.innerHTML = renderFAQSection({ showJourneyCta: true });
    target.dataset.mounted = '1';
    bindFAQ();
  }

  function renderSchoolIcon(size) {
    var wrapClass = size === 'sm'
      ? 'audience-icon audience-icon-sm section-school-icon-wrap'
      : 'audience-icon audience-icon-md section-school-icon-wrap';
    return (
      '<span class="' + wrapClass + '" aria-hidden="true">' +
        '<svg class="section-school-icon-svg audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M3 22h18"/>' +
          '<path d="M6 18V9l6-4 6 4v9"/>' +
          '<path d="M10 18V13h4v5"/>' +
          '<path d="M10 9h4"/>' +
        '</svg>' +
      '</span>'
    );
  }

  function renderSchoolIconTitle(label, size) {
    return (
      '<span class="section-icon-title">' +
        renderSchoolIcon(size) +
        '<span>' + escapeHtml(label) + '</span>' +
      '</span>'
    );
  }

  function renderPageHeroDecor() {
    return (
      '<div class="page-hero-decor page-hero-decor--icons" aria-hidden="true">' +
        '<svg class="page-hero-sketch page-hero-sketch--bulb" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M28 44h8M30 48h4"/><path d="M32 8c-8 0-14 6-14 14 0 5 2 9 5 12 2 2 3 5 3 8h12c0-3 1-6 3-8 3-3 5-7 5-12 0-8-6-14-14-14z"/></svg>' +
        '<svg class="page-hero-sketch page-hero-sketch--laptop" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="10" y="14" width="44" height="28" rx="3"/><path d="M6 46h52l-4 6H10l-4-6z"/></svg>' +
        '<svg class="page-hero-sketch page-hero-sketch--cap" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 24 32 12l26 12-26 12L6 24z"/><path d="M16 30v12c0 4 7 8 16 8s16-4 16-8V30"/></svg>' +
        '<svg class="page-hero-sketch page-hero-sketch--globe" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="32" cy="32" r="20"/><path d="M12 32h40M32 12c6 6 6 34 0 40M32 12c-6 6-6 34 0 40"/></svg>' +
        '<svg class="page-hero-sketch page-hero-sketch--brush" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 52c8-2 18-12 24-24l6-6 8 8-6 6C32 42 22 52 12 52z"/><path d="M38 16l10 10"/></svg>' +
        '<svg class="page-hero-sketch page-hero-sketch--book" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 12h18a6 6 0 0 1 6 6v34H18a6 6 0 0 0-6 6V12z"/><path d="M30 18h18a6 6 0 0 1 6 6v34H36a6 6 0 0 0-6 6V18z"/></svg>' +
        '<svg class="page-hero-sketch page-hero-sketch--pencil" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 50l-2 8 8-2 30-30-6-6-30 30z"/><path d="M42 16l6 6"/></svg>' +
        '<svg class="page-hero-sketch page-hero-sketch--chart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 52h44"/><path d="M18 44V28M32 44V18M46 44V32"/></svg>' +
        '<svg class="page-hero-sketch page-hero-sketch--compass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="32" cy="32" r="20"/><polygon points="38 26 36 36 26 38 28 28 38 26"/></svg>' +
        '<svg class="page-hero-sketch page-hero-sketch--award" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="32" cy="24" r="12"/><path d="M24 36 22 52l10-6 10 6-2-16"/></svg>' +
        '<svg class="page-hero-sketch page-hero-sketch--briefcase" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="10" y="22" width="44" height="28" rx="3"/><path d="M24 22v-6a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6"/></svg>' +
        '<svg class="page-hero-sketch page-hero-sketch--rocket" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M32 8c8 8 12 20 12 32-6-2-10-2-12 0-2-2-6-2-12 0 0-12 4-24 12-32z"/><path d="M32 40v12M26 52h12"/><circle cx="32" cy="28" r="4"/></svg>' +
        '<svg class="page-hero-sketch page-hero-sketch--target" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="32" cy="32" r="20"/><circle cx="32" cy="32" r="12"/><circle cx="32" cy="32" r="4"/></svg>' +
        '<svg class="page-hero-sketch page-hero-sketch--users" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="32" cy="22" r="6"/><path d="M24 52v-4a8 8 0 0 1 8-8h8a8 8 0 0 1 8 8v4"/><circle cx="14" cy="28" r="4"/><path d="M8 52v-3a6 6 0 0 1 6-6"/><circle cx="50" cy="28" r="4"/><path d="M56 52v-3a6 6 0 0 0-6-6"/></svg>' +
        '<svg class="page-hero-sketch page-hero-sketch--school" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 28 32 16l24 12-24 12L8 28z"/><path d="M16 34v14c0 4 7 8 16 8s16-4 16-8V34"/></svg>' +
        '<svg class="page-hero-sketch page-hero-sketch--search" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="28" cy="28" r="14"/><path d="M38 38 52 52"/></svg>' +
      '</div>' +
      '<div class="page-hero-decor page-hero-decor--blob" aria-hidden="true"></div>'
    );
  }

  function mountPageHeroDecor(root) {
    var scope = root || document;

    scope.querySelectorAll('.page-hero:not([data-hero-decor])').forEach(function (hero) {
      hero.insertAdjacentHTML('afterbegin', renderPageHeroDecor());
      hero.setAttribute('data-hero-decor', '1');
    });

    var homeHero = root ? scope.querySelector('#hero') : document.getElementById('hero');
    if (homeHero && !homeHero.hasAttribute('data-hero-decor')) {
      var shell = homeHero.querySelector('.hero-shell');
      if (shell) {
        shell.insertAdjacentHTML('beforebegin', renderPageHeroDecor());
      } else {
        homeHero.insertAdjacentHTML('beforeend', renderPageHeroDecor());
      }
      homeHero.setAttribute('data-hero-decor', '1');
    }
  }

  function initSharedSections(page) {
    mountPageHeroDecor();
    if (page === 'home') {
      var faqMount = document.getElementById('faq-mount');
      if (faqMount && window.Arivuu.mountFAQ) window.Arivuu.mountFAQ(faqMount);
      mountHomePdfAndEcosystem();
    }
  }

  window.Arivuu.renderTakeTestButton = renderTakeTestButton;
  window.Arivuu.renderFeatureBar = renderFeatureBar;
  window.Arivuu.renderCareerEcosystemSection = renderCareerEcosystemSection;
  window.Arivuu.bindCareerEcosystemSection = bindCareerEcosystemSection;
  window.Arivuu.renderFAQSection = renderFAQSection;
  window.Arivuu.renderTestimonialsSection = renderTestimonialsSection;
  window.Arivuu.renderHomeTestimonialSlides = renderHomeTestimonialSlides;
  window.Arivuu.bindFAQ = bindFAQ;
  window.Arivuu.mountFAQ = mountFAQ;
  window.Arivuu.renderSchoolIcon = renderSchoolIcon;
  window.Arivuu.renderSchoolIconTitle = renderSchoolIconTitle;
  window.Arivuu.renderPageHeroDecor = renderPageHeroDecor;
  window.Arivuu.mountPageHeroDecor = mountPageHeroDecor;
  window.Arivuu.initSharedSections = initSharedSections;
  window.Arivuu.CARD_ICONS = CARD_ICONS;
})();
