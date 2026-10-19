(function () {
var list = document.getElementById('pub-list');
if (!list) return;
var data = (window.PUBLICATIONS || []).slice().sort(function (a, b) {
return b.y - a.y;
});
function esc(s) {
return String(s || '').replace(/[&<>"]/g, function (c) {
return { '&': '&', '<': '<', '>': '>', '"': '"' }[c];
});
}
var html = '', last = null, open = false;
data.forEach(function (p) {
if (p.y !== last) {
if (open) html += '</ul></div>';
html += '<div class="pub-group"><h3 class="pub-year">' + p.y + '</h3><ul class="pub-items">';
last = p.y;
open = true;
}
var venue = [p.j, p.c].filter(Boolean).map(esc).join(' <span>·</span> ');
var badge = p.s ? '<span class="badge">' + esc(p.s) + '</span>' : '';
var link = p.doi ? ' <a href="' + esc(p.doi) + '" target="_blank" rel="noopener">DOI ↗</a>' : '';
html += '<li>' +
          '<p class="pub-title">' + esc(p.t) + '</p>' +
          '<p class="pub-auth">' + esc(p.a) + '</p>' +
          ((venue || badge || link) ? '<p class="pub-venue">' + venue + badge + link + '</p>' : '') +
        '</li>';
});
if (open) html += '</ul></div>';
list.innerHTML = html || '<p class="mute pub-empty">No publications found.</p>';
})();