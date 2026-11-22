// Organic Finishes LLC — Archival Monograph, Lightbox Focus Management & Quote Form Delivery

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

  // 4. Daniel Blue Style Full-Screen Architectural Image Lightbox (with accessible focus management)
  const zoomableImages = document.querySelectorAll('.hero-img-main, .pillar-img-wrap img, .gallery-img-box img');
  if (zoomableImages.length > 0) {
    const backdrop = document.createElement('div');
    backdrop.className = 'lightbox-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-label', 'Full-screen architectural surface inspection');
    backdrop.innerHTML = `
      <button type="button" class="lightbox-close" aria-label="Close Fullscreen View">Close [ESC]</button>
      <img class="lightbox-img" src="" alt="" />
      <div class="lightbox-caption"></div>
    `;
    document.body.appendChild(backdrop);

    const lbImg = backdrop.querySelector('.lightbox-img');
    const lbCaption = backdrop.querySelector('.lightbox-caption');
    const lbClose = backdrop.querySelector('.lightbox-close');
    let lastFocusedTrigger = null;

    const closeLightbox = () => {
      backdrop.classList.remove('open');
      if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
        lastFocusedTrigger.focus();
        lastFocusedTrigger = null;
      }
    };

    const openLightbox = (img) => {
      lastFocusedTrigger = img;
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
      lbClose.focus();
    };

    zoomableImages.forEach((img) => {
      if (!img.closest('a')) {
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
      }
      img.addEventListener('click', (e) => {
        if (img.closest('a')) return;
        e.stopPropagation();
        openLightbox(img);
      });
      img.addEventListener('keydown', (e) => {
        if (img.closest('a')) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(img);
        }
      });
    });

    lbClose.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('open')) {
        closeLightbox();
      }
    });
  }

  // 5. Quote Request Form Handler (FormSubmit AJAX Endpoint + Copyable Summary & Direct Phone/SMS/Email Fallback)
  const quoteForm = document.getElementById('organic-quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = (document.getElementById('q-name') || {}).value || '';
      const phone = (document.getElementById('q-phone') || {}).value || '';
      const email = (document.getElementById('q-email') || {}).value || '';
      const city = (document.getElementById('q-city') || {}).value || '';
      const service = (document.getElementById('q-service') || {}).value || '';
      const message = (document.getElementById('q-message') || {}).value || '';

      const summaryText =
        `ORGANIC FINISHES LLC — PROJECT INQUIRY\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Email: ${email}\n` +
        `Location: ${city || 'Oklahoma'}\n` +
        `System: ${service}\n` +
        `Scope & Details: ${message}`;

      const subject = encodeURIComponent(`Project Inquiry: ${service} — ${name} (${city || 'Oklahoma'})`);
      const bodyEncoded = encodeURIComponent(summaryText);
      const mailtoHref = `mailto:contact@organicfinishesllc.org?subject=${subject}&body=${bodyEncoded}`;
      const smsHref = `sms:4058160750?body=${bodyEncoded}`;

      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit Project Inquiry';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Transmitting Dossier...';
      }

      let deliveredViaEndpoint = false;
      try {
        const resp = await fetch('https://formsubmit.co/ajax/contact@organicfinishesllc.org', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name,
            phone,
            email,
            location: city || 'Oklahoma',
            system: service,
            message,
            _subject: `Organic Finishes Inquiry: ${service} — ${name}`
          })
        });
        if (resp.ok) {
          deliveredViaEndpoint = true;
        }
      } catch (_) {
        deliveredViaEndpoint = false;
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }

      let resultPanel = document.getElementById('inquiry-result-panel');
      if (!resultPanel) {
        resultPanel = document.createElement('div');
        resultPanel.id = 'inquiry-result-panel';
        resultPanel.className = 'inquiry-result-panel';
        quoteForm.appendChild(resultPanel);
      }

      const statusHeading = deliveredViaEndpoint
        ? '✓ INQUIRY TRANSMITTED TO CONTACT@ORGANICFINISHESLLC.ORG'
        : '✓ INQUIRY DOSSIER PREPARED — COPY OR SEND DIRECTLY BELOW';

      resultPanel.innerHTML = `
        <div class="mono-tag" style="color: hsl(145, 55%, 72%); font-weight: 600;">${statusHeading}</div>
        <p style="font-size: 0.84rem; color: var(--text-on-dark-muted); margin-top: 0.35rem;">
          Your project summary is ready below. You can copy it with one click, email it directly to <strong>contact@organicfinishesllc.org</strong>, or call/text Shawn Reeder at <strong>405-816-0750</strong>.
        </p>
        <pre id="copyable-inquiry-summary" class="inquiry-summary-box"></pre>
        <div class="inquiry-fallback-actions">
          <button type="button" id="copy-inquiry-btn" class="btn btn-primary btn-sm" style="background-color: var(--accent-terracotta); border-color: var(--accent-terracotta);">Copy Inquiry Summary</button>
          <a href="${mailtoHref}" class="btn btn-outline btn-sm" style="color: var(--text-on-dark); border-color: rgba(247,243,237,0.4);">Open in Email App</a>
          <a href="${smsHref}" class="btn btn-outline btn-sm" style="color: var(--text-on-dark); border-color: rgba(247,243,237,0.4);">Text to 405-816-0750</a>
          <a href="tel:4058160750" class="btn btn-outline btn-sm" style="color: var(--text-on-dark); border-color: rgba(247,243,237,0.4);">Call 405-816-0750</a>
        </div>
      `;

      const preEl = resultPanel.querySelector('#copyable-inquiry-summary');
      if (preEl) preEl.textContent = summaryText;
      resultPanel.classList.add('visible');

      const copyBtn = resultPanel.querySelector('#copy-inquiry-btn');
      if (copyBtn && navigator.clipboard) {
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(summaryText).then(() => {
            copyBtn.textContent = '✓ Copied to Clipboard';
          });
        });
      }
    });
  }
});
