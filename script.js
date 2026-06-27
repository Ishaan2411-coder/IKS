/* ============================================
   IKS — CINEMATIC EXPERIENCE ENGINE
   "0 Rupees. Infinite Dreams."
   ============================================ */

// ============================================
// COMMUNITY RULES DATA
// ============================================
const RULES = [
  {
    title: "No Money Involved",
    body: "IKS is built on collaboration, not transactions. Members must not ask for, demand, or offer money for contributions within community projects."
  },
  {
    title: "Studies Come First",
    body: "Most members are students. Your education, family responsibilities, and personal growth always come first. Participate only in your free time and, where required, with your parents' permission."
  },
  {
    title: "Voluntary Participation",
    body: "No member is forced to work on any project. If you are not interested, unavailable, or uncomfortable with a task, you have the right to respectfully say \"No.\""
  },
  {
    title: "Family-Like Environment",
    body: "We want IKS to feel like a supportive family. Healthy jokes, fun conversations, and friendly interactions are welcome. However, personal attacks, bullying, harassment, discrimination, hate speech, or disrespectful comments are strictly prohibited."
  },
  {
    title: "Respect Every Dream",
    body: "Behind every project is someone's dream. Whether you are a writer, artist, editor, animator, musician, developer, or creator — contribute honestly and responsibly. We are not just building projects — we are helping people build their dreams."
  },
  {
    title: "Give Credit Where It's Due",
    body: "Always acknowledge and respect the work of fellow creators. Do not copy, steal, repost, or claim someone else's work as your own."
  },
  {
    title: "Keep the Community Safe",
    body: "Any form of scams, threats, harmful behavior, inappropriate content, or activities that may harm members or the community will not be tolerated."
  },
  {
    title: "Learn, Help, Grow",
    body: "The purpose of IKS is not competition. It is collaboration. Help others when you can, learn when you need to, and grow together as creators."
  },
  {
    title: "No Ghosting After Commitment",
    body: "If you commit to a project and later become unavailable, inform the team as soon as possible. Do not disappear without notice. Respect everyone's time and effort."
  },
  {
    title: "Use of IKS Name & Responsibility",
    body: "No individual, team, or project may use the IKS name, logo, branding, or claim official association with IKS without the knowledge and approval of the Founder. Any project created without such approval is considered independent and unofficial."
  },
  {
    title: "Rules May Evolve",
    body: "As IKS grows, new situations and challenges may arise. These rules may be updated, expanded, or modified whenever necessary to ensure the safety, growth, and integrity of the community."
  }
];

// ============================================
// STATE
// ============================================
const TOTAL_SCENES = 13;
let currentScene = -1;
let isTransitioning = false;
let cinemaPhase = true;  // true = cinematic intro, false = done
let currentRule = 0;
let sceneTimer = null;

