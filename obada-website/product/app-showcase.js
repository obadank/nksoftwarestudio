const appTabs = [...document.querySelectorAll('.app-tabs button')];
const appPanels = [...document.querySelectorAll('.app-panel')];

appTabs.forEach((tab) => tab.addEventListener('click', () => {
  appTabs.forEach((item) => item.classList.toggle('active', item === tab));
  appPanels.forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === tab.dataset.app));
  document.querySelector('.apps-showcase').scrollIntoView({ behavior: 'smooth', block: 'start' });
}));

document.querySelectorAll('.app-visual').forEach((visual) => {
  const main = visual.querySelector('.main-shot img');
  const thumbs = [...visual.querySelectorAll('.shot-strip button')];
  thumbs.forEach((button) => button.addEventListener('click', () => {
    main.style.opacity = '0';
    setTimeout(() => {
      main.src = button.dataset.src;
      main.alt = button.querySelector('img').alt;
      main.onload = () => { main.style.opacity = '1'; };
    }, 140);
    thumbs.forEach((item) => item.classList.toggle('active', item === button));
  }));
});

const lightbox = document.querySelector('.app-lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxText = lightbox.querySelector('span');
let lightboxItems = [];
let lightboxIndex = 0;
let touchStartX = 0;

function showLightboxImage(index) {
  if (!lightboxItems.length) return;
  lightboxIndex = (index + lightboxItems.length) % lightboxItems.length;
  const item = lightboxItems[lightboxIndex];
  lightboxImage.style.opacity = '0';
  setTimeout(() => {
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;
    lightboxText.textContent = `${item.alt}  ·  ${lightboxIndex + 1} / ${lightboxItems.length}`;
    lightboxImage.onload = () => { lightboxImage.style.opacity = '1'; };
  }, 100);
}

document.querySelectorAll('.main-shot').forEach((button) => button.addEventListener('click', () => {
  const visual = button.closest('.app-visual');
  lightboxItems = [...visual.querySelectorAll('.shot-strip img')].map((img) => ({ src: img.src, alt: img.alt }));
  const currentSrc = button.querySelector('img').src;
  const currentIndex = lightboxItems.findIndex((item) => item.src === currentSrc);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  showLightboxImage(currentIndex < 0 ? 0 : currentIndex);
}));

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
}

lightbox.querySelector('.app-lightbox-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.app-lightbox-prev').addEventListener('click', () => showLightboxImage(lightboxIndex - 1));
lightbox.querySelector('.app-lightbox-next').addEventListener('click', () => showLightboxImage(lightboxIndex + 1));
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
lightbox.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) > 45) showLightboxImage(lightboxIndex + (distance < 0 ? 1 : -1));
}, { passive: true });

addEventListener('keydown', (event) => {
  if (!lightbox.classList.contains('open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showLightboxImage(lightboxIndex + 1);
  if (event.key === 'ArrowRight') showLightboxImage(lightboxIndex - 1);
});
