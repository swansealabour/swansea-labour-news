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
 *
 * On test pages (/test2-<ward slug>) it also trials, from wards.json:
 *  - a "We're here to help!" band, above the pledges, with a button down to the councillor list
 *  - a "You asked - we delivered!" panel (the ward's `delivered` list), below the pledges
 *  - a "Your community budget at work" summary (the ward's `budget`), below that
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

  function addAbout(h, ward) {
    if (hasOwnAbout() || !ward.about) return;
    var row = h.closest(".sqs-layout > .row") || h.closest(".row");
    if (!row) return;
    var box = el("div", "sl-about");
    var head = el("h4", "sl-about-head", "About " + ward.name);
    box.appendChild(head);
    if (ward.about.paras) {
      // Longer write-ups: short paragraphs with a bold lead-in ("Then.", "Today.")
      ward.about.paras.forEach(function (p) {
        var para = el("p", "sl-about-text");
        if (p.label) para.appendChild(el("b", null, p.label + ". "));
        para.appendChild(document.createTextNode(p.text));
        box.appendChild(para);
      });
    } else {
      box.appendChild(el("p", "sl-about-text", ward.about.text));
    }
    var facts = el("ul", "sl-about-facts");
    (ward.about.facts || []).forEach(function (f) { facts.appendChild(el("li", null, f)); });
    box.appendChild(facts);
    var src = el("p", "sl-about-source", ward.about.sourceLead || "From ");
    var a = el("a", null, ward.about.source);
    a.href = ward.about.sourceUrl;
    a.target = "_blank";
    a.rel = "noopener";
    src.appendChild(a);
    box.appendChild(src);
    row.parentNode.insertBefore(box, row.nextSibling);
  }

  // --- Trial sections, shown only on test pages (/test2-<ward slug>) until approved ---

  var COUNT = ["", "", "two", "three", "four", "five"];

  // The out-card's "We're here to help!" band. The councillors' photos and numbers are already
  // in the page's own councillor list, so the band just points down to it.
  function buildHelp(ward) {
    var people = ward.councillors || [];
    var band = el("div", "sl-help");
    var top = el("div", "sl-help-top");
    top.appendChild(el("h2", "sl-display sl-yellow", "We're here to help!"));
    var box = el("div", "sl-help-box");
    box.appendChild(el("p", null, people.length > 1
      ? "Your " + (COUNT[people.length] || "") + " local councillors work for you all year round. Tell us what needs fixing in your street and we will act on it. No issue is too small. Call or email us and we will get back to you."
      : "Your local councillor works for you all year round. Tell me what needs fixing in your street and I will act on it. No issue is too small. Call or email and I will get back to you."));
    var list = document.querySelector(".user-items-list-section");
    if (list) {
      list.id = list.id || "sl-councillors";
      var go = el("a", "sl-help-go", people.length > 1 ? "Contact your councillors" : "Contact your councillor");
      go.href = "#" + list.id;
      go.addEventListener("click", function (e) { // the page doesn't jump to #links on its own
        e.preventDefault();
        list.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      box.appendChild(go);
    }
    top.appendChild(box);
    band.appendChild(top);
    return band;
  }

  // The out-card's "You asked - we delivered!" panel for this ward
  function buildDelivered(ward) {
    var panel = el("div", "sl-delivered");
    var intro = el("div", "sl-delivered-intro");
    var h = el("h2", "sl-display");
    h.innerHTML = "You asked &ndash;<br><span class=\"sl-yellow\">we delivered!</span>";
    intro.appendChild(h);
    intro.insertAdjacentHTML("beforeend", '<svg class="sl-underline" viewBox="0 0 260 18" preserveAspectRatio="none" aria-hidden="true"><path d="M4 12 C 60 4, 140 3, 256 8" stroke="#fbe70d" stroke-width="5" fill="none" stroke-linecap="round"/></svg>');
    intro.appendChild(el("p", null, "Here's what your Labour councillors have delivered for " + ward.name + "."));
    panel.appendChild(intro);
    var list = el("ul", "sl-delivered-list");
    ward.delivered.forEach(function (d) {
      var li = el("li");
      li.innerHTML = TICK;
      var body = el("div");
      body.appendChild(el("b", null, d.title));
      body.appendChild(el("span", null, d.text));
      li.appendChild(body);
      list.appendChild(li);
    });
    panel.appendChild(list);
    return panel;
  }

  function money(n) { return "£" + Math.round(n).toLocaleString("en-GB"); }

  // "Your community budget at work": headline figures, spend by theme, what's coming, groups backed
  function buildBudget(ward) {
    var b = ward.budget;
    var box = el("div", "sl-budget");
    var head = el("h4", "sl-budget-head");
    head.appendChild(document.createTextNode("Your community budget at work "));
    head.appendChild(el("span", "sl-bar", "|"));
    head.appendChild(el("span", "sl-cy", "Eich cyllideb gymunedol ar waith"));
    box.appendChild(head);
    box.appendChild(el("p", "sl-budget-intro", "Our community budget lets us fund local priorities quickly, from play areas and parking to the clubs and groups that keep " +
      ward.name + " going. Here's how we've used it since 2022."));

    var stats = el("div", "sl-budget-stats");
    [[money(b.used), "spent or committed of our " + money(b.total) + " budget for " + b.period],
     [String(b.payments), "local projects, grants and events paid for"],
     [String(b.grants), "grants to local groups, clubs and charities"]].forEach(function (s) {
      var tile = el("div", "sl-budget-stat");
      tile.appendChild(el("b", null, s[0]));
      tile.appendChild(el("span", null, s[1]));
      stats.appendChild(tile);
    });
    box.appendChild(stats);

    var bars = el("div", "sl-budget-bars");
    bars.appendChild(el("h5", null, "Where the money has gone"));
    var max = Math.max.apply(null, b.themes.map(function (t) { return t.amount; }));
    b.themes.forEach(function (t) {
      var row = el("div", "sl-budget-bar");
      row.appendChild(el("span", "sl-budget-label", t.name));
      var track = el("span", "sl-budget-track");
      var fill = el("span", "sl-budget-fill");
      fill.style.width = Math.max(3, Math.round(t.amount / max * 100)) + "%";
      track.appendChild(fill);
      row.appendChild(track);
      row.appendChild(el("span", "sl-budget-amount", money(t.amount)));
      bars.appendChild(row);
    });
    box.appendChild(bars);

    if (b.coming) {
      var next = el("div", "sl-budget-next");
      next.appendChild(el("b", null, "Coming next: " + money(b.coming.amount) + " committed"));
      next.appendChild(el("span", null, b.coming.name));
      box.appendChild(next);
    }

    if (b.groups && b.groups.length) {
      box.appendChild(el("h5", null, "Groups and clubs we've backed"));
      var pills = el("ul", "sl-budget-groups");
      b.groups.forEach(function (g) { pills.appendChild(el("li", null, g)); });
      box.appendChild(pills);
    }
    box.appendChild(el("p", "sl-budget-note", "Figures to " + b.asOf + ". " + (b.note || "")));
    return box;
  }

  function addTrials(h, ward) {
    var row = h.closest(".row"); // the photo + pledges row
    if (!row) return;
    var after = row;
    function place(node) { after.parentNode.insertBefore(node, after.nextSibling); after = node; }
    if (ward.councillors && ward.councillors.length) row.parentNode.insertBefore(buildHelp(ward), row);
    if (ward.delivered && ward.delivered.length) place(buildDelivered(ward));
    if (ward.budget) place(buildBudget(ward));
  }

  function run() {
    var h = findPledgeHeading();
    if (!h) return;
    document.body.classList.add("sl-ward-page"); // ward title style in site.css
    tidyHeading(h);
    restylePledges(h);
    var slug = location.pathname.replace(/^\/+|\/+$/g, "").split("/")[0];
    var testing = slug.indexOf("test2-") === 0;
    if (testing) {
      slug = slug.slice("test2-".length);
      document.body.classList.add("sl-trial"); // trial styles in site.css
    }
    fetch(base + "wards.json", { cache: "no-cache" })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var ward = (data.wards || []).filter(function (w) { return w.slug === slug; })[0];
        if (!ward) return;
        addAbout(h, ward);
        if (testing) addTrials(h, ward);
      })
      .catch(function () {});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
