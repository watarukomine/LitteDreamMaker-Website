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

/**
 * Gets random elements from an array.
 * @template T
 * @param {T[]} arr The source array.
 * @param {number} count The number of elements to return.
 * @returns {T[]} A new array with random elements.
 */
function getRandomElements<T>(arr: T[], count: number): T[] {
  // Create a shuffled copy of the array
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  // Return the first 'count' elements, ensuring not to exceed the array length
  return shuffled.slice(0, Math.min(count, shuffled.length));
}


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
    // Select 10 random images for the preview carousel
    const previewImages = getRandomElements(allImages, 10);

    // Duplicate for infinite scroll effect, only if there are images to show
    if (previewImages.length > 0) {
      const displayImages = [...previewImages, ...previewImages];

      displayImages.forEach(img => {
        const item = document.createElement('a');
        item.href = 'gallery.html';
        item.className = 'carousel-item';
        item.innerHTML = `<img src="${img.url}" alt="Moment" loading="lazy">`;
        momentsCarousel.appendChild(item);
      });

      // Update animation duration based on item count to maintain speed
      momentsCarousel.style.animationDuration = `${displayImages.length * 4}s`;
    }
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

// About Image Randomization
const aboutImageModules = import.meta.glob('./assets/images/biography/profile-random-*.jpg', { eager: true });
const aboutImages = Object.values(aboutImageModules).map((mod: any) => mod.default);

function initAboutImage() {
  const aboutImgElement = document.getElementById('about-profile-img') as HTMLImageElement;
  if (aboutImgElement && aboutImages.length > 0) {
    const randomImage = aboutImages[Math.floor(Math.random() * aboutImages.length)];
    aboutImgElement.src = randomImage;
  }
}

// 753 Service Image Randomization (REMOVED - Replaced by Slideshow)

// Service Card Slideshow Logic
const newbornSlideshowModules = import.meta.glob('./assets/images/services/newborn-slideshow/*.jpg', { eager: true });
const service753SlideshowModules = import.meta.glob('./assets/images/services/753-random/*.jpg', { eager: true });
const familySlideshowModules = import.meta.glob('./assets/images/services/family-slideshow/*.jpg', { eager: true });
const familySlideshowImages = Object.values(familySlideshowModules).map((mod: any) => mod.default);

// Album Slideshow Imports
const chirimenSlideshowModules = import.meta.glob('./assets/images/products/chirimen-album/*.jpg', { eager: true });
const chirimenImages = Object.values(chirimenSlideshowModules).map((mod: any) => mod.default);

const lifesizeSlideshowModules = import.meta.glob('./assets/images/products/life-size-album/*.{jpg,png}', { eager: true });
const lifesizeImages = Object.values(lifesizeSlideshowModules).map((mod: any) => mod.default);

const newbornImages = Object.values(newbornSlideshowModules).map((mod: any) => mod.default);
const service753Images = Object.values(service753SlideshowModules).map((mod: any) => mod.default);

function initServiceSlideshow(containerId: string, images: string[], interval: number = 3000) {
  const container = document.getElementById(containerId);
  if (!container || images.length === 0) return;

  container.innerHTML = ''; // Clear existing content

  // Create image elements
  images.forEach((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = "Service Image";
    img.className = `service-card-img ${index === 0 ? 'active' : ''}`;
    container.appendChild(img);
  });

  // Start slideshow only if multiple images exist
  if (images.length > 1) {
    let currentIndex = 0;
    setInterval(() => {
      const imgs = container.querySelectorAll('.service-card-img');
      imgs[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % imgs.length;
      imgs[currentIndex].classList.add('active');
    }, interval);
  } else {
    // For single image, ensure it's visible
    const img = container.querySelector('.service-card-img');
    if (img) img.classList.add('active');
  }
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  initGallerySystem();
  initAboutImage();
  // initService753Image(); // Removed

  // Initialize Slideshows
  initServiceSlideshow('service-newborn-slideshow', newbornImages);
  initServiceSlideshow('service-753-slideshow', service753Images);
  initServiceSlideshow('service-family-slideshow', familySlideshowImages);

  // Album Slideshow (5 seconds interval)
  initServiceSlideshow('product-chirimen-slideshow', chirimenImages, 5000);
  initServiceSlideshow('product-lifesize-slideshow', lifesizeImages, 5000);
});
