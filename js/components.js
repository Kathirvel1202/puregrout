(function () {
  const navigationItems = [
    {
      key: 'home',
      label: 'Home',
      href: 'index.html',
      dropdown: [
        { label: 'Home 1', href: 'index.html' },
        { label: 'Home 2', href: 'home-2.html' }
      ]
    },
    { key: 'about', label: 'About Us', href: 'about.html' },
    { key: 'services', label: 'Services', href: 'services.html' },
    { key: 'process', label: 'Process', href: 'process.html' },
    { key: 'pricing', label: 'Pricing', href: 'pricing.html' },
    { key: 'faq', label: 'FAQ', href: 'faq.html' },
    { key: 'contact', label: 'Contact', href: 'contact.html' }
  ];

  function brandMarkup() {
    return `<span class="brand-badge" aria-hidden="true">
      <svg class="brand-badge-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="headerShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1B4438"/>
            <stop offset="100%" stop-color="#0A1C16"/>
          </linearGradient>
          <linearGradient id="headerGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F1D18A"/>
            <stop offset="100%" stop-color="#B78832"/>
          </linearGradient>
        </defs>
        <!-- Protective Shield Crest -->
        <path d="M16 2.5 C22.5 2.5 27.5 4.5 27.5 8.5 C27.5 18.5 21.5 25 16 29.5 C10.5 25 4.5 18.5 4.5 8.5 C4.5 4.5 9.5 2.5 16 2.5 Z" fill="url(#headerShieldGrad)" stroke="#D9B167" stroke-width="1.2" stroke-linejoin="round"/>
        <!-- 4 Ceramic Tiles Grid with Clear Grout Seams -->
        <rect x="9" y="7" width="6" height="6" rx="1.2" fill="url(#headerGoldGrad)"/>
        <rect x="17" y="7" width="6" height="6" rx="1.2" fill="#F4EFE6" opacity="0.95"/>
        <rect x="9" y="15" width="6" height="6" rx="1.2" fill="#F4EFE6" opacity="0.95"/>
        <rect x="17" y="15" width="6" height="6" rx="1.2" fill="url(#headerGoldGrad)"/>
        <!-- Grout Line Crosshairs -->
        <line x1="16" y1="6" x2="16" y2="22" stroke="#FFFFFF" stroke-width="1.1" stroke-linecap="round" opacity="0.85"/>
        <line x1="8" y1="14" x2="24" y2="14" stroke="#FFFFFF" stroke-width="1.1" stroke-linecap="round" opacity="0.85"/>
        <!-- Central Sparkle -->
        <path d="M16 10 C16 12.5 17.2 14 19.5 14 C17.2 14 16 15.5 16 18 C16 15.5 14.8 14 12.5 14 C14.8 14 16 12.5 16 10 Z" fill="#FFFFFF"/>
        <circle cx="16" cy="14" r="0.9" fill="#D9B167"/>
        <!-- Clean Seal Verification Mark -->
        <path d="M12.5 24 L14.8 26.2 L19.5 21.5" fill="none" stroke="#D9B167" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
    <span class="brand-name">Pure<span class="brand-accent">Grout</span></span>`;
  }

  function headerMarkup() {
    const currentPage = document.body.dataset.page || 'home';

    const linksHtml = navigationItems.map(({ key, label, href, dropdown }) => {
      const active = currentPage === key || (key === 'home' && (currentPage === 'home' || currentPage === 'home1' || currentPage === 'home2'));
      const hasDropdown = Array.isArray(dropdown) && dropdown.length > 0;

      if (!hasDropdown) {
        return `<li class="nav-item">
          <a href="${href}" class="nav-link ${active ? 'is-active' : ''}" ${active ? 'aria-current="page"' : ''}>${label}</a>
        </li>`;
      }

      const dropdownItems = dropdown.map(item => {
        const itemActive = (item.href === 'index.html' && (currentPage === 'home' || currentPage === 'home1')) ||
                           (item.href === 'home-2.html' && currentPage === 'home2');
        return `<a href="${item.href}" class="dropdown-item ${itemActive ? 'is-current' : ''}">
          <span class="dropdown-item-title">${item.label}</span>
          ${item.desc ? `<span class="dropdown-item-desc">${item.desc}</span>` : ''}
        </a>`;
      }).join('');

      return `<li class="nav-item nav-item-has-dropdown" data-dropdown>
        <a href="${href}" class="nav-link ${active ? 'is-active' : ''}" ${active ? 'aria-current="page"' : ''} aria-haspopup="true" aria-expanded="false">
          <span>${label}</span>
          <svg class="nav-chevron" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
        <div class="nav-dropdown" role="menu">
          ${dropdownItems}
        </div>
      </li>`;
    }).join('');

    return `
    <header class="site-header-wrapper">
      <div class="site-header site-header-capsule">
        <a class="brand" href="index.html" aria-label="PureGrout home">
          ${brandMarkup()}
        </a>

        <nav id="primary-navigation" class="primary-navigation" aria-label="Main navigation">
          <ul class="nav-list">
            ${linksHtml}
          </ul>
        </nav>

        <div class="nav-controls">
          <!-- Theme toggle switch (Sun / Moon) -->
          <button class="theme-switch" type="button" role="switch" aria-checked="false" aria-label="Toggle dark mode" title="Toggle Light / Dark mode">
            <span class="theme-switch-track">
              <span class="theme-switch-icon sun-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="4.5"/>
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                </svg>
              </span>
              <span class="theme-switch-thumb" aria-hidden="true"></span>
              <span class="theme-switch-icon moon-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              </span>
            </span>
          </button>

          <!-- LTR indicator badge -->
          <button class="nav-dir-badge" type="button" aria-label="Direction Left to Right" title="Reading Direction">LTR</button>

          <!-- Vertical separator -->
          <span class="nav-v-divider" aria-hidden="true"></span>

          <!-- Solid Amber-Gold Pill Button: Booking -->
          <a class="nav-booking-btn" href="booking.html">Booking</a>

          <!-- Mobile Hamburger Toggle -->
          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="Open navigation menu">
            <svg class="icon-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <path d="m18 6-12 12M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </header>`;
  }

  function socialIcon(name, svg, href) {
    const url = href || `https://${name.toLowerCase()}.com`;
    const action = name === 'WhatsApp' ? 'Message' : 'Follow';
    return `<a href="${url}" class="social-icon" target="_blank" rel="noopener noreferrer" aria-label="${action} PureGrout on ${name}">${svg}</a>`;
  }

  function footerMarkup() {
    const quickLinks = [
      { label: 'About Us', href: 'about.html' },
      { label: 'Our Services', href: 'services.html' },
      { label: 'Our Process', href: 'process.html' },
      { label: 'Pricing Guide', href: 'pricing.html' },
      { label: 'FAQ', href: 'faq.html' },
      { label: 'Contact Us', href: 'contact.html' },
      { label: 'Online Booking', href: 'booking.html' }
    ].map(({ label, href }) => `<li><a href="${href}">${label}</a></li>`).join('');

    const services = [
      { label: 'Tile Floor Cleaning', href: 'services.html#tile-floor-cleaning' },
      { label: 'Bathroom Tile Cleaning', href: 'services.html#bathroom-tile-cleaning' },
      { label: 'Kitchen Tile Cleaning', href: 'services.html#kitchen-tile-cleaning' },
      { label: 'Grout Cleaning & Sealing', href: 'services.html#grout-cleaning-restoration' },
      { label: 'Commercial Tile Care', href: 'services.html#commercial-tile-cleaning' }
    ].map(({ label, href }) => `<li><a href="${href}">${label}</a></li>`).join('');

    const instagram = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>';
    const facebook = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>';
    const youtube = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m10 15 5-3-5-3z"/><rect x="2" y="4" width="20" height="16" rx="5"/></svg>';
    const whatsapp = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9l-5.05.9"/><path d="M9 10a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>';

    return `<footer class="site-footer">
      <div class="footer-grid">
        <section class="footer-brand-block" aria-labelledby="footer-brand-title">
          <a class="brand footer-brand" href="index.html" aria-label="PureGrout home">${brandMarkup()}</a>
          <p id="footer-brand-title">Professional tile and grout cleaning, combining heated extraction, deep grout line scrubbing, and protective sealing for lasting cleanliness.</p>
          <div class="social-links" role="group" aria-label="Social media links">
            ${socialIcon('Instagram', instagram)}
            ${socialIcon('Facebook', facebook)}
            ${socialIcon('YouTube', youtube)}
            ${socialIcon('WhatsApp', whatsapp, 'https://wa.me/15557898453')}
          </div>
          <p class="footer-certified-note">Certified Surface Specialists · Fully Insured &amp; Bonded</p>
        </section>
        <nav class="footer-column" aria-label="Quick links">
          <h2>Navigation</h2><ul>${quickLinks}</ul>
        </nav>
        <nav class="footer-column" aria-label="Our services">
          <h2>Our Services</h2><ul>${services}</ul>
        </nav>
        <section class="footer-column footer-contact" aria-labelledby="footer-contact-title">
          <h2 id="footer-contact-title">Contact &amp; Hours</h2>
          <ul>
            <li><span class="contact-label">Phone</span><span class="business-info"><a href="tel:5557898453">(555) 789-8453</a></span></li>
            <li><span class="contact-label">Email</span><span class="business-info"><a href="mailto:service@puregrout.com">service@puregrout.com</a></span></li>
            <li><span class="contact-label">Service Center</span><span class="business-info">1428 Grand Ave, Suite 300, Metro City</span></li>
            <li><span class="contact-label">Operating Hours</span><span class="business-info">Mon – Sat: 8:00 AM – 6:00 PM</span></li>
            <li><span class="contact-label">Emergency</span><span class="business-info">Commercial 24/7 On-Call</span></li>
          </ul>
        </section>
      </div>
      <div class="footer-bottom">
        <p>© <span data-current-year></span> PureGrout. All rights reserved.</p>
        <div class="footer-legal">
          <a href="about.html">About</a>
          <a href="process.html">Process</a>
          <a href="faq.html">FAQ</a>
          <a href="contact.html">Quote</a>
          <a href="booking.html">Booking</a>
        </div>
      </div>
    </footer>`;
  }

  window.SiteComponents = {
    render() {
      const headerTarget = document.querySelector('#site-header');
      const footerTarget = document.querySelector('#site-footer');
      if (headerTarget) headerTarget.innerHTML = headerMarkup();
      if (footerTarget) footerTarget.innerHTML = footerMarkup();
      const year = document.querySelector('[data-current-year]');
      if (year) year.textContent = String(new Date().getFullYear());
    }
  };
})();
