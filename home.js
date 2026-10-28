/* Swansea Labour homepage design (out-card style)
 *
 * Squarespace Code Block (one per spot on the page; the script only needs adding once):
 *   <div class="sl-home" data-show="welcome delivered ospreys"></div>
 *   <script src="https://news.swansealabour.org/home.js" defer></script>
 *
 * data-show takes any of: welcome, delivered, ospreys, help (in the order given).
 *
 * The script also loads the out-card fonts (Anton, Bebas Neue, Caveat, Kaushan Script)
 * and restyles the homepage's own Squarespace sections: the hero, the "Help build a
 * better Swansea" banner, the newsletter heading and any .slh-head headings.
 * No green anywhere: it reads as Plaid Cymru.
 */
(function () {
  if (window.__slHome) return;
  window.__slHome = true;

  var script = document.currentScript;
  var base = script ? script.src.replace(/home\.js(\?.*)?$/, "") : "https://news.swansealabour.org/";
  var img = base + "images/";

  // Homepage sections in Squarespace (section ids from the live page)
  var HERO = 'section[data-section-id="619e7534def5fe401f3b96f5"]';
  var INVOLVED = 'section[data-section-id="619e757e6ebed759bec52176"]';
  var SIGNUP = 'section[data-section-id="619e75b465d5737e2e29c46e"]';
  // Old intro blocks (Rob's photo and quote) replaced by data-show="welcome", and the ward list
  var OLD_PHOTO = "#block-yui_3_17_2_1_1638340028038_7733";
  var OLD_QUOTE = "#block-c0cf8569770c9d04e5fb";
  var WARDS = "#block-yui_3_17_2_1_1791318729275_13605";

  var fonts = document.createElement("link");
  fonts.rel = "stylesheet";
  fonts.href = "https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Caveat:wght@600&family=Kaushan+Script&display=swap";
  document.head.appendChild(fonts);

  var css = [
    ":root{--slh-red:#e4003b;--slh-red-dark:#b8002f;--slh-yellow:#fbe70d;--slh-ink:#1c1c1c}",
    ".sl-home{display:block;width:100%;container-type:inline-size;line-height:1.6}",
    ".sl-home *{box-sizing:border-box}",
    ".sl-home > * + *{margin-top:56px}",
    ".slh-display{font-family:Anton,sans-serif;font-weight:400;text-transform:uppercase;line-height:1.02;letter-spacing:.5px;margin:0}",
    ".slh-yellow{color:var(--slh-yellow)!important;text-shadow:3px 3px 0 rgba(0,0,0,.25)}",
    ".slh-head{display:table;font-family:'Bebas Neue',sans-serif!important;font-weight:400!important;font-style:normal!important;font-size:clamp(32px,4vw,44px)!important;line-height:1!important;letter-spacing:.5px!important;" +
      "text-transform:none;margin:0 0 22px!important;padding:10px 18px 5px;background:var(--slh-red);color:#fff!important;border-radius:3px;box-shadow:3px 3px 0 rgba(0,0,0,.18)}",
    ".slh-head .cy{color:var(--slh-yellow)}",
    ".slh-head .bar{opacity:.55;margin:0 6px}",
    ".slh-head.slh-stack .bar{display:none}.slh-head.slh-stack .cy{display:block;margin-top:4px}",
    ".slh-btn{display:inline-block;font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:1px;line-height:1.2;padding:10px 26px 8px;border-radius:4px;text-decoration:none!important;transition:transform .15s}",
    ".slh-btn:hover{transform:translateY(-2px)}",
    ".slh-btn-yellow{background:var(--slh-yellow);color:var(--slh-red-dark)!important;box-shadow:3px 3px 0 rgba(0,0,0,.25)}",
    ".slh-btn-red{background:var(--slh-red);color:#fff!important;box-shadow:3px 3px 0 rgba(0,0,0,.18)}",

    // Welcome: Rob's quote and polaroid
    ".slh-welcome{display:grid;grid-template-columns:1.35fr 1fr;gap:48px;align-items:center}",
    ".slh-quote{font-size:20px;font-style:italic;line-height:1.5;border-left:5px solid var(--slh-red);padding-left:20px;margin:0 0 10px}",
    ".slh-quote-by{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:.5px;padding-left:25px;margin:0 0 22px}",
    ".slh-welcome p{margin:0 0 14px}",
    ".slh-polaroid{position:relative;background:#fff;padding:14px 14px 58px;box-shadow:0 10px 28px rgba(0,0,0,.18);transform:rotate(3deg);max-width:340px;width:100%;justify-self:center;margin:0}",
    ".slh-polaroid img{display:block;width:100%;aspect-ratio:1/1;object-fit:cover;object-position:50% 30%}",
    ".slh-polaroid figcaption{position:absolute;left:0;right:0;bottom:10px;text-align:center;font-family:Caveat,cursive;font-size:30px;color:var(--slh-ink)}",
    ".slh-pin{position:absolute;top:-12px;left:50%;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ff6b8a,var(--slh-red) 55%,#8a0022);box-shadow:2px 3px 4px rgba(0,0,0,.3)}",

    // You asked - we delivered
    ".slh-panel{background:var(--slh-red);color:#fff;border:6px solid var(--slh-yellow);border-radius:6px;padding:40px 44px;display:grid;grid-template-columns:1fr 1.5fr;gap:36px}",
    ".slh-panel h2{font-size:clamp(40px,5.2cqi,58px);color:#fff}",
    ".slh-underline{display:block;width:240px;max-width:100%;height:18px;margin-top:4px}",
    ".slh-panel .slh-intro{margin:20px 0 24px;font-size:17px}",
    ".slh-ticks{list-style:none;margin:0;padding:0;display:grid;gap:18px}",
    ".slh-ticks li{display:grid;grid-template-columns:34px 1fr;gap:14px;align-items:start;margin:0;padding:0}",
    ".slh-ticks li::before{content:none}",
    ".slh-ticks svg{width:34px;height:34px}",
    ".slh-ticks b{font-family:'Bebas Neue',sans-serif;font-weight:400;font-size:25px;letter-spacing:.5px;display:block;line-height:1.1;color:var(--slh-yellow)}",
    ".slh-ticks span{font-size:16px}",

    // Ospreys: leaflet-style black box
    ".slh-ospreys{background:#111;color:#fff;border-radius:6px;overflow:hidden;display:grid;grid-template-columns:1.15fr 1fr}",
    ".slh-ospreys-photo{position:relative;min-height:360px;margin:0}",
    ".slh-ospreys-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}",
    ".slh-ospreys-photo figcaption{position:absolute;right:10px;bottom:10px;font-size:12px;background:rgba(0,0,0,.6);color:#fff;padding:2px 8px;border-radius:3px}",
    ".slh-ospreys-text{padding:32px 40px 34px}",
    ".slh-ospreys-badge{width:104px;height:auto;display:block;margin:-6px 0 14px -8px}",
    ".slh-ospreys-text h2{font-size:clamp(36px,4.6cqi,46px);margin-bottom:14px}",
    ".slh-ospreys-text p{margin:0 0 12px;font-size:16px;color:#fff}",
    ".slh-ospreys-quote{font-style:italic;border-left:4px solid var(--slh-yellow);padding-left:14px;margin:18px 0!important}",
    ".slh-ospreys-text .slh-keep{font-family:Anton,sans-serif;text-transform:uppercase;color:var(--slh-yellow);font-size:30px;letter-spacing:.5px;margin:6px 0 0}",

    // We're here to help
    ".slh-help{background:var(--slh-red);color:#fff;border-radius:6px;padding:44px;display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center}",
    ".slh-help h2{font-size:clamp(48px,7cqi,80px)}",
    ".slh-dashed{border:3px dashed var(--slh-yellow);border-radius:12px;padding:28px 30px;text-align:center}",
    ".slh-dashed p{font-family:'Bebas Neue',sans-serif;font-size:28px;line-height:1.15;margin:0 0 20px;letter-spacing:.3px;color:#fff}",

    // Narrow columns and phones
    "@container (max-width:760px){",
    ".slh-welcome,.slh-panel,.slh-ospreys,.slh-help{grid-template-columns:1fr}",
    // Narrow: heading, then Rob's photo, then the quote and intro
    ".slh-welcome{display:flex;flex-direction:column;gap:0}",
    ".slh-welcome-text{display:contents}",
    ".slh-welcome .slh-head{order:1;align-self:flex-start}",
    ".slh-welcome-text > :not(.slh-head){order:3}",
    ".slh-welcome .slh-polaroid{order:2;max-width:270px;margin:8px auto 34px;padding:10px 10px 46px}",
    ".slh-welcome .slh-polaroid figcaption{font-size:25px;bottom:8px}",
    ".slh-panel{padding:30px 22px}",
    ".slh-ospreys-photo{min-height:0;aspect-ratio:16/9}",
    ".slh-ospreys-text{padding:24px 22px 26px}",
    ".slh-ospreys-badge{width:84px}",
    ".slh-help{padding:30px 22px}",
    ".slh-quote{font-size:18px}",
    "}",
    "@media (max-width:640px){.slh-head .cy{display:block}.slh-head .bar{display:none}}",

    // Squarespace hero: yellow Anton headline over a light red fade
    HERO + " .section-background::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,rgba(228,0,59,.8) 0%,rgba(228,0,59,.5) 35%,rgba(228,0,59,0) 58%)}",
    "@media (max-width:767px){" + HERO + " .section-background::after{background:linear-gradient(0deg,rgba(228,0,59,.7) 0%,rgba(228,0,59,.35) 45%,rgba(228,0,59,0) 75%)}}",
    HERO + " h1," + HERO + " h1 span{font-family:Anton,sans-serif!important;font-weight:400!important;text-transform:uppercase;color:var(--slh-yellow)!important;line-height:1.02!important;letter-spacing:.5px;text-shadow:3px 3px 0 rgba(0,0,0,.25)}",
    HERO + " h1{font-size:clamp(52px,8vw,112px)!important}",
    HERO + " p{text-shadow:0 1px 4px rgba(0,0,0,.45)}",
    HERO + " .sqs-block-code a{font-family:'Bebas Neue',sans-serif!important;font-size:22px!important;letter-spacing:1px!important;padding:10px 26px 8px!important;border-radius:4px!important;background:transparent!important;border:2px solid #fff!important;color:#fff!important}",
    HERO + " .sqs-block-code a:first-child{background:var(--slh-yellow)!important;border-color:var(--slh-yellow)!important;color:var(--slh-red-dark)!important;box-shadow:3px 3px 0 rgba(0,0,0,.25)}",

    // "Help build a better Swansea" banner
    INVOLVED + " h2,"+ INVOLVED + " h2 span{font-family:Anton,sans-serif!important;font-weight:400!important;text-transform:uppercase;color:var(--slh-yellow)!important;line-height:1.02!important;text-shadow:3px 3px 0 rgba(0,0,0,.25)}",
    INVOLVED + " h2{font-size:clamp(46px,6.5vw,90px)!important}",
    INVOLVED + " h2::after{content:'If you value it, vote for it!';display:block;font-family:'Kaushan Script',cursive;text-transform:none;color:#fff;font-size:.45em;transform:rotate(-4deg);transform-origin:left;margin:14px 0 4px;text-shadow:none}",
    INVOLVED + " .sqs-block-button-element{font-family:'Bebas Neue',sans-serif!important;font-size:22px!important;letter-spacing:1px!important;background:var(--slh-yellow)!important;color:var(--slh-red-dark)!important;border-radius:4px!important;box-shadow:3px 3px 0 rgba(0,0,0,.25)}",

    // Newsletter heading as a red label
    SIGNUP + " h4{display:table;font-family:'Bebas Neue',sans-serif!important;font-size:34px!important;line-height:1.05!important;padding:10px 18px 5px;background:var(--slh-red);color:#fff!important;border-radius:3px;box-shadow:3px 3px 0 rgba(0,0,0,.18)}",
    SIGNUP + " h4 strong," + SIGNUP + " h4 em{font-weight:400;font-style:normal}",

    // Intro section: hide the old photo and quote, show the ward list as red pills
    OLD_PHOTO + "," + OLD_QUOTE + "{display:none!important}",
    WARDS + " p:nth-of-type(2){font-size:0!important;display:flex;flex-wrap:wrap;gap:8px}",
    WARDS + " p:nth-of-type(2) a{font-size:14px;font-weight:600;line-height:1.4;text-decoration:none!important;border:2px solid var(--slh-red);color:var(--slh-red)!important;border-radius:30px;padding:3px 14px}",
    WARDS + " p:nth-of-type(2) a:hover{background:var(--slh-red);color:#fff!important}",

    // News cards: out-card headline font
    "#sl-news .sl-title{font-family:'Bebas Neue',sans-serif;font-weight:400;font-size:1.6em;line-height:1.05;letter-spacing:.3px}"
  ].join("");
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var tick = '<svg viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="17" fill="#fbe70d"/><path d="M9 17.5l5.5 5.5L25 12" stroke="#e4003b" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var parts = {
    welcome:
      '<div class="slh-welcome">' +
        '<div class="slh-welcome-text">' +
          '<h2 class="slh-head">Welcome <span class="bar">|</span><span class="cy">Croeso</span></h2>' +
          '<p class="slh-quote">“On behalf of the people of Swansea and all my colleagues in Swansea Labour can I welcome you to our wonderful city by the sea. Swansea is a place that is growing and reinventing itself for the 21st Century.”</p>' +
          '<p class="slh-quote-by">Cllr Rob Stewart, Leader of Swansea Council</p>' +
          "<p>Swansea Labour is the team of Labour councillors and members working for communities right across our city. From our schools, parks and city centre to the cost of living and tackling climate change, we're focused on making Swansea a better place to live, work and enjoy.</p>" +
          "<p>Find your local Labour team below, catch up on what's happening in your ward, or get in touch. We'd love to hear from you.</p>" +
        "</div>" +
        '<figure class="slh-polaroid"><span class="slh-pin"></span>' +
          '<img src="' + img + 'rob-stewart.jpg" alt="Cllr Rob Stewart, Leader of Swansea Council">' +
          "<figcaption>Working hard for you</figcaption></figure>" +
      "</div>",

    delivered:
      '<div class="slh-panel">' +
        "<div>" +
          '<h2 class="slh-display">You asked –<br><span class="slh-yellow">we delivered!</span></h2>' +
          '<svg class="slh-underline" viewBox="0 0 260 18" preserveAspectRatio="none" aria-hidden="true"><path d="M4 12 C 60 4, 140 3, 256 8" stroke="#fbe70d" stroke-width="5" fill="none" stroke-linecap="round"/></svg>' +
          '<p class="slh-intro">Swansea\'s Labour council is getting on with the job in every community. See every project on our map.</p>' +
          '<a class="slh-btn slh-btn-yellow" href="/delivering">See what we\'ve delivered</a>' +
        "</div>" +
        '<ul class="slh-ticks">' +
          "<li>" + tick + "<div><b>A record £14.5m for our roads</b><span>More than 5,600 potholes filled so far this year.</span></div></li>" +
          "<li>" + tick + "<div><b>Safer play for every community</b><span>£8 million upgrading the council's play areas across the city.</span></div></li>" +
          "<li>" + tick + "<div><b>The Ospreys home at St Helen's</b><span>A £7.6m revamp with a new pitch, floodlights and a community hub.</span></div></li>" +
          "<li>" + tick + "<div><b>Help in the heart of the city</b><span>Y Storfa, the new fully accessible community hub on Oxford Street.</span></div></li>" +
        "</ul>" +
      "</div>",

    ospreys:
      '<div class="slh-ospreys">' +
        '<figure class="slh-ospreys-photo">' +
          '<img src="' + img + 'st-helens-aerial.jpg" alt="St Helen\'s from the air, with its new pitch beside Swansea Bay" loading="lazy">' +
          "<figcaption>Photo: Ospreys</figcaption></figure>" +
        '<div class="slh-ospreys-text">' +
          '<img class="slh-ospreys-badge" src="' + img + 'ospreys-badge.png" alt="Ospreys">' +
          '<h2 class="slh-display slh-yellow">Standing up for the Ospreys</h2>' +
          "<p>Swansea Labour Council, led by Rob Stewart, fought to save the Ospreys and secured their future at St Helen's. The £7.6m revamp has delivered a new all-weather pitch, floodlights and a community hub for local schools and clubs.</p>" +
          '<p class="slh-ospreys-quote">“Thank you to everyone at Swansea Council who backed us and made it possible.” – Ospreys</p>' +
          '<p class="slh-keep">Keep Swansea Labour</p>' +
        "</div>" +
      "</div>",

    help:
      '<div class="slh-help">' +
        '<h2 class="slh-display slh-yellow">We\'re here to help!</h2>' +
        '<div class="slh-dashed">' +
          "<p>Your local councillors work for you all year round. Tell us what needs fixing in your street and we will act on it. No issue is too small.</p>" +
          '<a class="slh-btn slh-btn-yellow" href="#find-your-team">Contact your councillor</a>' +
        "</div>" +
      "</div>"
  };

  function render() {
    var spots = document.querySelectorAll(".sl-home[data-show]");
    for (var i = 0; i < spots.length; i++) {
      var names = spots[i].getAttribute("data-show").split(/\s+/);
      var html = "";
      for (var j = 0; j < names.length; j++) if (parts[names[j]]) html += parts[names[j]];
      spots[i].innerHTML = html;
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
})();
