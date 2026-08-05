// ==========================================================================
// Belmoney Docs — interactivity
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Icons ---------- */
  function initIcons() {
    if (window.lucide) { window.lucide.createIcons(); }
    else { setTimeout(initIcons, 60); }
  }
  initIcons();

  /* ---------- Scroll progress bar ---------- */
  const progress = document.getElementById("scrollProgress");
  function updateProgress() {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    progress.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + "%";
  }
  document.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ---------- Reveal on scroll ---------- */
  const revealItems = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  revealItems.forEach(el => revealObserver.observe(el));

  /* ---------- Nav active link highlighting ---------- */
  const sections = Array.from(document.querySelectorAll("main section[id], header[id]"));
  const navLinks = Array.from(document.querySelectorAll(".navlinks a"));
  function setActiveNav() {
    let currentId = null;
    const scrollPos = window.scrollY + 140;
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) currentId = sec.id;
    });
    navLinks.forEach(a => {
      const match = a.getAttribute("href") === "#" + currentId;
      a.classList.toggle("active", match);
    });
  }
  document.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

  /* ---------- Step "spine" fill, driven by scroll position within each stepper ---------- */
  const spines = document.querySelectorAll(".spine-wrap");
  function updateSpines() {
    spines.forEach(wrap => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      let progressed = (vh * 0.75 - rect.top);
      progressed = Math.max(0, Math.min(total, progressed));
      const ratio = total > 0 ? progressed / total : 0;
      const fillLine = wrap.querySelector(".spine-fill");
      if (fillLine) {
        fillLine.setAttribute("y2", (ratio * 100) + "%");
      }
      const steps = wrap.querySelectorAll(".step");
      const stepRatio = 1 / steps.length;
      steps.forEach((step, i) => {
        step.classList.toggle("is-active", ratio >= i * stepRatio);
      });
    });
  }
  document.addEventListener("scroll", updateSpines, { passive: true });
  window.addEventListener("resize", updateSpines);
  updateSpines();

  /* ---------- FAQ accordion (built from data, keeps markup lean) ---------- */
  const faqData = [
    ["Can Operations approve contracts?", "No. Approval always belongs to the designated Commercial or Legal approver, based on what's being changed. Operations submits the request and monitors the result."],
    ["How does the assistant decide who approves a change?", "It classifies the request automatically. Commercial fields (fees, pricing, company information) go to the Commercial approver; legal fields (liability, compliance, wording) go to the Legal approver."],
    ["Can I continue after approval?", "Yes. The task thread stays open, so you can keep the conversation going for follow-up requests."],
    ["Can I request multiple revisions?", "Yes, but one at a time. Submit each change as its own message so it gets its own clear approval decision."],
    ["What happens when approval is rejected?", "The workflow stops immediately. No document is changed. Correct the request based on the approver's feedback and submit it again."],
    ["Can the AI modify documents automatically?", "No. Every document change requires explicit approval from the designated approver first."],
    ["What if my request touches both a fee and a clause?", "Split it into two messages. One change per message keeps classification accurate and gives each change its own approval trail."],
    ["A partner is pushing for a same-day answer — can I skip the approval step?", "No. Approval timing depends on the approver's availability, not customer urgency. Let the customer know the request is in review, and flag time-sensitive cases to your team lead."],
    ["The assistant asked a clarifying question instead of drafting a revision — is that normal?", "Yes. If your message is missing a detail the assistant needs, it will ask instead of guessing. Reply with the missing detail in the same thread."],
    ["I submitted a request and nothing happened for a while — should I resubmit?", "Check the task status and comment thread first. If there's truly no response, see Troubleshooting before resubmitting."],
    ["Can I use the assistant for a partner that isn't in ClickUp yet?", "No. The assistant only operates within a ClickUp task that already has Contract Review status and an available Service Order."]
  ];

  const accordion = document.getElementById("faqAccordion");
  if (accordion) {
    faqData.forEach(([q, a], i) => {
      const item = document.createElement("div");
      item.className = "faq-item";
      item.innerHTML = `
        <button class="faq-q" aria-expanded="false" aria-controls="faq-a-${i}">
          <span>${q}</span>
          <i data-lucide="plus"></i>
        </button>
        <div class="faq-a" id="faq-a-${i}">
          <div class="faq-a-inner">${a}</div>
        </div>`;
      accordion.appendChild(item);
    });
    initIcons();

    accordion.addEventListener("click", (e) => {
      const btn = e.target.closest(".faq-q");
      if (!btn) return;
      const item = btn.closest(".faq-item");
      const answer = item.querySelector(".faq-a");
      const isOpen = item.classList.contains("open");

      accordion.querySelectorAll(".faq-item.open").forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove("open");
          openItem.querySelector(".faq-a").style.maxHeight = null;
          openItem.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        }
      });

      if (isOpen) {
        item.classList.remove("open");
        answer.style.maxHeight = null;
        btn.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
        btn.setAttribute("aria-expanded", "true");
      }
    });
  }

});
