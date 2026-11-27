// Clock: elapsed time since page load (works with id="clock" or id="timer")
(function () {
  const clockEl = document.getElementById('clock') || document.getElementById('timer');
  if (!clockEl) return;
  const start = Date.now();
  function tick() {
    const elapsed = Math.floor((Date.now() - start) / 1000);
    const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
    const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
    const s = String(elapsed % 60).padStart(2, '0');
    clockEl.textContent = `${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);
})();

// Fade-in reveal for images (needs .in-view CSS, as on the readings page)
(function () {
  const revealImages = document.querySelectorAll('.feature-panel img, .media img');
  if (!revealImages.length) return;

  if (!('IntersectionObserver' in window)) {
    revealImages.forEach(img => img.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealImages.forEach(img => observer.observe(img));
})();

// Lightbox zoom
(function () {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  const lightboxImg = lightbox.querySelector('img');

  document.querySelectorAll('.zoom').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('show');
    });
  });

  lightbox.addEventListener('click', () => lightbox.classList.remove('show'));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') lightbox.classList.remove('show');
  });
})();

// Carousel (only runs on pages that have one)
// Carousel (supports multiple per page)
document.querySelectorAll('.carousel-wrap').forEach(wrap => {
  const container = wrap.querySelector('.carousel-container');
  const slides = container.querySelectorAll('.carousel-slide');
  const prevBtn = wrap.querySelector('.carousel-btn.prev');
  const nextBtn = wrap.querySelector('.carousel-btn.next');
  const caption = wrap.parentElement.querySelector('.carousel-caption');
  let index = 0;

  function updateCaption() {
    if (!caption) return;
    const slide = slides[index];
    caption.textContent =
      slide.dataset.caption ||
      slide.querySelector('.carousel-caption')?.textContent.trim() ||
      '';
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    container.scrollTo({ left: index * container.clientWidth, behavior: 'smooth' });
    updateCaption();
  }

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));

  container.addEventListener('scroll', () => {
    const newIndex = Math.round(container.scrollLeft / container.clientWidth);
    if (newIndex !== index && slides[newIndex]) {
      index = newIndex;
      updateCaption();
    }
  });

  updateCaption();
});

// ease-in scroll to the top

// Smooth scroll to top with custom easing
(function () {
  const link = document.querySelector('.nav-top');
  if (!link) return;

  const duration = 900; // ms
  // ease-in-out cubic: slow start, fast middle, slow finish
  const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  link.addEventListener('click', e => {
    e.preventDefault();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, 0);
      return;
    }

    const startY = window.scrollY;
    const startTime = performance.now();

    function step(now) {
      const t = Math.min((now - startTime) / duration, 1);
      window.scrollTo({ top: startY * (1 - ease(t)), behavior: 'instant' });
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
})();

// Ghost overlay

// Ghost overlay of previous page (skip if we're already inside an iframe,
// otherwise each ghost would load its own ghost, and so on)
// if (window === window.top) {
//   const prev = document.querySelector('.nav-back')?.getAttribute('href');
//   if (prev) {
//     const ghost = document.createElement('iframe');
//     ghost.src = prev;
//     ghost.className = 'ghost-page';
//     ghost.setAttribute('aria-hidden', 'true');
//     ghost.tabIndex = -1;
//     document.body.appendChild(ghost);

//     // press G to toggle
//     addEventListener('keydown', e => {
//       if (e.key.toLowerCase() === 'g') ghost.classList.toggle('hidden');
//     });

//     // optional: keep the ghost scrolled in proportion to the page
//     addEventListener('scroll', () => {
//       try {
//         const w = ghost.contentWindow;
//         const d = w.document.documentElement;
//         const mine = document.documentElement.scrollHeight - innerHeight;
//         const p = mine > 0 ? scrollY / mine : 0;
//         w.scrollTo(0, p * (d.scrollHeight - w.innerHeight));
//       } catch (e) {} // blocked on file:// , works when hosted
//     });
//   }
// }