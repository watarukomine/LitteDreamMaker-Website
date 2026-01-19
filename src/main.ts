import './style.css'

// Reveal Animation on Scroll
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, {
  threshold: 0.1
});

revealElements.forEach(el => revealObserver.observe(el));

// Header Background Change on Scroll
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header?.classList.add('glass');
    header?.style.setProperty('padding', '1rem 0');
  } else {
    header?.style.setProperty('padding', '1.5rem 0');
  }
});

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLAnchorElement;
    const targetId = target.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Initial reveal for Hero section
window.addEventListener('load', () => {
  document.querySelectorAll('#hero .reveal').forEach(el => {
    el.classList.add('active');
  });
});

// --- Gallery & Carousel Logic ---

const galleryGrid = document.getElementById('gallery-grid');
const momentsCarousel = document.getElementById('moments-carousel');
const filterButtons = document.querySelectorAll('.filter-btn');

// Vite's feature to import all images from categories
const imageModules = import.meta.glob('./assets/images/gallery/**/*.{jpg,jpeg,png,JPG,PNG}', { eager: true });

function initGallerySystem() {
  const imagesByCategory: { [key: string]: string[] } = {};
  const allImages: { url: string; category: string }[] = [];
  const categories = ['newborn', 'miyamairi', '753', 'entrance_graduation', 'birthday', 'seijin', 'family', 'pet', 'other'];

  Object.keys(imageModules).forEach((path) => {
    const category = path.split('/').slice(-2, -1)[0];
    const imageUrl = (imageModules[path] as any).default;

    if (categories.includes(category)) {
      if (!imagesByCategory[category]) imagesByCategory[category] = [];
      imagesByCategory[category].push(imageUrl);
      allImages.push({ url: imageUrl, category });
    }
  });

  // 1. Gallery Page Logic
  if (galleryGrid) {
    galleryGrid.innerHTML = '';
    allImages.forEach(img => {
      const item = document.createElement('div');
      item.className = `gallery-item reveal ${img.category}`;
      item.dataset.category = img.category;
      item.innerHTML = `<img src="${img.url}" alt="${img.category} photo" loading="lazy">`;
      galleryGrid.appendChild(item);
    });
  }

  // 2. Main Page Carousel Logic
  if (momentsCarousel) {
    momentsCarousel.innerHTML = '';
    // Select about 10 random or first images for preview
    const previewImages = allImages.slice(0, 10);

    // Duplicate for infinite scroll effect
    const displayImages = [...previewImages, ...previewImages];

    displayImages.forEach(img => {
      const item = document.createElement('a');
      item.href = '/gallery.html';
      item.className = 'carousel-item';
      item.innerHTML = `<img src="${img.url}" alt="Moment" loading="lazy">`;
      momentsCarousel.appendChild(item);
    });

    // Update animation duration based on item count
    momentsCarousel.style.animationDuration = `${displayImages.length * 4}s`;
  }

  // Re-observe for reveal animation
  const newRevealElements = document.querySelectorAll('.reveal');
  newRevealElements.forEach(el => revealObserver.observe(el));
}

// Filtering Logic (for gallery.html)
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filterValue = (button as HTMLElement).dataset.filter;
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
      const htmlItem = item as HTMLElement;
      if (filterValue === 'all' || htmlItem.dataset.category === filterValue) {
        htmlItem.classList.remove('hide');
        setTimeout(() => {
          htmlItem.style.opacity = '1';
          htmlItem.style.transform = 'scale(1)';
        }, 10);
      } else {
        htmlItem.style.opacity = '0';
        htmlItem.style.transform = 'scale(0.8)';
        setTimeout(() => {
          htmlItem.classList.add('hide');
        }, 400);
      }
    });
  });
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  initGallerySystem();
});

