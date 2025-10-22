// Blog page interactive features and animations
(function() {
    'use strict';

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeScrollProgress();
        initializeAnimations();
        initializeNewsletterForm();
        initializeBlogPostInteractions();
        initializeLenis();
    });

    // Scroll progress bar
    function initializeScrollProgress() {
        const progressEl = document.getElementById('scroll-progress');
        if (!progressEl) return;

        function updateProgress() {
            const scrollTop = window.scrollY || window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressEl.style.width = pct + '%';
        }

        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);
        updateProgress();
    }

    // Initialize GSAP animations
    function initializeAnimations() {
        if (typeof gsap === 'undefined') return;

        // Hero section animation
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            gsap.fromTo(heroContent, 
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
            );
        }

        // Featured post animation
        const featuredPost = document.querySelector('.featured-post');
        if (featuredPost) {
            gsap.fromTo(featuredPost,
                { opacity: 0, y: 100 },
                { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", delay: 0.3 }
            );
        }

        // Blog posts grid animation
        const blogPosts = document.querySelectorAll('.blog-post');
        if (blogPosts.length > 0) {
            gsap.fromTo(blogPosts,
                { opacity: 0, y: 80 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8, 
                    ease: "power2.out", 
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: '.posts-grid',
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }

        // Newsletter section animation
        const newsletter = document.querySelector('.newsletter');
        if (newsletter) {
            gsap.fromTo(newsletter,
                { opacity: 0, y: 50 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 1, 
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: newsletter,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }
    }

    // Newsletter form handling
    function initializeNewsletterForm() {
        const form = document.querySelector('.newsletter-form');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]').value;
            const button = form.querySelector('button');
            
            if (!email) return;

            // Simulate form submission
            button.textContent = 'Subscribing...';
            button.disabled = true;

            setTimeout(() => {
                button.textContent = 'Subscribed!';
                button.style.background = 'linear-gradient(135deg, #00ffa2, #00F0FF)';
                
                setTimeout(() => {
                    form.reset();
                    button.textContent = 'Subscribe';
                    button.disabled = false;
                    button.style.background = 'linear-gradient(135deg, #00F0FF, #00ffa2)';
                }, 2000);
            }, 1000);
        });
    }

    // Blog post interactions
    function initializeBlogPostInteractions() {
        const blogPosts = document.querySelectorAll('.blog-post, .featured-post');
        
        blogPosts.forEach(post => {
            // 3D hover effect
            post.addEventListener('mousemove', function(e) {
                const rect = post.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                
                const rotateX = (y - 0.5) * 10;
                const rotateY = (x - 0.5) * 10;
                
                post.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });

            post.addEventListener('mouseleave', function() {
                post.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });

            // Click animation
            post.addEventListener('click', function(e) {
                if (e.target.tagName === 'A') return; // Don't animate if clicking a link
                
                post.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(0.98)';
                
                setTimeout(() => {
                    post.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
                }, 150);
            });
        });

        // Read more button hover effects
        const readMoreLinks = document.querySelectorAll('.read-more');
        readMoreLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = 'translateX(5px)';
                }
            });

            link.addEventListener('mouseleave', function() {
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = 'translateX(0)';
                }
            });
        });
    }

    // Initialize Lenis smooth scrolling
    function initializeLenis() {
        if (typeof Lenis === 'undefined') return;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Update GSAP ScrollTrigger when Lenis updates
        lenis.on('scroll', () => {
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.update();
            }
        });
    }

    // Navigation blur effect (matching index page behavior)
    function initializeNavigationEffects() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                navLinks.forEach(otherLink => {
                    if (otherLink !== this) {
                        otherLink.classList.add('blurred');
                    }
                });
            });

            link.addEventListener('mouseleave', function() {
                navLinks.forEach(otherLink => {
                    otherLink.classList.remove('blurred');
                });
            });
        });
    }

    // Initialize navigation effects
    initializeNavigationEffects();

    // Parallax effect for hero section
    function initializeParallax() {
        const hero = document.querySelector('.blog-hero');
        if (!hero) return;

        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // Initialize parallax
    initializeParallax();

    // Category filter functionality (for future enhancement)
    function initializeCategoryFilter() {
        const categories = document.querySelectorAll('.post-category');
        const blogPosts = document.querySelectorAll('.blog-post, .featured-post');
        
        categories.forEach(category => {
            category.addEventListener('click', function(e) {
                e.preventDefault();
                const selectedCategory = this.textContent.trim();
                
                blogPosts.forEach(post => {
                    const postCategory = post.querySelector('.post-category');
                    if (postCategory && postCategory.textContent.trim() === selectedCategory) {
                        post.style.display = 'block';
                        post.style.opacity = '1';
                    } else if (selectedCategory !== 'All') {
                        post.style.opacity = '0.3';
                    } else {
                        post.style.display = 'block';
                        post.style.opacity = '1';
                    }
                });
            });
        });
    }

    // Search functionality (for future enhancement)
    function initializeSearch() {
        // This would be implemented when search functionality is needed
        console.log('Search functionality ready for implementation');
    }

    // Performance optimization
    function optimizePerformance() {
        // Lazy load images when implemented
        const images = document.querySelectorAll('img[data-src]');
        if (images.length > 0) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    // Initialize performance optimizations
    optimizePerformance();

})();
