// Small enhancements. The page reads fine without this file.
(() => {
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // Email: built from data attributes so scrapers don't find it in the HTML.
  for (const el of $$(".js-email")) {
    const addr = `${el.dataset.u}@${el.dataset.d}`;
    el.href = `mailto:${addr}?subject=${encodeURIComponent("Hello from your website")}`;
  }
  for (const btn of $$(".js-copy")) {
    btn.addEventListener("click", async () => {
      const addr = `${btn.dataset.u}@${btn.dataset.d}`;
      try {
        await navigator.clipboard.writeText(addr);
        btn.textContent = "Copied";
      } catch {
        const r = document.createRange();
        r.selectNodeContents(btn.previousElementSibling);
        const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
        btn.textContent = "Selected";
      }
      setTimeout(() => (btn.textContent = "Copy"), 2000);
    });
  }

  // Case studies: tabs plus Previous / Next.
  const tabs = $$('[role="tab"]');
  const cases = $$(".story");
  const show = (i, focus) => {
    if (i < 0 || i >= cases.length) return;
    cases.forEach((c, j) => c.classList.toggle("is-active", j === i));
    tabs.forEach((t, j) => { t.setAttribute("aria-selected", String(j === i)); t.tabIndex = j === i ? 0 : -1; });
    if (focus) tabs[i].focus();
  };
  show(0);
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-go]");
    if (!b) return;
    const i = Number(b.dataset.go);
    show(i);
    if (b.classList.contains("pager__btn")) document.getElementById("stories").scrollIntoView({ block: "start" });
  });
  tabs.forEach((t, i) => t.addEventListener("keydown", (e) => {
    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (k) { e.preventDefault(); show((i + k + tabs.length) % tabs.length, true); }
  }));

  // Highlight the section you're reading in the top bar.
  const links = $$(".top__nav a");
  const byId = new Map(links.map((a) => [a.hash.slice(1), a]));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) if (en.isIntersecting) {
        links.forEach((a) => a.removeAttribute("aria-current"));
        byId.get(en.target.id)?.setAttribute("aria-current", "true");
      }
    }, { rootMargin: "-40% 0px -55% 0px" });
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  // Analytics events (only if Google Analytics is on).
  const track = (name, params = {}) => { try { window.gtag?.("event", name, params); } catch {} };
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a, button");
    if (!a) return;
    if (a.dataset.share) track("share", { method: a.dataset.share, content_type: "page" });
    else if (a.dataset.event) track(a.dataset.event);
    else if (a.classList.contains("js-email")) track("email_click");
    else if (a.classList.contains("plat")) track("platform_click", { platform: a.querySelector(".plat__name")?.textContent });
    else if (a.href?.includes("linkedin.com/in/")) track("linkedin_profile_click");
    else if (a.href?.endsWith(".pdf")) track("resume_download");
  });

  // Share: the phone's own share sheet where supported; copy link everywhere.
  for (const b of $$(".js-native-share")) {
    if (navigator.share) {
      b.hidden = false;
      b.addEventListener("click", () => {
        navigator.share({ title: b.dataset.title, text: b.dataset.text, url: b.dataset.url }).then(() => track("share", { method: "native" })).catch(() => {});
      });
    }
  }
  for (const b of $$(".js-copy-link")) {
    b.addEventListener("click", async () => {
      const label = b.querySelector("span");
      try { await navigator.clipboard.writeText(b.dataset.url); label.textContent = "Copied!"; }
      catch { prompt("Copy this link:", b.dataset.url); }
      setTimeout(() => (label.textContent = "Copy link"), 2000);
    });
  }

  // Contact form: send without leaving the page.
  const form = document.getElementById("cform");
  if (form) {
    const status = form.querySelector(".cform__status");
    const btn = form.querySelector(".cform__send");
    const sent = new URLSearchParams(location.search).get("sent");
    if (sent) status.textContent = sent === "1" ? "Thanks! I'll reply with what it takes and a fixed price." : "That didn't go through. Please email me instead.";
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      btn.disabled = true; btn.textContent = "Sending…"; status.textContent = "";
      form.classList.remove("is-error", "is-sent");
      try {
        const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
        const out = await res.json().catch(() => ({ ok: false, message: "Something went wrong. Please email me instead." }));
        status.textContent = out.message;
        form.classList.add(out.ok ? "is-sent" : "is-error");
        if (out.ok) { form.reset(); track("generate_lead", { method: "contact_form" }); }
      } catch {
        status.textContent = "No connection. Please try again or email me.";
        form.classList.add("is-error");
      }
      btn.disabled = false; btn.textContent = "Send it";
      window.turnstile?.reset?.();
    });
  }
})();
