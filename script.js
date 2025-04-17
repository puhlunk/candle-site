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
    
    // Scroll reveal animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
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
    
    // Add delay classes to specific elements
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.classList.add(`fade-in-delay-${(index % 3) + 1}`);
    });
    
    const processSteps = document.querySelectorAll('.process-step');
    processSteps.forEach((step, index) => {
        step.classList.add(`fade-in-delay-${(index % 4) + 1}`);
    });
    
    // Observe all elements
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
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
        
        // Add hover effect to product cards
        const productCard = button.closest('.product-card');
        if (productCard) {
            productCard.addEventListener('mouseenter', function() {
                this.querySelector('.product-image').style.transform = 'scale(1.02)';
                this.querySelector('.product-image').style.transition = 'transform 0.3s ease';
            });
            
            productCard.addEventListener('mouseleave', function() {
                this.querySelector('.product-image').style.transform = 'scale(1)';
            });
        }
    });
    
    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            hero.style.backgroundPositionY = `${scrollPosition * 0.4}px`;
        });
    }
    
    // Add smooth transition on page load
    window.addEventListener('load', function() {
        document.body.classList.add('page-loaded');
        
        // Add animation to hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
                heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            }, 200);
        }
    });
});