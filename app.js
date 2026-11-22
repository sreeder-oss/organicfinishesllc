// Organic Finishes LLC — Archival Monograph & Architectural Lightbox Logic

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle
  const menuBtn = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('primary-nav-menu');
  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      menuBtn.textContent = isOpen ? 'Close [×]' : 'Index [+]';
    });
  }

  // 2. FAQ Accordion Toggle
  const faqButtons = document.querySelectorAll('.faq-question');
  faqButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      if (item) {
        item.classList.toggle('open');
      }
    });
  });

  // 3. Portfolio Category Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card[data-category]');
  if (filterBtns.length > 0 && galleryCards.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.getAttribute('data-filter');
        galleryCards.forEach((card) => {
          const cats = (card.getAttribute('data-category') || '').split(' ');
          if (target === 'all' || cats.includes(target)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 4. Daniel Blue Style Full-Screen Architectural Image Lightbox
  const zoomableImages = document.querySelectorAll('.hero-img-main, .pillar-img-wrap img, .gallery-img-box img');
  if (zoomableImages.length > 0) {
    const backdrop = document.createElement('div');
    backdrop.className = 'lightbox-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.innerHTML = `
      <button type="button" class="lightbox-close" aria-label="Close Fullscreen View">Close [ESC]</button>
      <img class="lightbox-img" src="" alt="" />
      <div class="lightbox-caption"></div>
    `;
    document.body.appendChild(backdrop);

    const lbImg = backdrop.querySelector('.lightbox-img');
    const lbCaption = backdrop.querySelector('.lightbox-caption');
    const lbClose = backdrop.querySelector('.lightbox-close');

    const closeLightbox = () => {
      backdrop.classList.remove('open');
    };

    zoomableImages.forEach((img) => {
      img.addEventListener('click', (e) => {
        // Don't hijack clicks if inside an explicit anchor
        if (img.closest('a')) return;
        e.stopPropagation();
        lbImg.src = img.src;
        lbImg.alt = img.alt || '';
        const card = img.closest('.gallery-card, .pillar-card, .hero-media');
        let titleText = img.alt || 'Architectural Surface Plate';
        if (card) {
          const heading = card.querySelector('h3, strong');
          const cat = card.querySelector('.gallery-category, .pillar-tag');
          if (heading) {
            titleText = (cat ? `${cat.textContent} // ` : '') + heading.textContent;
          }
        }
        lbCaption.textContent = titleText;
        backdrop.classList.add('open');
      });
    });

    lbClose.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // 5. Quote Request Form Handler
  const quoteForm = document.getElementById('organic-quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('q-name') || {}).value || '';
      const phone = (document.getElementById('q-phone') || {}).value || '';
      const email = (document.getElementById('q-email') || {}).value || '';
      const city = (document.getElementById('q-city') || {}).value || '';
      const service = (document.getElementById('q-service') || {}).value || '';
      const message = (document.getElementById('q-message') || {}).value || '';

      const subject = encodeURIComponent(`Project Inquiry: ${service} — ${name} (${city || 'Oklahoma'})`);
      const body = encodeURIComponent(
        `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nLocation: ${city}\nService System: ${service}\n\nProject Details:\n${message}`
      );

      const statusEl = document.getElementById('quote-form-status');
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.textContent = 'Opening your email client addressed to contact@organicfinishesllc.org — or call/text 405-816-0750 directly!';
      }

      window.location.href = `mailto:contact@organicfinishesllc.org?subject=${subject}&body=${body}`;
    });
  }
});
