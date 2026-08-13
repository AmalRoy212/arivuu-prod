(function () {
  'use strict';

  window.Arivuu = window.Arivuu || {};

  var ROUTES = {
    '/': { page: 'home' },
    '/about': { page: 'about', file: 'pages/about.html' },
    '/contact': { page: 'contact', file: 'pages/contact.html' },
    '/services': { page: 'services', file: 'pages/services.html', defaultQuery: 'audience=school' },
    '/service': { page: 'service', file: 'pages/service.html' },
    '/student': { page: 'student', file: 'pages/student.html' },
    '/student/guide': { page: 'student-guide', file: 'pages/student-guide.html' },
    '/institution': { page: 'institution', file: 'pages/institution.html' },
    '/institution/guide': { page: 'service', file: 'pages/service.html', defaultQuery: 'audience=school' },
    '/blog': { page: 'blog', file: 'pages/blog.html' },
    '/blog-post': { page: 'blog-post', file: 'pages/blog-post.html' },
    '/workshops': { page: 'workshops', file: 'pages/workshops.html' }
  };

  var homeTemplate = null;
  var viewCache = {};
  var currentPath = null;

  function basePath() {
    var path = window.location.pathname;
    if (path.endsWith('/')) return path;
    var idx = path.lastIndexOf('/');
    return idx === -1 ? '/' : path.slice(0, idx + 1);
  }

  function resolveRoute(path, params) {
    params = params || new URLSearchParams();
    var audience = params.get('audience');

    if (path === '/institution') {
      return {
        path: '/institution/guide',
        params: new URLSearchParams(),
        route: ROUTES['/institution/guide'],
        redirect: true
      };
    }

    if (path === '/service' && (!audience || audience === 'school')) {
      return {
        path: '/institution/guide',
        params: new URLSearchParams(),
        route: ROUTES['/institution/guide'],
        redirect: true
      };
    }

    if (path === '/services' && (!audience || audience === 'school')) {
      return {
        path: '/institution/guide',
        params: new URLSearchParams(),
        route: ROUTES['/institution/guide'],
        redirect: true
      };
    }

    if (!ROUTES[path]) {
      return { path: '/', params: new URLSearchParams(), route: ROUTES['/'], redirect: true };
    }

    return { path: path, params: params, route: ROUTES[path], redirect: false };
  }

  function parseRoute() {
    var raw = window.location.hash.replace(/^#/, '') || '/';
    if (!raw.startsWith('/')) raw = '/' + raw;
    var q = raw.indexOf('?');
    var path = q === -1 ? raw : raw.slice(0, q);
    var params = new URLSearchParams(q === -1 ? '' : raw.slice(q + 1));
    return resolveRoute(path, params);
  }

  function homeUrl() {
    return window.location.pathname + window.location.search;
  }

  function routeUrl(path, params) {
    var query = params && params.toString() ? '?' + params.toString() : '';
    if (path === '/' && !query) return homeUrl();
    return '#' + path + query;
  }

  function currentRouteUrl() {
    var hash = window.location.hash;
    if (!hash || hash === '#' || hash === '#/') return homeUrl();
    return hash;
  }

  function cacheHome() {
    var outlet = document.getElementById('app-outlet');
    if (outlet && homeTemplate === null) homeTemplate = outlet.innerHTML;
  }

  function refreshHomeTemplate() {
    var outlet = document.getElementById('app-outlet');
    if (outlet) homeTemplate = outlet.innerHTML;
  }

  function setMeta(route, params, path) {
    if (window.Arivuu.setPageSEO) {
      window.Arivuu.setPageSEO(path || parseRoute().path);
    }
    window.Arivuu.routerParams = params;
  }

  function scrollToTarget(params) {
    var scrollId = params.get('scroll');
    if (!scrollId) return;
    function doScroll() {
      var el = document.getElementById(scrollId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    requestAnimationFrame(function () {
      doScroll();
      setTimeout(doScroll, 150);
    });
  }

  function fetchView(file) {
    if (viewCache[file]) return Promise.resolve(viewCache[file]);

    if (window.ARIVUU_VIEWS && window.ARIVUU_VIEWS[file]) {
      viewCache[file] = window.ARIVUU_VIEWS[file];
      return Promise.resolve(viewCache[file]);
    }

    var urls = [
      new URL(file, window.location.href).href,
      new URL(basePath() + file, window.location.origin || window.location.href).href
    ];

    function tryFetch(i) {
      if (i >= urls.length) return Promise.reject(new Error('Failed to load ' + file));
      return fetch(urls[i]).then(function (res) {
        if (!res.ok) throw new Error('Failed to load ' + file);
        return res.text();
      }).catch(function () { return tryFetch(i + 1); });
    }

    return tryFetch(0).then(function (html) {
      viewCache[file] = html;
      return html;
    });
  }

  function navigate(path, params, replace) {
    var resolved = resolveRoute(path, params || new URLSearchParams());
    if (resolved.redirect) {
      return navigate(resolved.path, resolved.params, true);
    }

    var nextUrl = routeUrl(resolved.path, resolved.params);
    if (replace) {
      history.replaceState({ path: resolved.path, params: resolved.params.toString() }, '', nextUrl);
    } else if (currentRouteUrl() !== nextUrl) {
      history.pushState({ path: resolved.path, params: resolved.params.toString() }, '', nextUrl);
    }
    return render(resolved.path, resolved.params);
  }

  function render(path, params) {
    var resolved = resolveRoute(path, params || new URLSearchParams());
    if (resolved.redirect) {
      history.replaceState({ path: resolved.path, params: resolved.params.toString() }, '', routeUrl(resolved.path, resolved.params));
      return render(resolved.path, resolved.params);
    }

    var route = resolved.route;
    path = resolved.path;
    params = resolved.params;
    var outlet = document.getElementById('app-outlet');
    if (!outlet) return Promise.resolve();

    if (route.defaultQuery && !params.toString()) {
      params = new URLSearchParams(route.defaultQuery);
    }

    var previousPath = currentPath;
    currentPath = path;
    outlet.classList.add('is-loading');
    setMeta(route, params, path);
    document.body.setAttribute('data-page', route.page);

    if (previousPath === '/' && path !== '/') {
      refreshHomeTemplate();
    }

    var done = function (html) {
      outlet.innerHTML = html;
      outlet.classList.remove('is-loading');
      if (window.Arivuu.initPage) window.Arivuu.initPage(route.page, params);

      function scrollTop() {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }

      if (path === '/' && params.get('scroll')) {
        scrollToTarget(params);
        return;
      }

      if (window.Arivuu.lockPageScrollTop) {
        window.Arivuu.lockPageScrollTop();
        return;
      }

      scrollTop();
      requestAnimationFrame(scrollTop);
    };

    if (path === '/') {
      cacheHome();
      done(homeTemplate || '');
      return Promise.resolve();
    }

    if (!route.file) {
      cacheHome();
      done(homeTemplate || '');
      return Promise.resolve();
    }

    return fetchView(route.file).then(done).catch(function () {
      outlet.innerHTML = '<main class="pt-16 sm:pt-20"><div class="section-padding text-center"><p class="text-muted-text">Unable to load this page.</p><a href="#/" class="inline-block mt-4 text-nebula text-sm font-medium">Go home</a></div></main>';
      outlet.classList.remove('is-loading');
    });
  }

  function isOnHome() {
    return currentPath === '/' || (currentPath === null && parseRoute().path === '/');
  }

  function handleLinkClick(e) {
    var link = e.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

    var href = link.getAttribute('href');
    if (!href) return;

    if (href.startsWith('mailto:') || href.startsWith('tel:')) return;

    if (href.startsWith('#/')) {
      e.preventDefault();
      var raw = href.slice(1);
      var q = raw.indexOf('?');
      var path = q === -1 ? raw : raw.slice(0, q);
      var params = new URLSearchParams(q === -1 ? '' : raw.slice(q + 1));
      navigate(path, params, false);
      return;
    }

    if (href === '#' || href === '#/') {
      e.preventDefault();
      navigate('/', new URLSearchParams(), false);
      return;
    }

    if (href.startsWith('#') && !href.startsWith('#/')) {
      var sectionId = href.slice(1);
      if (!sectionId) return;
      e.preventDefault();
      if (isOnHome()) {
        var target = document.getElementById(sectionId);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      navigate('/', new URLSearchParams('scroll=' + encodeURIComponent(sectionId)), false);
    }
  }

  function boot() {
    if (/\/pages\//.test(window.location.pathname)) {
      var name = window.location.pathname.split('/').pop().replace(/\.html$/, '');
      window.location.replace(basePath() + 'index.html#/' + name + window.location.search);
      return;
    }

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    cacheHome();

    document.addEventListener('click', handleLinkClick);
    window.addEventListener('popstate', function () {
      var r = parseRoute();
      render(r.path, r.params);
    });

    var initial = parseRoute();
    history.replaceState({ path: initial.path, params: initial.params.toString() }, '', routeUrl(initial.path, initial.params));
    render(initial.path, initial.params);
  }

  window.Arivuu.navigate = navigate;
  window.Arivuu.parseRoute = parseRoute;
  window.Arivuu.link = function (path, query) {
    var clean = String(path || '/').replace(/^\//, '');
    if (!clean && !query) return './';
    return '#/' + clean + (query ? '?' + query : '');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
