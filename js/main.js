// ===================================
// Lagoon Marketing - Main JavaScript
// Gulf Shores, Alabama
// ===================================

(function() {
    'use strict';

    // ===================================
    // Mobile Navigation Toggle
    // ===================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');

            // Animate hamburger icon
            this.classList.toggle('active');

            // Update aria-expanded for accessibility
            const isExpanded = navMenu.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggle = mobileMenuToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ===================================
    // Smooth Scrolling for Anchor Links
    // ===================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Ignore empty hash links
            if (href === '#' || href === '#!') return;

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();

                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL hash
                history.pushState(null, null, href);
            }
        });
    });

    // ===================================
    // Contact Form Validation & Submission
    // ===================================
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Clear previous errors
            clearFormErrors();

            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                business: document.getElementById('business').value.trim(),
                city: document.getElementById('city').value,
                service: document.getElementById('service').value,
                budget: document.getElementById('budget').value,
                message: document.getElementById('message').value.trim()
            };

            // Validate form
            let isValid = true;

            // Validate name
            if (formData.name === '') {
                showError('name', 'Please enter your full name');
                isValid = false;
            }

            // Validate email
            if (formData.email === '') {
                showError('email', 'Please enter your email address');
                isValid = false;
            } else if (!isValidEmail(formData.email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            }

            // Validate phone (optional but if provided, should be valid)
            if (formData.phone !== '' && !isValidPhone(formData.phone)) {
                showError('phone', 'Please enter a valid phone number');
                isValid = false;
            }

            // Validate message
            if (formData.message === '') {
                showError('message', 'Please tell us about your project');
                isValid = false;
            } else if (formData.message.length < 10) {
                showError('message', 'Please provide more details (at least 10 characters)');
                isValid = false;
            }

            // If form is valid, submit
            if (isValid) {
                submitForm(formData);
            } else {
                // Scroll to first error
                const firstError = document.querySelector('.error-message:not(:empty)');
                if (firstError) {
                    const errorField = firstError.previousElementSibling;
                    if (errorField) {
                        errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        errorField.focus();
                    }
                }
            }
        });
    }

    function clearFormErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => {
            error.textContent = '';
        });

        const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
        inputs.forEach(input => {
            input.style.borderColor = '';
        });
    }

    function showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + '-error');
        const inputElement = document.getElementById(fieldId);

        if (errorElement) {
            errorElement.textContent = message;
        }

        if (inputElement) {
            inputElement.style.borderColor = '#FF6B6B';
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        // Remove all non-numeric characters
        const cleanPhone = phone.replace(/\D/g, '');
        // Check if it's a valid US phone number (10 digits)
        return cleanPhone.length === 10 || cleanPhone.length === 11;
    }

    function submitForm(formData) {
        const submitButton = contactForm.querySelector('.submit-button');
        const successMessage = document.getElementById('form-success');
        const errorMessage = document.getElementById('form-error');

        // Disable submit button
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // For demo purposes, we'll show success
            // In production, you would send this to your backend API
            console.log('Form Data:', formData);

            // Show success message
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';

            // Reset form
            contactForm.reset();

            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';

            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Hide success message after 10 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 10000);

            // In case of error, you would do:
            // errorMessage.style.display = 'block';
            // successMessage.style.display = 'none';
            // submitButton.disabled = false;
            // submitButton.textContent = 'Send Message';
        }, 1500);
    }

    // ===================================
    // Header Scroll Effect
    // ===================================
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        }

        lastScrollTop = scrollTop;
    });

    // ===================================
    // Intersection Observer for Animations
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for fade-in animation
    const animatedElements = document.querySelectorAll('.feature-card, .service-card, .city-card, .benefit-item, .faq-item');

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // ===================================
    // Active Page Highlighting
    // ===================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

    // ===================================
    // Form Input Focus Effects
    // ===================================
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');

    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');

            // Clear error on input
            if (this.value.trim() !== '') {
                const errorElement = document.getElementById(this.id + '-error');
                if (errorElement) {
                    errorElement.textContent = '';
                }
                this.style.borderColor = '';
            }
        });
    });

    // ===================================
    // Phone Number Formatting
    // ===================================
    const phoneInput = document.getElementById('phone');

    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }

            e.target.value = value;
        });
    }

    // ===================================
    // Lazy Loading Images (if any are added)
    // ===================================
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // ===================================
    // Accessibility: Skip to Main Content
    // ===================================
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.position = 'absolute';
    skipLink.style.top = '10px';
    skipLink.style.left = '10px';
    skipLink.style.zIndex = '9999';
    skipLink.addEventListener('focus', function() {
        this.style.position = 'static';
    });
    skipLink.addEventListener('blur', function() {
        this.style.position = 'absolute';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);

    // ===================================
    // Console Message
    // ===================================
    console.log('%c🌊 Lagoon Marketing - Gulf Shores, AL', 'color: #00A9CE; font-size: 20px; font-weight: bold;');
    console.log('%cMaking waves in digital marketing since 2024', 'color: #006994; font-size: 14px;');
    console.log('%cInterested in working with us? Visit /contact.html', 'color: #6C757D; font-size: 12px;');

    // ===================================
    // Performance Monitoring
    // ===================================
    window.addEventListener('load', function() {
        if ('performance' in window) {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

            console.log(`⚡ Page loaded in ${pageLoadTime}ms`);

            // You could send this data to your analytics service
            // analytics.track('page_load_time', { duration: pageLoadTime });
        }
    });

    // ===================================
    // Print Styles Helper
    // ===================================
    window.addEventListener('beforeprint', function() {
        console.log('Preparing page for printing...');
        // Any print-specific JS modifications can go here
    });

    window.addEventListener('afterprint', function() {
        console.log('Print operation completed');
    });

})();
