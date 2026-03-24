/* =============================================
   CHANDRASHEKHAR KUMAR v2 — script2.js
   Canvas mesh BG · Cursor · Reveals · Ticker
   ============================================= */

(function () {
  "use strict";

  /* =============================================
     1. CURSOR
  ============================================= */
  const cur = document.getElementById("cur");
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + "px";
    cur.style.top  = my + "px";
  });

  document.addEventListener("mouseleave", () => { cur.style.opacity = "0"; });
  document.addEventListener("mouseenter", () => { cur.style.opacity = "1"; });

  /* =============================================
     2. CANVAS ANIMATED MESH / PARTICLE NETWORK
  ============================================= */
  const canvas = document.getElementById("mesh-canvas");
  const ctx = canvas.getContext("2d");

  let W, H, nodes = [];
  const NODE_COUNT = 55;
  const CONNECT_DIST = 160;
  const NODE_SPEED = 0.35;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  class Node {
    constructor() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * NODE_SPEED;
      this.vy = (Math.random() - 0.5) * NODE_SPEED;
      this.r  = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
  }

  for (let i = 0; i < NODE_COUNT; i++) nodes.push(new Node());

  function drawMesh() {
    ctx.clearRect(0, 0, W, H);

    // Lines
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(214, 58, 42, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Dots
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(214, 58, 42, 0.35)";
      ctx.fill();
      n.update();
    });

    requestAnimationFrame(drawMesh);
  }
  drawMesh();

  /* =============================================
     3. HEADER SCROLL EFFECT
  ============================================= */
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  }, { passive: true });

  /* =============================================
     4. HERO SEQUENCE ANIMATION
  ============================================= */
  const seqEls = document.querySelectorAll("[data-seq]");
  const baseDelay = 150;

  seqEls.forEach(el => {
    const seq  = parseInt(el.getAttribute("data-seq"), 10);
    const delay = seq * baseDelay + 200;

    // h1-word needs skewY reset too
    if (el.classList.contains("h1-word")) {
      el.style.transition =
        `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms,
         transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`;
    } else {
      el.style.transition =
        `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms,
         transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`;
    }

    // Trigger
    requestAnimationFrame(() => {
      setTimeout(() => {
        el.style.opacity  = "1";
        el.style.transform = "translateY(0) translateX(0) skewY(0deg)";
      }, 50);
    });
  });

  /* =============================================
     5. SCROLL REVEAL — IntersectionObserver
  ============================================= */
  const revealEls = document.querySelectorAll(".reveal");

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll(".reveal")];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.animationDelay = (idx * 80) + "ms";
        entry.target.classList.add("visible");
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  revealEls.forEach(el => revealObs.observe(el));

  /* =============================================
     6. TICKER DUPLICATION (seamless loop)
  ============================================= */
  const ticker = document.getElementById("ticker");
  if (ticker) {
    ticker.innerHTML += ticker.innerHTML; // duplicate for seamless loop
  }

  /* =============================================
     7. BENTO CARD TILT
  ============================================= */
  document.querySelectorAll(".bento-card").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform =
        `perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) scale(1.015)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.transition = "transform 0.6s cubic-bezier(0.16,1,0.3,1), background 0.25s";
    });
  });

  /* =============================================
     8. CONTACT CARD MAGNETIC PULL
  ============================================= */
  document.querySelectorAll(".contact-card").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.08;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.08;
      card.style.transform = `translateX(${6 + dx}px) translateY(${dy}px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.transition = "all 0.4s cubic-bezier(0.16,1,0.3,1)";
    });
    card.addEventListener("mouseenter", () => {
      card.style.transition = "all 0.15s ease";
    });
  });

  /* =============================================
     9. ACTIVE NAV HIGHLIGHTING
  ============================================= */
  const sections = document.querySelectorAll("section[id], .about-sec[id]");
  const navAs = document.querySelectorAll(".nav-a");

  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navAs.forEach(a => {
          const active = a.getAttribute("href") === `#${id}`;
          a.style.color = active ? "var(--ink)" : "";
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => secObs.observe(s));

  /* =============================================
     10. PAGE FADE IN
  ============================================= */
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";

  function fadeIn() { document.body.style.opacity = "1"; }
  if (document.readyState === "complete") { fadeIn(); }
  else { window.addEventListener("load", fadeIn); }

})();
