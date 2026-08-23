(function () {
  'use strict';

  window.Arivuu = window.Arivuu || {};

  var data = window.ARIVUU_AUDIENCE_SERVICES;

  var ICONS = {
    compass: '<svg class="service-feature-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
    chart: '<svg class="service-feature-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>',
    'user-check': '<svg class="service-feature-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>',
    briefcase: '<svg class="service-feature-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    activity: '<svg class="service-feature-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>',
    navigation: '<svg class="service-feature-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>',
    calendar: '<svg class="service-feature-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
    award: '<svg class="service-feature-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
    users: '<svg class="service-workshop-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    book: '<svg class="service-workshop-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>',
    heart: '<svg class="service-workshop-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2M9 9h.01M15 9h.01"/></svg>',
    clock: '<svg class="service-workshop-meta-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    map: '<svg class="service-workshop-meta-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'
  };

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function getQueryParam(name) {
    if (window.Arivuu && window.Arivuu.routerParams) {
      return window.Arivuu.routerParams.get(name);
    }
    return new URLSearchParams(window.location.search).get(name);
  }

  function getAudience() {
    var id = getQueryParam('audience') || data.defaultAudience || 'school';
    if (!data.audiences[id]) id = data.defaultAudience || 'school';
    return data.audiences[id];
  }

  function serviceUrl(audience) {
    if (!audience || audience === 'school') return '#/institution/guide';
    return '#/service?audience=' + encodeURIComponent(audience);
  }

  function normalizeLogoEntry(entry) {
    return {
      name: entry.name || '',
      logo: entry.logo || ''
    };
  }

  function renderLogoItem(logo, hidden) {
    var hiddenAttr = hidden ? ' aria-hidden="true"' : '';
    return (
      '<div class="logo-marquee-item"' + hiddenAttr + '>' +
        '<img src="' + escapeHtml(logo.logo) + '" alt="' + escapeHtml(logo.name) + '" class="logo-marquee-img" draggable="false" loading="lazy" />' +
        '<span class="logo-marquee-name">' + escapeHtml(logo.name) + '</span>' +
      '</div>'
    );
  }

  function renderLogoMarquee(logos) {
    var seen = {};
    var uniqueLogos = logos.filter(function (entry) {
      var logo = normalizeLogoEntry(entry);
      var key = logo.name.toLowerCase() + '|' + logo.logo;
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    }).map(normalizeLogoEntry);

    if (!uniqueLogos.length) return '';

    var batchHtml = uniqueLogos.map(function (logo) {
      return renderLogoItem(logo, false);
    }).join('');

    return (
      '<div class="service-partners-marquee-wrap">' +
        '<div class="logo-marquee logo-marquee--loop" aria-label="Partner schools">' +
          '<div class="logo-marquee-track">' +
            '<div class="logo-marquee-batch">' + batchHtml + '</div>' +
            '<div class="logo-marquee-batch" aria-hidden="true">' + batchHtml + '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function bindLogoMarquee(root) {
    var marquee = root ? root.querySelector('.logo-marquee--loop') : document.querySelector('.logo-marquee--loop');
    if (!marquee) return;

    function updateMarquee() {
      var batch = marquee.querySelector('.logo-marquee-batch');
      var track = marquee.querySelector('.logo-marquee-track');
      if (!batch || !track) return;

      marquee.classList.remove('is-scrollable');

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        track.style.animationPlayState = 'paused';
        marquee.classList.add('is-scrollable');
        return;
      }

      track.style.animationPlayState = 'running';
      var batchWidth = batch.getBoundingClientRect().width;
      var duration = Math.max(24, Math.min(80, batchWidth / 22));
      track.style.setProperty('--marquee-duration', duration + 's');
    }

    if (marquee.dataset.marqueeBound !== '1') {
      marquee.dataset.marqueeBound = '1';
      window.addEventListener('resize', updateMarquee);
    }

    updateMarquee();

    marquee.querySelectorAll('.logo-marquee-img').forEach(function (img) {
      if (img.complete) return;
      img.addEventListener('load', updateMarquee, { once: true });
      img.addEventListener('error', updateMarquee, { once: true });
    });
  }

  function renderCustomSelect(id, label, name, placeholder, options, required) {
    var labelClass = 'block text-xs font-medium text-muted-text mb-1.5';
    var triggerClass =
      'service-select-trigger w-full px-4 py-3 rounded-xl border border-nebula/25 bg-white text-sm text-stardust ' +
      'focus:outline-none focus:border-nebula/50 focus:ring-2 focus:ring-nebula/15 ' +
      'flex items-center justify-between gap-3 text-left cursor-pointer';
    var optionsHtml = options.map(function (opt) {
      return (
        '<li class="service-select-option" role="option" data-value="' + escapeHtml(opt) + '">' +
          escapeHtml(opt) +
        '</li>'
      );
    }).join('');

    return (
      '<div class="service-custom-select" data-custom-select>' +
        '<label for="' + id + '" class="' + labelClass + '">' + escapeHtml(label) + '</label>' +
        '<input type="hidden" id="' + id + '" name="' + name + '" value=""' + (required ? ' required' : '') + ' />' +
        '<button type="button" class="' + triggerClass + '" aria-haspopup="listbox" aria-expanded="false">' +
          '<span class="service-select-value is-placeholder">' + escapeHtml(placeholder) + '</span>' +
          '<svg class="service-select-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>' +
        '</button>' +
        '<ul class="service-select-menu" role="listbox" hidden>' + optionsHtml + '</ul>' +
      '</div>'
    );
  }

  function renderField(label, id, name, type, placeholder, autocomplete, inputmode) {
    var labelClass = 'block text-xs font-medium text-muted-text mb-1.5';
    var inputClass =
      'w-full px-4 py-3 rounded-xl border border-nebula/25 bg-white text-sm text-stardust ' +
      'placeholder:text-muted-text focus:outline-none focus:border-nebula/50 focus:ring-2 focus:ring-nebula/15';
    var attrs = 'id="' + id + '" name="' + name + '" type="' + type + '" required class="' + inputClass + '" placeholder="' + escapeHtml(placeholder) + '"';
    if (autocomplete) attrs += ' autocomplete="' + autocomplete + '"';
    if (inputmode) attrs += ' inputmode="' + inputmode + '"';

    return (
      '<div>' +
        '<label for="' + id + '" class="' + labelClass + '">' + escapeHtml(label) + '</label>' +
        '<input ' + attrs + ' />' +
      '</div>'
    );
  }

  function renderContactForm(audience) {
    var designationField = renderCustomSelect(
      'service-contact-designation',
      'Designation',
      'designation',
      'Select designation',
      data.designationOptions,
      true
    );

    return (
      '<form id="service-contact-form" class="glass-card p-6 sm:p-8 lg:p-10 space-y-5 w-full" novalidate ' +
        'data-subject="' + escapeHtml(audience.contactSubject) + '" data-audience="' + escapeHtml(audience.id) + '">' +
        '<div class="grid sm:grid-cols-2 gap-5">' +
          renderField('Name', 'service-contact-name', 'name', 'text', 'Your name', 'name') +
          renderField('Email', 'service-contact-email', 'email', 'email', 'you@example.com', 'email', 'email') +
          '<div class="sm:col-span-2">' +
            renderField('Mobile number', 'service-contact-phone', 'phone', 'tel', '+91 98765 43210', 'tel', 'tel') +
          '</div>' +
        '</div>' +
        '<div class="grid sm:grid-cols-2 gap-5">' +
          renderField('School / Institution', 'service-contact-institution', 'institution', 'text', 'School or institute name', 'organization') +
          renderField('City', 'service-contact-city', 'city', 'text', 'Your city', 'address-level2') +
        '</div>' +
        designationField +
        '<div id="service-contact-status" class="hidden text-sm rounded-xl px-4 py-3" role="status"></div>' +
        '<button type="submit" class="w-full sm:w-auto px-8 py-3 rounded-full bg-nebula text-white text-sm font-medium hover:bg-nebula/80 transition-all duration-300 shadow-accent-md">Submit</button>' +
      '</form>'
    );
  }

  function renderAceFlipCardItem(item) {
    if (typeof item === 'string') {
      return '<li class="flip-card-list-item">' + escapeHtml(item) + '</li>';
    }
    if (item.segments && item.segments.length) {
      var content = item.segments.map(function (part) {
        if (part.bold) {
          return '<strong class="text-stardust font-semibold">' + escapeHtml(part.text) + '</strong>';
        }
        return escapeHtml(part.text);
      }).join('');
      return '<li class="flip-card-list-item">' + content + '</li>';
    }
    if (item.lead) {
      return (
        '<li class="flip-card-list-item">' +
          '<strong class="text-stardust font-semibold">' + escapeHtml(item.lead) + '</strong>' +
          (item.rest ? ' ' + escapeHtml(item.rest) : '') +
        '</li>'
      );
    }
    var text = item.text || '';
    var content = item.strong
      ? '<strong class="text-stardust font-semibold">' + escapeHtml(text) + '</strong>'
      : escapeHtml(text);
    return '<li class="flip-card-list-item">' + content + '</li>';
  }

  function renderAceFlipCard(card) {
    var icon = ICONS[card.icon] || ICONS.compass;
    var items = (card.items || []).map(renderAceFlipCardItem).join('');
    var accentClass = card.letter === 'C' ? ' flip-card--accent-biolume' : '';

    return (
      '<article class="flip-card' + accentClass + '">' +
        '<div class="flip-card-inner">' +
          '<div class="flip-card-face flip-card-front glass-card">' +
            '<div class="flip-card-icon-wrap audience-icon">' + icon + '</div>' +
            '<h3 class="flip-card-title">' + escapeHtml(card.letter) + ' – ' + escapeHtml(card.title) + '</h3>' +
            '<span class="flip-card-hint">Hover to learn more</span>' +
          '</div>' +
          '<div class="flip-card-face flip-card-back glass-card">' +
            '<ul class="flip-card-list">' + items + '</ul>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function renderAceJourneyHeading(heading) {
    var text = heading || 'We Power Your ACE Journey';
    var marker = 'ACE Journey';
    var idx = text.indexOf(marker);
    if (idx === -1) {
      return escapeHtml(text).replace('ACE', '<span class="gradient-text">ACE</span>');
    }
    return (
      escapeHtml(text.slice(0, idx)) +
      '<span class="gradient-text">' + escapeHtml(marker) + '</span>' +
      escapeHtml(text.slice(idx + marker.length))
    );
  }

  function renderAceJourneySection(section) {
    if (!section) return '';

    var cards = (section.cards || []).map(renderAceFlipCard).join('');
    var brochure = section.brochure || {};
    var eyebrow = section.eyebrow || 'Our Framework';

    return (
      '<section id="ace-journey" class="section-padding-lg ace-journey-section bg-surface-deep relative overflow-hidden" aria-labelledby="service-ace-journey-title">' +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">' +
          '<div class="text-center mb-16">' +
            '<span class="text-biolume text-xs font-medium tracking-[0.15em] uppercase">' + escapeHtml(eyebrow) + '</span>' +
            '<h2 id="service-ace-journey-title" class="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-stardust mt-4">' +
              renderAceJourneyHeading(section.heading) +
            '</h2>' +
            (section.intro
              ? '<p id="service-ace-journey-intro" class="text-muted-text text-sm mt-4 max-w-xl mx-auto">' + escapeHtml(section.intro) + '</p>'
              : '') +
          '</div>' +
          '<div class="flip-card-grid">' + cards + '</div>' +
          (brochure.pdf
            ? '<div class="service-ace-journey-actions">' +
                '<a href="' + escapeHtml(brochure.pdf) + '" class="service-ace-brochure-btn btn-premium" target="_blank" rel="noopener noreferrer" data-brochure-url="' + escapeHtml(brochure.pdf) + '" data-brochure-filename="' + escapeHtml(brochure.filename || 'Arivuu-Brochure.pdf') + '">' +
                  '<svg class="service-ace-brochure-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
                    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>' +
                  '</svg>' +
                  '<span>' + escapeHtml(brochure.label || 'Download Brochure') + '</span>' +
                '</a>' +
              '</div>'
            : '') +
        '</div>' +
      '</section>'
    );
  }

  function renderLegacyAceSection() {
    return (
      '<section id="service-ace-section" class="service-section service-ace-section bg-surface-deep">' +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">' +
          '<h2 class="service-section-title text-center">We power your <span class="gradient-text">ACE journey</span> in 3 steps</h2>' +
          '<div class="service-ace-steps">' +
            data.aceSteps.map(renderAceStep).join('') +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function renderAceSection(audience) {
    if (audience.aceJourneySection) {
      return renderAceJourneySection(audience.aceJourneySection);
    }
    return renderLegacyAceSection();
  }

  function bindFlipCards(root) {
    if (!root) return;
    root.querySelectorAll('.flip-card').forEach(function (card) {
      if (card.dataset.bound === '1') return;
      card.dataset.bound = '1';
      card.addEventListener('click', function () {
        card.classList.toggle('is-flipped');
      });
    });
  }

  function renderAceStep(step) {
    var points = step.points.map(function (p) {
      return '<li class="service-ace-point">' + escapeHtml(p) + '</li>';
    }).join('');

    var content =
      '<div class="service-ace-content">' +
        '<div class="service-ace-watermark" aria-hidden="true">' + escapeHtml(step.letter) + '</div>' +
        '<div class="service-ace-letter">' + escapeHtml(step.letter) + ' = ' + escapeHtml(step.title) + '</div>' +
        '<ul class="service-ace-list">' + points + '</ul>' +
      '</div>';

    var imageClass = 'service-ace-image' + (step.imageFit === 'contain' ? ' service-ace-image--contain' : '');
    var imageAlt = step.letter === 'A' ? 'Approach badge' : (step.letter === 'E' ? 'Eco System illustration' : '');

    var image =
      '<div class="service-ace-image-wrap service-ace-parallax-layer">' +
        '<img src="' + escapeHtml(step.image) + '" alt="' + escapeHtml(imageAlt) + '" class="' + imageClass + '" />' +
      '</div>';

    var rowClass = step.imageLeft
      ? 'service-ace-row'
      : 'service-ace-row service-ace-row--image-right';

    return '<div class="' + rowClass + '">' + image + content + '</div>';
  }

  function renderGistHighlights(items) {
    return items.map(function (item) {
      return (
        '<li class="service-gist-highlight">' +
          '<span class="service-gist-highlight-icon audience-icon audience-icon-sm audience-icon--round" aria-hidden="true">' +
            '<svg class="audience-icon-svg-fill" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.25a1 1 0 0 1-1.414 0l-3.25-3.25a1 1 0 1 1 1.414-1.414l2.543 2.543 6.517-6.517a1 1 0 0 1 1.414 0z" clip-rule="evenodd"/></svg>' +
          '</span>' +
          '<span>' + escapeHtml(item) + '</span>' +
        '</li>'
      );
    }).join('');
  }

  function renderGistStats(stats) {
    return stats.map(function (stat) {
      return (
        '<div class="service-gist-stat">' +
          '<span class="service-gist-stat-value">' + escapeHtml(stat.value) + '</span>' +
          '<span class="service-gist-stat-label">' + escapeHtml(stat.label) + '</span>' +
        '</div>'
      );
    }).join('');
  }

  var AUDIENCE_ACCENTS = {
    Students: 'nebula',
    Parents: 'biolume',
    Educators: 'biolume'
  };

  function renderWorkshopAudiences(item) {
    var audiences = item.audiences || (item.audience ? [item.audience] : []);
    return audiences.map(function (label) {
      var tagAccent = AUDIENCE_ACCENTS[label] || item.accent || 'nebula';
      return (
        '<span class="service-workshop-audience service-workshop-audience--' + tagAccent + '">' +
          escapeHtml(label) +
        '</span>'
      );
    }).join('');
  }

  function renderWorkshopSegment(part) {
    var html = escapeHtml(part.text);
    if (part.bold) {
      return '<strong class="text-stardust font-semibold">' + html + '</strong>';
    }
    if (part.italic) {
      return '<em>' + html + '</em>';
    }
    return html;
  }

  function renderWorkshopDescription(item) {
    if (item.segments && item.segments.length) {
      return item.segments.map(renderWorkshopSegment).join('');
    }
    return escapeHtml(item.description || '');
  }

  function renderWorkshopCard(item) {
    var accent = item.accent === 'biolume' ? 'biolume' : 'nebula';
    var icon = ICONS[item.icon] || ICONS.compass;
    var audiences = item.audiences || (item.audience ? [item.audience] : []);
    var audienceHtml = audiences.length
      ? '<div class="service-workshop-audiences">' + renderWorkshopAudiences(item) + '</div>'
      : '';
    var metaHtml = (item.duration || item.format)
      ? '<div class="service-workshop-meta">' +
          (item.duration
            ? '<span class="service-workshop-meta-item">' + ICONS.clock + escapeHtml(item.duration) + '</span>'
            : '') +
          (item.format
            ? '<span class="service-workshop-meta-item">' + ICONS.map + escapeHtml(item.format) + '</span>'
            : '') +
        '</div>'
      : '';

    return (
      '<article class="service-workshop-card service-workshop-card--' + accent + '">' +
        '<div class="service-workshop-card-glow" aria-hidden="true"></div>' +
        '<div class="service-workshop-card-inner">' +
          '<div class="service-workshop-card-top">' +
            '<div class="service-workshop-icon-wrap audience-icon audience-icon-md service-workshop-icon-wrap--' + accent + '">' + icon + '</div>' +
            audienceHtml +
          '</div>' +
          '<h3 class="service-workshop-title">' + escapeHtml(item.title) + '</h3>' +
          '<p class="service-workshop-desc">' + renderWorkshopDescription(item) + '</p>' +
          metaHtml +
        '</div>' +
      '</article>'
    );
  }

  function renderWhyArivuuDescription(section) {
    if (section.segments && section.segments.length) {
      return section.segments.map(function (part) {
        if (part.bold) {
          return '<strong class="text-stardust font-semibold">' + escapeHtml(part.text) + '</strong>';
        }
        return escapeHtml(part.text);
      }).join('');
    }
    return escapeHtml(section.description || '');
  }

  function renderWhyArivuuFeatureBoxes(features) {
    features = features || [];
    if (!features.length) return '';

    var mid = Math.ceil(features.length / 2);
    var rows = [features.slice(0, mid), features.slice(mid)].filter(function (row) {
      return row.length;
    });

    return (
      '<div class="service-why-arivuu-features service-why-arivuu-features--boxes" role="list">' +
        rows
          .map(function (row) {
            return (
              '<div class="service-why-arivuu-features-row">' +
                row
                  .map(function (item) {
                    return '<span class="service-why-arivuu-feature" role="listitem">' + escapeHtml(item) + '</span>';
                  })
                  .join('') +
              '</div>'
            );
          })
          .join('') +
      '</div>'
    );
  }

  function renderWhyArivuuSection(section) {
    if (!section) return '';

    return (
      '<section class="service-section service-why-arivuu-section bg-void" aria-labelledby="service-why-arivuu-title">' +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">' +
          '<div class="service-why-arivuu service-why-arivuu--standalone">' +
            '<h2 id="service-why-arivuu-title" class="service-why-arivuu-heading">' +
              'Why Arivuu for <span class="gradient-text">Career Counselling?</span>' +
            '</h2>' +
            '<p class="service-why-arivuu-desc">' + renderWhyArivuuDescription(section) + '</p>' +
            renderWhyArivuuFeatureBoxes(section.features) +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function renderSchoolWorkshopsIntro(meta) {
    if (meta.introSegments && meta.introSegments.length) {
      return meta.introSegments.map(function (part) {
        if (part.bold) {
          return '<strong class="text-stardust font-semibold">' + escapeHtml(part.text) + '</strong>';
        }
        return escapeHtml(part.text);
      }).join('');
    }
    return escapeHtml(meta.intro || '');
  }

  function renderSchoolWorkshopsHeader(meta) {
    var renderSchoolIcon = window.Arivuu.renderSchoolIcon;
    var iconHtml = renderSchoolIcon
      ? '<span class="service-workshops-school-icon">' + renderSchoolIcon('sm') + '</span>'
      : '';

    return (
      '<div class="service-workshops-header service-workshops-header--school">' +
        '<div class="service-workshops-title-row">' +
          '<h2 id="service-workshops-title" class="service-workshops-title service-workshops-title--school">' +
            'Why Schools Partner with <span class="gradient-text">Arivuu</span>' +
          '</h2>' +
          iconHtml +
        '</div>' +
        '<p class="service-workshops-intro">' + renderSchoolWorkshopsIntro(meta) + '</p>' +
      '</div>'
    );
  }

  function renderWorkshopsSection(audience) {
    var meta = Object.assign({}, data.workshopsSection || {}, (audience && audience.workshopsSection) || {});
    var renderIconTitle = window.Arivuu.renderSchoolIconTitle;
    var isSchoolHeader = meta.titleIcon === 'school';
    var statsList = meta.stats || [];
    var stats = statsList.length
      ? statsList.map(function (stat) {
          return (
            '<div class="service-workshops-stat">' +
              '<span class="service-workshops-stat-value">' + escapeHtml(stat.value) + '</span>' +
              '<span class="service-workshops-stat-label">' + escapeHtml(stat.label) + '</span>' +
            '</div>'
          );
        }).join('')
      : '';
    var workshopItems = (audience && audience.workshops) || data.workshops || [];
    var cards = workshopItems.map(renderWorkshopCard).join('');
    var ctaHref = audience && audience.approachSection ? '#/contact' : '#service-contact-form';
    var titleHtml = meta.titleIcon === 'school' && renderIconTitle
      ? renderIconTitle(meta.title || 'Students')
      : 'Workshops &amp; <span class="gradient-text">Seminars</span>';
    var headerHtml = isSchoolHeader
      ? renderSchoolWorkshopsHeader(meta)
      : (
        '<div class="service-workshops-header">' +
          '<span class="service-workshops-eyebrow">' + escapeHtml(meta.eyebrow || 'Events & Seminars') + '</span>' +
          '<h2 id="service-workshops-title" class="service-workshops-title">' + titleHtml + '</h2>' +
          '<p class="service-workshops-intro">' + escapeHtml(meta.intro || '') + '</p>' +
        '</div>'
      );
    var sectionClass = 'service-section service-workshops-section bg-void' +
      (isSchoolHeader ? ' service-workshops-section--school' : '');

    var partnerCta = '';
    var whyCta = audience && audience.whyArivuuSection && audience.whyArivuuSection.cta;
    if (isSchoolHeader && whyCta && whyCta.label) {
      partnerCta =
        '<div class="service-workshops-partner-cta">' +
          '<button type="button" class="btn-premium btn-premium--biolume" data-open-contact ' +
            'data-contact-title="' + escapeHtml(whyCta.modalTitle || whyCta.label) + '" ' +
            'data-contact-subject="' + escapeHtml(whyCta.subject || 'School partnership') + '">' +
            '<span>' + escapeHtml(whyCta.label) + '</span>' +
          '</button>' +
        '</div>';
    }

    return (
      '<section class="' + sectionClass + '" aria-labelledby="service-workshops-title">' +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">' +
          headerHtml +
          (stats ? '<div class="service-workshops-stats">' + stats + '</div>' : '') +
          '<div class="service-workshops-grid">' + cards + '</div>' +
          partnerCta +
          (meta.hideCta
            ? ''
            : '<div class="service-workshops-cta">' +
                '<div class="service-workshops-cta-content">' +
                  '<p class="service-workshops-cta-title">' + escapeHtml(meta.ctaText || 'Book a workshop') + '</p>' +
                  '<p class="service-workshops-cta-hint">' + escapeHtml(meta.ctaHint || '') + '</p>' +
                '</div>' +
                '<a href="' + ctaHref + '" class="service-workshops-cta-btn">Get in touch</a>' +
              '</div>') +
        '</div>' +
      '</section>'
    );
  }

  function renderGistTabHeadline(tabData) {
    if (!tabData) return '';
    return escapeHtml(tabData.headline || '');
  }

  function renderGistTabLabel(tab) {
    return escapeHtml(tab.label);
  }

  function renderGistSection(audience) {
    var gistMeta = data.gistSection || {};
    var defaultTab = data.gistTabs.find(function (t) { return t.id === audience.defaultGistTab; }) || data.gistTabs[0];
    var defaultHeadline = renderGistTabHeadline(defaultTab);

    var tabs = data.gistTabs.map(function (tab) {
      var active = tab.id === audience.defaultGistTab ? ' is-active' : '';
      return (
        '<button type="button" class="service-gist-tab' + active + '" data-gist-tab="' + tab.id + '" ' +
          'aria-pressed="' + (active ? 'true' : 'false') + '" role="tab">' +
          '<span class="service-gist-tab-label">' + renderGistTabLabel(tab) + '</span>' +
        '</button>'
      );
    }).join('');

    return (
      '<section class="service-section service-gist-section bg-surface-deep" aria-labelledby="service-gist-title">' +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">' +
          '<div class="service-gist-header">' +
            '<span class="service-gist-eyebrow">' + escapeHtml(gistMeta.eyebrow || 'Platform') + '</span>' +
            '<h2 id="service-gist-title" class="service-gist-title">Gist of our <span class="gradient-text">software</span></h2>' +
            '<p class="service-gist-intro">' + escapeHtml(gistMeta.intro || '') + '</p>' +
          '</div>' +
          '<div class="service-gist-layout">' +
            '<div class="service-gist-panel">' +
              '<div class="service-gist-tabs" role="tablist" aria-label="Software audience views">' + tabs + '</div>' +
              '<div class="service-gist-detail" id="service-gist-detail">' +
                '<h3 class="service-gist-headline" id="service-gist-headline">' + defaultHeadline + '</h3>' +
                '<p class="service-gist-description" id="service-gist-description">' + escapeHtml(defaultTab.description) + '</p>' +
                '<ul class="service-gist-highlights" id="service-gist-highlights">' +
                  renderGistHighlights(defaultTab.highlights || []) +
                '</ul>' +
              '</div>' +
            '</div>' +
            '<div class="service-gist-showcase">' +
              '<div class="service-gist-stats" id="service-gist-stats">' +
                renderGistStats(defaultTab.stats || []) +
              '</div>' +
              '<div class="service-gist-browser">' +
                '<div class="service-gist-browser-bar">' +
                  '<div class="service-gist-browser-dots" aria-hidden="true">' +
                    '<span></span><span></span><span></span>' +
                  '</div>' +
                  '<div class="service-gist-browser-url" aria-hidden="true">app.arivuu.com/dashboard</div>' +
                '</div>' +
                '<div class="service-gist-preview" id="service-gist-preview">' +
                  '<img id="service-gist-image" src="' + escapeHtml(defaultTab.image) + '" ' +
                    'alt="' + escapeHtml(defaultTab.alt || 'Software dashboard preview') + '" ' +
                    'class="service-gist-screenshot" />' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function renderHeroDescription(audience) {
    if (audience.descriptionSegments && audience.descriptionSegments.length) {
      return audience.descriptionSegments.map(function (part) {
        if (part.accent === 'biolume') {
          return '<span class="text-biolume">' + escapeHtml(part.text) + '</span>';
        }
        return escapeHtml(part.text);
      }).join('');
    }
    return escapeHtml(audience.description || '');
  }

  function renderServicePageHero(audience) {
    var eyebrow = audience.pageEyebrow || 'Our Programs';
    var breadcrumb = audience.pageBreadcrumb || 'Services';
    var heroDecor = window.Arivuu.renderPageHeroDecor ? window.Arivuu.renderPageHeroDecor() : '';

    return (
      '<header class="page-hero bg-surface-deep border-b border-nebula/10" data-hero-decor="1">' +
        heroDecor +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-10 sm:py-16 relative">' +
          '<nav class="page-breadcrumbs mb-6" aria-label="Breadcrumb">' +
            '<a href="#/">Home</a><span>/</span>' +
            '<a href="#/institution/guide">Institutions</a><span>/</span>' +
            '<span class="page-breadcrumbs-current">' + escapeHtml(breadcrumb) + '</span>' +
          '</nav>' +
          '<span class="text-biolume text-xs font-medium tracking-[0.15em] uppercase">' + escapeHtml(eyebrow) + '</span>' +
          '<h1 class="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-stardust mt-3 leading-tight">' +
            escapeHtml(audience.heroLead) + ' <span class="gradient-text">' + escapeHtml(audience.heroTitle) + '</span>' +
          '</h1>' +
          '<p class="text-muted-text text-sm sm:text-base mt-4 max-w-2xl leading-relaxed">' +
            (audience.heroTagline ? '<span class="text-biolume">' + escapeHtml(audience.heroTagline) + '</span> ' : '') +
            renderHeroDescription(audience) +
          '</p>' +
        '</div>' +
      '</header>'
    );
  }

  var ECOSYSTEM_CHECK_ICON =
    '<svg class="service-ecosystem-item-icon service-ecosystem-item-icon--check" viewBox="0 0 20 20" aria-hidden="true">' +
      '<path fill-rule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.25a1 1 0 0 1-1.414 0l-3.25-3.25a1 1 0 1 1 1.414-1.414l2.543 2.543 6.517-6.517a1 1 0 0 1 1.414 0z" clip-rule="evenodd"/>' +
    '</svg>';

  var ECOSYSTEM_X_ICON =
    '<svg class="service-ecosystem-item-icon service-ecosystem-item-icon--x" viewBox="0 0 20 20" aria-hidden="true">' +
      '<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414z" clip-rule="evenodd"/>' +
    '</svg>';

  function renderApproachSection(section) {
    if (!section) return '';

    var paragraphs = (section.paragraphs || []).map(function (text, index) {
      return (
        '<div class="service-approach-card">' +
          '<span class="service-approach-card-num" aria-hidden="true">0' + (index + 1) + '</span>' +
          '<p class="service-approach-text">' + escapeHtml(text) + '</p>' +
        '</div>'
      );
    }).join('');

    return (
      '<section id="service-arivuu-approach" class="service-section service-approach-section" aria-labelledby="service-approach-title">' +
        '<div class="service-approach-bg" aria-hidden="true"></div>' +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 relative">' +
          '<div class="service-approach-layout">' +
            '<div class="service-approach-intro">' +
              (section.subtitle
                ? '<span class="service-approach-eyebrow">' + escapeHtml(section.subtitle) + '</span>'
                : '') +
              '<h2 id="service-approach-title" class="service-approach-title">' +
                'Arivuu <span class="gradient-text">Approach</span>' +
              '</h2>' +
              '<p class="service-approach-lead">' +
                escapeHtml(section.lead || '') +
              '</p>' +
            '</div>' +
            '<div class="service-approach-cards">' + paragraphs + '</div>' +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function renderEcosystemComparisonColumn(column, variant) {
    var isArivuu = variant === 'arivuu';
    var icon = isArivuu ? ECOSYSTEM_CHECK_ICON : ECOSYSTEM_X_ICON;

    var items = (column.items || []).map(function (text) {
      return (
        '<li class="service-ecosystem-item">' +
          icon +
          '<span>' + escapeHtml(text) + '</span>' +
        '</li>'
      );
    }).join('');

    var badge = isArivuu
      ? '<span class="service-ecosystem-badge">Recommended</span>'
      : '';

    return (
      '<div class="service-ecosystem-column service-ecosystem-column--' + variant + '">' +
        '<div class="service-ecosystem-column-inner">' +
          '<h3 class="service-ecosystem-column-title">' + escapeHtml(column.title) + '</h3>' +
          '<ul class="service-ecosystem-list">' + items + '</ul>' +
          badge +
        '</div>' +
      '</div>'
    );
  }

  function renderEcosystemFrameworkCard(item) {
    var icon = ICONS[item.icon] || ICONS.compass;
    var titleAttr = item.description
      ? ' title="' + escapeHtml(item.description) + '"'
      : '';

    return (
      '<article class="service-ecosystem-framework-card service-ecosystem-framework-card--compact glass-card"' + titleAttr + '>' +
        '<div class="service-ecosystem-framework-icon audience-icon audience-icon-sm" aria-hidden="true">' + icon + '</div>' +
        '<h4 class="service-ecosystem-framework-title">' + escapeHtml(item.title) + '</h4>' +
      '</article>'
    );
  }

  function renderEcosystemFramework(framework, bridgeTitle) {
    if (!framework || !framework.items || !framework.items.length) return '';

    var cards = framework.items.map(renderEcosystemFrameworkCard).join('');

    return (
      '<div class="service-ecosystem-framework">' +
        (bridgeTitle
          ? '<div class="service-ecosystem-bridge">' +
              '<span class="service-ecosystem-bridge-line" aria-hidden="true"></span>' +
              '<h3 class="service-ecosystem-bridge-title">' + escapeHtml(bridgeTitle) + '</h3>' +
              '<span class="service-ecosystem-bridge-line" aria-hidden="true"></span>' +
            '</div>'
          : '') +
        (framework.subtitle
          ? '<p class="service-ecosystem-framework-subtitle">' + escapeHtml(framework.subtitle) + '</p>'
          : '') +
        '<div class="service-ecosystem-framework-grid">' + cards + '</div>' +
      '</div>'
    );
  }

  function renderEcosystemSection(section) {
    if (!section) return '';

    var columns = section.columns || [];
    var arivuuCol = columns[0] ? renderEcosystemComparisonColumn(columns[0], 'arivuu') : '';
    var traditionalCol = columns[1] ? renderEcosystemComparisonColumn(columns[1], 'traditional') : '';

    return (
      '<section class="service-section service-ecosystem-section" aria-labelledby="service-ecosystem-title">' +
        '<div class="service-ecosystem-bg" aria-hidden="true"></div>' +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 relative">' +
          '<div class="service-ecosystem-header">' +
            (section.subtitle
              ? '<span class="service-ecosystem-eyebrow">' + escapeHtml(section.subtitle) + '</span>'
              : '') +
            '<h2 id="service-ecosystem-title" class="service-ecosystem-title">' +
              'Career Ecosystem for <span class="gradient-text">Schools</span>' +
            '</h2>' +
          '</div>' +
          '<div class="service-ecosystem-compare">' +
            arivuuCol +
            '<div class="service-ecosystem-vs" aria-hidden="true"><span>VS</span></div>' +
            traditionalCol +
          '</div>' +
          renderEcosystemFramework(section.framework, section.footer) +
        '</div>' +
      '</section>'
    );
  }

  function renderContactSection(audience) {
    if (audience.whyArivuuSection || audience.approachSection) {
      return (
        (audience.whyArivuuSection ? renderWhyArivuuSection(audience.whyArivuuSection) : '') +
        (audience.ecosystemSection ? renderEcosystemSection(audience.ecosystemSection) : '')
      );
    }

    var contactHeading = audience.contactHeading.replace(/\n/g, '<br />');

    return (
      '<section class="service-section service-contact-section bg-void">' +
        '<div class="service-contact-container mx-auto px-4 sm:px-6 lg:px-16">' +
          '<div class="service-contact-grid">' +
            '<div class="service-contact-form-wrap">' +
              renderContactForm(audience) +
            '</div>' +
            '<div class="service-contact-heading-wrap">' +
              '<h2 class="service-contact-heading">' + contactHeading + '</h2>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function renderSchoolPdfSection(audience) {
    if (!audience || audience.id !== 'school') return '';

    var studentGuide = window.ARIVUU_STUDENT_GUIDE;
    var pdfMeta = studentGuide && studentGuide.pdfSection;
    if (!window.Arivuu.renderPdfSampleSection || !pdfMeta) return '';

    return window.Arivuu.renderPdfSampleSection(pdfMeta);
  }

  function renderSchoolTestimonials(audience) {
    if (!audience || audience.id !== 'school') return '';
    if (!window.Arivuu.renderStudentTestimonialsSection) return '';

    return window.Arivuu.renderStudentTestimonialsSection('schools');
  }

  function renderPartnersSection(audience, contentHtml) {
    return (
      '<section class="service-partners-section bg-surface-deep !pt-10">' +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8 sm:py-10">' +
          '<h2 class="service-partners-heading text-center">' +
            escapeHtml(audience.partnersHeading || '').replace(
              /(320\+ school|320\+ partner schools|250\+ certified counsellors in our network)$/i,
              '<span class="gradient-text">$1</span>'
            ) +
          '</h2>' +
        '</div>' +
        contentHtml +
      '</section>'
    );
  }

  function renderSchoolLogosError() {
    return window.Arivuu.renderSheetDataError
      ? window.Arivuu.renderSheetDataError({ retryId: 'school-logos-retry' })
      : '<p class="text-center text-muted-text text-sm py-8">Couldn\'t load data at the moment. Please try again later.</p>';
  }

  function renderAudiencePage(audience, partnersContentHtml) {
    return (
      renderServicePageHero(audience) +

      renderPartnersSection(audience, partnersContentHtml) +

      renderContactSection(audience) +

      renderAceSection(audience) +

      (audience.id === 'school' ? '<div id="workshops-mount"></div>' : '') +

      renderWorkshopsSection(audience) +

      renderSchoolPdfSection(audience) +

      (window.Arivuu.renderCareerEcosystemSection ? window.Arivuu.renderCareerEcosystemSection() : '') +

      renderSchoolTestimonials(audience) +

      (window.Arivuu.renderFAQSection ? window.Arivuu.renderFAQSection() : '')
    );
  }

  function bindGistTabs() {
    var tabs = document.querySelectorAll('[data-gist-tab]');
    var imgEl = document.getElementById('service-gist-image');
    var preview = document.getElementById('service-gist-preview');
    var headlineEl = document.getElementById('service-gist-headline');
    var descriptionEl = document.getElementById('service-gist-description');
    var highlightsEl = document.getElementById('service-gist-highlights');
    var statsEl = document.getElementById('service-gist-stats');
    var detailEl = document.getElementById('service-gist-detail');
    var audience = getAudience();
    if (!tabs.length || !imgEl) return;

    function applyTab(tabData) {
      if (!tabData) return;

      if (headlineEl) headlineEl.innerHTML = renderGistTabHeadline(tabData);
      if (descriptionEl) descriptionEl.textContent = tabData.description || '';
      if (highlightsEl) highlightsEl.innerHTML = renderGistHighlights(tabData.highlights || []);
      if (statsEl) statsEl.innerHTML = renderGistStats(tabData.stats || []);

      if (preview) preview.classList.add('is-switching');
      imgEl.classList.add('is-fading');
      if (detailEl) detailEl.classList.add('is-switching');

      window.setTimeout(function () {
        imgEl.src = tabData.image;
        imgEl.alt = tabData.alt || 'Software dashboard preview';
        imgEl.classList.remove('is-fading');
        if (preview) preview.classList.remove('is-switching');
        if (detailEl) detailEl.classList.remove('is-switching');
      }, 150);
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var tabId = tab.getAttribute('data-gist-tab');
        var tabData = data.gistTabs.find(function (t) { return t.id === tabId; });
        if (!tabData) return;

        tabs.forEach(function (t) {
          t.classList.remove('is-active');
          t.setAttribute('aria-pressed', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-pressed', 'true');

        applyTab(tabData);
      });
    });
  }

  function closeAllCustomSelects(except) {
    document.querySelectorAll('[data-custom-select]').forEach(function (wrap) {
      if (except && wrap === except) return;
      wrap.classList.remove('is-open');
      var trigger = wrap.querySelector('.service-select-trigger');
      var menu = wrap.querySelector('.service-select-menu');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      if (menu) menu.hidden = true;
    });
  }

  function bindCustomSelects() {
    document.querySelectorAll('[data-custom-select]').forEach(function (wrap) {
      if (wrap.dataset.bound === '1') return;
      wrap.dataset.bound = '1';

      var hidden = wrap.querySelector('input[type="hidden"]');
      var trigger = wrap.querySelector('.service-select-trigger');
      var valueEl = wrap.querySelector('.service-select-value');
      var menu = wrap.querySelector('.service-select-menu');
      var options = wrap.querySelectorAll('.service-select-option');
      if (!hidden || !trigger || !valueEl || !menu) return;

      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        var isOpen = wrap.classList.contains('is-open');
        closeAllCustomSelects();
        if (!isOpen) {
          wrap.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
          menu.hidden = false;
        }
      });

      options.forEach(function (option) {
        option.addEventListener('click', function () {
          var val = option.getAttribute('data-value') || '';
          hidden.value = val;
          valueEl.textContent = val;
          valueEl.classList.remove('is-placeholder');
          options.forEach(function (o) { o.classList.remove('is-selected'); });
          option.classList.add('is-selected');
          closeAllCustomSelects();
        });
      });
    });

    if (!document.body.dataset.customSelectDocBound) {
      document.body.dataset.customSelectDocBound = '1';
      document.addEventListener('click', function (e) {
        if (!e.target.closest('[data-custom-select]')) closeAllCustomSelects();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeAllCustomSelects();
      });
    }
  }

  var aceParallaxHandler = null;

  function teardownAceParallax() {
    if (aceParallaxHandler) {
      window.removeEventListener('scroll', aceParallaxHandler);
      window.removeEventListener('resize', aceParallaxHandler);
      aceParallaxHandler = null;
    }
  }

  function bindAceParallax() {
    teardownAceParallax();

    var section = document.getElementById('service-ace-section');
    if (!section) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var rows = section.querySelectorAll('.service-ace-row');
    if (!rows.length) return;

    var ticking = false;

    function updateParallax() {
      ticking = false;
      var viewH = window.innerHeight;

      rows.forEach(function (row, index) {
        var rect = row.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewH) return;

        var progress = (rect.top + rect.height * 0.5 - viewH * 0.5) / viewH;
        progress = Math.max(-1, Math.min(1, progress));
        var dir = index % 2 === 0 ? 1 : -1;

        var imageWrap = row.querySelector('.service-ace-image-wrap');
        var watermark = row.querySelector('.service-ace-watermark');

        var imageShift = progress * 28 * dir;
        var watermarkShift = progress * 40 * dir;

        if (imageWrap) {
          imageWrap.style.transform = 'translate3d(0, ' + imageShift.toFixed(2) + 'px, 0)';
        }
        if (watermark) {
          watermark.style.transform =
            'translate3d(-50%, calc(-50% + ' + watermarkShift.toFixed(2) + 'px), 0)';
        }
      });
    }

    aceParallaxHandler = function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateParallax);
      }
    };

    window.addEventListener('scroll', aceParallaxHandler, { passive: true });
    window.addEventListener('resize', aceParallaxHandler, { passive: true });
    updateParallax();
  }

  function bindServiceContactForm() {
    var form = document.getElementById('service-contact-form');
    if (!form || form.dataset.bound === '1') return;

    form.dataset.bound = '1';
    var statusEl = document.getElementById('service-contact-status');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (window.Arivuu.validateServiceContactForm) {
        var err = window.Arivuu.validateServiceContactForm(form);
        if (err) {
          window.Arivuu.showServiceFormStatus(statusEl, err, 'error');
          return;
        }
      }

      var site = window.ARIVUU_SITE || {};
      var subject = form.dataset.subject || 'General enquiry';
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var phone = form.phone.value.trim();
      var designation = form.designation ? form.designation.value : '';
      var institution = form.institution ? form.institution.value : '';
      var city = form.city ? form.city.value : '';
      var audience = form.dataset.audience || '';
      var to = site.email || 'info@arivuu.com';

      var payload = {
        formType: 'service-contact',
        name: name,
        email: email,
        phone: String(phone),
        subject: subject,
        message: '',
        institution: institution,
        city: city,
        designation: designation,
        audience: audience
      };

      var mailtoFallback = function () {
        var body = 'Name: ' + name + '\nEmail: ' + email + '\nMobile: ' + phone;
        if (institution && institution !== 'N/A') body += '\nSchool / Institution: ' + institution;
        if (city) body += '\nCity: ' + city;
        if (designation) body += '\nDesignation: ' + designation;
        window.location.href = 'mailto:' + encodeURIComponent(to) +
          '?subject=' + encodeURIComponent(subject + ' — ' + name) +
          '&body=' + encodeURIComponent(body);
      };

      if (window.Arivuu.handleContactFormSubmit) {
        window.Arivuu.handleContactFormSubmit({
          form: form,
          statusEl: statusEl,
          payload: payload,
          showStatus: window.Arivuu.showServiceFormStatus,
          mailtoFallback: mailtoFallback
        });
        return;
      }

      mailtoFallback();
      if (window.Arivuu.showServiceFormStatus) {
        window.Arivuu.showServiceFormStatus(statusEl, 'Opening your email client to send the message…', 'success');
      }
    });
  }

  function bindBrochureDownload(root) {
    if (!root) return;

    root.querySelectorAll('[data-brochure-url]').forEach(function (link) {
      if (link.dataset.brochureBound === '1') return;
      link.dataset.brochureBound = '1';

      link.addEventListener('click', function (e) {
        var url = link.getAttribute('data-brochure-url');
        var filename = link.getAttribute('data-brochure-filename') || 'Arivuu-Brochure.pdf';
        if (!url || !window.Arivuu.triggerFileDownload) return;

        e.preventDefault();
        window.Arivuu.triggerFileDownload(url, filename);
      });
    });
  }

  function finishServicePageRender(mount, audience) {
    document.title = audience.seoTitle + ' | Arivuu';
    if (window.Arivuu.setPageSEO) {
      var seoPath = audience.id === 'school' ? '/institution/guide' : '/service';
      window.Arivuu.setPageSEO(seoPath, {
        title: audience.seoTitle + ' | Arivuu',
        description: audience.seoDescription
      });
    }

    bindGistTabs();
    bindCustomSelects();
    bindServiceContactForm();
    if (document.getElementById('service-ace-section')) {
      bindAceParallax();
    }
    bindFlipCards(mount);
    bindBrochureDownload(mount);
    bindLogoMarquee(mount);
    if (window.Arivuu.bindFAQ) window.Arivuu.bindFAQ();

    if (audience.id === 'school') {
      if (window.Arivuu.bindPdfSampleSection) window.Arivuu.bindPdfSampleSection();
      if (window.Arivuu.bindStudentTestimonials) window.Arivuu.bindStudentTestimonials('schools');
      if (window.Arivuu.bindCareerEcosystemSection) window.Arivuu.bindCareerEcosystemSection(mount);
      if (window.Arivuu.mountHomeWorkshops) window.Arivuu.mountHomeWorkshops();
    }

    if (window.Arivuu.lockPageScrollTop) window.Arivuu.lockPageScrollTop();
  }

  function bindSchoolLogosRetry(audience) {
    var retryBtn = document.getElementById('school-logos-retry');
    if (!retryBtn || retryBtn.dataset.bound === '1') return;
    retryBtn.dataset.bound = '1';
    retryBtn.addEventListener('click', function () {
      renderServicePage();
    });
  }

  function renderServicePage() {
    var mount = document.getElementById('service-page-mount');
    if (!mount || !data) return;

    var audience = getAudience();
    var loader = window.Arivuu.loadSchoolLogos;

    mount.innerHTML = renderAudiencePage(
      audience,
      '<p class="text-center text-muted-text text-sm py-8">Loading partner schools…</p>'
    );

    if (!loader) {
      mount.innerHTML = renderAudiencePage(audience, renderSchoolLogosError());
      finishServicePageRender(mount, audience);
      bindSchoolLogosRetry(audience);
      return;
    }

    loader().then(function (logos) {
      if (!document.getElementById('service-page-mount')) return;
      if (!logos || !logos.length) {
        throw new Error('No school logos found');
      }
      mount.innerHTML = renderAudiencePage(audience, renderLogoMarquee(logos));
      finishServicePageRender(mount, audience);
    }).catch(function () {
      if (!document.getElementById('service-page-mount')) return;
      mount.innerHTML = renderAudiencePage(audience, renderSchoolLogosError());
      finishServicePageRender(mount, audience);
      bindSchoolLogosRetry(audience);
    });
  }

  function renderServicesListing() {
    renderServicePage();
  }

  function mountSharedAceCards() {
    var mounts = document.querySelectorAll('[data-ace-cards]');
    if (!mounts.length) return;

    var school = data && data.audiences && data.audiences.school;
    var section = school && school.aceJourneySection;
    if (!section || !section.cards || !section.cards.length) return;

    var cardsHtml = section.cards.map(renderAceFlipCard).join('');
    mounts.forEach(function (mount) {
      if (mount.dataset.mounted === '1') return;
      mount.innerHTML = cardsHtml;
      mount.dataset.mounted = '1';
      bindFlipCards(mount);
    });
  }

  window.Arivuu.initServices = function (page) {
    page = page || document.body.getAttribute('data-page');
    if (page === 'services' || page === 'service') {
      renderServicePage();
    } else {
      teardownAceParallax();
    }
    if (page === 'home' || page === 'institution') {
      mountSharedAceCards();
    }
  };

  window.Arivuu.serviceUrl = serviceUrl;
})();
