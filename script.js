/**
 * IKS — Jack of All Traits
 * Exact PDF Replica Logic & Rules Acceptance
 */

document.addEventListener('DOMContentLoaded', () => {

  const rulesCheckbox = document.getElementById('rulesCheckbox');
  const joinBtn = document.getElementById('joinBtn');
  const lockHint = document.getElementById('lockHint');
  const joinSection = document.querySelector('.join-section');
  const dots = document.querySelectorAll('.slide-nav .dot');
  const pages = document.querySelectorAll('.pdf-page');

  const TARGET_URL = 'https://forms.gle/Txvu1e2kKCSVmxMq5';

  // 1. Checkbox Accept / Toggle Logic
  if (rulesCheckbox && joinBtn) {
    rulesCheckbox.addEventListener('change', () => {
      const isAccepted = rulesCheckbox.checked;

      if (isAccepted) {
        // Unlock button
        joinBtn.classList.remove('disabled');
        joinSection.classList.add('accepted');

        if (lockHint) {
          lockHint.classList.add('unlocked');
          lockHint.innerHTML = '<i class="fa-solid fa-lock-open"></i> Rules accepted! Click below to join IKS';
        }

        // Trigger confetti celebration
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.85 },
            colors: ['#e0aa48', '#f7d58b', '#cb252d', '#ffffff']
          });
        }
      } else {
        // Lock button
        joinBtn.classList.add('disabled');
        joinSection.classList.remove('accepted');

        if (lockHint) {
          lockHint.classList.remove('unlocked');
          lockHint.innerHTML = '<i class="fa-solid fa-lock"></i> Please accept the rules above to unlock the join button';
        }
      }
    });

    // 2. Intercept click when disabled
    joinBtn.addEventListener('click', (e) => {
      if (!rulesCheckbox.checked || joinBtn.classList.contains('disabled')) {
        e.preventDefault();

        // Shake the checkbox box
        if (joinSection) {
          joinSection.classList.remove('shake');
          void joinSection.offsetWidth;
          joinSection.classList.add('shake');
        }

        // Scroll to checkbox smoothly
        joinSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // 3. Slide Nav Active State on Scroll
  const observerOptions = {
    threshold: 0.4
  };

  const pageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        dots.forEach(dot => {
          if (dot.getAttribute('href') === `#${id}`) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  pages.forEach(page => pageObserver.observe(page));

});
