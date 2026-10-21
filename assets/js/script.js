const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const header = $(".site-header");
const menuToggle = $("#menuToggle");
const nav = $("#mainNav");

if (menuToggle) menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});

$$(".nav-link").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 25);

  const sections = $$("section[id]");
  let current = "home";
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 160) current = section.id;
  });
  $$(".nav-link").forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {threshold: .12});
$$(".reveal").forEach(el => observer.observe(el));

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    let value = 0;
    const step = Math.max(1, Math.ceil(target / 20));
    const timer = setInterval(() => {
      value += step;
      if (value >= target) {
        value = target;
        clearInterval(timer);
      }
      el.textContent = value;
    }, 45);
    statObserver.unobserve(el);
  });
}, {threshold: .6});
$$("[data-count]").forEach(el => statObserver.observe(el));

const tabs = $$(".tab");
const panels = {
  projects: $("#projects"),
  certificates: $("#certificates"),
  tech: $("#tech")
};
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    Object.values(panels).forEach(panel => panel.style.display = "none");
    panels[tab.dataset.filter].style.display = "block";
  });
});

const filters = $$(".filter");
const cards = $$(".project-card");
filters.forEach(filter => {
  filter.addEventListener("click", () => {
    filters.forEach(f => f.classList.remove("active"));
    filter.classList.add("active");
    const category = filter.dataset.category;
    cards.forEach(card => {
      const show = category === "all" || card.dataset.category === category;
      card.style.display = show ? "" : "none";
    });
  });
});

if ($("#contactForm")) $("#contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = $("#formMessage");
  msg.textContent = "Message captured. Connect this form to your PHP/backend email handler.";
  e.target.reset();
});

$("#year").textContent = new Date().getFullYear();

$$('a[href="#"]').forEach(a => {
  a.addEventListener("click", e => e.preventDefault());
});



// Click a loaded profile, project, or certificate image to preview it.
document.addEventListener("click", (event) => {
  const img = event.target.closest(".project-image img, .certificate-image img, .profile-ring img, .hero-photo img");
  if (!img || !img.naturalWidth) return;
  const box = document.createElement("div");
  box.className = "image-preview";
  const preview = document.createElement("img");
  preview.src = img.src;
  preview.alt = img.alt || "Image preview";
  const close = document.createElement("button");
  close.type = "button";
  close.setAttribute("aria-label", "Close image preview");
  close.textContent = "×";
  box.append(close, preview);
  document.body.appendChild(box);
  requestAnimationFrame(() => box.classList.add("show"));
  const dismiss = () => box.remove();
  close.addEventListener("click", dismiss);
  box.addEventListener("click", (e) => { if (e.target === box) dismiss(); });
  document.addEventListener("keydown", function esc(e) {
    if (e.key === "Escape") { dismiss(); document.removeEventListener("keydown", esc); }
  });
});


// Open the complete original document PDF in an overlay on the same index page.
const resumeModal = $("#resumeModal");
const openResume = $("#openResume");
const closeResume = $("#closeResume");
const dismissResume = () => {
  if (!resumeModal) return;
  resumeModal.classList.remove("open");
  resumeModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("resume-open");
  if (openResume) openResume.focus();
};
if (openResume && resumeModal) openResume.addEventListener("click", () => {
  resumeModal.classList.add("open");
  resumeModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("resume-open");
  if (closeResume) closeResume.focus();
});
if (closeResume) closeResume.addEventListener("click", dismissResume);
if (resumeModal) resumeModal.addEventListener("click", (event) => {
  if (event.target === resumeModal) dismissResume();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && resumeModal && resumeModal.classList.contains("open")) dismissResume();
});
