document.getElementById('year').textContent = new Date().getFullYear();

const revealSections = document.querySelectorAll('[data-scroll-reveal]');
revealSections.forEach((section) => {
  const elements = section.querySelectorAll('.section-title, .plan-card, .feature-intro, .feature-grid article, .contact-copy, .social');
  elements.forEach((element) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(34px) scale(.98)';
    element.style.animation = 'none';
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const elements = entry.target.querySelectorAll('.section-title, .plan-card, .feature-intro, .feature-grid article, .contact-copy, .social');
    elements.forEach((element, index) => {
      element.animate([
        { opacity: 0, transform: 'translateY(34px) scale(.98)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' },
      ], { duration: 720, delay: Math.min(index * 85, 520), easing: 'cubic-bezier(.16,.9,.24,1)', fill: 'forwards' });
    });
    observer.unobserve(entry.target);
  });
}, { threshold: 0.16 });

revealSections.forEach((section) => observer.observe(section));

window.addEventListener('load', () => {
  window.setTimeout(() => {
    document.body.classList.remove('splash-active');
    document.body.classList.add('loaded');
    document.getElementById('splash').setAttribute('aria-hidden', 'true');
  }, 2850);
});
