/* Swansea Labour site script for every page on swansealabour.org (loaded after site.css).
 *
 * Squarespace: Website Tools > Code Injection > Header:
 *   <script src="https://news.swansealabour.org/site.js?v=1" defer></script>
 * Bump ?v= after each upload so phones load the new copy.
 *
 * On ward pages it:
 *  - tidies the pledge heading ("Our Pledges -" becomes "Our Pledges | Ein Haddewidion")
 *  - turns the pledge list into a tick list, like the out-card's "You asked - we delivered!"
 *  - adds a short "About the ward" box from wards.json (written from Swansea Council's
 *    ward profiles) under the pledges, unless the page already has its own "about" section
 */
(function () {
  var script = document.currentScript;
  var base = script ? script.src.replace(/site\.js(\?.*)?$/, "") : "https://news.swansealabour.org/";

  var TICK = '<svg viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="17" fill="#fbe70d"/><path d="M9 17.5l5.5 5.5L25 12" stroke="#e4003b" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function clean(s) { return (s || "").replace(/\u2705/g, "").replace(/\s+/g, " ").trim(); }

  function findPledgeHeading() {
    var heads = document.querySelectorAll(".sqs-html-content h3, .sqs-html-content h4");
    for (var i = 0; i < heads.length; i++) if (/pledge/i.test(heads[i].textContent)) return heads[i];
    return null;
  }

  // "Our Pledges -" -> "Our Pledges | Ein Haddewidion" (or "My Pledges | Fy Addewidion")
  function tidyHeading(h) {
    var english = clean(h.textContent).replace(/[\s\-\u2013\u2014:]+$/, "");
    var mine = /^my\b/i.test(english);
    h.textContent = "";
    h.appendChild(document.createTextNode(english + " "));
    h.appendChild(el("span", "sl-bar", "|"));
    h.appendChild(el("span", "sl-cy", mine ? "Fy Addewidion" : "Ein Haddewidion"));
    h.classList.add("sl-pledge-head");
  }

  // One pledge item (a list item, or a paragraph on pages that use them) -> {title, text}
  function readPledge(node) {
    var label = node.querySelector(".sqsrte-text-color--accent") || node.querySelector("strong");
    var all = clean(node.textContent);
    if (!label) return { title: "", text: all };
    var title = clean(label.textContent).replace(/[\s:\-\u2013]+$/, "");
    var labelText = clean(label.textContent);
    var rest = all.indexOf(labelText) === 0 ? all.slice(labelText.length) : all.replace(labelText, "");
    return { title: title, text: clean(rest).replace(/^[\s:\-\u2013\u2014]+/, "") };
  }

  function buildTicks(items) {
    var list = el("ul", "sl-pledges");
    items.forEach(function (p) {
      var li = el("li");
      li.innerHTML = TICK;
      var body = el("div");
      if (p.title) body.appendChild(el("b", null, p.title));
      if (p.text) body.appendChild(el("span", null, p.text));
      li.appendChild(body);
      list.appendChild(li);
    });
    return list;
  }

  function restylePledges(h) {
    var next = h.nextElementSibling;
    var nodes = [], items = [];
    if (next && (next.tagName === "UL" || next.tagName === "OL")) {
      nodes = [next];
      Array.prototype.forEach.call(next.children, function (li) { items.push(readPledge(li)); });
    } else {
      // Pages that list pledges as paragraphs, one per pledge
      while (next && next.tagName === "P" && next.querySelector(".sqsrte-text-color--accent, strong")) {
        nodes.push(next);
        items.push(readPledge(next));
        next = next.nextElementSibling;
      }
    }
    items = items.filter(function (p) { return p.title || p.text; });
    if (!items.length) return;
    nodes[0].parentNode.insertBefore(buildTicks(items), nodes[0]);
    nodes.forEach(function (n) { n.parentNode.removeChild(n); });
  }

  function hasOwnAbout() {
    var heads = document.querySelectorAll(".sqs-html-content h3, .sqs-html-content h4");
    for (var i = 0; i < heads.length; i++) if (/about (the|this)/i.test(heads[i].textContent)) return true;
    return false;
  }

  function addAbout(h) {
    if (hasOwnAbout()) return;
    var slug = location.pathname.replace(/^\/+|\/+$/g, "").split("/")[0];
    fetch(base + "wards.json", { cache: "no-cache" })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var ward = (data.wards || []).filter(function (w) { return w.slug === slug; })[0];
        if (!ward || !ward.about) return;
        var row = h.closest(".sqs-layout > .row") || h.closest(".row");
        if (!row) return;
        var box = el("div", "sl-about");
        var head = el("h4", "sl-about-head", "About " + ward.name);
        box.appendChild(head);
        box.appendChild(el("p", "sl-about-text", ward.about.text));
        var facts = el("ul", "sl-about-facts");
        (ward.about.facts || []).forEach(function (f) { facts.appendChild(el("li", null, f)); });
        box.appendChild(facts);
        var src = el("p", "sl-about-source", "From ");
        var a = el("a", null, ward.about.source);
        a.href = ward.about.sourceUrl;
        a.target = "_blank";
        a.rel = "noopener";
        src.appendChild(a);
        box.appendChild(src);
        row.parentNode.insertBefore(box, row.nextSibling);
      })
      .catch(function () {});
  }

  function run() {
    var h = findPledgeHeading();
    if (!h) return;
    tidyHeading(h);
    restylePledges(h);
    addAbout(h);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
