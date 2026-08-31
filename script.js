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

    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      body { font-family: var(--body-font, 'Manrope'), sans-serif; font-size: var(--base-font-size, 16px); }
      h1, h2, h3, h4 { font-family: var(--heading-font, 'Playfair Display'), serif; font-size: var(--heading-size, 34px); }
    `;
    document.head.appendChild(styleTag);
  }

  // 2. ЗАВАНТАЖЕННЯ ШАПКИ, ЛОГОТИПУ, КОНТАКТІВ
  const header = await fetchData('content/header.json');
  if (header) {
    if (header.logo_image) {
      document.querySelector('.logo').innerHTML = `<img src="${header.logo_image}" alt="Logo" style="max-height: 50px;">`;
    } else {
      document.querySelector('.logo').innerHTML = header.site_title;
    }
    document.querySelector('.header-address').innerHTML = header.header_address;
    const phoneLink = document.querySelector('.header-right .btn');
    if (phoneLink && header.phone) phoneLink.textContent = header.phone;
  }

  // 3. ЗАВАНТАЖЕННЯ СЕКЦІЙ
  const sections = await fetchData('content/sections.json');
  if (sections) {
    const setText = (selector, text) => {
      const el = document.querySelector(selector);
      if (el) el.innerHTML = text;
    };

    setText('.hero-text h1', sections.hero_title || '');
    setText('.hero-text .lede', `<span>${sections.hero_text || ''}</span>`);
    setText('.hero-actions .btn-primary', sections.hero_btn1 || '');
    setText('.hero-actions .btn-outline', sections.hero_btn2 || '');
    setText('.section-gray .section-title', sections.popular_title || '');
    setText('#catalog .section-title', sections.catalog_title || '');
    setText('.section-gray:nth-of-type(2) .section-title', sections.work_title || '');
    setText('.reviews-head h2', sections.reviews_title || '');
    setText('.cta-band h2', sections.cta_text || '');
    setText('.contact-form h2', sections.form_title || '');
    setText('.contact-form .field:nth-of-type(1) label', sections.form_name || '');
    setText('.contact-form .field:nth-of-type(2) label', sections.form_phone || '');
    setText('.contact-form .btn', sections.form_btn || '');
    setText('.section:last-of-type .section-title', sections.faq_title || '');
    setText('.site-footer h2', sections.footer_title || '');
    setText('.site-footer p', sections.footer_address || '');
    setText('.site-footer p:nth-of-type(2)', sections.footer_schedule || '');
    setText('.footer-phone', sections.footer_phone || '');
    setText('.footer-bottom', sections.footer_copyright || '');

    // ЗМІНЮЄМО СТРІЧКУ ЩО БІЖИТЬ
    const marqueeSpans = document.querySelectorAll('.marquee-track span');
    if (marqueeSpans.length > 0 && sections.marquee_text) {
      marqueeSpans.forEach(span => {
        span.innerHTML = sections.marquee_text + ' &nbsp;•&nbsp; ' + sections.marquee_text + ' &nbsp;•&nbsp; ' + sections.marquee_text + ' &nbsp;•&nbsp; ';
      });
    }
  }

  // 4. ЗАВАНТАЖЕННЯ КАТЕГОРІЙ
  const cats = await fetchData('content/categories.json');
  if (cats) {
    const catCards = document.querySelectorAll('.cat-card');
    if (catCards.length === 8) {
      const titles = [cats.cat1_title, cats.cat2_title, cats.cat3_title, cats.cat4_title, cats.cat5_title, cats.cat6_title, cats.cat7_title, cats.cat8_title];
      const descs = [cats.cat1_desc, cats.cat2_desc, cats.cat3_desc, cats.cat4_desc, cats.cat5_desc, cats.cat6_desc, cats.cat7_desc, cats.cat8_desc];

      catCards.forEach((card, i) => {
        card.querySelector('h3').innerHTML = titles[i] || '';
        card.querySelector('p').innerHTML = descs[i] || '';
        card.querySelector('.btn').innerHTML = cats.cat1_btn || 'Больше вариантов';
      });
    }
  }

  // 5. ЗАВАНТАЖЕННЯ КРОКІВ
  const stepsData = await fetchData('content/steps.json');
  if (stepsData) {
    const stepEls = document.querySelectorAll('.step');
    if (stepEls.length === 4) {
      const titles = [stepsData.step1_title, stepsData.step2_title, stepsData.step3_title, stepsData.step4_title];
      const descs = [stepsData.step1_desc, stepsData.step2_desc, stepsData.step3_desc, stepsData.step4_desc];

      stepEls.forEach((step, i) => {
        step.querySelector('h4').innerHTML = titles[i] || '';
        step.querySelector('p').innerHTML = descs[i] || '';
      });
    }
  }

  // 6. ЗАВАНТАЖЕННЯ ТОВАРІВ (через GitHub API)
  const productContainer = document.querySelector('.product-grid');
  if (productContainer) {
    try {
      const repoResponse = await fetch('https://api.github.com/repos/Stanislovee/ballon/contents/content/products');
      if (repoResponse.ok) {
        const files = await repoResponse.json();
        const mdFiles = files.filter(f => f.name.endsWith('.md'));
        const products = [];
        for (const file of mdFiles) {
          const mdText = await fetch(file.download_url).then(r => r.text());
          const lines = mdText.split('\n');
          let title = '', price = 0, old_price = null, image = '', desc = '', link = '#';
          let inFrontMatter = false;
          let frontMatter = [];
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() === '---') {
              inFrontMatter = !inFrontMatter;
              if (!inFrontMatter) break;
              continue;
            }
            if (inFrontMatter) frontMatter.push(lines[i]);
          }
          frontMatter.forEach(line => {
            const [key, ...value] = line.split(':');
            const val = value.join(':').trim().replace(/^"|"$/g, '');
            switch(key.trim()) {
              case 'title': title = val; break;
              case 'price': price = parseFloat(val); break;
              case 'old_price': old_price = val ? parseFloat(val) : null; break;
              case 'image': image = val; break;
              case 'desc': desc = val; break;
              case 'link': link = val; break;
            }
          });
          products.push({ title, price, old_price, image, desc, link });
        }
        if (products.length > 0) {
          productContainer.innerHTML = products.map(p => `
            <div class="product-card reveal in">
              <div class="thumb"><img src="${p.image}" alt="${p.title}"></div>
              <div class="body">
                <h3>${p.title}</h3>
                <div class="price">${p.price} р. ${p.old_price ? `<span class="old">${p.old_price} р.</span>` : ''}</div>
                <div class="card-actions">
                  <a href="${p.link}" class="btn btn-outline btn-sm">Подробнее о наборе</a>
                  <button class="btn btn-primary btn-sm">Заказать</button>
                </div>
              </div>
            </div>
          `).join('');
        }
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  // 7. ЗАВАНТАЖЕННЯ ВІДГУКІВ (через GitHub API)
  const reviewContainer = document.querySelector('.review-track');
  if (reviewContainer) {
    try {
      const repoResponse = await fetch('https://api.github.com/repos/Stanislovee/ballon/contents/content/reviews');
      if (repoResponse.ok) {
        const files = await repoResponse.json();
        const mdFiles = files.filter(f => f.name.endsWith('.md'));
        const reviews = [];
        for (const file of mdFiles) {
          const mdText = await fetch(file.download_url).then(r => r.text());
          const lines = mdText.split('\n');
          let date = '', text = '';
          let inFrontMatter = false;
          let frontMatter = [];
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() === '---') {
              inFrontMatter = !inFrontMatter;
              if (!inFrontMatter) break;
              continue;
            }
            if (inFrontMatter) frontMatter.push(lines[i]);
          }
          frontMatter.forEach(line => {
            const [key, ...value] = line.split(':');
            const val = value.join(':').trim().replace(/^"|"$/g, '');
            switch(key.trim()) {
              case 'date': date = val; break;
              case 'text': text = val; break;
            }
          });
          reviews.push({ date, text });
        }
        if (reviews.length > 0) {
          reviewContainer.innerHTML = reviews.map(r => `
            <div class="review-card">
              <span class="stars">★★★★★</span><span class="review-date">${r.date}</span>
              <p>${r.text}</p>
            </div>
          `).join('');
        }
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  }

  // 8. ЗАВАНТАЖЕННЯ FAQ (через GitHub API)
  const faqContainer = document.querySelector('.section .reveal');
  if (faqContainer) {
    try {
      const repoResponse = await fetch('https://api.github.com/repos/Stanislovee/ballon/contents/content/faq');
      if (repoResponse.ok) {
        const files = await repoResponse.json();
        const mdFiles = files.filter(f => f.name.endsWith('.md'));
        const faqs = [];
        for (const file of mdFiles) {
          const mdText = await fetch(file.download_url).then(r => r.text());
          const lines = mdText.split('\n');
          let question = '', answer = '';
          let inFrontMatter = false;
          let frontMatter = [];
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() === '---') {
              inFrontMatter = !inFrontMatter;
              if (!inFrontMatter) break;
              continue;
            }
            if (inFrontMatter) frontMatter.push(lines[i]);
          }
          frontMatter.forEach(line => {
            const [key, ...value] = line.split(':');
            const val = value.join(':').trim().replace(/^"|"$/g, '');
            switch(key.trim()) {
              case 'question': question = val; break;
              case 'answer': answer = val; break;
            }
          });
          faqs.push({ question, answer });
        }
        if (faqs.length > 0) {
          faqContainer.innerHTML = faqs.map(faq => `
            <div class="faq-item">
              <div class="faq-q"><h4>${faq.question}</h4><span class="faq-toggle"></span></div>
              <div class="faq-a"><p>${faq.answer}</p></div>
            </div>
          `).join('');
          document.querySelectorAll('.faq-item').forEach(item => {
            item.querySelector('.faq-q').addEventListener('click', () => {
              const wasOpen = item.classList.contains('open');
              document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
              if (!wasOpen) item.classList.add('open');
            });
          });
        }
      }
    } catch (error) {
      console.error('Error loading faq:', error);
    }
  }

});