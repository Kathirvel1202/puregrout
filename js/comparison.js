(function () {
  const slider = document.querySelector('[data-comparison]');
  if (!slider) return;
  const range = slider.querySelector('.comparison-range');

  function updateComparison(val) {
    const value = typeof val === 'number' ? Math.max(0, Math.min(100, Math.round(val))) : Number(range.value);
    if (typeof val === 'number') {
      range.value = value;
    }
    slider.style.setProperty('--comparison-position', `${value}%`);
    range.setAttribute('aria-valuetext', `${value} percent`);
  }

  range.addEventListener('input', function () {
    updateComparison();
  });

  let isDragging = false;

  function setPosFromPointer(e) {
    const rect = slider.getBoundingClientRect();
    if (!rect.width) return;
    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const percent = ((clientX - rect.left) / rect.width) * 100;
    updateComparison(percent);
  }

  slider.addEventListener('pointerdown', function (e) {
    isDragging = true;
    setPosFromPointer(e);
    try {
      slider.setPointerCapture(e.pointerId);
    } catch (_) {}
  });

  slider.addEventListener('pointermove', function (e) {
    if (!isDragging) return;
    setPosFromPointer(e);
  });

  function stopDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    try {
      if (e && e.pointerId) slider.releasePointerCapture(e.pointerId);
    } catch (_) {}
  }

  slider.addEventListener('pointerup', stopDrag);
  slider.addEventListener('pointercancel', stopDrag);

  updateComparison();
})();
