document.addEventListener('DOMContentLoaded', () => {

  // 1. Dynamic Copyright Year
  document.getElementById('year').textContent = new Date().getFullYear();

  // 2. Sticky Header Logic
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 3. Accessible Mobile Navigation
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const primaryNav = document.getElementById('primary-navigation');
  const navLinks = primaryNav.querySelectorAll('a');

  // Toggle menu state
  const toggleMenu = () => {
    const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
    mobileBtn.setAttribute('aria-expanded', !isExpanded);
    primaryNav.classList.toggle('is-open');

    // Manage focus for accessibility
    if (!isExpanded) {
      // When opened, focus the first link inside the menu
      navLinks[0].focus();
    } else {
      // When closed, return focus to the toggle button
      mobileBtn.focus();
    }
  };

  mobileBtn.addEventListener('click', toggleMenu);

  // Close menu with Escape key (A11y Requirement)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
      toggleMenu();
    }
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (primaryNav.classList.contains('is-open')) {
        toggleMenu();
      }
    });
  });

  // 4. Scroll Reveal Animations utilizing Intersection Observer (100% Performance)
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  // Note: We use purely native DOM APIs for performance
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Stop observing once revealed
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.reveal, .img-reveal');
  // Ensure screen readers don't misinterpret opacity logic by letting CSS handle visibility naturally
  revealElements.forEach(el => observer.observe(el));

  // 5. Form Validation & Submission Logic
  const form = document.getElementById('inquiryForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const originalText = btn.textContent;

    // Mock submission state with visual/text updates
    btn.textContent = 'Sending...';
    btn.setAttribute('aria-busy', 'true');
    btn.style.opacity = '0.7';

    setTimeout(() => {
      btn.textContent = 'Inquiry Sent Successfully';
      btn.removeAttribute('aria-busy');
      btn.style.backgroundColor = 'var(--clr-olive)';
      btn.style.color = 'var(--clr-white)';
      form.reset();

      // Revert back to original state
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
        btn.style.opacity = '1';
      }, 4000);
    }, 1500);
  });



  // 6. Modern Gallery Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active states and ARIA pressed from all buttons
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            
            // Set active state to clicked button
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            
            const filterValue = btn.getAttribute('data-filter');
            
            // Filter logic
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hidden');
                    // Add subtle animation re-trigger if desired
                    item.style.animation = 'none';
                    item.offsetHeight; /* trigger reflow */
                    item.style.animation = null; 
                } else {
                    item.classList.add('hidden');
                }
            });
            
            // Re-evaluate Intersection Observer for newly revealed items
            galleryItems.forEach(el => {
                if(!el.classList.contains('hidden') && !el.classList.contains('active')) {
                   observer.observe(el);
                }
            });
        });
    });
});