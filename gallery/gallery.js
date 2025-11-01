// Gallery Configuration
const PHOTO_COUNT = 12; // Number of photos in the gallery
const PLACEHOLDER_BASE = 'https://picsum.photos'; // Placeholder image service

// State
let isExpanded = false;
let currentLightboxIndex = 0;
let photos = [];

// Initialize the gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeGallery();
    setupScrollProgress();
    setupLightbox();
    setupParallaxEffects();
    animateNavbar();
});

// Initialize Gallery
function initializeGallery() {
    const photoStack = document.getElementById('photoStack');
    const photoGrid = document.getElementById('photoGrid');
    
    // Generate photo data
    photos = generatePhotoData(PHOTO_COUNT);
    
    // Create photo elements in stack
    photos.forEach((photo, index) => {
        const photoElement = createPhotoElement(photo, index);
        photoStack.appendChild(photoElement);
        
        // Apply stacking transform
        applyStackTransform(photoElement, index, PHOTO_COUNT);
    });
    
    // Setup click handler for expansion
    photoStack.addEventListener('click', expandGallery);
}

// Generate photo data
function generatePhotoData(count) {
    const photoArray = [];
    for (let i = 0; i < count; i++) {
        // Using different sizes to get variety from picsum.photos
        const width = 400 + (i % 3) * 100;
        const height = 500 + (i % 3) * 100;
        photoArray.push({
            id: i,
            url: `${PLACEHOLDER_BASE}/${width}/${height}?random=${i}`,
            alt: `Photo ${i + 1}`
        });
    }
    return photoArray;
}

// Create photo element
function createPhotoElement(photo, index) {
    const photoItem = document.createElement('div');
    photoItem.className = 'photo-item';
    photoItem.dataset.index = index;
    
    const img = document.createElement('img');
    img.src = photo.url;
    img.alt = photo.alt;
    img.loading = 'lazy';
    
    photoItem.appendChild(img);
    
    return photoItem;
}

// Apply stack transform to create stacked effect
function applyStackTransform(element, index, total) {
    const offset = (index - total / 2) * 2;
    const rotation = (index - total / 2) * 1.5;
    const scale = 1 - (Math.abs(index - total / 2) * 0.01);
    
    // Initial state (hidden)
    gsap.set(element, {
        x: offset,
        y: offset * 0.5,
        rotation: rotation,
        scale: scale,
        zIndex: index,
        opacity: 0
    });
    
    // Animate in with stagger
    gsap.to(element, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        delay: index * 0.08
    });
    
    // Add subtle breathing animation to the stack
    gsap.to(element, {
        y: `+=${Math.sin(index) * 3}`,
        duration: 2 + (index * 0.1),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: index * 0.1
    });
}

// Expand gallery animation
function expandGallery() {
    if (isExpanded) return;
    
    isExpanded = true;
    const photoStack = document.getElementById('photoStack');
    const photoGrid = document.getElementById('photoGrid');
    const stackHint = document.getElementById('stackHint');
    const photoItems = photoStack.querySelectorAll('.photo-item');
    
    // Hide hint
    stackHint.classList.add('hidden');
    
    // Remove click handler from stack
    photoStack.removeEventListener('click', expandGallery);
    
    // Animate photos to grid
    const timeline = gsap.timeline({
        onComplete: () => {
            // Move photos to grid container and mark stack as expanded
            photoStack.classList.add('expanded');
            photoGrid.classList.add('active');
            
            photoItems.forEach((item, index) => {
                const clonedItem = item.cloneNode(true);
                
                // Reset transform and opacity for grid display
                gsap.set(clonedItem, {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    scale: 1,
                    opacity: 1,
                    clearProps: 'all'
                });
                
                photoGrid.appendChild(clonedItem);
                
                // Animate in from bottom
                gsap.from(clonedItem, {
                    y: 50,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                    delay: index * 0.05
                });
                
                // Setup 3D tilt effect
                setup3DTilt(clonedItem);
                
                // Setup click handler for lightbox
                clonedItem.addEventListener('click', () => openLightbox(index));
            });
            
            // Remove original items from stack
            photoStack.innerHTML = '';
        }
    });
    
    // Animate each photo with stagger
    photoItems.forEach((item, index) => {
        timeline.to(item, {
            x: 0,
            y: index * -150, // Spread them vertically temporarily
            rotation: 0,
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
        }, index * 0.05);
    });
    
    // Fade out and prepare for grid transition
    timeline.to(photoItems, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
    }, '+=0.2');
}

