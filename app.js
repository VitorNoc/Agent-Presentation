// Belmoney Docs — final interactive edition

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const initIcons = () => window.lucide?.createIcons({ attrs: { "aria-hidden": "true" } });
  initIcons();

  const progress = $("#scrollProgress");
  const backToTop = $("#backToTop");
  const sidebar = $("#docSidebar");
  const mobileMenu = $("#mobileMenu");
  const navLinks = $$(".sidebar-nav a");
  const sections = $$("main > section[id]");

  function updatePageState() {
    const root = document.documentElement;
    const max = root.scrollHeight - root.clientHeight;
    const ratio = max > 0 ? root.scrollTop / max : 0;
    if (progress) progress.style.width = `${ratio * 100}%`;
    backToTop?.classList.toggle("is-visible", window.scrollY > 650);
  }
  document.addEventListener("scroll", updatePageState, { passive: true });
  window.addEventListener("resize", updatePageState);
  updatePageState();

  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach(link => link.classList.toggle("is-active", link.dataset.target === visible.target.id));
    }, { rootMargin: "-18% 0px -68% 0px", threshold: [0, .15, .5] });
    sections.forEach(section => navObserver.observe(section));
  }

  mobileMenu?.addEventListener("click", () => {
    const open = sidebar.classList.toggle("is-open");
    mobileMenu.setAttribute("aria-expanded", String(open));
  });
  navLinks.forEach(link => link.addEventListener("click", () => {
    sidebar?.classList.remove("is-open");
    mobileMenu?.setAttribute("aria-expanded", "false");
  }));

  const revealItems = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(item => item.classList.add("in-view"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -32px 0px" });
    revealItems.forEach(item => revealObserver.observe(item));
  }

  const spines = $$(".spine-wrap");
  function updateSpines() {
    spines.forEach(wrap => {
      const rect = wrap.getBoundingClientRect();
      const total = rect.height;
      const progressed = Math.max(0, Math.min(total, innerHeight * 0.75 - rect.top));
      const ratio = total > 0 ? progressed / total : 0;
      wrap.querySelector(".spine-fill")?.setAttribute("y2", `${ratio * 100}%`);
      const steps = $$(".step", wrap);
      const stepRatio = steps.length ? 1 / steps.length : 1;
      steps.forEach((step, index) => step.classList.toggle("is-active", ratio >= index * stepRatio));
    });
  }
  document.addEventListener("scroll", updateSpines, { passive: true });
  window.addEventListener("resize", updateSpines);
  updateSpines();

  const accordion = $("#faqAccordion");
  accordion?.addEventListener("click", event => {
    const button = event.target.closest(".faq-q");
    if (!button) return;
    const item = button.closest(".faq-item");
    const answer = $(".faq-a", item);
    const willOpen = !item.classList.contains("open");
    $$(".faq-item.open", accordion).forEach(openItem => {
      if (openItem === item) return;
      openItem.classList.remove("open");
      $(".faq-a", openItem).style.maxHeight = "";
      $(".faq-q", openItem).setAttribute("aria-expanded", "false");
    });
    item.classList.toggle("open", willOpen);
    button.setAttribute("aria-expanded", String(willOpen));
    answer.style.maxHeight = willOpen ? `${answer.scrollHeight}px` : "";
  });

  $("#printDocument")?.addEventListener("click", () => window.print());

  const toast = $("#toast");
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1800);
  }

  $$(".copy-section-link").forEach(button => button.addEventListener("click", async () => {
    const url = `${location.origin}${location.pathname}#${button.dataset.section}`;
    try { await navigator.clipboard.writeText(url); showToast("Section link copied"); }
    catch { location.hash = button.dataset.section; showToast("Section opened"); }
  }));

  const themeToggle = $("#themeToggle");
  const storedTheme = localStorage.getItem("belmoney-doc-theme");
  const preferredDark = matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = storedTheme || (preferredDark ? "dark" : "light");
  document.documentElement.dataset.theme = initialTheme;
  function syncThemeIcon() {
    const dark = document.documentElement.dataset.theme === "dark";
    themeToggle?.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    themeToggle?.setAttribute("title", dark ? "Light theme" : "Dark theme");
    if (themeToggle) themeToggle.innerHTML = `<i data-lucide="${dark ? "sun" : "moon"}" aria-hidden="true"></i>`;
    initIcons();
  }
  syncThemeIcon();
  themeToggle?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("belmoney-doc-theme", next);
    syncThemeIcon();
  });

  const dialog = $("#searchDialog");
  const searchInput = $("#searchInput");
  const results = $("#searchResults");
  const status = $("#searchStatus");
  const searchable = sections.map(section => ({
    id: section.id,
    title: $(".section-title", section)?.textContent.trim() || section.id,
    text: section.textContent.replace(/\s+/g, " ").trim()
  }));
  function openSearch() {
    dialog.hidden = false;
    document.body.style.overflow = "hidden";
    setTimeout(() => searchInput.focus(), 0);
  }
  function closeSearch() {
    dialog.hidden = true;
    document.body.style.overflow = "";
    searchInput.value = "";
    results.innerHTML = "";
    status.textContent = "Type to search headings and content.";
  }
  $("#openSearch")?.addEventListener("click", openSearch);
  $$('[data-close-search]').forEach(el => el.addEventListener("click", closeSearch));
  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); openSearch(); }
    if (event.key === "Escape" && !dialog.hidden) closeSearch();
  });
  searchInput?.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    results.innerHTML = "";
    if (!query) { status.textContent = "Type to search headings and content."; return; }
    const matches = searchable.filter(item => item.text.toLowerCase().includes(query)).slice(0, 12);
    status.textContent = `${matches.length} result${matches.length === 1 ? "" : "s"}`;
    if (!matches.length) { results.innerHTML = '<div class="search-empty">No matching section found.</div>'; return; }
    matches.forEach(item => {
      const pos = item.text.toLowerCase().indexOf(query);
      const start = Math.max(0, pos - 55);
      const excerpt = `${start ? "…" : ""}${item.text.slice(start, start + 150)}${item.text.length > start + 150 ? "…" : ""}`;
      const link = document.createElement("a");
      link.className = "search-result";
      link.href = `#${item.id}`;
      link.innerHTML = `<strong>${item.title}</strong><span>${excerpt}</span>`;
      link.addEventListener("click", closeSearch);
      results.appendChild(link);
    });
  });
});
