// Organic Finishes LLC — Shared Interactive Logic (Nav, FAQ, Portfolio Filters, Quote Form)

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle
  const menuBtn = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('primary-nav-menu');
  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      menuBtn.textContent = isOpen ? 'Close ✕' : 'Menu ☰';
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

  // 4. Quote Request Form Handler (Constructs ready-to-send inquiry to contact@organicfinishesllc.org)
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
