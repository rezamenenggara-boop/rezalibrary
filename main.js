/* ============================================================
   Logika halaman: render daftar, search, filter, kategori,
   tokoh, keuangan, dan detail catatan. Tanpa library eksternal.
   ============================================================ */

(function () {
  "use strict";

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function catLabel(id) {
    var c = CATEGORIES.filter(function (x) { return x.id === id; })[0];
    return c ? c.label : id;
  }

  function formatDate(s) {
    if (!s) return "";
    var d = new Date(s);
    if (isNaN(d.getTime())) return s;
    var bulan = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
    return d.getDate() + " " + bulan[d.getMonth()] + " " + d.getFullYear();
  }

  function byDateDesc(a, b) { return (b.date || "").localeCompare(a.date || ""); }

  function noteCard(n) {
    var tags = (n.tags || []).map(function (t) { return '<span class="tag">#' + t + '</span>'; }).join(" ");
    return '' +
      '<article class="card">' +
        '<div class="card-meta">' +
          '<span class="badge">' + n.source + '</span>' +
          '<span class="badge badge-cat">' + catLabel(n.category) + '</span>' +
          '<span class="card-date">' + formatDate(n.date) + '</span>' +
        '</div>' +
        '<h2 class="card-title"><a href="catatan.html?id=' + encodeURIComponent(n.id) + '">' + n.title + '</a></h2>' +
        '<p class="card-excerpt">' + (n.excerpt || "") + '</p>' +
        '<div class="card-foot">' +
          '<span class="card-tokoh">' + (n.tokoh ? "Tokoh: " + n.tokoh : "") + '</span>' +
          '<span class="card-tags">' + tags + '</span>' +
        '</div>' +
      '</article>';
  }

  /* ---------- Halaman Utama (daftar + search + filter) ---------- */
  function renderIndex() {
    var listEl = $("#note-list");
    var searchEl = $("#search");
    var filterEl = $("#filters");
    var countEl = $("#count");
    var activeCat = "semua";
    var query = "";

    var chips = ['<button class="chip active" data-cat="semua">Semua</button>'];
    CATEGORIES.forEach(function (c) {
      chips.push('<button class="chip" data-cat="' + c.id + '">' + c.label + '</button>');
    });
    filterEl.innerHTML = chips.join("");

    function apply() {
      var q = query.trim().toLowerCase();
      var items = NOTES.slice().sort(byDateDesc).filter(function (n) {
        if (activeCat !== "semua" && n.category !== activeCat) return false;
        if (!q) return true;
        var hay = [n.title, n.excerpt, n.tokoh, n.source, catLabel(n.category)]
          .concat(n.tags || []).join(" ").toLowerCase();
        return hay.indexOf(q) !== -1;
      });
      listEl.innerHTML = items.length
        ? items.map(noteCard).join("")
        : '<p class="empty">Tidak ada catatan yang cocok.</p>';
      if (countEl) countEl.textContent = items.length + " catatan";
    }

    filterEl.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      $all(".chip", filterEl).forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      activeCat = btn.getAttribute("data-cat");
      apply();
    });
    if (searchEl) searchEl.addEventListener("input", function (e) { query = e.target.value; apply(); });

    apply();
  }

  /* ---------- Halaman Kategori ---------- */
  function renderKategori() {
    var wrap = $("#kategori-list");
    var html = CATEGORIES.map(function (c) {
      var items = NOTES.filter(function (n) { return n.category === c.id; }).sort(byDateDesc);
      if (!items.length) return "";
      var lis = items.map(function (n) {
        return '<li><a href="catatan.html?id=' + encodeURIComponent(n.id) + '">' + n.title + '</a>' +
          '<span class="muted"> — ' + n.source + '</span></li>';
      }).join("");
      return '<section class="group">' +
        '<h2 class="group-title">' + c.label + ' <span class="count">' + items.length + '</span></h2>' +
        '<ul class="link-list">' + lis + '</ul></section>';
    }).join("");
    wrap.innerHTML = html || '<p class="empty">Belum ada catatan.</p>';
  }

  /* ---------- Halaman Tokoh ---------- */
  function renderTokoh() {
    var wrap = $("#tokoh-list");
    var map = {};
    NOTES.forEach(function (n) {
      var t = n.tokoh || "Lainnya";
      (map[t] = map[t] || []).push(n);
    });
    var names = Object.keys(map).sort();
    var html = names.map(function (name) {
      var items = map[name].sort(byDateDesc);
      var info = (typeof TOKOH !== "undefined" && TOKOH[name]) ? TOKOH[name] : null;
      var lis = items.map(function (n) {
        return '<li><a href="catatan.html?id=' + encodeURIComponent(n.id) + '">' + n.title + '</a></li>';
      }).join("");
      return '<section class="group">' +
        '<h2 class="group-title">' + name + ' <span class="count">' + items.length + '</span></h2>' +
        (info && info.bio ? '<p class="muted">' + info.bio + '</p>' : '') +
        (info && info.profile ? '<p><a href="catatan.html?file=' + encodeURIComponent(info.profile) + '">Baca profil &rarr;</a></p>' : '') +
        '<ul class="link-list">' + lis + '</ul></section>';
    }).join("");
    wrap.innerHTML = html || '<p class="empty">Belum ada tokoh.</p>';
  }

  /* ---------- Halaman Keuangan ---------- */
  function renderKeuangan() {
    var notesEl = $("#keuangan-notes");
    var linksEl = $("#keuangan-links");
    var items = NOTES.filter(function (n) { return n.category === "keuangan"; }).sort(byDateDesc);
    notesEl.innerHTML = items.length ? items.map(noteCard).join("") : '<p class="empty">Belum ada catatan keuangan.</p>';
    if (linksEl && typeof EXTERNAL_LINKS !== "undefined") {
      linksEl.innerHTML = EXTERNAL_LINKS.map(function (l) {
        return '<li><a href="' + l.url + '" target="_blank" rel="noopener">' + l.label + ' &#8599;</a>' +
          (l.note ? '<span class="muted"> — ' + l.note + '</span>' : '') + '</li>';
      }).join("");
    }
  }

  /* ---------- Halaman Detail ---------- */
  function renderDetail() {
    var params = new URLSearchParams(location.search);
    var id = params.get("id");
    var fileParam = params.get("file");
    var note = null, file = fileParam;

    if (id) {
      note = NOTES.filter(function (n) { return n.id === id; })[0];
      if (note) file = note.file;
    }

    var headEl = $("#note-head");
    var bodyEl = $("#note-body");

    if (!file) { bodyEl.innerHTML = '<p class="empty">Catatan tidak ditemukan.</p>'; return; }

    if (note && headEl) {
      var tags = (note.tags || []).map(function (t) { return '<span class="tag">#' + t + '</span>'; }).join(" ");
      var src = note.sourceUrl
        ? '<a href="' + note.sourceUrl + '" target="_blank" rel="noopener">' + note.source + ' &#8599;</a>'
        : note.source;
      headEl.innerHTML =
        '<div class="card-meta">' +
          '<span class="badge">' + src + '</span>' +
          '<span class="badge badge-cat">' + catLabel(note.category) + '</span>' +
          '<span class="card-date">' + formatDate(note.date) + '</span>' +
        '</div>' +
        (note.tokoh ? '<p class="note-tokoh">Tokoh: <a href="tokoh.html">' + note.tokoh + '</a></p>' : '') +
        (tags ? '<div class="card-tags">' + tags + '</div>' : '');
      document.title = note.title + " — " + SITE.title;
    }

    fetch(file)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (md) { bodyEl.innerHTML = Markdown.render(md); })
      .catch(function () {
        bodyEl.innerHTML = '<p class="empty">Gagal memuat catatan. Jika kamu membuka file langsung dari komputer (file://), ' +
          'jalankan lewat GitHub Pages atau server lokal agar file .md bisa dibaca.</p>';
      });
  }

  /* ---------- Inisialisasi ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    $all("[data-site-title]").forEach(function (el) { el.textContent = SITE.title; });
    $all("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

    var page = document.body.getAttribute("data-page");
    if (page === "index") renderIndex();
    else if (page === "kategori") renderKategori();
    else if (page === "tokoh") renderTokoh();
    else if (page === "keuangan") renderKeuangan();
    else if (page === "detail") renderDetail();
  });
})();
