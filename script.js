document.addEventListener('DOMContentLoaded', async () => {

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

  /* ============================================== */
  /* ======   ЗАВАНТАЖЕННЯ ДАНИХ З CMS   ========== */
  /* ============================================== */
  
  async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Not found');
      return await response.json();
    } catch (error) {
      console.warn(`Не вдалося завантажити: ${url}`);
      return null;
    }
  }

  // 1. ЗАВАНТАЖЕННЯ ТЕМИ (Кольори, Шрифти, Розміри)
  const theme = await fetchData('content/theme.json');
  if (theme) {
    const root = document.documentElement;
    if (theme.bg_color) root.style.setProperty('--white', theme.bg_color);
    if (theme.text_color) root.style.setProperty('--ink', theme.text_color);
    if (theme.heading_color) root.style.setProperty('--brown', theme.heading_color);
    if (theme.button_color) root.style.setProperty('--brown-dark', theme.button_color);
    if (theme.header_bg) root.style.setProperty('--cream-header', theme.header_bg);

    if (theme.heading_font) root.style.setProperty('--heading-font', theme.heading_font);
    if (theme.body_font) root.style.setProperty('--body-font', theme.body_font);

    if (theme.base_font_size) root.style.setProperty('--base-font-size', theme.base_font_size + 'px');
    if (theme.heading_size) root.style.setProperty('--heading-size', theme.heading_size + 'px');

    // Додаємо стилі для шрифтів, які не були в CSS
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      body { font-family: var(--body-font, 'Manrope'), sans-serif; font-size: var(--base-font-size, 16px); }
      h1, h2, h3, h4 { font-family: var(--heading-font, 'Playfair Display'), serif; font-size: var(--heading-size, 34px); }
    `;
    document.head.appendChild(styleTag);
  }

  // 2. ЗАВАНТАЖЕННЯ ТЕКСТІВ ТА ЛОГОТИПУ
  const settings = await fetchData('content/settings.json');
  if (settings) {
    const setText = (selector, text) => {
      const el = document.querySelector(selector);
      if (el) el.innerHTML = text;
    };

    // Логотип
    if (settings.logo_image) {
      document.querySelector('.logo').innerHTML = `<img src="${settings.logo_image}" alt="Logo" style="max-height: 50px;">`;
    } else {
      setText('.logo', settings.site_title);
    }
    
    setText('.header-address', settings.address);
    setText('.hero-text h1', settings.hero_title);
    setText('.hero-text .lede', `<span>${settings.hero_text}</span>`);
    setText('.section-gray .section-title', settings.popular_title);
    setText('#catalog .section-title', settings.catalog_title);
    setText('.site-footer h2', settings.footer_title);
    setText('.site-footer p', settings.footer_address);
    setText('.site-footer p:nth-of-type(2)', settings.footer_schedule);
    setText('.footer-bottom', settings.footer_copyright);
  }
});