/* Swansea Labour homepage design (out-card style)
 *
 * Squarespace Code Block (one per spot on the page; the script only needs adding once,
 * extra copies are ignored):
 *   <div class="sl-home" data-show="welcome delivered ospreys"></div>
 *   <script src="https://news.swansealabour.org/home.js" defer></script>
 *
 * data-show takes any of: welcome, delivered, ospreys, help (in the order given).
 *
 * The script also loads the out-card fonts (Anton, Bebas Neue, Caveat, Kaushan Script)
 * and restyles the homepage's own Squarespace sections so the page matches
 * homepage-preview.html: hero, intro, postcode finder, ward list, news, the "Help build
 * a better Swansea" banner, the newsletter sign-up and the footer.
 * Anton headings use weight 700 (the browser thickens Anton, which only has one weight), as in the preview.
 * No green anywhere: it reads as Plaid Cymru.
 */
(function () {
  if (window.__slHome) return;
  window.__slHome = true;

  var script = document.currentScript;
  var base = script ? script.src.replace(/home\.js(\?.*)?$/, "") : "https://news.swansealabour.org/";
  var img = base + "images/";

  // Homepage sections and blocks in Squarespace (ids from the live page)
  var HERO = 'section[data-section-id="619e7534def5fe401f3b96f5"]';
  var INTRO = 'section[data-section-id="619e7534def5fe401f3b96f7"]';
  var NEWS = 'section[data-section-id="6adc6e2825d53e257d564295"]';
  var INVOLVED = 'section[data-section-id="619e757e6ebed759bec52176"]';
  var SIGNUP = 'section[data-section-id="619e75b465d5737e2e29c46e"]';
  var FOOTER = 'section[data-section-id="60f66d97c0d6ed6055a561a8"]';
  var OLD_PHOTO = "#block-yui_3_17_2_1_1638340028038_7733"; // replaced by data-show="welcome"
  var OLD_QUOTE = "#block-c0cf8569770c9d04e5fb";
  var WARDS = "#block-yui_3_17_2_1_1791318729275_13605";
  var NEWS_BLOCK = "yui_3_17_2_1_1792830867356_7296";

  var fonts = document.createElement("link");
  fonts.rel = "stylesheet";
  fonts.href = "https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Caveat:wght@500;700&family=Kaushan+Script&display=swap";
  document.head.appendChild(fonts);

  var BEBAS = "font-family:'Bebas Neue',sans-serif!important;font-weight:400!important;letter-spacing:1px!important;";
  var BTN = BEBAS + "font-size:22px!important;line-height:1.6!important;padding:10px 26px 8px!important;border-radius:4px!important;text-transform:none!important;";
  var CONTAINER = "width:100%!important;max-width:1180px!important;margin-left:auto!important;margin-right:auto!important;padding-left:24px!important;padding-right:24px!important;box-sizing:border-box!important;";
  // Full-width band behind an element without changing the layout
  var BAND = function (c) { return "background:" + c + ";box-shadow:0 0 0 100vmax " + c + ";clip-path:inset(0 -100vmax);"; };

  var css = [
    ":root{--slh-red:#e4003b;--slh-red-dark:#b8002f;--slh-yellow:#fbe70d;--slh-ink:#1c1c1c;--slh-soft:#f6f4f1}",
    ".sl-home{display:block;width:100%;container-type:inline-size;font-size:16px;line-height:1.6}",
    ".sl-home *{box-sizing:border-box}",
    ":where(.sl-home) p{font-size:16px;font-weight:400;line-height:1.6}",
    // Squarespace sets antialiased smoothing, which thins the lettering on Apple devices; the preview uses the default
    ".slh-display,.slh-head,.slh-btn,#header,#sl-news .sl-title,.slh-polaroid figcaption," + HERO + " h1," + HERO + " h1 span," + HERO + " .sqs-block-code a," + INVOLVED + " h2," + SIGNUP + " h4{-webkit-font-smoothing:auto!important;-moz-osx-font-smoothing:auto!important}",
    ".slh-display{font-family:Anton,sans-serif;font-weight:700;text-transform:uppercase;line-height:1.02;letter-spacing:.5px;margin:0}",
    ".slh-yellow{color:var(--slh-yellow)!important;text-shadow:4px 4px 0 rgba(0,0,0,.45)}",
    ".slh-head{display:table;font-family:'Bebas Neue',sans-serif!important;font-weight:400!important;font-style:normal!important;font-size:44px!important;line-height:1!important;letter-spacing:.5px!important;" +
      "text-transform:none!important;margin:0 0 22px!important;padding:10px 18px 5px!important;background:var(--slh-red);color:#fff!important;border-radius:3px;box-shadow:3px 3px 0 rgba(0,0,0,.18)}",
    ".slh-head .cy{color:var(--slh-yellow)}",
    ".slh-head .bar{opacity:.55;margin:0 6px}",
    ".slh-btn{display:inline-block;" + BTN + "text-decoration:none!important;transition:transform .15s}",
    ".slh-btn:hover{transform:translateY(-2px)}",
    ".slh-btn-yellow{background:var(--slh-yellow);color:var(--slh-red-dark)!important;box-shadow:3px 3px 0 rgba(0,0,0,.25)}",

    // Welcome: Rob's quote and polaroid
    ".slh-welcome{display:grid;grid-template-columns:1.35fr 1fr;gap:56px;align-items:center}",
    ".slh-welcome p{margin:0 0 16px}",
    ".slh-quote{font-size:21px!important;font-style:italic;line-height:1.5!important;border-left:5px solid var(--slh-red);padding-left:20px;margin:0 0 10px!important}",
    ".slh-quote-by{font-family:'Bebas Neue',sans-serif;font-size:22px!important;letter-spacing:.5px;padding-left:25px;margin:0 0 22px!important}",
    ".slh-polaroid{position:relative;background:#fff;padding:14px 14px 58px;box-shadow:0 10px 28px rgba(0,0,0,.18);transform:rotate(3deg);max-width:380px;width:100%;justify-self:center;margin:0}",
    ".slh-polaroid img{display:block;width:100%;aspect-ratio:1/1;object-fit:cover;object-position:50% 30%}",
    ".slh-polaroid figcaption{position:absolute;left:0;right:0;bottom:10px;text-align:center;font-family:Caveat,cursive;font-size:30px;line-height:1.2;color:var(--slh-ink)}",
    ".slh-pin{position:absolute;top:-12px;left:50%;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ff6b8a,var(--slh-red) 55%,#8a0022);box-shadow:2px 3px 4px rgba(0,0,0,.3)}",

    // Grey band behind "You asked - we delivered!" and the Ospreys box
    ".slh-soft{" + BAND("var(--slh-soft)") + "padding:70px 0;margin-top:70px}",
    ".slh-soft + .slh-soft{margin-top:0;padding-top:0}",
    ".slh-panel{background:var(--slh-red);color:#fff;border:6px solid var(--slh-yellow);border-radius:6px;padding:44px 48px;display:grid;grid-template-columns:1fr 1.6fr;gap:40px}",
    ".slh-panel h2{font-size:64px;color:#fff}",
    ".slh-underline{display:block;width:260px;max-width:100%;height:18px;margin-top:4px}",
    ".slh-panel .slh-intro{margin:22px 0 26px;font-size:17px;color:#fff}",
    ".slh-ticks{list-style:none!important;margin:0!important;padding:0!important;display:grid;gap:18px}",
    ".slh-ticks li{display:grid;grid-template-columns:34px 1fr;gap:14px;align-items:start;margin:0!important;padding:0!important;list-style:none!important}",
    ".slh-ticks li::before,.slh-ticks li::marker{content:none!important}",
    ".slh-ticks svg{width:34px;height:34px}",
    ".slh-ticks b{font-family:'Bebas Neue',sans-serif;font-weight:400;font-size:25px;letter-spacing:.5px;display:block;line-height:1.1;color:var(--slh-yellow)}",
    ".slh-ticks span{font-size:16px;font-weight:400;color:#fff}",

    // Ospreys: leaflet-style black box
    ".slh-ospreys{background:#111;color:#fff;border-radius:6px;overflow:hidden;display:grid;grid-template-columns:1.15fr 1fr}",
    ".slh-ospreys-photo{position:relative;min-height:360px;margin:0}",
    ".slh-ospreys-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}",
    ".slh-ospreys-photo figcaption{position:absolute;right:10px;bottom:10px;font-size:12px;line-height:1.4;background:rgba(0,0,0,.6);color:#fff;padding:2px 8px;border-radius:3px}",
    ".slh-ospreys-text{padding:32px 40px 34px}",
    ".slh-ospreys-badge{width:104px;height:auto;display:block;margin:-6px 0 14px -8px}",
    ".slh-ospreys-text h2{font-size:46px;margin-bottom:16px}",
    ".slh-ospreys-text p{margin:0 0 12px;color:#fff}",
    ".slh-ospreys-quote{font-style:italic;border-left:4px solid var(--slh-yellow);padding-left:14px;margin:18px 0!important}",
    ".slh-ospreys-text .slh-keep{font-family:Anton,sans-serif;font-weight:400;text-transform:uppercase;color:var(--slh-yellow);font-size:30px;line-height:1.3;letter-spacing:.5px;margin:6px 0 0}",

    // We're here to help: full-width red band
    ".slh-help{" + BAND("var(--slh-red)") + "color:#fff;padding:70px 0;margin-top:70px;display:grid;grid-template-columns:1fr 1fr;gap:44px;align-items:center}",
    ".slh-help h2{font-size:clamp(54px,7vw,88px)}",
    ".slh-dashed{border:3px dashed var(--slh-yellow);border-radius:12px;padding:30px 34px;text-align:center}",
    ".slh-dashed p{font-family:'Bebas Neue',sans-serif;font-size:30px!important;line-height:1.15!important;margin:0 0 22px;letter-spacing:.3px;color:#fff}",

    // Narrow columns and phones
    "@container (max-width:800px){",
    ".slh-panel,.slh-ospreys,.slh-help{grid-template-columns:1fr}",
    ".slh-welcome{display:flex;flex-direction:column;gap:0}", // heading, then photo, then quote
    ".slh-welcome-text{display:contents}",
    ".slh-welcome .slh-head{order:1;align-self:flex-start}",
    ".slh-welcome-text > :not(.slh-head){order:3}",
    ".slh-welcome .slh-polaroid{order:2;max-width:270px;margin:8px auto 34px;padding:10px 10px 46px}",
    ".slh-welcome .slh-polaroid figcaption{font-size:25px;bottom:8px}",
    ".slh-quote{font-size:18px!important}",
    ".slh-panel{padding:30px 22px}",
    ".slh-panel h2{font-size:48px}",
    ".slh-ospreys-photo{min-height:0;aspect-ratio:16/9}",
    ".slh-ospreys-text{padding:24px 22px 26px}",
    ".slh-ospreys-badge{width:84px}",
    ".slh-ospreys-text h2{font-size:40px}",
    "}",
    "@media (max-width:800px){.slh-head{font-size:34px!important}.slh-head .cy{display:block}.slh-head .bar{display:none}}",

    // Page widths: a 1180px container like the preview
    HERO + " .content," + INTRO + " .content," + INVOLVED + " .content," + SIGNUP + " .content{" + CONTAINER + "}",
    HERO + " .content-wrapper," + INTRO + " .content-wrapper," + INVOLVED + " .content-wrapper," + SIGNUP + " .content-wrapper," + FOOTER + " .content-wrapper{padding-left:0!important;padding-right:0!important}",
    "@media (min-width:768px){.fe-block-" + NEWS_BLOCK + "{grid-area:1/2/4/26!important}" + NEWS + " .fluid-engine{grid-template-rows:auto!important;grid-auto-rows:auto!important}}",
    "#block-" + NEWS_BLOCK + " .sqs-block-content{width:100%;max-width:1132px;margin:0 auto}",

    // Hero: yellow Anton headline over a light red fade, left-aligned buttons
    // The photo starts below the header (its height is measured into --slh-header), with no white wash,
    // centred like the preview: 560px tall on desktop, 520px on phones
    HERO + "{min-height:0!important;padding-top:var(--slh-header,0px)!important}",
    HERO + " .section-background{top:var(--slh-header,0px)!important;height:auto!important;bottom:0!important}",
    HERO + " .section-background img{object-position:50% 50%!important}",
    HERO + " .section-background-overlay{opacity:0!important}",
    HERO + " .content-wrapper{box-sizing:border-box!important;min-height:560px!important;padding-top:40px!important;padding-bottom:40px!important;align-items:center!important}",
    "#block-yui_3_17_2_1_1642931961542_5509{display:none!important}", // hero spacer block
    HERO + " .section-background::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,rgba(228,0,59,.8) 0%,rgba(228,0,59,.5) 35%,rgba(228,0,59,0) 58%)}",
    "@media (max-width:767px){" + HERO + " .section-background::after{background:linear-gradient(0deg,rgba(228,0,59,.7) 0%,rgba(228,0,59,.35) 45%,rgba(228,0,59,0) 75%)}}",
    HERO + " .sqs-block{padding-top:0!important;padding-bottom:0!important}",
    HERO + " h1," + HERO + " h1 span{font-family:Anton,sans-serif!important;font-weight:700!important;text-transform:uppercase;color:var(--slh-yellow)!important;line-height:1.02!important;letter-spacing:.5px!important;text-shadow:4px 4px 0 rgba(0,0,0,.45)}",
    HERO + " h1{font-size:clamp(64px,9vw,118px)!important;max-width:640px;margin:0!important}",
    HERO + " p{font-size:19px!important;font-weight:400!important;line-height:1.6!important;max-width:520px;margin:18px 0 28px!important;text-shadow:0 1px 4px rgba(0,0,0,.45)}",
    HERO + " .sqs-block-code .sqs-code-container > div{justify-content:flex-start!important;gap:14px!important;margin:0!important}",
    HERO + " .sqs-block-code a{" + BTN + "background:transparent!important;border:2px solid #fff!important;color:#fff!important;transition:transform .15s}",
    HERO + " .sqs-block-code a:first-child{background:var(--slh-yellow)!important;border:0!important;color:var(--slh-red-dark)!important;box-shadow:3px 3px 0 rgba(0,0,0,.25)}",
    HERO + " .sqs-block-code a:hover{transform:translateY(-2px)}",
    // Phones: content sits at the bottom of the photo; "Find your councillor" on its own row, the other two below
    "@media (max-width:767px){" + HERO + " .content-wrapper{min-height:520px!important;padding-bottom:41px!important;align-items:flex-end!important}" + HERO + " h1{font-size:64px!important}" +
      HERO + " .sqs-block-code .sqs-code-container > div{display:grid!important;grid-template-columns:auto auto;justify-content:start}" +
      HERO + " .sqs-block-code a:first-child{grid-column:1/-1;justify-self:start}}",

    // Intro: the old photo and quote blocks give way to data-show="welcome"
    OLD_PHOTO + "," + OLD_QUOTE + "{display:none!important}",
    INTRO + " .content-wrapper{padding-top:63px!important;padding-bottom:60px!important}",
    ".sl-home[data-show~='ospreys']{margin-bottom:96px}",
    "#block-yui_3_17_2_1_1791319811396_7423{padding-bottom:0!important}" + WARDS + "{padding-top:0!important;padding-bottom:0!important}",
    "#block-" + NEWS_BLOCK + "{padding-top:0!important}",

    // Postcode finder
    "#find-your-team .sl-label{display:block;font-weight:700!important;font-size:16px!important;line-height:1.4!important;margin:0!important}",
    "#find-your-team .sl-row{display:flex;gap:10px;max-width:560px;margin:8px 0 10px}",
    "#find-your-team input{flex:1;font-size:18px!important;padding:12px 16px!important;border:2px solid #ccc!important;border-radius:4px!important;background:#fff}",
    "#find-your-team .sl-btn{" + BTN + "background:var(--slh-red)!important;color:#fff!important;border:0!important;box-shadow:3px 3px 0 rgba(0,0,0,.18)}",
    "#find-your-team .sl-locate{font-size:14px!important;line-height:1.4!important;padding:0!important;margin:0!important;color:var(--slh-red)!important}",
    "@media (max-width:800px){#find-your-team .sl-row{flex-direction:column}}",
    "#sl-result{max-width:560px;border-radius:0 4px 4px 0}",
    "#sl-result p{font-weight:400!important}",
    "#sl-result a{display:inline-block;" + BTN + "background:var(--slh-red)!important;color:#fff!important;border:0!important;text-decoration:none!important;box-shadow:3px 3px 0 rgba(0,0,0,.18);transition:transform .15s}",
    "#sl-result a:hover{transform:translateY(-2px)}",

    // Ward list as red pills
    WARDS + " p:nth-of-type(1){display:none}",
    WARDS + " p:nth-of-type(2){font-size:0!important;display:flex;flex-wrap:wrap;gap:8px;margin-top:28px!important}",
    WARDS + " p:nth-of-type(2) a{font-size:14px;font-weight:600;line-height:1.6;text-decoration:none!important;border:2px solid var(--slh-red);color:var(--slh-red)!important;border-radius:30px;padding:4px 14px}",
    WARDS + " p:nth-of-type(2) a:hover{background:var(--slh-red);color:#fff!important}",
    WARDS + " p:nth-of-type(3){display:none}",

    // News: out-card headline font on the cards, red band flush with the banner below
    NEWS + " .content-wrapper{padding-top:30px!important;padding-bottom:0!important}",
    NEWS + " .fluid-engine{row-gap:0!important}",
    "#sl-news .sl-title{font-family:'Bebas Neue',sans-serif;font-weight:400;font-size:26px;line-height:1.05;letter-spacing:.3px}",
    "#sl-news p{font-weight:400!important;line-height:1.6!important}",

    // "Help build a better Swansea" banner
    INVOLVED + " .content-wrapper{padding-top:110px!important;padding-bottom:129px!important}",
    INVOLVED + " .section-background-overlay{opacity:1!important;background:linear-gradient(0deg,rgba(0,0,0,.55),rgba(0,0,0,.25))!important}",
    INVOLVED + " .sqs-block{padding-top:0!important;padding-bottom:0!important}",
    INVOLVED + " h2," + INVOLVED + " h2 span{font-family:Anton,sans-serif!important;font-weight:700!important;text-transform:uppercase;color:var(--slh-yellow)!important;line-height:1.02!important;letter-spacing:.5px!important;text-shadow:4px 4px 0 rgba(0,0,0,.45)}",
    INVOLVED + " h2{font-size:clamp(52px,7vw,92px)!important;margin:0!important}",
    INVOLVED + " h2::after{content:'If you value it, vote for it!';display:block;font-family:'Kaushan Script',cursive;text-transform:none;color:#fff;font-size:44px;line-height:1.3;letter-spacing:0;transform:rotate(-4deg);transform-origin:left;margin:6px 0 57px;text-shadow:none}",
    INVOLVED + " p{font-size:18px!important;font-weight:400!important;line-height:1.6!important;max-width:560px}",
    INVOLVED + " .sqs-block-button-container{justify-content:flex-start!important;text-align:left!important;margin-top:24px!important}",
    INVOLVED + " .sqs-block-button-element{" + BTN + "background:var(--slh-yellow)!important;color:var(--slh-red-dark)!important;box-shadow:3px 3px 0 rgba(0,0,0,.25)}",
    "@media (max-width:767px){" + INVOLVED + " h2::after{font-size:34px}}",

    // Newsletter sign-up
    SIGNUP + " .content-wrapper{padding-top:70px!important;padding-bottom:70px!important}",
    SIGNUP + " h4{display:table;font-family:'Bebas Neue',sans-serif!important;font-size:44px!important;line-height:1!important;letter-spacing:.5px!important;padding:10px 18px 5px;margin:0 0 18px!important;background:var(--slh-red);color:#fff!important;border-radius:3px;box-shadow:3px 3px 0 rgba(0,0,0,.18)}",
    SIGNUP + " h4 strong," + SIGNUP + " h4 em{font-weight:400!important;font-style:normal!important}",
    SIGNUP + " .sqs-html-content p," + SIGNUP + " .sqs-html-content em{font-style:normal!important;font-weight:400!important}",
    SIGNUP + " .form-submit-button{" + BTN + "background:var(--slh-red)!important;color:#fff!important;box-shadow:3px 3px 0 rgba(0,0,0,.18)}",
    "@media (max-width:800px){" + SIGNUP + " h4{font-size:34px!important}}",

    // Footer strapline
    // Header and footer in the leaflets' Labour red (#e4003b), each edged with the out-card's yellow rule
    "header#header{border-bottom:4px solid var(--slh-yellow)}",
    "#footer-sections{border-top:5px solid var(--slh-yellow)}",
    FOOTER + " .section-background{background:var(--slh-red)!important}",
    FOOTER + " .content-wrapper{padding-top:40px!important;padding-bottom:30px!important}",
    FOOTER + " .content{" + CONTAINER + "}",
    FOOTER + " .content::before{content:'Building a Better Swansea \\00B7  Adeiladu Abertawe gwell';display:block;font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:.5px;color:#fff;margin-bottom:14px}"
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
      '<div class="slh-soft"><div class="slh-panel">' +
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
      "</div></div>",

    ospreys:
      '<div class="slh-soft"><div class="slh-ospreys">' +
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
      "</div></div>",

    help:
      '<div class="slh-help">' +
        '<h2 class="slh-display slh-yellow">We\'re here to help!</h2>' +
        '<div class="slh-dashed">' +
          "<p>Your local councillors work for you all year round. Tell us what needs fixing in your street and we will act on it. No issue is too small.</p>" +
          '<a class="slh-btn slh-btn-yellow" href="#find-your-team">Contact your councillor</a>' +
        "</div>" +
      "</div>"
  };

  // The hero photo starts below the Squarespace header, whose height changes between desktop and phone
  function measureHeader() {
    var header = document.getElementById("header");
    if (header) document.documentElement.style.setProperty("--slh-header", header.offsetHeight + "px");
  }
  measureHeader();
  window.addEventListener("resize", measureHeader);
  window.addEventListener("load", measureHeader);

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
