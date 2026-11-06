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
 *  - a "We're here to help!" band with the councillors' phone and email, above the pledges,
 *    in place of the page's own councillor list lower down
 *  - a "You asked - we delivered!" panel (the ward's `delivered` list), below the pledges
 *  - an "Investing in <ward>" summary of the council's capital spend there (capital.json)
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

  // "+447973712852" or "07973712852" -> "07973 712852"
  function prettyPhone(p) {
    var d = (p || "").replace(/[^\d+]/g, "").replace(/^\+44/, "0");
    return /^0\d{10}$/.test(d) ? d.slice(0, 5) + " " + d.slice(5) : p;
  }

  // The out-card's "We're here to help!" band, with each councillor's phone and email.
  // It replaces the page's own councillor list lower down (hidden by body.sl-help-shown in site.css).
  function buildHelp(ward) {
    var people = ward.councillors || [];
    var candidates = ward.candidates || []; // Labour candidates standing alongside the ward's councillors
    var band = el("div", "sl-help");
    var top = el("div", "sl-help-top");
    top.appendChild(el("h2", "sl-display sl-yellow", "We're here to help!"));
    var box = el("div", "sl-help-box");
    var who = people.length > 1 ? "Your " + (COUNT[people.length] || "") + " local councillors" : "Your local councillor";
    if (candidates.length) who += " and Labour candidate" + (candidates.length > 1 ? "s" : "");
    box.appendChild(el("p", null, people.length > 1 || candidates.length
      ? who + " work for you all year round. Tell us what needs fixing in your street and we will act on it. No issue is too small. Call or email us and we will get back to you."
      : "Your local councillor works for you all year round. Tell me what needs fixing in your street and I will act on it. No issue is too small. Call or email and I will get back to you."));
    top.appendChild(box);
    band.appendChild(top);
    var list = el("div", "sl-help-people");
    people.concat(candidates).forEach(function (c) {
      var isCandidate = candidates.indexOf(c) > -1;
      var card = el("div", "sl-help-person");
      if (c.photo) {
        var img = el("img");
        img.src = base + c.photo;
        img.alt = c.name;
        img.loading = "lazy";
        card.appendChild(img);
      }
      card.appendChild(el("b", null, isCandidate ? c.name : "Cllr " + c.name));
      if (isCandidate) card.appendChild(el("span", "sl-help-role", "Labour candidate"));
      [c.phone, c.landline].forEach(function (n) { // mobile, then landline if there is one
        if (!n) return;
        var tel = el("a", "sl-help-phone", prettyPhone(n));
        tel.href = "tel:" + n.replace(/\s+/g, "");
        card.appendChild(tel);
      });
      if (c.email) {
        var mail = el("a", "sl-help-email", c.email);
        mail.href = "mailto:" + c.email;
        card.appendChild(mail);
      }
      list.appendChild(card);
    });
    band.appendChild(list);
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

  // "Out and about": a few photos of the councillors at local events (wards.json gallery)
  function buildGallery(ward) {
    var box = el("div", "sl-budget sl-gallery");
    var head = el("h4", "sl-budget-head");
    head.appendChild(document.createTextNode("Out and about "));
    head.appendChild(el("span", "sl-bar", "|"));
    head.appendChild(el("span", "sl-cy", "Allan yn y gymuned"));
    box.appendChild(head);
    var grid = el("div", "sl-gallery-grid");
    ward.gallery.forEach(function (p, i) {
      var fig = el("figure");
      var btn = el("button", "sl-gallery-open");
      btn.type = "button";
      btn.setAttribute("aria-label", "Enlarge photo: " + p.caption);
      var img = el("img");
      img.src = base + p.photo;
      img.alt = p.alt || p.caption;
      img.loading = "lazy";
      btn.appendChild(img);
      btn.addEventListener("click", function () { openLightbox(ward.gallery, i); });
      fig.appendChild(btn);
      fig.appendChild(el("figcaption", null, p.caption));
      grid.appendChild(fig);
    });
    box.appendChild(grid);
    return box;
  }

  // Click a gallery photo to see it large; arrows/Escape on keyboard, tap outside to close
  function openLightbox(photos, start) {
    var i = start, opener = document.activeElement;
    var lb = el("div", "sl-lightbox");
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    var img = el("img"), cap = el("p", "sl-lightbox-cap");
    var close = el("button", "sl-lightbox-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "Close");
    var prev = el("button", "sl-lightbox-nav sl-lightbox-prev", "‹");
    var next = el("button", "sl-lightbox-nav sl-lightbox-next", "›");
    prev.type = next.type = "button";
    prev.setAttribute("aria-label", "Previous photo");
    next.setAttribute("aria-label", "Next photo");
    function show() {
      var p = photos[i];
      img.src = base + (p.full || p.photo);
      img.alt = p.alt || p.caption;
      cap.textContent = p.caption + "  (" + (i + 1) + " of " + photos.length + ")";
    }
    function step(d) { i = (i + d + photos.length) % photos.length; show(); }
    function shut() { document.removeEventListener("keydown", key); lb.remove(); document.body.style.overflow = ""; if (opener) opener.focus(); }
    function key(e) {
      if (e.key === "Escape") shut();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    }
    prev.addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
    next.addEventListener("click", function (e) { e.stopPropagation(); step(1); });
    close.addEventListener("click", shut);
    lb.addEventListener("click", function (e) { if (e.target === lb) shut(); });
    var fig = el("figure", "sl-lightbox-fig");
    fig.appendChild(img);
    fig.appendChild(cap);
    lb.appendChild(fig);
    if (photos.length > 1) { lb.appendChild(prev); lb.appendChild(next); }
    lb.appendChild(close);
    document.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    document.body.appendChild(lb);
    show();
    close.focus();
  }

  // 690946 -> "£691,000": £10,000 and over to the nearest thousand, smaller sums in full
  function money(n) { return "£" + (n >= 1e4 ? Math.round(n / 1e3) * 1e3 : Math.round(n)).toLocaleString("en-GB"); }
  // Headline figures, short so they fit the tiles: 1720000 -> "£1.7m", 130250 -> "£130k", 9500 -> "£9,500"
  function bigMoney(n) {
    if (n >= 999500) return "£" + (Math.round(n / 1e5) / 10) + "m";
    if (n >= 1e4) return "£" + Math.round(n / 1e3) + "k";
    return money(n);
  }
  function norm(s) { return String(s || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z]/g, ""); }

  // "Investing in <ward>": the council's capital spend in the ward since 2022, from capital.json
  function buildCapital(ward, cap) {
    var keys = ["roads", "schools", "schoolBuildings", "play", "communityFund"];
    var total = keys.reduce(function (sum, k) { return sum + (cap[k] || 0); }, 0);
    var box = el("div", "sl-budget sl-capital");
    var head = el("h4", "sl-budget-head");
    head.appendChild(document.createTextNode("Investing in " + ward.name + " "));
    head.appendChild(el("span", "sl-bar", "|"));
    head.appendChild(el("span", "sl-cy", "Buddsoddi yn eich cymuned"));
    box.appendChild(head);

    var big = el("div", "sl-capital-total");
    big.appendChild(el("b", null, bigMoney(total)));
    big.appendChild(el("span", null, "invested in " + ward.name + " by Swansea's Labour council since 2022, on top of the community budget"));
    box.appendChild(big);

    var stats = el("div", "sl-budget-stats");
    var words = {
      roads: "on resurfacing and repairing roads and pavements",
      schools: "on improving local schools",
      schoolBuildings: "on school buildings",
      play: "on new and improved play areas",
      communityFund: "from the Community Investment Fund for local projects"
    };
    keys.forEach(function (k) {
      if (!cap[k]) return;
      var tile = el("div", "sl-budget-stat");
      tile.appendChild(el("b", null, bigMoney(cap[k])));
      tile.appendChild(el("span", null, words[k]));
      stats.appendChild(tile);
    });
    if (cap.potholes) {
      var ph = el("div", "sl-budget-stat");
      ph.appendChild(el("b", null, cap.potholes.toLocaleString("en-GB")));
      ph.appendChild(el("span", null, "pothole repairs since January 2022"));
      stats.appendChild(ph);
    }
    box.appendChild(stats);

    var go = el("a", "sl-capital-map", "See what we've delivered on the map");
    go.href = "/delivering?ward=" + encodeURIComponent(cap.name);
    box.appendChild(go);
    box.appendChild(el("p", "sl-budget-note", "Swansea Council capital figures, May 2022 to May 2026. School improvements from April 2022, potholes to October 2026."));
    return box;
  }

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
    [[bigMoney(b.used),"spent or committed on local priorities since 2022"],
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
      // one scheme or a list of schemes; figures are optional
      var coming = [].concat(b.coming);
      var sum = coming.reduce(function (s, c) { return s + (c.amount || 0); }, 0);
      var next = el("div", "sl-budget-next");
      next.appendChild(el("b", null, "Coming next" + (sum ? ": " + money(sum) + " committed" : "")));
      if (coming.length === 1) next.appendChild(el("span", null, coming[0].name));
      else {
        var list = el("ul", "sl-budget-next-list");
        coming.forEach(function (c) {
          var li = el("li");
          li.appendChild(el("span", null, c.name + (c.status ? " (" + c.status + ")" : "")));
          if (c.amount) li.appendChild(el("span", "sl-budget-amount", money(c.amount)));
          list.appendChild(li);
        });
        next.appendChild(list);
      }
      if (b.comingNote) next.appendChild(el("p", "sl-budget-note", b.comingNote));
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

  function addTrials(h, ward, capital) {
    var row = h.closest(".row"); // the photo + pledges row
    if (!row) return;
    var after = row;
    function place(node) { after.parentNode.insertBefore(node, after.nextSibling); after = node; }
    if (ward.councillors && ward.councillors.length) {
      row.parentNode.insertBefore(buildHelp(ward), row);
      document.body.classList.add("sl-help-shown"); // hides the page's own councillor list
    }
    if (ward.delivered && ward.delivered.length) place(buildDelivered(ward));
    if (ward.gallery && ward.gallery.length) place(buildGallery(ward));
    var cap = ((capital && capital.wards) || []).filter(function (w) { return norm(w.name) === norm(ward.name); })[0];
    if (cap) place(buildCapital(ward, cap));
    if (ward.budget) place(buildBudget(ward));
  }

  function getJson(name) {
    return fetch(base + name, { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
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
    Promise.all([getJson("wards.json"), getJson("capital.json")])
      .then(function (res) {
        var ward = ((res[0] && res[0].wards) || []).filter(function (w) { return w.slug === slug; })[0];
        if (!ward) return;
        addAbout(h, ward);
        // the new sections: always on test2- pages, and on live pages once a ward is switched over
        if (testing || ward.newLayout) addTrials(h, ward, res[1]);
      })
      .catch(function () {});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
