/* ============================================
   IKS COMMUNITY — INTERACTIVITY
   "0 Rupees. Infinite Dreams."
   ============================================ */

// ============================================
// LOADING SCREEN
// ============================================
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    // Trigger hero reveals after loader fades
    setTimeout(() => {
      document.querySelectorAll('.hero .reveal').forEach(el => {
        el.classList.add('visible');
      });
    }, 300);
  }, 1800);
});

// ============================================
// GOLDEN PARTICLE SYSTEM
// ============================================
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.8 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.05;
      this.fadeSpeed = Math.random() * 0.003 + 0.001;
      this.fadeDir = 1;

      // Gold tones
      const goldTones = [
        [201, 168, 76],
        [212, 185, 98],
        [245, 215, 120],
        [180, 140, 50],
      ];
      const tone = goldTones[Math.floor(Math.random() * goldTones.length)];
      this.r = tone[0];
      this.g = tone[1];
      this.b = tone[2];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Fade in and out
      this.opacity += this.fadeSpeed * this.fadeDir;
      if (this.opacity >= 0.5) this.fadeDir = -1;
      if (this.opacity <= 0.02) {
        this.fadeDir = 1;
        this.reset();
      }

      // Wrap around
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticleArray() {
    particles = [];
    // Scale particle count by screen size
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    animationId = requestAnimationFrame(animate);
  }

  resize();
  initParticleArray();
  animate();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      initParticleArray();
    }, 250);
  });
})();

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
(function initNav() {
  const nav = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });
})();

// ============================================
// MOBILE MENU TOGGLE
// ============================================
(function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
  });

  // Close on link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      toggle.classList.remove('active');
      links.classList.remove('open');
    }
  });
})();

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => {
    // Don't observe hero elements — they're revealed after loader
    if (!el.closest('.hero')) {
      observer.observe(el);
    }
  });
})();

// ============================================
// RULES ACCORDION
// ============================================
function toggleRule(header) {
  const item = header.parentElement;
  const isActive = item.classList.contains('active');

  // Close all others
  document.querySelectorAll('.rule-item.active').forEach(el => {
    el.classList.remove('active');
  });

  // Toggle current
  if (!isActive) {
    item.classList.add('active');
  }
}

// ============================================
// JOIN BUTTON HANDLER
// ============================================
function handleJoin(event) {
  event.preventDefault();

  const btn = document.getElementById('joinBtn');
  const originalText = btn.innerHTML;

  btn.innerHTML = `
    Stay Tuned! ✨
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
  `;

  setTimeout(() => {
    btn.innerHTML = originalText;
  }, 2500);
}

// ============================================
// SMOOTH SCROLL FOR NAV LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      const navHeight = document.getElementById('navbar').offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    }
  });
});
