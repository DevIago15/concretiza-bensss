"use strict";

const body = document.body;
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navList = document.querySelector(".nav-list");
const simulationForm = document.querySelector(".simulation-form");
const phoneInput = document.querySelector("#telefone");

const closeNavigation = () => {
  body.classList.remove("nav-open");
  if (navToggle) {
    navToggle.setAttribute("aria-expanded", "false");
  }
};

const toggleNavigation = () => {
  const isOpen = body.classList.toggle("nav-open");
  if (navToggle) {
    navToggle.setAttribute("aria-expanded", String(isOpen));
  }
};

const handleScrollState = () => {
  if (!header) {
    return;
  }
  if (window.scrollY > 12) {
    header.classList.add("is-scrolled");
  } else {
    header.classList.remove("is-scrolled");
  }
};

if (navToggle && navList) {
  navToggle.addEventListener("click", toggleNavigation);

  navList.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 960) {
        closeNavigation();
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) {
      closeNavigation();
    }
  });
}

window.addEventListener("scroll", handleScrollState);
handleScrollState();

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  const ddd = digits.slice(0, 2);

  if (digits.length <= 2) {
    return ddd ? `(${ddd}` : "";
  }

  if (digits.length <= 6) {
    const middle = digits.slice(2);
    return `(${ddd}) ${middle}`;
  }

  if (digits.length <= 10) {
    const middle = digits.slice(2, 6);
    const end = digits.slice(6, 10);
    return `(${ddd}) ${middle}${end ? `-${end}` : ""}`;
  }

  const middle = digits.slice(2, 7);
  const end = digits.slice(7, 11);
  return `(${ddd}) ${middle}${end ? `-${end}` : ""}`;
};

if (phoneInput) {
  phoneInput.addEventListener("input", (event) => {
    const target = event.target;
    target.value = formatPhone(target.value);
  });
}

if (simulationForm) {
  simulationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!simulationForm.checkValidity()) {
      simulationForm.reportValidity();
      return;
    }

    const nome = simulationForm.nome.value.trim();
    const produto = simulationForm.produto.value;
    const credito = simulationForm.credito.value;

    const messageParts = [
      `Olá, meu nome é ${nome}.`,
      produto ? `Tenho interesse em ${produto}.` : "",
      credito ? `Desejo simular o crédito de ${credito}.` : "",
    ].filter(Boolean);

    const message = encodeURIComponent(messageParts.join(" "));
    const whatsappUrl = `https://api.whatsapp.com/send?phone=5517996702711&text=${message}`;
    const newWindow = window.open(whatsappUrl, "_blank");

    if (!newWindow) {
      window.location.href = whatsappUrl;
    }
  });
}

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
  origin: 'top',
  distance: '60px',
  duration: 2500,
  delay: 400,
})
sr.reveal(`.hero-form-card`)
sr.reveal(`.media-card, .card-grid`, { origin: 'bottom' })
sr.reveal(`.vehicle-hero img, .image-cta__media`, { origin: 'top' })
sr.reveal(`.hero-form-card`, { origin: 'left' })
sr.reveal(`.eyebrow`, { origin: 'right' })
sr.reveal(`.`, { interval: '100' })

// ===== Config =====
const TYPED_TARGET_ID = 'typed';
const FORCE_ANIMATION = false; // se true, ignora prefers-reduced-motion

function getStrings() {
  const isMobile = window.matchMedia('(max-width: 640px)').matches;
  return isMobile
    ? [
      'Crédito inteligente para seus objetivos 💡',
      'Parcelas que cabem no bolso 💰',
      'O caminho certo para seus sonhos 🏠'
    ]
    : [
      'Crédito inteligente p/ seus objetivos 💡',
      'Parcelas que cabem no seu bolso 💰',
      'O caminho certo p/ seus sonhos 🏠'
    ];
}

let typedInstance = null;
let resizeTimer = null;

function destroyTyped() {
  if (typedInstance && typeof typedInstance.destroy === 'function') {
    typedInstance.destroy();
    typedInstance = null;
  }
}

function initTyped() {
  // 1) guarda: biblioteca carregada?
  if (!window.Typed) {
    console.warn('[typed] Biblioteca Typed.js ainda não disponível.');
    return false;
  }
  // 2) guarda: alvo existe?
  const el = document.getElementById(TYPED_TARGET_ID);
  if (!el) {
    console.warn(`[typed] Elemento #${TYPED_TARGET_ID} não encontrado.`);
    return false;
  }

  // 3) acessibilidade (pode forçar animação se quiser)
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced && !FORCE_ANIMATION) {
    el.textContent = 'Crédito inteligente para realizar seus objetivos';
    destroyTyped();
    return true;
  }

  // 4) recria
  destroyTyped();
  typedInstance = new Typed(`#${TYPED_TARGET_ID}`, {
    strings: getStrings(),
    typeSpeed: 60,
    backSpeed: 30,
    backDelay: 2200,
    startDelay: 300,
    smartBackspace: true,
    loop: true,
    showCursor: true,
    cursorChar: '|'
  });
  return true;
}

// Espera DOM + tenta novamente se a lib ainda não chegou
function bootTypedWithRetry(retries = 20, interval = 150) {
  const ok = initTyped();
  if (!ok && retries > 0) {
    setTimeout(() => bootTypedWithRetry(retries - 1, interval), interval);
  }
}

// Inicia quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => bootTypedWithRetry());
} else {
  bootTypedWithRetry();
}

// Recria no resize (debounce)
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => initTyped(), 250);
});

// Se for SPA e o #typed entra depois, observa o DOM e inicia quando aparecer
const mo = new MutationObserver(() => {
  if (!typedInstance && document.getElementById(TYPED_TARGET_ID)) {
    initTyped();
  }
});
mo.observe(document.documentElement, { childList: true, subtree: true });