// Setup 3D tilt effect on hover
function setup3DTilt(element) {
    const maxRotate = 6;
    
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        const rotateY = (x - 0.5) * (maxRotate * 2);
        const rotateX = (0.5 - y) * (maxRotate * 2);
        
        gsap.to(element, {
            rotateX: rotateX,
            rotateY: rotateY,
            duration: 0.3,
            ease: 'power2.out',
            transformPerspective: 800
        });
    });
    
    element.addEventListener('mouseleave', () => {
        gsap.to(element, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
}

// Setup scroll progress bar
function setupScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    
    function updateProgress() {
        const scrollTop = window.scrollY || window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = scrollPercent + '%';
    }
    
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
}

// Setup lightbox functionality
function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Navigation
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox(-1);
    });
    
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox(1);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox(-1);
                break;
            case 'ArrowRight':
                navigateLightbox(1);
                break;
        }
    });
}

// Open lightbox
function openLightbox(index) {
    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    
    lightboxImage.src = photos[index].url;
    lightboxImage.alt = photos[index].alt;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Show lightbox
    lightbox.classList.add('active');
    
    // Animate image in
    gsap.fromTo(lightboxImage, 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }
    );
}

// Close lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    
    // Animate image out
    gsap.to(lightboxImage, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
            lightbox.classList.remove('active');
            // Restore body scroll
            document.body.style.overflow = '';
        }
    });
}

// Navigate lightbox
function navigateLightbox(direction) {
    currentLightboxIndex = (currentLightboxIndex + direction + photos.length) % photos.length;
    
    const lightboxImage = document.getElementById('lightboxImage');
    
    // Animate transition
    gsap.to(lightboxImage, {
        x: direction * 50,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
            lightboxImage.src = photos[currentLightboxIndex].url;
            lightboxImage.alt = photos[currentLightboxIndex].alt;
            
            gsap.fromTo(lightboxImage,
                { x: -direction * 50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.2, ease: 'power2.out' }
            );
        }
    });
}

// Setup parallax effects
function setupParallaxEffects() {
    const hero = document.querySelector('.gallery-hero');
    
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            
            gsap.to(hero, {
                y: rate,
                opacity: 1 - (scrolled / 500),
                duration: 0.1
            });
        }, { passive: true });
    }
    
    // Parallax effect for photo grid on scroll
    window.addEventListener('scroll', () => {
        if (!isExpanded) return;
        
        const photoItems = document.querySelectorAll('.photo-grid .photo-item');
        photoItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;
            
            if (scrollPercent > 0 && scrollPercent < 1) {
                const movement = (scrollPercent - 0.5) * 20;
                gsap.to(item, {
                    y: movement,
                    duration: 0.3,
                    ease: 'power1.out'
                });
            }
        });
    }, { passive: true });
}

// Animate navbar on scroll
function animateNavbar() {
    const navbar = document.querySelector('.dynamic-nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            gsap.to(navbar, {
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(10px)',
                duration: 0.3
            });
        } else {
            gsap.to(navbar, {
                backgroundColor: '#000000',
                backdropFilter: 'blur(0px)',
                duration: 0.3
            });
        }
        
        // Hide navbar on scroll down, show on scroll up
        if (currentScroll > lastScroll && currentScroll > 100) {
            gsap.to(navbar, {
                y: -100,
                duration: 0.3,
                ease: 'power2.out'
            });
        } else {
            gsap.to(navbar, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}

// Add smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
