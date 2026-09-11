/**
 * PORTFOLIO ELLIO PICARD — INTERACTIVITÉ (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Gestion du Header au défilement (Ombre & Réduction de taille)
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Menu Mobile (Burger)
  const burgerBtn = document.getElementById('burger-btn');
  const navLinks = document.getElementById('nav-links');
  const allNavLinks = document.querySelectorAll('.nav-link, .nav-cta-btn');

  if (burgerBtn && navLinks) {
    burgerBtn.addEventListener('click', () => {
      burgerBtn.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });

    // Fermer le menu lors d'un clic sur un lien
    allNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        burgerBtn.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    });

    // Fermer le menu en cliquant en dehors
    document.addEventListener('click', (e) => {
      if (
        navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !burgerBtn.contains(e.target)
      ) {
        burgerBtn.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.classList.remove('no-scroll');
      }
    });
  }

  // 3. Navigation active au défilement
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink();

  // 4. Animations d'apparition au scroll (Scroll Reveal)
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback pour anciens navigateurs
    revealElements.forEach((el) => el.classList.add('active'));
  }

  // 5. Gestion du Formulaire de Contact
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm && formFeedback && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      // Validation basique
      if (!name || !email || !subject || !message) {
        formFeedback.textContent = 'Veuillez remplir tous les champs du formulaire.';
        formFeedback.className = 'form-feedback error';
        return;
      }

      // Envoi reel via l'API FormSubmit
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span><i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours...</span>';
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);

      fetch('https://formsubmit.co/ajax/ellio.picard@free.fr', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success === 'true' || data.success === true) {
            formFeedback.textContent = `Merci ${name} ! Votre message a bien été envoyé directement à Ellio.`;
            formFeedback.className = 'form-feedback success';
            contactForm.reset();
          } else {
            // Premier envoi ou confirmation
            formFeedback.textContent = `Message transmis ! (Lors du tout premier envoi, FormSubmit demande une confirmation par email).`;
            formFeedback.className = 'form-feedback success';
            contactForm.reset();
          }
        })
        .catch(() => {
          // En cas d'ouverture directe en file:/// bloquant le fetch, soumission standard
          contactForm.submit();
        })
        .finally(() => {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        });
    });
  }
});
