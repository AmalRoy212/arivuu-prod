(function () {
  'use strict';

  window.Arivuu = window.Arivuu || {};

  var SERVICE_LINKS = [
    { href: '#/student/guide', label: 'Students', matchPages: ['student', 'student-guide'] },
    { href: '#/institution/guide', label: 'Institutions', matchPages: ['institution', 'service', 'services'] },
    { href: '#/workshops', label: 'Seminar', matchPages: ['workshops'] }
  ];

  function getAudienceFromHash() {
    var hash = window.location.hash || '';
    var q = hash.indexOf('?');
    if (q === -1) return null;
    return new URLSearchParams(hash.slice(q + 1)).get('audience');
  }

  function isServicesSectionActive(page) {
    return page === 'services' || page === 'service' || page === 'student' || page === 'student-guide' || page === 'institution' || page === 'workshops';
  }

  function isServiceLinkActive(link, page) {
    if (link.matchPages.indexOf(page) === -1) return false;
    if (page === 'service' || page === 'services') {
      var audience = getAudienceFromHash();
      if (link.href.indexOf('audience=school') !== -1) {
        return !audience || audience === 'school';
      }
      if (link.href.indexOf('audience=student') !== -1) {
        return audience === 'student';
      }
    }
    return true;
  }

  function navLink(href, label, active) {
    var cls = active
      ? 'text-sm text-stardust font-medium font-body'
      : 'text-sm text-muted-text hover:text-stardust transition-colors duration-300 font-body';
    return '<a href="' + href + '" class="' + cls + '">' + label + '</a>';
  }

  function navDropdown(page) {
    var sectionActive = isServicesSectionActive(page);
    var triggerCls = sectionActive
      ? 'nav-dropdown-trigger text-sm text-stardust font-medium font-body'
      : 'nav-dropdown-trigger text-sm text-muted-text hover:text-stardust transition-colors duration-300 font-body';

    var items = SERVICE_LINKS.map(function (link) {
      var active = isServiceLinkActive(link, page);
      return (
        '<a href="' + link.href + '" class="nav-dropdown-item' + (active ? ' is-active' : '') + '" role="menuitem">' +
          escapeHtml(link.label) +
        '</a>'
      );
    }).join('');

    return (
      '<div class="nav-dropdown">' +
        '<span class="' + triggerCls + '" tabindex="0" role="button" aria-haspopup="true">Services</span>' +
        '<div class="nav-dropdown-panel">' +
          '<div class="nav-dropdown-menu" role="menu">' + items + '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function mobileNavLink(href, label, active) {
    var cls = active
      ? 'nav-mobile-link nav-mobile-link-active'
      : 'nav-mobile-link';
    return '<a href="' + href + '" class="' + cls + '">' + label + '</a>';
  }

  function mobileServicesGroup(page) {
    var sectionActive = isServicesSectionActive(page);
    var toggleCls = sectionActive
      ? 'nav-mobile-group-toggle is-active'
      : 'nav-mobile-group-toggle';
    var items = SERVICE_LINKS.map(function (link) {
      var active = isServiceLinkActive(link, page);
      return (
        '<a href="' + link.href + '" class="nav-mobile-sublink' + (active ? ' is-active' : '') + '">' +
          escapeHtml(link.label) +
        '</a>'
      );
    }).join('');

    return (
      '<div class="nav-mobile-group' + (sectionActive ? ' is-expanded' : '') + '">' +
        '<button type="button" id="nav-mobile-services-toggle" class="' + toggleCls + '" ' +
          'aria-expanded="' + (sectionActive ? 'true' : 'false') + '" aria-controls="nav-mobile-services-panel">' +
          'Services' +
        '</button>' +
        '<div id="nav-mobile-services-panel" class="nav-mobile-subpanel"' + (sectionActive ? '' : ' hidden') + '>' +
          items +
        '</div>' +
      '</div>'
    );
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderDesktopLinks(page, isHome) {
    var parts = [];
    parts.push(navLink('#/', 'Home', isHome));
    parts.push('<span class="nav-link-sep" aria-hidden="true">/</span>');
    parts.push(navLink('#/about', 'About', page === 'about'));
    parts.push('<span class="nav-link-sep" aria-hidden="true">/</span>');
    parts.push(navDropdown(page));
    parts.push('<span class="nav-link-sep" aria-hidden="true">/</span>');
    parts.push(navLink('#/?scroll=career-library', 'Career Library', isHome));
    parts.push('<span class="nav-link-sep" aria-hidden="true">/</span>');
    parts.push(navLink('#/blog', 'Blog', page === 'blog' || page === 'blog-post'));
    parts.push('<span class="nav-link-sep" aria-hidden="true">/</span>');
    parts.push(navLink('#/contact', 'Contact', page === 'contact'));
    return parts.join('');
  }

  function renderMobileLinks(page, isHome) {
    var parts = [];
    parts.push(mobileNavLink('#/', 'Home', isHome));
    parts.push(mobileNavLink('#/about', 'About', page === 'about'));
    parts.push(mobileServicesGroup(page));
    parts.push(mobileNavLink('#/?scroll=career-library', 'Career Library', isHome));
    parts.push(mobileNavLink('#/blog', 'Blog', page === 'blog' || page === 'blog-post'));
    parts.push(mobileNavLink('#/contact', 'Contact', page === 'contact'));
    return parts.join('');
  }

  window.Arivuu.renderNavbar = function (page) {
    page = page || document.body.getAttribute('data-page') || 'home';
    var isHome = page === 'home';

    var html =
      '<nav id="navbar" class="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 bg-transparent">' +
        '<div class="nav-bar-head w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">' +
          '<div class="flex items-center justify-between h-16 sm:h-20">' +
            '<a href="#/" class="flex items-center shrink-0 gap-2 min-w-0">' +
              '<img src="logo/logo-one.png" alt="" class="h-7 w-7 sm:h-8 sm:w-8 object-contain" draggable="false" />' +
              '<img src="logo/logo-text.png" alt="Arivuu" class="h-5 w-auto object-contain" draggable="false" />' +
            '</a>' +
            '<div class="nav-desktop-links hidden lg:flex items-center">' +
              renderDesktopLinks(page, isHome) +
            '</div>' +
            '<div class="flex items-center gap-2 sm:gap-3">' +
              '<a href="#/contact" class="pill-button pill-button-sm text-xs hidden sm:inline-flex">Get In Touch</a>' +
              '<button type="button" id="nav-toggle" class="nav-toggle lg:hidden" aria-expanded="false" aria-controls="nav-mobile-menu" aria-label="Open menu">' +
                '<svg class="nav-toggle-icon nav-toggle-open" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>' +
                '<svg class="nav-toggle-icon nav-toggle-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</nav>' +
      '<div id="nav-mobile-menu" class="nav-mobile-menu lg:hidden" hidden>' +
        '<div class="nav-mobile-menu-inner">' +
          renderMobileLinks(page, isHome) +
          '<a href="#/contact" class="nav-mobile-cta">Get In Touch</a>' +
        '</div>' +
      '</div>';

    var wrapper = document.getElementById('site-navbar');
    if (wrapper) {
      wrapper.innerHTML = html;
    }
    if (window.Arivuu.bindNavbar) window.Arivuu.bindNavbar();
  };

})();
