(function () {
  'use strict';

  var HEADER_ALIASES = {
    name: 'name',
    school: 'name',
    schoolname: 'name',
    institution: 'name',
    logo: 'logo',
    logourl: 'logo',
    logo_url: 'logo',
    image: 'logo',
    imageurl: 'logo',
    image_url: 'logo',
    active: 'active',
    published: 'active',
    visible: 'active',
    sort: 'sort',
    order: 'sort',
    sortorder: 'sort'
  };

  function normalizeHeader(header) {
    return String(header || '').trim().toLowerCase().replace(/\s+/g, '');
  }

  function parseBool(value) {
    if (typeof value === 'boolean') return value;
    var normalized = String(value || '').trim().toLowerCase();
    if (!normalized) return true;
    return normalized === 'true' || normalized === 'yes' || normalized === '1';
  }

  function cellValue(cell) {
    if (!cell || cell.v == null) return '';
    return String(cell.v);
  }

  function mapRowToLogo(headers, row) {
    var entry = {
      name: '',
      logo: '',
      active: true,
      sort: null
    };

    headers.forEach(function (header, index) {
      var field = HEADER_ALIASES[normalizeHeader(header)];
      if (!field) return;
      var value = cellValue(row.c[index]);
      if (field === 'active') {
        entry.active = parseBool(value);
      } else if (field === 'sort') {
        var num = parseFloat(String(value).trim());
        entry.sort = isNaN(num) ? null : num;
      } else {
        entry[field] = String(value).trim();
      }
    });

    return entry;
  }

  function headersLookValid(headers) {
    return headers.some(function (label) {
      return HEADER_ALIASES[normalizeHeader(label)];
    });
  }

  function extractHeadersAndRows(table) {
    var rows = (table.rows || []).slice();
    var colHeaders = (table.cols || []).map(function (col) {
      return col.label || '';
    });

    // Sheet format: row 1 = column titles, row 2+ = logo data.
    if (headersLookValid(colHeaders)) {
      return { headers: colHeaders, rows: rows, hasHeader: true };
    }

    if (rows.length < 2) {
      return { headers: [], rows: [], hasHeader: false };
    }

    var titleRow = (rows[0].c || []).map(cellValue);
    if (!headersLookValid(titleRow)) {
      return { headers: [], rows: [], hasHeader: false };
    }

    return {
      headers: titleRow,
      rows: rows.slice(1),
      hasHeader: true
    };
  }

  function logosFromSheetTable(table) {
    var extracted = extractHeadersAndRows(table);

    if (!extracted.hasHeader || !extracted.rows.length) {
      return [];
    }

    var seen = {};
    var unique = [];

    extracted.rows
      .map(function (row) { return mapRowToLogo(extracted.headers, row); })
      .filter(function (entry) { return entry.name && entry.logo && entry.active; })
      .sort(function (a, b) {
        if (a.sort != null && b.sort != null) return a.sort - b.sort;
        if (a.sort != null) return -1;
        if (b.sort != null) return 1;
        return a.name.localeCompare(b.name);
      })
      .forEach(function (entry) {
        var key = entry.name.toLowerCase() + '|' + entry.logo;
        if (seen[key]) return;
        seen[key] = true;
        unique.push({ name: entry.name, logo: entry.logo });
      });

    return unique;
  }

  function fetchSchoolLogosFromGoogleSheet(sheetId, sheetGid) {
    return new Promise(function (resolve, reject) {
      var callbackName = '_arivuuSchoolLogosSheet_' + Math.random().toString(36).slice(2);
      var script = document.createElement('script');
      var settled = false;

      function cleanup() {
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
      }

      function finish(err, data) {
        if (settled) return;
        settled = true;
        cleanup();
        if (err) reject(err);
        else resolve(data);
      }

      window[callbackName] = function (payload) {
        try {
          if (!payload || payload.status !== 'ok') {
            throw new Error('Google Sheets query failed');
          }
          var logos = logosFromSheetTable(payload.table);
          finish(null, logos);
        } catch (error) {
          finish(error);
        }
      };

      script.onerror = function () {
        finish(new Error('Failed to fetch Google Sheet'));
      };

      var url = 'https://docs.google.com/spreadsheets/d/' +
        encodeURIComponent(sheetId) +
        '/gviz/tq?tqx=out:json;responseHandler:' + callbackName;
      if (sheetGid) {
        url += '&gid=' + encodeURIComponent(sheetGid);
      }
      script.src = url;
      document.head.appendChild(script);
    });
  }

  window.Arivuu = window.Arivuu || {};
  window.Arivuu.loadSchoolLogos = function () {
    var env = window.ARIVUU_ENV || {};
    var sheetId = String(env.ARIVUU_SCHOOL_LOGOS_GOOGLE_SHEET_ID || '').trim();
    if (!sheetId) {
      return Promise.reject(new Error('School logos Google Sheet ID is not configured.'));
    }
    return fetchSchoolLogosFromGoogleSheet(sheetId, env.ARIVUU_SCHOOL_LOGOS_GOOGLE_SHEET_GID);
  };
})();
