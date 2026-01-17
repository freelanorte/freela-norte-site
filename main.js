/**
 * Freela Norte — main.js
 * Slider + animações premium (sem quebrar layout)
 * Requisitos: Swiper.js + GSAP
 */

(function () {
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================
     SCROLL REVEAL (leve, 3D)
  ========================= */
  function initScrollReveal() {
    if (!window.gsap || prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    qsa('section[data-reveal]').forEach((section) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      tl.fromTo(
        section,
        { opacity: 0, y: 16, rotationX: 1.2, z: -60, transformPerspective: 1100 },
        { opacity: 1, y: 0, rotationX: 0, z: 0, duration: 0.7, ease: 'power3.out' }
      );

      const inner = qsa('[data-stagger]', section);
      if (inner.length) {
        tl.fromTo(
          inner,
          { opacity: 0, y: 12, rotationX: 1, z: -40 },
          { opacity: 1, y: 0, rotationX: 0, z: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08 },
          '-=0.35'
        );
      }

      const cards = qsa('.card3d', section);
      if (cards.length) {
        tl.fromTo(
          cards,
          { opacity: 0, rotateY: 12, rotateX: 8, z: 40 },
          { opacity: 1, rotateY: 0, rotateX: 0, z: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06 },
          '-=0.30'
        );
      }
    });

    const mqlHoverFine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mqlHoverFine.matches) return;

    qsa('.card3d').forEach((el) => {
      const setRX = gsap.quickSetter(el, 'rotationX', 'deg');
      const setRY = gsap.quickSetter(el, 'rotationY', 'deg');
      const setZ  = gsap.quickSetter(el, 'z');

      function onMove(e) {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = (e.clientX - cx) / r.width;
        const dy = (e.clientY - cy) / r.height;

        const maxY = 8;
        const maxX = 6;
        setRY(dx * maxY);
        setRX(-dy * maxX);
        setZ(12);
      }

      function onLeave() {
        gsap.to(el, { rotationX: 0, rotationY: 0, z: 0, duration: 0.35, ease: 'power2.out' });
      }

      el.addEventListener('mousemove', onMove, { passive: true });
      el.addEventListener('mouseleave', onLeave, { passive: true });
    });
  }

  /* =========================
     SETAS PISCANDO (CTA)
  ========================= */
  function animateArrows(sliderRoot) {
    if (!window.gsap || prefersReduced) return;

    const prev = sliderRoot.querySelector("[data-prev]");
    const next = sliderRoot.querySelector("[data-next]");
    if (!prev || !next) return;

    gsap.fromTo(
      next,
      { opacity: 0.55, y: 0 },
      {
        opacity: 1,
        y: 8,
        duration: 1.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      }
    );

    gsap.fromTo(
      prev,
      { opacity: 0.55, y: 0 },
      {
        opacity: 1,
        y: -8,
        duration: 1.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      }
    );
  }

  /* =========================
     SLIDER ANIMAÇÕES
  ========================= */

  function hideTexts(sliderRoot) {
    if (!window.gsap || prefersReduced) return;
    gsap.set(qsa(".cardText", sliderRoot), { opacity: 0, y: 16 });
  }

  function animateActiveSlide(sliderRoot) {
    if (!window.gsap || prefersReduced) return;

    const active = sliderRoot.querySelector(".swiper-slide-active");
    if (!active) return;

    const card = qs(".cardMedia", active);
    const text = qs(".cardText", active);

    if (card) {
      gsap.fromTo(
        card,
        { y: 28, opacity: 0, rotateX: 10 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.55,
          ease: "power3.out"
        }
      );
    }

    if (text) {
      gsap.fromTo(
        text,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          delay: 0.15,
          ease: "power3.out"
        }
      );
    }
  }

  function pulseDots(sliderRoot) {
    if (!window.gsap || prefersReduced) return;

    const active = sliderRoot.querySelector(
      ".swiper-pagination-bullet-active"
    );
    if (!active) return;

    gsap.fromTo(
      active,
      { scale: 1 },
      { scale: 1.35, duration: 0.3, ease: "back.out(2)" }
    );
  }

  /* =========================
     INIT SLIDER
  ========================= */
  function initSlider(sliderShell) {
    const swiperEl = sliderShell.querySelector("[data-swiper]");
    if (!swiperEl || !window.Swiper) return;

    const prev = sliderShell.querySelector("[data-prev]");
    const next = sliderShell.querySelector("[data-next]");
    const dots = sliderShell.querySelector(".dots");

    const swiper = new Swiper(swiperEl, {
      speed: 520,
      spaceBetween: 18,
      centeredSlides: true,
      grabCursor: true,
      simulateTouch: true,

      freeMode: {
        enabled: true,
        momentum: true,
        momentumRatio: 0.9,
        sticky: true
      },

      pagination: {
        el: dots,
        clickable: true
      },

      breakpoints: {
        0: { slidesPerView: 1.05 },
        640: { slidesPerView: 1.4 },
        960: { slidesPerView: 1.9 }
      }
    });

    prev && prev.addEventListener("click", () => swiper.slidePrev());
    next && next.addEventListener("click", () => swiper.slideNext());

    animateArrows(sliderShell);
    hideTexts(sliderShell);
    animateActiveSlide(sliderShell);
    pulseDots(sliderShell);

    swiper.on("slideChangeTransitionStart", () => {
      hideTexts(sliderShell);
    });

    swiper.on("transitionEnd", () => {
      animateActiveSlide(sliderShell);
      pulseDots(sliderShell);
    });

    swiper.on("touchEnd", () => {
      animateActiveSlide(sliderShell);
      pulseDots(sliderShell);
    });
  }

  /* =========================
     MENU MOBILE
  ========================= */
  function initMenu() {
    const btn = qs("[data-menu]");
    const menu = qs("[data-mobile-menu]");
    if (!btn || !menu) return;

    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("is-open", !open);
      menu.setAttribute("aria-hidden", String(open));
    });
  }

  /* =========================
     BOOT
  ========================= */
  document.addEventListener("DOMContentLoaded", () => {
    initMenu();
    initScrollReveal();
    qsa(".swiperWrap, .sliderShell").forEach(initSlider);
  });
})();