// ============================================
// GOLDEN PARTICLE SYSTEM
// ============================================
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.6 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.speedY = (Math.random() - 0.5) * 0.25;
      this.opacity = Math.random() * 0.35 + 0.05;
      this.fadeSpeed = Math.random() * 0.003 + 0.001;
      this.fadeDir = 1;
      const tones = [[201,168,76],[212,185,98],[245,215,120],[180,140,50]];
      const t = tones[Math.floor(Math.random() * tones.length)];
      this.r = t[0]; this.g = t[1]; this.b = t[2];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity += this.fadeSpeed * this.fadeDir;
      if (this.opacity >= 0.45) this.fadeDir = -1;
      if (this.opacity <= 0.02) { this.fadeDir = 1; this.reset(); }
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.r},${this.g},${this.b},${this.opacity})`;
      ctx.fill();
    }
  }

  function init() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 100);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  resize();
  init();
  animate();

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { resize(); init(); }, 250);
  });
})();

// ============================================
// PROGRESS BAR
// ============================================
function updateProgress() {
  const bar = document.getElementById('progressBar');
  // Cinema: scenes 0-12 = 0% to 50%
  // Rules intro = 50%
  // Rules 1-11 = 50% to 95%
  // Join = 100%
  let pct = 0;

  if (cinemaPhase) {
    pct = ((currentScene + 1) / TOTAL_SCENES) * 50;
  }

  bar.style.width = pct + '%';
}

function setProgress(pct) {
  document.getElementById('progressBar').style.width = pct + '%';
}

// ============================================
// CINEMATIC SCENE ENGINE
// ============================================
function showScene(index) {
  if (index < 0 || index >= TOTAL_SCENES || isTransitioning) return;

  isTransitioning = true;
  clearTimeout(sceneTimer);

  // Hide current
  const current = document.querySelector('.scene.active');
  if (current) current.classList.remove('active');

  // Show next after brief gap
  setTimeout(() => {
    const next = document.getElementById('scene-' + index);
    if (next) next.classList.add('active');
    currentScene = index;
    updateProgress();
    isTransitioning = false;

    // Auto-advance timings per scene
    const timings = [4500, 3500, 4500, 3000, 3500, 4500, 4000, 5500, 4500, 5000, 4500, 5500, 5000];
    const delay = timings[index] || 4000;

    sceneTimer = setTimeout(() => {
      advanceScene();
    }, delay);
  }, current ? 400 : 100);
}

function advanceScene() {
  if (!cinemaPhase) return;

  if (currentScene < TOTAL_SCENES - 1) {
    showScene(currentScene + 1);
  } else {
    // Cinema done → transition to rules
    endCinema();
  }
}

function endCinema() {
  cinemaPhase = false;
  clearTimeout(sceneTimer);

  // Hide cinema
  const cinema = document.getElementById('cinema');
  const current = document.querySelector('.scene.active');
  if (current) current.classList.remove('active');

  setTimeout(() => {
    cinema.style.display = 'none';
    document.getElementById('tapHint').classList.add('hidden');
    document.getElementById('skipBtn').classList.add('hidden');

    // Show rules phase
    startRulesPhase();
  }, 600);
}

function skipIntro() {
  cinemaPhase = false;
  clearTimeout(sceneTimer);

  const cinema = document.getElementById('cinema');
  const current = document.querySelector('.scene.active');
  if (current) current.classList.remove('active');

  setTimeout(() => {
    cinema.style.display = 'none';
    document.getElementById('tapHint').classList.add('hidden');
    document.getElementById('skipBtn').classList.add('hidden');
    startRulesPhase();
  }, 400);
}

// ============================================
// RULES PHASE
// ============================================
function startRulesPhase() {
  const phase = document.getElementById('rulesPhase');
  const intro = document.getElementById('rulesIntro');

  phase.classList.add('active');
  intro.style.display = '';
  setProgress(50);

  // Build progress dots
  const dotsContainer = document.getElementById('ruleProgress');
  dotsContainer.innerHTML = '';
  RULES.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'rule-dot';
    dot.id = 'dot-' + i;
    dotsContainer.appendChild(dot);
  });
}

function showRule(index) {
  const display = document.getElementById('ruleDisplay');
  const card = document.getElementById('ruleCard');
  const counter = document.getElementById('ruleCounter');
  const badge = document.getElementById('ruleNumberBadge');
  const title = document.getElementById('ruleTitle');
  const body = document.getElementById('ruleBody');
  const btn = document.getElementById('acceptRuleBtn');

  display.style.display = '';

  // Animate out current card
  card.classList.remove('visible');

  setTimeout(() => {
    counter.innerHTML = 'Rule <span class="current">' + (index + 1) + '</span> of ' + RULES.length;
    badge.textContent = index + 1;
    title.textContent = RULES[index].title;
    body.textContent = RULES[index].body;

    // Reset accept button
    btn.classList.remove('accepted');
    btn.innerHTML = 'I Accept <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

    // Update dots
    const activeDot = document.getElementById('dot-' + index);
    if (activeDot) activeDot.classList.add('active');

    // Animate in
    requestAnimationFrame(() => {
      card.classList.add('visible');
    });

    // Update progress: 50% to 95%
    const rulePct = 50 + ((index + 1) / RULES.length) * 45;
    setProgress(rulePct);

    currentRule = index;
  }, 300);
}

function acceptCurrentRule() {
  const btn = document.getElementById('acceptRuleBtn');

  // Animate acceptance
  btn.classList.add('accepted');
  btn.innerHTML = 'Accepted ✓';

  // Mark dot as done
  const dot = document.getElementById('dot-' + currentRule);
  if (dot) {
    dot.classList.remove('active');
    dot.classList.add('done');
  }

  setTimeout(() => {
    if (currentRule < RULES.length - 1) {
      // Next rule
      showRule(currentRule + 1);
    } else {
      // All rules accepted → join phase
      showJoinPhase();
    }
  }, 700);
}

// ============================================
// JOIN PHASE
// ============================================
function showJoinPhase() {
  // Hide rules
  const rulesPhase = document.getElementById('rulesPhase');
  rulesPhase.classList.remove('active');

  setTimeout(() => {
    rulesPhase.style.display = 'none';
    const joinPhase = document.getElementById('joinPhase');
    joinPhase.classList.add('active');
    setProgress(100);
  }, 600);
}

// ============================================
// EVENT LISTENERS
// ============================================
window.addEventListener('load', () => {
  // Start the cinematic intro
  setTimeout(() => {
    showScene(0);
  }, 600);
});

// Tap/click/key to advance scenes
document.addEventListener('click', (e) => {
  if (!cinemaPhase) return;
  // Don't advance if clicking skip button
  if (e.target.closest('#skipBtn')) return;
  advanceScene();
});

document.addEventListener('keydown', (e) => {
  if (!cinemaPhase) return;
  if (e.key === 'Escape') {
    skipIntro();
    return;
  }
  advanceScene();
});

// Skip button
document.getElementById('skipBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  skipIntro();
});

// Start rules button
document.getElementById('startRulesBtn').addEventListener('click', () => {
  document.getElementById('rulesIntro').style.display = 'none';
  showRule(0);
});

// Accept rule button
document.getElementById('acceptRuleBtn').addEventListener('click', () => {
  acceptCurrentRule();
});
