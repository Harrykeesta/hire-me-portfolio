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
})();
