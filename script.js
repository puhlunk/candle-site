// Preload critical resources
const preloadResources = () => {
    // Preload fonts
    const fontPreloads = [
        'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Montserrat:wght@300;400;500;600&display=swap'
    ];
    
    fontPreloads.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
};

// Initialize performance optimizations before DOM is fully loaded
preloadResources();

// Wait for initial render to complete before enabling animations
let animationsEnabled = false;
setTimeout(() => {
    animationsEnabled = true;
}, 300);

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
    
    // Header scroll effect
    const header = document.querySelector('.site-header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
        
        lastScrollY = window.scrollY;
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Image optimization
    function optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Set initial opacity to 0
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            
            // Show image when loaded
            if (img.complete) {
                setTimeout(() => {
                    img.style.opacity = '1';
                }, 50);
            } else {
                img.addEventListener('load', function() {
                    setTimeout(() => {
                        img.style.opacity = '1';
                    }, 50);
                });
            }
            
            // Add loading attribute for native lazy loading
            img.setAttribute('loading', 'lazy');
            
            // Add decoding attribute for performance
            img.setAttribute('decoding', 'async');
        });
    }
    
    // Run image optimization after a small delay
    setTimeout(optimizeImages, 100);
    
    // Scroll reveal animations - improved to prevent jitter
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && animationsEnabled) {
                // Add a small staggered delay before adding animation class
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, 50);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elements to animate on scroll
    const animateElements = [
        ...document.querySelectorAll('.section-title'),
        ...document.querySelectorAll('.section-subtitle'),
        ...document.querySelectorAll('.product-card'),
        ...document.querySelectorAll('.process-step'),
        ...document.querySelectorAll('.story-content'),
        ...document.querySelectorAll('.story-image'),
        ...document.querySelectorAll('.materials-content'),
        ...document.querySelectorAll('.materials-image'),
        ...document.querySelectorAll('.newsletter-form'),
        ...document.querySelectorAll('.contact-info'),
        ...document.querySelectorAll('.contact-form')
    ];
    
    // Add delay classes to specific elements - with reduced animation timing
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        // Set initial opacity in CSS to prevent flash
        card.style.opacity = '0';
        card.classList.add(`fade-in-delay-${(index % 3) + 1}`);
    });
    
    const processSteps = document.querySelectorAll('.process-step');
    processSteps.forEach((step, index) => {
        // Set initial opacity in CSS to prevent flash
        step.style.opacity = '0';
        step.classList.add(`fade-in-delay-${(index % 4) + 1}`);
    });
    
    // Observe all elements - with delay to ensure DOM is settled
    setTimeout(() => {
        animateElements.forEach(element => {
            observer.observe(element);
        });
    }, 150);
    
    // Product hover effects - with optimized handlers
    const applyProductCardEffects = () => {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const image = card.querySelector('.product-image');
            
            card.addEventListener('mouseenter', () => {
                requestAnimationFrame(() => {
                    if (image) {
                        image.style.transform = 'scale(1.02)';
                        image.style.transition = 'transform 0.3s ease';
                    }
                });
            });
            
            card.addEventListener('mouseleave', () => {
                requestAnimationFrame(() => {
                    if (image) {
                        image.style.transform = 'scale(1)';
                    }
                });
            });
        });
    };
    
    // Apply product card effects
    setTimeout(applyProductCardEffects, 200);
    
    // Form submissions
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (isValidEmail(email)) {
                // Simulate successful subscription
                emailInput.value = '';
                showToast('Thank you for subscribing!', 'success');
            } else {
                showToast('Please enter a valid email address.', 'error');
            }
        });
    }
    
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = this.querySelector('#name');
            const emailInput = this.querySelector('#email');
            const subjectInput = this.querySelector('#subject');
            const messageInput = this.querySelector('#message');
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const subject = subjectInput.value.trim();
            const message = messageInput.value.trim();
            
            if (name && isValidEmail(email) && subject && message) {
                // Simulate successful form submission
                nameInput.value = '';
                emailInput.value = '';
                subjectInput.value = '';
                messageInput.value = '';
                
                showToast('Your message has been sent. We\'ll get back to you soon!', 'success');
            } else {
                showToast('Please fill in all fields correctly.', 'error');
            }
        });
    }
    
    // Helper functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showToast(message, type = 'info') {
        // Check if a toast container exists, create one if not
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
            
            // Add toast container styles
            const style = document.createElement('style');
            style.textContent = `
                .toast-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999;
                }
                .toast {
                    padding: 12px 20px;
                    margin-bottom: 10px;
                    border-radius: 4px;
                    color: white;
                    font-size: 14px;
                    opacity: 0;
                    transform: translateY(20px);
                    animation: toast-in 0.3s ease forwards;
                    max-width: 300px;
                }
                .toast.success {
                    background-color: #4caf50;
                }
                .toast.error {
                    background-color: #f44336;
                }
                .toast.info {
                    background-color: #2196f3;
                }
                @keyframes toast-in {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    // Product button interactions
    const productButtons = document.querySelectorAll('.product-btn');
    productButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productTitle = this.closest('.product-card').querySelector('.product-title').textContent;
            
            // Button animation
            this.innerHTML = '<span>Added ✓</span>';
            this.classList.add('success-btn');
            
            setTimeout(() => {
                this.innerHTML = 'View Details';
                this.classList.remove('success-btn');
            }, 1500);
            
            showToast(`${productTitle} added to cart!`, 'success');
        });
    });
    
    // Optimized parallax effect for hero section using requestAnimationFrame
    const hero = document.querySelector('.hero');
    if (hero) {
        let ticking = false;
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    const scrollPosition = window.scrollY;
                    if (hero.style) {
                        hero.style.backgroundPositionY = `${scrollPosition * 0.3}px`;
                    }
                    ticking = false;
                });
                
                ticking = true;
            }
        });
    }
});

// Optimized page load transitions with performance timing
window.addEventListener('load', function() {
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
        // Add page-loaded class to body for initial fade-in
        document.body.classList.add('page-loaded');
        
        // Animate hero content with smoother timing
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            // Set initial state
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(20px)';
            
            // Trigger animation after layout is stable
            requestAnimationFrame(() => {
                // Add transition properties first
                heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                
                // Force a reflow before changing properties
                heroContent.offsetHeight;
                
                // Then change the properties to animate
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            });
        }
        
        // Add performance optimization hints to browser
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.setAttribute('rel', 'prerender');
        });
    });
});