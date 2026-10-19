(function () {
  var list = document.getElementById('pub-list');
  if (!list) return;
  var data = (window.PUBLICATIONS || []).slice().sort(function (a, b) { return b.y - a.y; });
  var q = document.getElementById('pub-q'),
      yr = document.getElementById('pub-year'),
      chips = document.getElementById('pub-themes'),
      count = document.getElementById('pub-count'),
      clear = document.getElementById('pub-clear');
  var theme = '';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // Year options
  var seen = {};
  data.forEach(function (p) {
    if (!seen[p.y]) {
      seen[p.y] = 1;
      var o = document.createElement('option');
      o.value = p.y; o.textContent = p.y;
      yr.appendChild(o);
    }
  });

  // Theme chips
  var themes = [];
  data.forEach(function (p) {
    (p.th || []).forEach(function (t) { if (themes.indexOf(t) < 0) themes.push(t); });
  });
  themes.sort();
  function addChip(label, val) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = label;
    b.setAttribute('data-v', val);
    b.setAttribute('aria-pressed', val === theme ? 'true' : 'false');
    chips.appendChild(b);
  }
  function syncChips() {
    [].forEach.call(chips.children, function (c) {
      c.setAttribute('aria-pressed', c.getAttribute('data-v') === theme ? 'true' : 'false');
    });
  }
  addChip('All themes', '');
  themes.forEach(function (t) { addChip(t, t); });

  chips.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.chip') : null;
    if (!b) return;
    theme = b.getAttribute('data-v');
    syncChips();
    render();
  });
  q.addEventListener('input', render);
  yr.addEventListener('change', render);
  clear.addEventListener('click', function () {
    q.value = ''; yr.value = ''; theme = '';
    syncChips();
    render();
  });

  function render() {
    var term = (q.value || '').trim().toLowerCase();
    var y = yr.value, html = '', n = 0, last = null, open = false;
    data.forEach(function (p) {
      if (y && String(p.y) !== y) return;
      if (theme && (p.th || []).indexOf(theme) < 0) return;
      if (term && (p.t + ' ' + p.a + ' ' + p.j).toLowerCase().indexOf(term) < 0) return;
      n++;
      if (p.y !== last) {
        if (open) html += '</ul></div>';
        html += '<div class="pub-group"><h3 class="pub-year">' + p.y + '</h3><ul class="pub-items">';
        last = p.y; open = true;
      }
      var venue = [p.j, p.c].filter(Boolean).map(esc).join(' <span>&middot;</span> ');
      var badge = p.s ? '<span class="badge">' + esc(p.s) + '</span>' : '';
      var link = p.doi ? ' <a href="' + esc(p.doi) + '" target="_blank" rel="noopener">DOI &#8599;</a>' : '';
      html += '<li><p class="pub-title">' + esc(p.t) + '</p><p class="pub-auth">' + esc(p.a) + '</p>' +
              ((venue || badge || link) ? '<p class="pub-venue">' + venue + badge + link + '</p>' : '') + '</li>';
    });
    if (open) html += '</ul></div>';
    list.innerHTML = html || '<p class="mute pub-empty">No publications match these filters.</p>';
    var total = data.length;
    count.textContent = (n === total ? total + ' publications' : n + ' of ' + total + ' publications') +
      (total ? '  \u00b7  ' + data[total - 1].y + '\u2013' + data[0].y : '');
  }
  render();
})();
