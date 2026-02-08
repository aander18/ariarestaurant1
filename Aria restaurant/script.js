(() => {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  const setNavbarState = () => {
    if (!navbar) return;
    const scrolled = window.scrollY > 100;
    navbar.classList.toggle("scrolled", scrolled);
  };

  setNavbarState();
  window.addEventListener("scroll", setNavbarState, { passive: true });

  const closeMenu = () => {
    if (!hamburger || !navMenu) return;
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  const toggleMenu = () => {
    if (!hamburger || !navMenu) return;
    const isOpen = navMenu.classList.toggle("active");
    hamburger.classList.toggle("active", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  if (hamburger) {
    hamburger.addEventListener("click", toggleMenu);
  }

  document.addEventListener("click", (e) => {
    if (!navMenu || !hamburger) return;
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (navMenu.contains(target) || hamburger.contains(target)) return;
    closeMenu();
  });

  if (navMenu) {
    navMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => closeMenu());
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (!href) return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    });
  });

  const observerTargets = Array.from(document.querySelectorAll(".fade-in-scroll"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  observerTargets.forEach((el) => observer.observe(el));

  const contactForm = document.getElementById("contactForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const dateInput = document.getElementById("date");
  const timeSelect = document.getElementById("time");
  const guestsSelect = document.getElementById("guests");
  const messageInput = document.getElementById("message");

  const WHATSAPP_PHONE = "393343576688";

  const setError = (input, msg) => {
    const group = input?.closest?.(".form-group");
    if (!group) return;
    const errorEl = group.querySelector(".error-message");
    if (errorEl) errorEl.textContent = msg || "";
    group.classList.toggle("error", Boolean(msg));
  };

  const showError = (fieldId, message) => {
    const field = document.getElementById(fieldId);
    if (!field) return;
    const formGroup = field.closest(".form-group");
    if (!formGroup) return;
    const errorMessage = formGroup.querySelector(".error-message");
    formGroup.classList.add("error");
    if (errorMessage) errorMessage.textContent = message;
  };

  const setMinDate = () => {
    if (!dateInput) return;
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", today);
  };

  setMinDate();

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      document.querySelectorAll(".form-group").forEach((group) => {
        group.classList.remove("error");
      });

      let isValid = true;

      const name = (nameInput?.value || "").trim();
      const email = (emailInput?.value || "").trim();
      const phone = (phoneInput?.value || "").trim();
      const date = (dateInput?.value || "").trim();
      const time = (timeSelect?.value || "").trim();
      const guests = (guestsSelect?.value || "").trim();
      const message = (messageInput?.value || "").trim();

      if (name === "" || name.length < 2) {
        showError("name", "Inserisci un nome valido");
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showError("email", "Inserisci un'email valida");
        isValid = false;
      }

      const phoneRegex = /^[\d\s\+\-\(\)]+$/;
      if (!phoneRegex.test(phone) || phone.length < 8) {
        showError("phone", "Inserisci un numero di telefono valido");
        isValid = false;
      }

      if (date === "") {
        showError("date", "Seleziona una data");
        isValid = false;
      } else {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          showError("date", "Seleziona una data futura");
          isValid = false;
        }
      }

      if (time === "") {
        showError("time", "Seleziona un orario");
        isValid = false;
      }

      if (guests === "") {
        showError("guests", "Seleziona il numero di ospiti");
        isValid = false;
      }

      if (!isValid) return;

      const formattedDate = new Date(date).toLocaleDateString("it-IT", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      let whatsappMessage = `🍽️ *NUOVA PRENOTAZIONE*\n\n`;
      whatsappMessage += `👤 *Nome:* ${name}\n`;
      whatsappMessage += `📧 *Email:* ${email}\n`;
      whatsappMessage += `📱 *Telefono:* ${phone}\n`;
      whatsappMessage += `📅 *Data:* ${formattedDate}\n`;
      whatsappMessage += `🕐 *Ora:* ${time}\n`;
      whatsappMessage += `👥 *Ospiti:* ${guests}\n`;
      if (message) {
        whatsappMessage += `\n💬 *Note:*\n${message}`;
      }

      const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(url, "_blank", "noopener,noreferrer");

      contactForm.reset();

      const toast = document.createElement("div");
      toast.className = "toast-notification";
      toast.textContent = "✅ Prenotazione inviata! Conferma su WhatsApp.";
      document.body.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add("visible"));
      setTimeout(() => {
        toast.classList.remove("visible");
        setTimeout(() => toast.remove(), 400);
      }, 4000);
    });
  }

  const toastStyles = `
    .toast-notification {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: var(--primary-color, #7ec8e3);
        color: #1a1a1a;
        padding: 14px 28px;
        border-radius: 50px;
        font-family: 'Montserrat', sans-serif;
        font-weight: 600;
        font-size: 0.95rem;
        box-shadow: 0 8px 30px rgba(0,0,0,0.4);
        z-index: 3000;
        opacity: 0;
        transition: opacity 0.4s ease, transform 0.4s ease;
        pointer-events: none;
        white-space: nowrap;
    }
    .toast-notification.visible {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
`;

  const styleSheet = document.createElement("style");
  styleSheet.textContent = toastStyles;
  document.head.appendChild(styleSheet);

  console.log("✨ Aria Restaurant website loaded successfully!");
})();
