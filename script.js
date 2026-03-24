/* =============================================
   CHANDRASHEKHAR KUMAR — script.js
   Interactions: Cursor, Nav, Scroll Reveals
   ============================================= */

(function () {
  "use strict";

  // ---- CUSTOM CURSOR ----
  const cursor = document.getElementById("cursor");
  const follower = document.getElementById("cursor-follower");
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + "px";
    follower.style.top = followerY + "px";
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hide cursor when leaving window
  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
    follower.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    cursor.style.opacity = "1";
    follower.style.opacity = "1";
  });

  // ---- NAV SCROLL ----
  const nav = document.getElementById("nav");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }, { passive: true });

  // ---- STAGGERED REVEAL ANIMATION (data-delay attrs on hero) ----
  document.querySelectorAll("[data-delay]").forEach((el) => {
    const delay = el.getAttribute("data-delay");
    el.style.animationDelay = delay + "ms";
  });

  // ---- SCROLL REVEAL — fade-up elements ----
  function setupScrollReveal() {
    const targets = [
      ".about-grid",
      ".skills-grid .skill-card",
      ".timeline-item",
      ".edu-strip",
      ".connect-inner",
      ".section-title",
      ".section-label",
    ];

    const allEls = [];

    targets.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el, i) => {
        el.classList.add("fade-up");
        // Stagger child elements
        if (el.parentElement.querySelectorAll(selector.split(" ").pop()).length > 1) {
          el.style.transitionDelay = i * 80 + "ms";
        }
        allEls.push(el);
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    allEls.forEach((el) => observer.observe(el));
  }

  setupScrollReveal();

  // ---- SMOOTH ACTIVE NAV LINKS ----
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.style.color = link.getAttribute("href") === `#${id}`
              ? "var(--text)"
              : "";
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // ---- SKILL CARD HOVER TILT ----
  document.querySelectorAll(".skill-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) scale(1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.transition = "transform 0.5s var(--ease-out-expo), background 0.3s";
    });
  });

  // ---- FLOATING CHIPS PARALLAX ----
  const chips = document.querySelectorAll(".chip");
  if (chips.length > 0) {
    const speeds = [0.04, -0.03, 0.05, -0.04, 0.03, -0.05];
    window.addEventListener("mousemove", (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      chips.forEach((chip, i) => {
        const s = speeds[i] || 0.03;
        chip.style.transform = `translate(${dx * s}px, ${dy * s}px)`;
      });
    }, { passive: true });
  }

  // ---- CONNECT CARD MAGNETIC EFFECT ----
  document.querySelectorAll(".connect-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transition = "background 0.25s, border-color 0.25s, transform 0.2s";
    });
  });

  // ---- PAGE LOAD SEQUENCE ----
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.4s ease";

  window.addEventListener("load", () => {
    setTimeout(() => {
      document.body.style.opacity = "1";
    }, 50);
  });

  // If load already fired
  if (document.readyState === "complete") {
    document.body.style.opacity = "1";
  }

})();
