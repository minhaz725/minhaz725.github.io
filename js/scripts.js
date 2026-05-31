/* ============================================
   MD Minhazur Rahman — Portfolio Scripts
   Dark/light toggle, scroll animations, mobile nav
   ============================================ */

(function () {
  'use strict';

  // ---- Dark / Light Mode Toggle ----
  const themeToggle = document.querySelector('.theme-toggle');
  const root = document.documentElement;

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (_) {
      // localStorage unavailable — ignore
    }
  }

  // Init: check localStorage, then system preference, default dark
  function initTheme() {
    let saved;
    try {
      saved = localStorage.getItem('theme');
    } catch (_) {
      // ignore
    }
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }

  initTheme();

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const current = root.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ---- Mobile Navigation ----
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
      const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
      navLinks.classList.toggle('open');
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    });

    // Close mobile menu when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          menuBtn.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        menuBtn.focus();
      }
    });
  }

  // ---- Scroll Fade-in Animations (Intersection Observer) ----
  var fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window && fadeElements.length > 0) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything if IntersectionObserver not supported
    fadeElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ---- Active nav link highlighting on scroll ----
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length > 0 && navAnchors.length > 0) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navAnchors.forEach(function (a) {
              a.style.color = '';
            });
            var active = document.querySelector('.nav-links a[href="#' + entry.target.id + '"]');
            if (active) {
              active.style.color = 'var(--accent)';
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-' + (parseInt(getComputedStyle(root).getPropertyValue('--nav-height')) || 64) + 'px 0px -40% 0px',
      }
    );

    sections.forEach(function (s) {
      sectionObserver.observe(s);
    });
  }
})();
