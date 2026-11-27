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
  const zoomableImages = document.querySelectorAll('.hero-img-main, .pillar-img-wrap img, .gallery-img-box img, .spec-deck-img-wrap img, .cinema-card-img, .service-photo-img');
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
      const card = img.closest('.gallery-card, .pillar-card, .hero-media, .spec-deck-card, .cinema-trio-card, .service-photo-card');
      let titleText = img.alt || 'Architectural Surface Plate';
      if (card) {
        const heading = card.querySelector('h3, strong, .spec-deck-title, .cinema-card-title, .service-photo-title');
        const cat = card.querySelector('.gallery-category, .pillar-tag, .spec-deck-code, .cinema-card-code, .service-photo-code');
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

  // 6. Clara — Studio Concierge Floating Chat Widget (Static Ontology-Backed Assistant)
  const claraKnowledge = [
    {
      keywords: ['sample', 'samples', 'board', 'boards', 'color', 'colors', 'swatch', 'deposit', 'mockup'],
      reply:
        'Before a deposit is secured, we discuss <strong>general aggregate, texture, and movement</strong> only. Custom project sample boards matched to your specific color are fabricated and presented <strong>only after a deposit is secured</strong>.'
    },
    {
      keywords: ['tile', 'over tile', 'existing tile', 'demolition', 'demo', 'rip out'],
      reply:
        'Yes—at just 2–3 mm thick, our microcement system bonds directly over structurally sound ceramic or porcelain tile using diamond prep, an adhesion primer, fiberglass reinforcement mesh, waterproofing, and multi-coat mineral layers.'
    },
    {
      keywords: ['tadelakt', 'shower', 'wet', 'bathroom', 'curbless', 'floor', 'waterproof'],
      reply:
        'Both are seamless and waterproof, but differ in application: <strong>Moroccan Tadelakt</strong> is a stone-burnished hydraulic lime plaster ideal for shower walls and wet rooms. <strong>Microcement</strong> is mesh-reinforced and sealed with 2K polyurethane, making it tough enough for curbless shower floors, vanities, and countertops.'
    },
    {
      keywords: ['travel', 'area', 'where', 'location', 'tulsa', 'sand springs', 'okc', 'edmond', 'state', 'country', 'nationwide'],
      reply:
        'We are based in <strong>Sand Springs and the Tulsa metro</strong> (with roots in Edmond/OKC) and travel <strong>nationwide across the United States</strong> for the right architectural commission (domestic travel only).'
    },
    {
      keywords: ['size', 'sqft', 'square', 'feet', '1200', 'large', 'small', 'minimum', 'solo', 'crew'],
      reply:
        'Shawn works primarily solo and focuses on specialized, smaller-scale craft rather than high-volume square footage. As a capacity rule, we <strong>do not accept projects over 1,200 sq ft without additional crew</strong>.'
    },
    {
      keywords: ['prep', 'drywall', 'level 4', 'level 5', 'tape', 'taping', 'joint', 'joints', 'substrate'],
      reply:
        '<strong>Level 4 drywall</strong> is the ideal baseline for most walls. However, Shawn prefers <strong>taping his own joints</strong> in showers, range hoods, and most feature walls to guarantee seam integrity.'
    },
    {
      keywords: ['wood', 'cabinet', 'cabinets', 'trim', 'lacquer', 'oil', 'spray', 'paint', 'painting', 'decorative'],
      reply:
        'We offer selective wood and decorative painting alongside our plaster and microcement work. As a strict shop rule, <strong>we do not spray lacquer or oil-based coatings</strong>. We also apply microcement over prepped wood/MDF for vanities, hoods, and built-ins.'
    },
    {
      keywords: ['brand', 'manufacturer', 'material', 'product', 'romabio', 'meoded', 'vasari', 'topciment', 'sponsor'],
      reply:
        'We are completely <strong>material-neutral</strong>—we select whichever lime, clay, or microcement system best fits the architecture and substrate rather than favoring a single brand.'
    },
    {
      keywords: ['exterior', 'outside', 'outdoor', 'stucco', 'patio'],
      reply:
        'Most of our work is interior, though Shawn is open to inspecting almost any project to see if it is the right technical fit.'
    },
    {
      keywords: ['clean', 'cleaning', 'maintain', 'maintenance', 'care', 'soap', 'bleach', 'seal', 'sealer'],
      reply:
        'Clean routinely with a gentle <strong>pH-neutral soap</strong> and a soft microfiber cloth or mop. Avoid bleach, ammonia, and abrasive powders. In showers, a quick squeegee after use helps prevent hard-water mineral buildup.'
    },
    {
      keywords: ['price', 'cost', 'estimate', 'quote', 'how much', 'designer', 'designers', 'rate', 'budget'],
      reply:
        'We partner primarily with <strong>interior designers</strong> (alongside builders and homeowners) and price by finish system, substrate condition, and scope rather than volume square-foot rates. Call or text <a href="tel:4058160750">405-816-0750</a> or email <a href="mailto:contact@organicfinishesllc.org">contact@organicfinishesllc.org</a> for an estimate.'
    },
    {
      keywords: ['contact', 'call', 'text', 'phone', 'email', 'shawn', 'book', 'schedule', 'consultation', 'hello', 'hi'],
      reply:
        'You can reach Shawn directly by call or text at <a href="tel:4058160750">405-816-0750</a>, email <a href="mailto:contact@organicfinishesllc.org">contact@organicfinishesllc.org</a>, or use the <a href="#contact">project inquiry form</a> on this page.'
    }
  ];

  const claraChips = [
    { label: 'Sample Boards', query: 'How do sample boards and colors work?' },
    { label: 'Over Tile', query: 'Can microcement go over existing tile?' },
    { label: 'Travel & Area', query: 'Where do you travel and work?' },
    { label: 'Size & Prep', query: 'What is your project size limit and drywall prep?' },
    { label: 'Pricing & Contact', query: 'How do estimates and contacting Shawn work?' }
  ];

  const matchClaraReply = (input) => {
    const clean = input.toLowerCase().trim();
    if (!clean) return null;

    let bestMatch = null;
    let bestScore = 0;

    claraKnowledge.forEach((entry) => {
      let score = 0;
      entry.keywords.forEach((kw) => {
        if (clean.includes(kw)) {
          score += kw.includes(' ') ? 3 : 2;
        }
      });
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    });

    if (bestMatch && bestScore > 0) {
      return bestMatch.reply;
    }

    return 'I want to make sure you get an accurate answer on that. For specific project questions, please call or text Shawn directly at <a href="tel:4058160750">405-816-0750</a>, email <a href="mailto:contact@organicfinishesllc.org">contact@organicfinishesllc.org</a>, or leave details in the <a href="#contact">inquiry form</a>.';
  };

  const launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.id = 'clara-launcher';
  launcher.className = 'clara-launcher';
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'clara-panel');
  launcher.innerHTML = '<span class="clara-status-dot" aria-hidden="true"></span><span>Ask Clara</span>';

  const panel = document.createElement('section');
  panel.id = 'clara-panel';
  panel.className = 'clara-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Clara — Organic Finishes Studio Concierge');
  panel.innerHTML = `
    <div class="clara-header">
      <div class="clara-title-group">
        <div class="clara-avatar" aria-hidden="true">C</div>
        <div>
          <div class="clara-name">Clara</div>
          <div class="clara-subtitle">Studio Concierge</div>
        </div>
      </div>
      <button type="button" class="clara-close" aria-label="Close Clara chat">Close [×]</button>
    </div>
    <div class="clara-messages" id="clara-messages"></div>
    <div class="clara-chips" id="clara-chips"></div>
    <form class="clara-input-row" id="clara-form">
      <input type="text" id="clara-input" class="clara-input" placeholder="Ask about finishes, prep, travel..." autocomplete="off" />
      <button type="submit" class="clara-send">Send</button>
    </form>
  `;

  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  const messagesEl = panel.querySelector('#clara-messages');
  const chipsEl = panel.querySelector('#clara-chips');
  const closeBtn = panel.querySelector('.clara-close');
  const formEl = panel.querySelector('#clara-form');
  const inputEl = panel.querySelector('#clara-input');

  const appendMessage = (html, sender) => {
    const msg = document.createElement('div');
    msg.className = `clara-msg ${sender === 'user' ? 'clara-msg-user' : 'clara-msg-bot'}`;
    if (sender === 'user') {
      msg.textContent = html;
    } else {
      msg.innerHTML = html;
    }
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };

  appendMessage(
    'Hello — I’m <strong>Clara</strong>, the studio concierge for Organic Finishes LLC. Ask me about microcement, Tadelakt, sample boards, drywall prep, travel, or scheduling.',
    'bot'
  );

  claraChips.forEach((chip) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'clara-chip';
    btn.textContent = chip.label;
    btn.addEventListener('click', () => {
      appendMessage(chip.query, 'user');
      const reply = matchClaraReply(chip.query);
      setTimeout(() => appendMessage(reply, 'bot'), 180);
    });
    chipsEl.appendChild(btn);
  });

  const toggleClara = (forceState) => {
    const isOpen = typeof forceState === 'boolean' ? forceState : !panel.classList.contains('open');
    panel.classList.toggle('open', isOpen);
    launcher.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      inputEl.focus();
    }
  };

  launcher.addEventListener('click', () => toggleClara());
  closeBtn.addEventListener('click', () => toggleClara(false));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      toggleClara(false);
    }
  });

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = inputEl.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    inputEl.value = '';
    const reply = matchClaraReply(text);
    setTimeout(() => appendMessage(reply, 'bot'), 220);
  });
});

