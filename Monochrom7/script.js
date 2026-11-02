/* Monochrome shared interactions: mobile navigation, accessible image lightbox and form validation. */
document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation works on every page.
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('#main-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
    });
  }

  // Turn content images into buttons that open a full-size lightbox.
  const images = [...document.querySelectorAll('main img')].filter(img => !img.closest('.no-lightbox'));
  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox-dialog';
  dialog.setAttribute('aria-label', 'Image preview');
  dialog.innerHTML = '<button class="lightbox-close" type="button" aria-label="Close image preview">×</button><button class="lightbox-prev" type="button" aria-label="Previous image">‹</button><figure><img class="lightbox-image" alt=""><figcaption></figcaption></figure><button class="lightbox-next" type="button" aria-label="Next image">›</button>';
  document.body.appendChild(dialog);
  const preview = dialog.querySelector('.lightbox-image');
  const caption = dialog.querySelector('figcaption');
  let current = 0;
  images.forEach((img, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'lightbox-trigger';
    button.setAttribute('aria-label', `Enlarge image: ${img.alt || 'image'}`);
    img.parentNode.insertBefore(button, img); button.appendChild(img);
    button.addEventListener('click', () => { current = index; showImage(); if (!dialog.open) dialog.showModal(); });
  });
  function showImage() {
    const img = images[current];
    preview.src = img.currentSrc || img.src;
    preview.alt = img.alt || 'Enlarged image';
    caption.textContent = img.alt || '';
    dialog.querySelector('.lightbox-prev').disabled = images.length < 2;
    dialog.querySelector('.lightbox-next').disabled = images.length < 2;
  }
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.lightbox-prev').addEventListener('click', () => { current = (current - 1 + images.length) % images.length; showImage(); });
  dialog.querySelector('.lightbox-next').addEventListener('click', () => { current = (current + 1) % images.length; showImage(); });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { current = (current - 1 + images.length) % images.length; showImage(); }
    if (event.key === 'ArrowRight') { current = (current + 1) % images.length; showImage(); }
  });

  // Front-end validation only. A live website needs a configured form endpoint to receive submissions.
  const forms = [
    { id: 'project-enquiry-form', feedback: 'project-form-feedback', message: 'Your project enquiry passed the form checks. This website demo does not send or store submissions yet; connect a secure form service before publishing.' },
    { id: 'model-application-form', feedback: 'model-form-feedback', message: 'Your application passed the form checks. This website demo does not send or store submissions yet; connect a secure form service before publishing.' }
  ];
  forms.forEach(item => {
    const form = document.getElementById(item.id);
    const feedback = document.getElementById(item.feedback);
    if (!form || !feedback) return;
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      feedback.textContent = item.message;
      feedback.classList.add('is-visible');
    });
    form.addEventListener('input', () => { feedback.textContent = ''; feedback.classList.remove('is-visible'); });
  });
});
