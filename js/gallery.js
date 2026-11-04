(function () {
  const dialog = document.querySelector('.gallery-lightbox');
  const triggers = Array.from(document.querySelectorAll('[data-gallery-item]'));
  if (!dialog || !triggers.length) return;

  const image = dialog.querySelector('.lightbox-image');
  const caption = dialog.querySelector('.lightbox-caption');
  const closeButton = dialog.querySelector('.lightbox-close');
  let activeIndex = 0;
  let returnFocus = null;

  function showImage(index) {
    activeIndex = (index + triggers.length) % triggers.length;
    const trigger = triggers[activeIndex];
    image.src = trigger.dataset.full;
    image.alt = trigger.dataset.alt || '';
    caption.textContent = trigger.querySelector('span')?.textContent || '';
  }

  function openImage(index, trigger) {
    returnFocus = trigger;
    showImage(index);
    dialog.showModal();
    closeButton.focus();
  }

  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => openImage(index, trigger));
  });

  closeButton.addEventListener('click', () => dialog.close());
  dialog.querySelector('.lightbox-prev').addEventListener('click', () => showImage(activeIndex - 1));
  dialog.querySelector('.lightbox-next').addEventListener('click', () => showImage(activeIndex + 1));

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showImage(activeIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showImage(activeIndex + 1);
    }
  });

  dialog.addEventListener('close', () => returnFocus?.focus());
})();
