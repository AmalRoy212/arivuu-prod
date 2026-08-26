(function () {
  'use strict';

  var mount = document.getElementById('site-footer');
  if (!mount) return;

  var site = window.ARIVUU_SITE || {};
  var brand = site.name || 'Arivuu';
  var email = site.email || 'info@arivuu.com';
  var mailtoHref = 'mailto:' + encodeURIComponent(email);
  var phone = site.phone || '+91 90710 12312';
  var phoneHref = site.phoneHref || phone.replace(/\s+/g, '');
  var address = site.address || 'Bangalore, Karnataka, India';
  var social = site.social || {};
  var instagramUrl = social.instagram || '';
  var linkedinUrl = social.linkedin || '';
  var year = site.year || new Date().getFullYear();
  var description = site.description || 'Career guidance for students across India.';
  var statsStudents = (site.stats && site.stats.students) || '55,000+';

  function sectionLink(id) {
    return '#/?scroll=' + encodeURIComponent(id);
  }

  var quickLinkClass = 'text-muted-text text-sm hover:text-stardust transition-colors duration-300';
  var quickLinks = [
    { label: 'About Us', href: '#/about' },
    { label: 'Blog', href: '#/blog' },
    { label: 'Career Library', href: sectionLink('career-library') },
    { label: 'Contact', href: '#/contact' },
    { label: 'FAQ', href: sectionLink('faq') },
    { label: 'For Schools', href: '#/institution/guide' },
    { label: 'For Students', href: '#/student/guide' },
    { label: 'Framework (ACE Journey)', href: sectionLink('ace-journey') },
    { label: 'Home', href: '#/' },
    { label: 'Partnerships', button: true },
    { label: 'Seminar', href: '#/workshops' },
    { label: 'Services', href: sectionLink('workshops-section') },
    { label: 'Success Stories', href: sectionLink('testimonials') }
  ].sort(function (a, b) {
    return a.label.localeCompare(b.label);
  });

  var quickLinksHtml = quickLinks
    .map(function (item) {
      if (item.button) {
        return (
          '<li><button type="button" data-open-contact data-contact-title="Partnerships" data-contact-subject="School partnership" class="' +
          quickLinkClass +
          ' text-left">Partnerships</button></li>'
        );
      }
      return '<li><a href="' + item.href + '" class="' + quickLinkClass + '">' + item.label + '</a></li>';
    })
    .join('');

  mount.outerHTML =
    '<footer id="footer" class="bg-surface-deep border-t border-nebula/12">' +
      '<div class="section-padding pb-0 footer-journey-cta">' +
        '<div class="max-w-7xl mx-auto">' +
          '<div class="glass-card p-6 sm:p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 mb-12 sm:mb-16 text-center lg:text-left">' +
            '<div class="w-full lg:w-auto">' +
              '<h3 class="font-display text-2xl sm:text-3xl font-medium text-stardust mb-2">Ready to Start Your <span class="gradient-text">Journey?</span></h3>' +
              '<p class="text-muted-text text-sm">Join ' + statsStudents + ' students who have found clarity with ' + brand + '.</p>' +
            '</div>' +
            '<div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">' +
              '<a href="#/contact" class="btn-outline btn-outline-neutral btn-outline-lg w-full sm:w-auto text-center">Book demo</a>' +
              '<button type="button" data-open-contact data-contact-title="Get in touch" data-contact-subject="General enquiry" class="w-full sm:w-auto text-center px-8 py-4 rounded-full bg-nebula text-white text-sm font-medium hover:bg-nebula/80 transition-all duration-300 shadow-accent-lg hover:shadow-accent-xl">Get in touch</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 pb-12">' +
        '<div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-10">' +
          '<div class="lg:col-span-2">' +
            '<a href="#/" class="inline-flex items-center gap-2 mb-4">' +
              '<img src="logo/logo-one.png" alt="" class="h-8 w-8 object-contain" />' +
              '<img src="logo/logo-text.png" alt="Arivuu" class="h-5 w-auto object-contain" />' +
            '</a>' +
            '<p class="text-muted-text text-sm leading-relaxed max-w-xs mb-6">' + description + '</p>' +
            '<p class="text-biolume text-xs font-medium tracking-[0.12em] uppercase mb-3">Arivuu – Empowering Students, Supporting Schools</p>' +
            '<ul class="footer-contact-list space-y-2.5 mb-6">' +
              '<li class="flex items-start gap-2 text-muted-text text-xs">' +
                '<svg class="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-nebula" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>' +
                '<span>' + address + '</span>' +
              '</li>' +
              '<li class="flex items-center gap-2 text-muted-text text-xs">' +
                '<svg class="w-3.5 h-3.5 flex-shrink-0 text-nebula" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
                '<a href="tel:' + phoneHref + '" class="hover:text-stardust transition-colors duration-300">' + phone + '</a>' +
                '<span class="text-stardust/25" aria-hidden="true">|</span>' +
                '<a href="' + mailtoHref + '" class="inline-flex items-center gap-2 hover:text-stardust transition-colors duration-300" aria-label="Email ' + email + '">' +
                  '<svg class="w-3.5 h-3.5 flex-shrink-0 text-nebula" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>' +
                  '<span>' + email + '</span>' +
                '</a>' +
              '</li>' +
            '</ul>' +
            '<p class="font-display font-medium text-stardust text-sm mb-3">You can also find us</p>' +
            '<div class="flex gap-3">' +
              (linkedinUrl
                ? '<a href="' + linkedinUrl + '" target="_blank" rel="noopener noreferrer" class="footer-social-btn" aria-label="LinkedIn">' +
                    '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>' +
                  '</a>'
                : '') +
              (instagramUrl
                ? '<a href="' + instagramUrl + '" target="_blank" rel="noopener noreferrer" class="footer-social-btn" aria-label="Instagram">' +
                    '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>' +
                  '</a>'
                : '') +
              '<a href="' + mailtoHref + '" class="footer-social-btn" aria-label="Email">' +
                '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>' +
              '</a>' +
            '</div>' +
          '</div>' +
          '<div class="sm:col-span-2 lg:col-span-3">' +
            '<h4 class="font-display font-medium text-stardust text-sm mb-4">Quick Links</h4>' +
            '<ul class="footer-quick-links">' +
              quickLinksHtml +
            '</ul>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="border-t border-nebula/12">' +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-5 flex items-center justify-center sm:justify-start text-center sm:text-left">' +
          '<p class="text-muted-text text-xs">&copy; ' + year + ' ' + brand + '. All rights reserved.</p>' +
        '</div>' +
      '</div>' +
    '</footer>';
})();
