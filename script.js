document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

function initializePortfolio() {
    console.log('Portfolio initializing...');
    
    try {
        initLoadingScreen();
        initNavigation();
        initScrollEffects();
        initTypingEffect();
        initContactForm();
        initBackToTop();
        initAnimations();
        
        console.log('Portfolio initialized successfully');
    } catch (error) {
        console.error('Error initializing portfolio:', error);
    }
}

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    if (!loadingScreen) {
        console.warn('Loading screen element not found');
        return;
    }
    
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        
        setTimeout(() => {
            if (loadingScreen && loadingScreen.parentNode) {
                loadingScreen.remove();
            }
        }, 500);
    }, 2000);
}

// Navigation
// FIXED JavaScript - Add this to your adaptive-script.js
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle (keep existing code)
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isActive = navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = isActive ? 'hidden' : '';
        });
    }
    
    // SMART LINK HANDLING - This is the key fix!
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const target = link.getAttribute('target');
            
            // If it's a new tab link (target="_blank") or external file, let browser handle it
            if (target === '_blank' || href.endsWith('.html')) {
                // Don't prevent default - let new tab open normally
                return;
            }
            
            // Only prevent default for internal anchor links (#section)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                const targetSection = document.querySelector(href);
                if (targetSection && navbar) {
                    const navHeight = navbar.offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
                
                // Update active link for internal links only
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
            
            // Close mobile menu after click
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });
    
    function closeMobileMenu() {
        if (navToggle) navToggle.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function handleNavLinkClick(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu
            closeMobileMenu();
            
            // Update active link
            updateActiveNavLink(this);
        }
    }
    
    function updateActiveNavLink(activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

// Scroll Effects
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    
    if (!navbar) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNavbar() {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class for styling
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll (desktop only)
        if (window.innerWidth > 768) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    function updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const navHeight = navbar ? navbar.offsetHeight : 80;
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Throttled scroll event
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateNavbar();
                updateActiveSection();
            });
            ticking = true;
        }
    }, { passive: true });
}

// Typing Effect
function initTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    const cursor = document.querySelector('.cursor');
    
    if (!typingText) return;
    
    const texts = [
        'Data Analyst',
        'Software Engineer',
        'Python Developer',
        'AI/ML Enthusiast', 
        'Problem Solver'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeWriter() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            setTimeout(() => { isDeleting = true; }, 1000);
            typingSpeed = 50;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 100;
        }
        
        setTimeout(typeWriter, typingSpeed);
    }
    
    // Start typing animation
    typeWriter();
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    /*
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();  // ← This BREAKS Web3Forms!
    
    // ... all this code prevents Web3Forms from working
    // ... remove or comment out everything inside this function
});
*/
    
    // Form validation
    /*
const inputs = contactForm.querySelectorAll('input, select, textarea');
inputs.forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('input', clearValidation);
});
*/
    
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text') || submitBtn;
        const btnIcon = submitBtn.querySelector('.btn-icon');
        
        // Show loading state
        submitBtn.disabled = true;
        const originalText = btnText.textContent;
        btnText.textContent = 'Sending...';
        
        if (btnIcon) {
            btnIcon.className = 'fas fa-spinner fa-spin btn-icon';
        }
        
        try {
            // Simulate form submission (replace with actual form handler)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success state
            btnText.textContent = 'Message Sent!';
            if (btnIcon) {
                btnIcon.className = 'fas fa-check btn-icon';
            }
            
            contactForm.reset();
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            
        } catch (error) {
            // Error state
            btnText.textContent = 'Send Failed';
            if (btnIcon) {
                btnIcon.className = 'fas fa-exclamation-triangle btn-icon';
            }
            
            showNotification('Failed to send message. Please try again.', 'error');
        }
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.disabled = false;
            btnText.textContent = originalText;
            if (btnIcon) {
                btnIcon.className = 'fas fa-paper-plane btn-icon';
            }
        }, 3000);
    }
    
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Remove existing validation classes
        field.classList.remove('valid', 'invalid');
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(value)) {
                field.classList.add('valid');
            } else {
                field.classList.add('invalid');
            }
        }
        
        // Required field validation
        if (field.hasAttribute('required')) {
            if (value) {
                field.classList.add('valid');
            } else {
                field.classList.add('invalid');
            }
        }
    }
    
    function clearValidation(e) {
        e.target.classList.remove('invalid');
    }
}

// Back to Top Button
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (!backToTopBtn) return;
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, { passive: true });
    
    // Smooth scroll to top
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add staggered animations for children
                if (entry.target.classList.contains('stagger-children')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate-in');
                        }, index * 100);
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll([
        '.hero-content',
        '.hero-image', 
        '.section-header',
        '.skill-card',
        '.cert-card',
        '.project-card',
        '.contact-item',
        '.detail-item'
    ].join(','));
    
    animatedElements.forEach(el => {
        if (el) observer.observe(el);
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${iconMap[type] || iconMap.info}"></i>
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles if not already present
    if (!document.querySelector('#notification-styles')) {
        addNotificationStyles();
    }
    
    document.body.appendChild(notification);
    
    // Trigger animation
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => hideNotification(notification));
    
    // Auto-hide after 5 seconds
    setTimeout(() => hideNotification(notification), 5000);
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

function addNotificationStyles() {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-surface);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-xl);
            border: 1px solid var(--color-border-light);
            z-index: 9999;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 400px;
            min-width: 300px;
        }
        
        .notification.show {
            opacity: 1;
            transform: translateX(0);
        }
        
        .notification-success {
            border-left: 4px solid var(--color-success);
        }
        
        .notification-error {
            border-left: 4px solid var(--color-error);
        }
        
        .notification-warning {
            border-left: 4px solid var(--color-warning);
        }
        
        .notification-info {
            border-left: 4px solid var(--color-primary);
        }
        
        .notification-content {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .notification-content i:first-child {
            font-size: 18px;
            color: var(--color-primary);
        }
        
        .notification-success .notification-content i:first-child {
            color: var(--color-success);
        }
        
        .notification-error .notification-content i:first-child {
            color: var(--color-error);
        }
        
        .notification-warning .notification-content i:first-child {
            color: var(--color-warning);
        }
        
        .notification-message {
            flex: 1;
            font-weight: 500;
            color: var(--color-text-primary);
            line-height: 1.5;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 14px;
            cursor: pointer;
            color: var(--color-text-secondary);
            padding: 4px;
            border-radius: var(--radius-base);
            transition: all 0.15s;
        }
        
        .notification-close:hover {
            color: var(--color-text-primary);
            background: var(--color-surface-elevated);
        }
    `;
    
    document.head.appendChild(style);
}

// Debounce utility
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle utility
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    
    // Show error notification only in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        showNotification(`Error: ${e.error.message}`, 'error');
    }
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// Performance measurement utility
function measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${(end - start).toFixed(2)} milliseconds`);
    return result;
}

// Export utilities for global use
window.PortfolioUtils = {
    showNotification,
    debounce,
    throttle,
    measurePerformance
};

// Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
    initializePortfolio();
}