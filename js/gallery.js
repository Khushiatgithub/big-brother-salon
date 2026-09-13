/* ==========================================================================
   BIG BROTHER HAIR & BEAUTY SALON - GALLERY & BEFORE/AFTER ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBeforeAfterSliders();
  initGalleryFilter();
  initLightbox();
});

/**
 * Interactive Before / After Split Image Slider
 */
function initBeforeAfterSliders() {
  const containers = document.querySelectorAll('.ba-slider-container');

  containers.forEach(container => {
    const afterLayer = container.querySelector('.ba-after');
    const handle = container.querySelector('.ba-handle');
    if (!afterLayer || !handle) return;

    let isDragging = false;

    const setSliderPosition = (xPos) => {
      const rect = container.getBoundingClientRect();
      let offsetX = xPos - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percent = (offsetX / rect.width) * 100;
      afterLayer.style.width = `${percent}%`;
      handle.style.left = `${percent}%`;
    };

    // Mouse Events
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.clientX);
    });

    // Touch Events (Mobile/Tablet)
    container.addEventListener('touchstart', (e) => {
      isDragging = true;
      if (e.touches.length > 0) {
        setSliderPosition(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || !e.touches.length) return;
      setSliderPosition(e.touches[0].clientX);
    }, { passive: true });
  });
}

/**
 * Gallery Filter Buttons
 */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const items = document.querySelectorAll('.gallery-item');

  if (!filterBtns.length || !items.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filter === 'all' || itemCategory === filter) {
          item.style.display = 'block';
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease';
            item.style.opacity = '1';
          }, 20);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Fullscreen Lightbox Modal
 */
function initLightbox() {
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  const items = document.querySelectorAll('.gallery-item');

  if (!lightbox || !lightboxImg) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}
