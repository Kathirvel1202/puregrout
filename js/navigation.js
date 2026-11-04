(function () {
  function initTheme() {
    const savedTheme = localStorage.getItem('puregrout-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;

    function applyTheme(dark) {
      if (dark) {
        document.documentElement.classList.add('theme-dark');
      } else {
        document.documentElement.classList.remove('theme-dark');
      }
      const switches = document.querySelectorAll('.theme-switch');
      switches.forEach(btn => {
        btn.setAttribute('aria-checked', String(dark));
        btn.classList.toggle('is-dark', dark);
      });
    }

    applyTheme(isDark);

    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('.theme-switch');
      if (!toggle) return;
      const currentlyDark = document.documentElement.classList.contains('theme-dark');
      const nextDark = !currentlyDark;
      localStorage.setItem('puregrout-theme', nextDark ? 'dark' : 'light');
      applyTheme(nextDark);
    });
  }

  function initDirToggle() {
    document.addEventListener('click', (e) => {
      const badge = e.target.closest('.nav-dir-badge');
      if (!badge) return;
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const nextDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', nextDir);
      badge.textContent = nextDir.toUpperCase();
    });
  }

  function initModals() {
    const modal = document.querySelector('#login-modal');
    if (!modal) return;

    function openModal() {
      if (typeof modal.showModal === 'function') {
        modal.showModal();
      } else {
        modal.setAttribute('open', '');
      }
      document.body.style.overflow = 'hidden';
      const input = modal.querySelector('input');
      if (input) setTimeout(() => input.focus(), 50);
    }

    function closeModal() {
      if (typeof modal.close === 'function') {
        modal.close();
      } else {
        modal.removeAttribute('open');
      }
      document.body.style.overflow = '';
    }

    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-modal-open="login-modal"]')) {
        e.preventDefault();
        openModal();
      } else if (e.target.closest('[data-modal-close]')) {
        e.preventDefault();
        closeModal();
      }
    });

    modal.addEventListener('cancel', () => {
      document.body.style.overflow = '';
    });

    const portalForm = document.querySelector('#portal-form');
    if (portalForm) {
      portalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = portalForm.querySelector('button[type="submit"]');
        const origText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Connecting to Secure Server...';
        setTimeout(() => {
          submitBtn.textContent = 'Demo Mode: Verified!';
          setTimeout(() => {
            closeModal();
            submitBtn.disabled = false;
            submitBtn.textContent = origText;
            portalForm.reset();
          }, 900);
        }, 800);
      });
    }
  }

  function initDropdowns() {
    const dropdownItems = document.querySelectorAll('[data-dropdown]');

    dropdownItems.forEach((item) => {
      const link = item.querySelector('.nav-link');
      const menu = item.querySelector('.nav-dropdown');
      if (!link || !menu) return;

      let timer = null;

      function open() {
        clearTimeout(timer);
        dropdownItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('is-open');
            const otherLink = other.querySelector('.nav-link');
            if (otherLink) otherLink.setAttribute('aria-expanded', 'false');
          }
        });
        item.classList.add('is-open');
        link.setAttribute('aria-expanded', 'true');
      }

      function close() {
        timer = setTimeout(() => {
          item.classList.remove('is-open');
          link.setAttribute('aria-expanded', 'false');
        }, 120);
      }

      item.addEventListener('mouseenter', open);
      item.addEventListener('mouseleave', close);

      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 960) {
          e.preventDefault();
          const isOpen = item.classList.contains('is-open');
          if (isOpen) {
            item.classList.remove('is-open');
            link.setAttribute('aria-expanded', 'false');
          } else {
            open();
          }
        }
      });

      item.addEventListener('focusin', open);
      item.addEventListener('focusout', (e) => {
        if (!item.contains(e.relatedTarget)) {
          item.classList.remove('is-open');
          link.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('[data-dropdown]')) {
        dropdownItems.forEach(item => {
          item.classList.remove('is-open');
          const link = item.querySelector('.nav-link');
          if (link) link.setAttribute('aria-expanded', 'false');
        });
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdownItems.forEach(item => {
          item.classList.remove('is-open');
          const link = item.querySelector('.nav-link');
          if (link) link.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('#primary-navigation');
    if (!toggle || !nav) return;

    function closeNav() {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
      nav.classList.remove('is-open');
    }

    function openNav() {
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close navigation menu');
      nav.classList.add('is-open');
    }

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    nav.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && !link.closest('[data-dropdown] > .nav-link')) {
        closeNav();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 960) {
        closeNav();
      }
    });
  }

  function initStickyScroll() {
    const capsule = document.querySelector('.site-header.site-header-capsule');
    if (!capsule) return;

    function handleScroll() {
      if (window.scrollY > 15) {
        capsule.classList.add('is-scrolled');
      } else {
        capsule.classList.remove('is-scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  window.SiteNavigation = {
    init() {
      initTheme();
      initDirToggle();
      initModals();
      initDropdowns();
      initMobileMenu();
      initStickyScroll();
    }
  };
})();
