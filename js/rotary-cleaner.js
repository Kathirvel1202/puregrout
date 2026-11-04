/**
 * Home 2: Industrial Hydro-Rotary Extraction Showcase
 * Interactive multi-surface cleaner simulation with live telemetry & auto-demonstration
 */
(function () {
  function initRotaryCleaner() {
    const container = document.querySelector('[data-rotary-showcase]');
    if (!container) return;

    const frame = container.querySelector('.rotary-frame');
    const divider = container.querySelector('.rotary-wand-divider');
    const dirtyLayer = container.querySelector('.rotary-layer-dirty');
    const cleanLayer = container.querySelector('.rotary-layer-clean');
    const surfaceTabs = container.querySelectorAll('[data-surface-target]');
    const autoBtn = container.querySelector('[data-auto-clean]');
    const telemetryStatus = container.querySelector('[data-telemetry-status]');
    const telemetryDetail = container.querySelector('[data-telemetry-detail]');

    let currentPos = 50;
    let isDragging = false;
    let autoInterval = null;
    let autoDirection = 1;

    // Define 3 Distinct Problem Surfaces where BOTH before and after use the SAME matching image
    const surfaceProfiles = {
      commercial: {
        title: "High-Traffic Commercial Plaza (Porcelain Floor)",
        image: "assets/images/tile-after-clean.jpg",
        dirtyFilter: "brightness(0.68) contrast(1.35) sepia(0.35) saturate(0.85)",
        grimeOpacity: "0.7",
        status: "230°F Thermal Rinse · 900 PSI Hydro-Rotary Active",
        detail: "1,850 sq.ft. commercial porcelain restored. Ground-in street sediment & oils extracted."
      },
      kitchen: {
        title: "Commercial Kitchen & Food Prep Floor (Quarry Tile)",
        image: "assets/images/checkered-tile-kitchen.webp",
        dirtyFilter: "brightness(0.62) contrast(1.4) sepia(0.42) saturate(0.9)",
        grimeOpacity: "0.8",
        status: "Alkaline Grease Emulsification · 230°F Deep Flush",
        detail: "Polymerized cooking oils and blackened grout lines returned to original safety standards."
      },
      shower: {
        title: "Architectural Spa & Walk-In Shower (Subway & Marble)",
        image: "assets/images/bright-tiled-bathroom.webp",
        dirtyFilter: "brightness(0.7) contrast(1.3) sepia(0.28) hue-rotate(-10deg)",
        grimeOpacity: "0.65",
        status: "pH-Neutral Calcium Lift · Fluoropolymer Color Seal",
        detail: "Soap scum, iron stains, and mineral scale dissolved without etching natural stone finish."
      }
    };

    function setPosition(percent) {
      currentPos = Math.max(5, Math.min(95, percent));
      frame.style.setProperty('--rotary-pos', `${currentPos}%`);
      if (divider) divider.setAttribute('aria-valuenow', Math.round(currentPos));
    }

    // Pointer events for smooth drag
    function onPointerMove(e) {
      if (!isDragging) return;
      const rect = frame.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const x = clientX - rect.left;
      const percent = (x / rect.width) * 100;
      setPosition(percent);
    }

    function startDrag(e) {
      stopAutoClean();
      isDragging = true;
      frame.classList.add('is-interacting');
      onPointerMove(e);
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerup', endDrag);
      window.addEventListener('touchmove', onPointerMove, { passive: true });
      window.addEventListener('touchend', endDrag);
    }

    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      frame.classList.remove('is-interacting');
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', endDrag);
    }

    if (divider) {
      divider.addEventListener('pointerdown', startDrag);
      divider.addEventListener('touchstart', startDrag, { passive: true });
    }

    // Keyboard accessibility
    if (divider) {
      divider.addEventListener('keydown', (e) => {
        stopAutoClean();
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          setPosition(currentPos - 5);
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          setPosition(currentPos + 5);
        } else if (e.key === 'Home') {
          e.preventDefault();
          setPosition(5);
        } else if (e.key === 'End') {
          e.preventDefault();
          setPosition(95);
        }
      });
    }

    // Surface Tab Switcher
    surfaceTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        stopAutoClean();
        surfaceTabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');

        const key = tab.dataset.surfaceTarget;
        const profile = surfaceProfiles[key] || surfaceProfiles.commercial;

        if (dirtyLayer && profile.image) {
          const img = dirtyLayer.querySelector('img');
          if (img) {
            img.src = profile.image;
            img.style.filter = profile.dirtyFilter;
          }
          const grime = dirtyLayer.querySelector('.rotary-grime-overlay');
          if (grime) {
            grime.style.opacity = profile.grimeOpacity;
          }
        }
        if (cleanLayer && profile.image) {
          const img = cleanLayer.querySelector('img');
          if (img) {
            img.src = profile.image;
            img.style.filter = 'brightness(1.04) contrast(1.02)';
          }
        }
        if (telemetryStatus) telemetryStatus.textContent = profile.status;
        if (telemetryDetail) telemetryDetail.textContent = profile.detail;
      });
    });

    // Auto-clean demonstration loop
    function startAutoClean() {
      if (autoInterval) return;
      if (autoBtn) {
        autoBtn.classList.add('is-running');
        autoBtn.innerHTML = '<span>⏸</span> Pause Machine Demo';
      }
      autoInterval = setInterval(() => {
        let nextPos = currentPos + (autoDirection * 0.7);
        if (nextPos >= 88) {
          nextPos = 88;
          autoDirection = -1;
        } else if (nextPos <= 12) {
          nextPos = 12;
          autoDirection = 1;
        }
        setPosition(nextPos);
      }, 25);
    }

    function stopAutoClean() {
      if (!autoInterval) return;
      clearInterval(autoInterval);
      autoInterval = null;
      if (autoBtn) {
        autoBtn.classList.remove('is-running');
        autoBtn.innerHTML = '<span aria-hidden="true">▶</span> Run Machine Demo';
      }
    }

    if (autoBtn) {
      autoBtn.addEventListener('click', () => {
        if (autoInterval) {
          stopAutoClean();
        } else {
          startAutoClean();
        }
      });
    }

    // Initial setup
    setPosition(45);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRotaryCleaner);
  } else {
    initRotaryCleaner();
  }
})();

