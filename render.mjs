// Turns content into the page. Pure function: no file system, so it also runs in a browser.
export function render(c, { hasOg = false } = {}) {
  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
  const list = (arr, fn) => (arr || []).map(fn).join("");

  const p = c.person;
  const [user, domain] = (p.email || "@").split("@");
  const siteUrl = (c.site.url || "").replace(/\/$/, "");

  // Email is assembled in the browser so simple scrapers can't harvest it.
  const emailBits = `data-u="${esc(user)}" data-d="${esc(domain)}"`;
  const emailText = `${esc(user)}<span aria-hidden="true">&#8203;</span>&#64;${esc(domain)}`;

  // A small four-point sparkle doodle (decoration only).
  const sparkle = (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 1.5c.6 5.6 4.9 9.9 10.5 10.5-5.6.6-9.9 4.9-10.5 10.5C11.4 16.9 7.1 12.6 1.5 12 7.1 11.4 11.4 7.1 12 1.5z" fill="currentColor"/></svg>`;

  // A photo, or (while you're building) a labeled spot showing what photo goes there.
  const camera = `<svg class="ph__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 8h3l2-3h6l2 3h3v11H4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;
  const photo = (src, alt, hint, cls) =>
    src
      ? `<img class="${cls}" src="${esc(src)}" alt="${esc(alt)}" loading="lazy">`
      : c.site.photoPlaceholders
        ? `<div class="${cls} ph" role="img" aria-label="Photo placeholder: ${esc(hint)}">${camera}<span class="ph__t">Photo of you</span><span class="ph__h">${esc(hint)}</span></div>`
        : "";

  const portrait = p.photo
    ? `<img class="portrait" src="${esc(p.photo)}" alt="${esc(p.name)}" width="400" height="400">`
    : c.site.photoPlaceholders
      ? photo("", p.name, p.photoHint || "Headshot · square", "portrait")
      : `<div class="portrait portrait--mono" role="img" aria-label="${esc(p.name)}"><span>${esc(c.site.monogram)}</span></div>`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    description: c.site.description,
    url: siteUrl || undefined,
    jobTitle: p.role,
    sameAs: [p.linkedin, ...(c.platforms?.items || []).map((x) => x.url)].filter(Boolean),
    knowsAbout: ["NetSuite", "EDI", "Order-to-cash", "Celigo", "Shopify", "Zapier", "Make", "Monday.com"],
    address: { "@type": "PostalAddress", addressLocality: p.region, addressCountry: "US" },
  };

  const nav = [
    ["services", "Services"],
    ["how-it-works", "How it works"],
    ["stories", "Results"],
    ["about", "About"],
    ["hire", "Hire me"],
  ];

  const plats = c.platforms?.items || [];
  const livePlats = plats.filter((x) => x.url);
  const platCard = (x) =>
    x.url
      ? `<a class="plat" href="${esc(x.url)}" rel="me noopener" target="_blank"><span class="plat__name">${esc(x.name)}</span><span class="plat__best">${esc(x.best)}</span><span class="plat__go">View my profile ↗</span></a>`
      : `<div class="plat plat--soon"><span class="plat__name">${esc(x.name)}</span><span class="plat__best">${esc(x.best)}</span><span class="plat__go">Profile coming soon</span></div>`;

  const storyHtml = (k, i, all) => `
    <article class="story" id="story-${esc(k.id)}" role="tabpanel" aria-labelledby="tab-${esc(k.id)}">
      <header class="story__head">
        <p class="eyebrow">${esc(k.where)}</p>
        <h3 class="bannerline"><span>${esc(k.title)}</span></h3>
        <p class="story__short">${esc(k.short)}</p>
      </header>
      ${
        k.flow
          ? `<div class="flow" role="img" aria-label="How an order moves: ${esc(k.flow.join(", then "))}">${list(
              k.flow,
              (f, j) => `<span class="flow__step">${esc(f)}</span>${j < k.flow.length - 1 ? '<span class="flow__arrow" aria-hidden="true">→</span>' : ""}`
            )}</div>`
          : ""
      }
      <div class="story__parts">${list(
        k.parts,
        (part) => `<section><h4>${esc(part.h)}</h4><p>${esc(part.p)}</p></section>`
      )}</div>
      <nav class="pager" aria-label="Stories">
        <button type="button" class="pager__btn" data-go="${i - 1}" ${i === 0 ? "disabled" : ""}>← Previous</button>
        <span class="pager__count">${i + 1} / ${all.length}</span>
        <button type="button" class="pager__btn" data-go="${i + 1}" ${i === all.length - 1 ? "disabled" : ""}>Next story →</button>
      </nav>
    </article>`;

  const html = `<!doctype html>
  <html lang="en-US">
  <head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <script>document.documentElement.classList.add("js")</script>
  <title>${esc(c.site.title)}</title>
  <meta name="description" content="${esc(c.site.description)}">
  ${siteUrl ? `<link rel="canonical" href="${esc(siteUrl)}/">` : ""}
  <meta property="og:type" content="profile">
  <meta property="og:title" content="${esc(c.site.title)}">
  <meta property="og:description" content="${esc(c.site.description)}">
  ${siteUrl ? `<meta property="og:url" content="${esc(siteUrl)}/">` : ""}
  ${siteUrl && hasOg ? `<meta property="og:image" content="${esc(siteUrl)}/og.png">` : ""}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#14213a">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap">
  <link rel="stylesheet" href="/styles.css">
  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>
  </head>
  <body>
  <a class="skip" href="#main">Skip to content</a>
  <header class="top">
    <div class="wrap top__in">
      <a class="brand" href="#top" aria-label="${esc(p.name)}, back to top"><span class="brand__mark">${esc(c.site.monogram)}</span><span class="brand__name">${esc(p.name)}</span></a>
      <nav class="top__nav" aria-label="Sections">${list(nav, ([id, label]) => `<a href="#${id}">${label}</a>`)}</nav>
      <a class="btn btn--hire" href="#contact">Get a quote</a>
    </div>
  </header>

  <main id="main">
    <section class="hero" id="top">
      <div class="wrap hero__in">
        <div class="hero__photo">
          <div class="ring">${portrait}</div>
          ${sparkle("sparkle sparkle--photo")}
        </div>
        <div class="hero__text">
          <p class="hello">${esc(p.hello)}</p>
          <h1 class="namebar"><span>${esc(p.name)}</span>${sparkle("sparkle sparkle--name")}</h1>
          <p class="hero__role">${esc(p.role)} <span aria-hidden="true">·</span> ${esc(p.location)}</p>
          <p class="hero__line">${esc(p.headline)}</p>
          ${list(p.intro, (t, i) => `<p class="${i === 0 ? "lede" : "lede lede--2"}">${esc(t)}</p>`)}
          <div class="nowbox">
            <p class="now__status"><span class="dot" aria-hidden="true"></span>${esc(c.now.status)}</p>
            <p>${esc(c.now.text)}</p>
          </div>
          <div class="cta">
            <a class="btn btn--primary js-email" ${emailBits} href="#contact">Tell me what's broken</a>
            ${livePlats.length ? list(livePlats.slice(0, 2), (x) => `<a class="btn" href="${esc(x.url)}" rel="me noopener" target="_blank">Hire me on ${esc(x.name)} ↗</a>`) : `<a class="btn" href="#services">See what I fix</a>`}
            <a class="btn btn--quiet" href="${esc(p.linkedin)}" rel="me noopener" target="_blank">LinkedIn ↗</a>
          </div>
        </div>
      </div>
    </section>















    <section class="section section--tight" id="hire" aria-labelledby="hire-h">
      <div class="wrap">
        <div class="section__head">
          <h2 id="hire-h">${esc(c.platforms.title)}</h2>
          <p>${esc(c.platforms.intro)}</p>
        </div>
        <div class="plats">${list(plats, platCard)}
          <a class="plat plat--direct js-email" ${emailBits} href="#contact"><span class="plat__name">Direct</span><span class="plat__best">Best if you already know what you need. Email me and I'll send a fixed-price quote.</span><span class="plat__go">Email me →</span></a>
        </div>
      </div>
    </section>
    <section class="section section--alt" id="services" aria-labelledby="services-h">
      <div class="wrap">
        <div class="section__head">
          <h2 id="services-h">${esc(c.services.title)}</h2>
          <p>${esc(c.services.intro)}</p>
        </div>
        <ul class="services">${list(
          c.services.items,
          (x) => `<li><h3>${esc(x.title)}</h3><p>${esc(x.body)}</p><p class="services__fit">${esc(x.fit)}</p><p class="services__tools">${esc(x.tools)}</p></li>`
        )}</ul>
        <div class="clients">
          <h3 class="label">${esc(c.clients.title)}</h3>
          <ul class="clients__list">${list(c.clients.names, (n) => `<li>${esc(n)}</li>`)}</ul>
        </div>
      </div>
    </section>

    <section class="section" id="how-it-works" aria-labelledby="how-h">
      <div class="wrap">
        <div class="section__head">
          <h2 id="how-h">${esc(c.process.title)}</h2>
        </div>
        <ol class="steps">${list(
          c.process.steps,
          (x, i) => `<li><span class="steps__n" aria-hidden="true">${i + 1}</span><h3>${esc(x.title)}</h3><p>${esc(x.body)}</p></li>`
        )}</ol>
      </div>
    </section>

    <section class="impact" aria-labelledby="impact-h">
      <div class="wrap">
        <h2 id="impact-h" class="label">Track record</h2>
        <ul class="impact__grid">${list(
          c.impact,
          (m) => `<li><strong>${esc(m.value)}</strong><span class="impact__label">${esc(m.label)}</span><span class="impact__ctx">${esc(m.context)}</span></li>`
        )}</ul>
      </div>
    </section>
    <section class="section section--alt" id="stories" aria-labelledby="stories-h">
      <div class="wrap">
        <div class="section__head">
          <h2 id="stories-h">Results, in plain words</h2>
          <p>What was broken, what I did about it, and how it turned out.</p>
        </div>
        <div class="tabs" role="tablist" aria-label="Stories">${list(
          c.stories,
          (k, i) => `<button type="button" role="tab" id="tab-${esc(k.id)}" aria-controls="story-${esc(k.id)}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-go="${i}"><span class="tabs__n">Story ${i + 1}</span><span class="tabs__name">${esc(k.tab)}</span></button>`
        )}</div>
        <div class="stories">${c.stories.map(storyHtml).join("")}</div>
      </div>
    </section>
    <section class="section section--alt" id="how-i-work" aria-labelledby="work-h">
      <div class="wrap">
        <div class="section__head">
          <h2 id="work-h">How I work</h2>
        </div>
        <ul class="principles">${list(
          c.principles,
          (x) => `<li><h3>${esc(x.title)}</h3><p>${esc(x.body)}</p></li>`
        )}</ul>
      </div>
    </section>
    <section class="section" id="ai" aria-labelledby="ai-h">
      <div class="wrap">
        <div class="section__head">
          <h2 id="ai-h">How I use AI</h2>
          <p>${esc(c.ai.intro)}</p>
        </div>
        <ul class="ai">${list(c.ai.items, (x) => `<li><h3>${esc(x.title)}</h3><p>${esc(x.body)}</p></li>`)}</ul>
      </div>
    </section>
    <section class="section section--alt" id="journey" aria-labelledby="journey-h">
      <div class="wrap">
        <div class="section__head">
          <h2 id="journey-h">How I got here</h2>
        </div>
        <ol class="journey">${list(
          c.journey,
          (j) => `<li><p class="journey__when">${esc(j.when)}</p><h3>${esc(j.title)}</h3><p>${esc(j.body)}</p></li>`
        )}</ol>
      </div>
    </section>
    <section class="section section--alt" id="about" aria-labelledby="about-h">
      <div class="wrap about">
        <div class="about__text">
          <h2 id="about-h">About me</h2>
          ${list(c.about.paragraphs, (t) => `<p>${esc(t)}</p>`)}
          <p class="about__more">The full work history is on <a href="${esc(p.resume)}">my resume</a> and <a href="${esc(p.linkedin)}" rel="me noopener" target="_blank">LinkedIn</a>.</p>
        </div>
        <div class="about__side">
          ${
            c.about.offClock?.length
              ? `<div class="offclock"><h3 class="label">Off the clock</h3><ul>${list(c.about.offClock, (x) => `<li>${esc(x)}</li>`)}</ul></div>`
              : ""
          }
        </div>
      </div>
    </section>
    <section class="contact" id="contact" aria-labelledby="contact-h">
      <div class="wrap contact__in">
        <div>
          <h2 id="contact-h">${esc(c.contact.title)}${sparkle("sparkle sparkle--contact")}</h2>
          <p class="contact__lede">${esc(c.contact.text)}</p>
          ${c.contact.also ? `<p class="contact__also">${esc(c.contact.also)} <a href="${esc(p.resume)}">Resume (PDF)</a></p>` : ""}
        </div>
        <div class="contact__card">
          <p class="label">Email</p>
          <p class="contact__email"><a class="js-email" ${emailBits} href="#contact">${emailText}</a>
            <button type="button" class="copy js-copy" ${emailBits}>Copy</button></p>
          ${livePlats.length ? `<p class="label">Hire me on</p><p class="contact__links">${list(livePlats, (x) => `<a href="${esc(x.url)}" rel="me noopener" target="_blank">${esc(x.name)} ↗</a>`)}</p>` : ""}
          <p class="label">Elsewhere</p>
          <p class="contact__links">
            <a href="${esc(p.linkedin)}" rel="me noopener" target="_blank">LinkedIn ↗</a>
            <a href="${esc(p.resume)}">Resume (PDF)</a>
          </p>
          <p class="label">Where</p>
          <p>${esc(p.location)} · ${esc(p.timezone)}</p>
        </div>
      </div>
    </section>
  </main>

  <footer class="foot">
    <div class="wrap foot__in">
      <p>© ${new Date().getFullYear()} ${esc(p.name)}</p>
      <p>Made in ${esc(p.region)}. Hosted on Cloudflare. No ads, no tracking.${c.footer.templateUrl ? ` <a href="${esc(c.footer.templateUrl)}">Use this template</a>.` : ""}</p>
      <p><a href="#top">Back to top ↑</a></p>
    </div>
  </footer>
  <script src="/app.js" defer></script>
  </body>
  </html>
  `;

  const notFound = `<!doctype html><html lang="en-US"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Page not found | ${esc(p.name)}</title><link rel="stylesheet" href="/styles.css"></head>
  <body><main class="wrap nf"><p class="hello">Hmm.</p><h1>That page isn't here.</h1><p><a class="btn btn--primary" href="/">Go to the home page</a></p></main></body></html>`;

  const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="10" fill="#14213a"/><rect x="10" y="50" width="44" height="4" fill="#c62828"/><text x="32" y="42" font-family="Arial Narrow, Arial, sans-serif" font-size="28" font-weight="700" fill="#fff" text-anchor="middle">${esc(c.site.monogram)}</text></svg>`;

  return { html, notFound, favicon, siteUrl };
}
