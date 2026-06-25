// ============================================================
// Interactions du portfolio : curseur, nav, reveal, tilt 3D,
// boutons magnétiques, formulaire de contact (FormSubmit + honeypot).
// ============================================================

const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

// ---- Curseur lumineux ----
const cursor = $("#cursor");
if (cursor && window.matchMedia("(min-width: 901px)").matches) {
  let cx = 0, cy = 0, tx = 0, ty = 0;
  window.addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; });
  const loop = () => {
    cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };
  loop();
  // grossit au survol des éléments interactifs
  $$("a, button, [data-tilt], input, textarea").forEach((el) => {
    el.addEventListener("pointerenter", () => cursor.classList.add("grow"));
    el.addEventListener("pointerleave", () => cursor.classList.remove("grow"));
  });
}

// ---- Nav : fond au scroll + lien actif ----
const nav = $("#nav");
const sections = $$("section[id]");
const navLinks = $$(".nav__links a");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
  let current = "";
  sections.forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${current}`));
});

// ---- Menu burger (mobile) ----
const burger = $("#burger");
const links = $("#navlinks");
burger?.addEventListener("click", () => links.classList.toggle("open"));
navLinks.forEach((a) => a.addEventListener("click", () => links.classList.remove("open")));

// ---- Reveal au scroll ----
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
  { threshold: 0.12 },
);
$$(".reveal").forEach((el) => io.observe(el));

// ---- Tilt 3D sur les cartes ----
if (window.matchMedia("(min-width: 901px)").matches) {
  $$("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateY(-4px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}

// ---- Boutons magnétiques ----
if (window.matchMedia("(min-width: 901px)").matches) {
  $$(".magnetic").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
    });
    btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
  });
}

// ---- Toast ----
const toast = $("#toast");
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}

// ---- Formulaire de contact (FormSubmit AJAX + honeypot anti-spam) ----
const FORM_EMAIL = "davidiazoulay@gmail.com";
const form = $("#contact-form");
const status = $("#form-status");
const sendBtn = $("#send-btn");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  // honeypot : si rempli, c'est un bot -> on ignore silencieusement
  if (form._honey.value) return;

  status.className = "form-status";
  status.textContent = "";
  sendBtn.disabled = true;
  sendBtn.textContent = "Envoi…";

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${FORM_EMAIL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        Nom: form.name.value,
        Email: form.email.value,
        Sujet: form.subject.value,
        Message: form.message.value,
        _subject: `Portfolio — ${form.subject.value}`,
        _template: "table",
      }),
    });
    const data = await res.json();
    if (res.ok && (data.success === "true" || data.success === true)) {
      status.className = "form-status ok";
      status.textContent = "Message envoyé, merci ! Je reviens vers vous vite.";
      form.reset();
      showToast("Message envoyé ✓");
    } else {
      throw new Error("send failed");
    }
  } catch (err) {
    status.className = "form-status err";
    status.textContent = "Oups, l'envoi a échoué. Écrivez-moi directement : " + FORM_EMAIL;
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = "Envoyer le message";
  }
});
