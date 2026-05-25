/* ============================================================
   Parser Markdown minimal — tanpa library eksternal.
   Mendukung: heading, paragraf, bold, italic, inline code, link,
   blockquote, list (ul/ol), code block (```), garis (---), tabel.
   ============================================================ */

var Markdown = (function () {
  "use strict";

  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function inline(text) {
    var codes = [];
    text = text.replace(/`([^`]+)`/g, function (m, c) {
      codes.push("<code>" + c + "</code>");
      return "\u0000" + (codes.length - 1) + "\u0000";
    });
    text = text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>');
    text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    text = text.replace(/\u0000(\d+)\u0000/g, function (m, i) { return codes[i]; });
    return text;
  }

  function fmt(text) { return inline(escapeHtml(text)); }

  function splitRow(row) {
    return row.replace(/^\s*\|/, "").replace(/\|\s*$/, "")
      .split("|").map(function (c) { return c.trim(); });
  }

  function render(md) {
    var lines = md.replace(/\r\n/g, "\n").split("\n");
    var out = [];
    var para = [];
    var quote = [];
    var list = null;
    var i, line;

    function flushPara() {
      if (para.length) { out.push("<p>" + fmt(para.join(" ")) + "</p>"); para = []; }
    }
    function flushQuote() {
      if (quote.length) {
        out.push("<blockquote>" + quote.map(function (q) { return fmt(q); }).join("<br>") + "</blockquote>");
        quote = [];
      }
    }
    function flushList() {
      if (list) {
        var tag = list.ordered ? "ol" : "ul";
        out.push("<" + tag + ">" + list.items.map(function (it) {
          return "<li>" + fmt(it) + "</li>";
        }).join("") + "</" + tag + ">");
        list = null;
      }
    }
    function flushAll() { flushPara(); flushQuote(); flushList(); }

    for (i = 0; i < lines.length; i++) {
      line = lines[i];

      /* Code block */
      if (/^```/.test(line)) {
        flushAll();
        var buf = [];
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) { buf.push(lines[i]); i++; }
        out.push("<pre><code>" + escapeHtml(buf.join("\n")) + "</code></pre>");
        continue;
      }

      /* Tabel */
      if (line.indexOf("|") !== -1 && i + 1 < lines.length &&
          /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1]) && lines[i + 1].indexOf("-") !== -1) {
        flushAll();
        var header = splitRow(line);
        i++; /* lewati baris pemisah */
        var rows = [];
        while (i + 1 < lines.length && lines[i + 1].indexOf("|") !== -1 && lines[i + 1].trim() !== "") {
          i++; rows.push(splitRow(lines[i]));
        }
        var t = "<table><thead><tr>";
        header.forEach(function (c) { t += "<th>" + fmt(c) + "</th>"; });
        t += "</tr></thead><tbody>";
        rows.forEach(function (r) {
          t += "<tr>";
          r.forEach(function (c) { t += "<td>" + fmt(c) + "</td>"; });
          t += "</tr>";
        });
        t += "</tbody></table>";
        out.push(t);
        continue;
      }

      /* Heading */
      var h = line.match(/^(#{1,6})\s+(.*)$/);
      if (h) { flushAll(); out.push("<h" + h[1].length + ">" + fmt(h[2]) + "</h" + h[1].length + ">"); continue; }

      /* Garis horizontal */
      if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { flushAll(); out.push("<hr>"); continue; }

      /* Blockquote */
      var bq = line.match(/^\s*>\s?(.*)$/);
      if (bq) { flushPara(); flushList(); quote.push(bq[1]); continue; } else { flushQuote(); }

      /* List tak berurut */
      var ul = line.match(/^\s*[-*+]\s+(.*)$/);
      if (ul) {
        flushPara();
        if (!list || list.ordered) { flushList(); list = { ordered: false, items: [] }; }
        list.items.push(ul[1]); continue;
      }
      /* List berurut */
      var ol = line.match(/^\s*\d+\.\s+(.*)$/);
      if (ol) {
        flushPara();
        if (!list || !list.ordered) { flushList(); list = { ordered: true, items: [] }; }
        list.items.push(ol[1]); continue;
      }

      /* Baris kosong */
      if (line.trim() === "") { flushAll(); continue; }

      /* Paragraf */
      flushList();
      para.push(line.trim());
    }

    flushAll();
    return out.join("\n");
  }

  return { render: render };
})();
