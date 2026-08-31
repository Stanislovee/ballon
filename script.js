document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav ---------- */
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.main-nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('mobile-open');
      nav.style.display = nav.classList.contains('mobile-open') ? 'flex' : '';
      if (nav.classList.contains('mobile-open')) {
        nav.style.position = 'absolute';
        nav.style.top = '100%';
        nav.style.left = '0';
        nav.style.right = '0';
        nav.style.background = '#E9DEC7';
        nav.style.flexDirection = 'column';
        nav.style.padding = '20px 32px';
        nav.style.gap = '16px';
      }
    });
  }

  /* ---------- Back to top ---------- */
  const backTop = document.querySelector('.back-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('show', window.scrollY > 400);
    });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- Reviews slider ---------- */
  const track = document.querySelector('.review-track');
  if (track) {
    const cards = track.children.length;
    let perView = window.innerWidth <= 720 ? 1 : (window.innerWidth <= 980 ? 2 : 3);
    let index = 0;
    const update = () => {
      perView = window.innerWidth <= 720 ? 1 : (window.innerWidth <= 980 ? 2 : 3);
      const max = Math.max(0, cards - perView);
      if (index > max) index = max;
      const pct = (100 / perView) * index;
      track.style.transform = `translateX(-${pct}%)`;
    };
    document.querySelector('.review-next')?.addEventListener('click', () => {
      const max = Math.max(0, cards - perView);
      index = index >= max ? 0 : index + 1;
      update();
    });
    document.querySelector('.review-prev')?.addEventListener('click', () => {
      const max = Math.max(0, cards - perView);
      index = index <= 0 ? max : index - 1;
      update();
    });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ---------- Quiz modal ---------- */
  const overlay = document.getElementById('quizOverlay');
  const openBtns = document.querySelectorAll('[data-open-quiz]');
  const closeBtn = document.querySelector('.quiz-modal .close-x');
  const steps = overlay ? Array.from(overlay.querySelectorAll('.quiz-step')) : [];
  let stepIndex = 0;

  const renderStep = () => {
    steps.forEach((s, i) => s.style.display = i === stepIndex ? 'grid' : 'none');
    const bar = overlay.querySelector('.quiz-progress-bar');
    bar.style.width = `${((stepIndex + 1) / steps.length) * 100}%`;
    overlay.querySelector('.quiz-step-num').textContent = `Шаг: ${stepIndex + 1}/${steps.length}`;
    overlay.querySelector('.quiz-prev').disabled = stepIndex === 0;
    const nextBtn = overlay.querySelector('.quiz-next');
    nextBtn.innerHTML = stepIndex === steps.length - 1 ? 'Отправить &rarr;' : 'Далее &rarr;';
  };

  const openQuiz = () => {
    if (!overlay) return;
    overlay.classList.add('open');
    stepIndex = 0;
    renderStep();
  };
  const closeQuiz = () => overlay && overlay.classList.remove('open');

  openBtns.forEach(b => b.addEventListener('click', openQuiz));
  closeBtn?.addEventListener('click', closeQuiz);
  overlay?.addEventListener('click', (e) => { if (e.target === overlay) closeQuiz(); });

  overlay?.querySelectorAll('.quiz-option').forEach(opt => {
    opt.addEventListener('click', () => {
      opt.parentElement.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });

  overlay?.querySelector('.quiz-next')?.addEventListener('click', () => {
    if (stepIndex < steps.length - 1) {
      stepIndex++;
      renderStep();
    } else {
      overlay.querySelector('.quiz-body-wrap').innerHTML =
        '<div style="padding:60px 10px;text-align:center;"><h3>Спасибо! ✨</h3><p style="color:#7A6A5D;">Катя свяжется с Вами в течение 15 минут и поможет с выбором оформления.</p></div>';
      overlay.querySelector('.quiz-footer').style.display = 'none';
    }
  });

  overlay?.querySelector('.quiz-prev')?.addEventListener('click', () => {
    if (stepIndex > 0) { stepIndex--; renderStep(); }
  });

  /* ---------- Contact form submit ---------- */
  document.querySelectorAll('.contact-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.innerHTML = '<h2>Спасибо!</h2><p style="color:#EDE4D6;">Мы свяжемся с Вами в течение 15 минут.</p>';
    });
  });

});