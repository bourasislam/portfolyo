const clients = [
    { name: "Ahmed Mohamed", company: "Digital Marketing Agency", text: "Islam's editing transformed our content completely. The quality and professionalism exceeded our expectations. Highly recommended!" },
    { name: "Fatima Bentaleb", company: "Content Creator", text: "Working with Islam was amazing. His attention to detail and creative approach brought my vision to life. I'll definitely hire him again!" },
    { name: "Mohammed Hassan", company: "E-commerce Business", text: "Professional and timely delivery. The videos increased our engagement by 300%. Worth every penny!" },
    { name: "Layla Ibrahim", company: "Beauty Brand", text: "Islam created stunning reels for our campaign. The creativity and execution were outstanding!" }
];

let currentTestimonialPage = 0;
const testimonialPerPage = 2;

document.addEventListener('DOMContentLoaded', function() {
    initializeHamburger();
    initializeFormValidation();
    initializeStarRating();
    initializeSmoothScroll();
    initializeScrollAnimations();
    initializeCounterAnimation();
    initializeFooterSocialAnimations();
    initializeCertificateModal();
    initializeBackgroundOrbs();
    addParticleAnimation();
    initializeTestimonials();
});

function initializeTestimonials() {
    renderTestimonials();
    
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentTestimonialPage = (currentTestimonialPage - 1 + Math.ceil(clients.length / testimonialPerPage)) % Math.ceil(clients.length / testimonialPerPage);
            renderTestimonials();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentTestimonialPage = (currentTestimonialPage + 1) % Math.ceil(clients.length / testimonialPerPage);
            renderTestimonials();
        });
    }
}

function renderTestimonials() {
    const container = document.querySelector('.testimonials-content');
    if (!container) return;
    
    const startIndex = currentTestimonialPage * testimonialPerPage;
    const endIndex = startIndex + testimonialPerPage;
    const pageClients = clients.slice(startIndex, endIndex);
    
    container.innerHTML = pageClients.map((client, index) => `
        <div class="testimonial-card">
            <div class="testimonial-header">
                <img src="https://i.pravatar.cc/60?u=${client.name}" alt="${client.name}">
                <div class="testimonial-author">
                    <h4>${client.name}</h4>
                    <p>${client.company}</p>
                </div>
            </div>
            <div class="testimonial-rating">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
            </div>
            <p class="testimonial-text">"${client.text}"</p>
        </div>
    `).join('');
    
    updatePaginationButtons();
}

function updatePaginationButtons() {
    const totalPages = Math.ceil(clients.length / testimonialPerPage);
    const pageInfo = document.getElementById('testimonialPageInfo');
    if (pageInfo) {
        pageInfo.textContent = `${currentTestimonialPage + 1} / ${totalPages}`;
    }
}

function initializeHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        document.addEventListener('click', function(event) {
            if (!event.target.closest('.navbar')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
}

function initializeFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateContactForm()) {
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    service: document.getElementById('service').value,
                    message: document.getElementById('details').value
                };

                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';

                fetch('https://script.google.com/macros/s/AKfycbziRhdse5RJuDU3naFMmtsI73x-tSL5T4897ebQ13TGHqIILmOCeD0djFZwtNFE-BU3eg/exec', {
                    method: 'POST',
                    mode: 'no-cors',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                }).then(() => {
                    showSuccessMessage('contactForm', 'Thank you! Your message has been sent successfully.');
                    contactForm.reset();
                    setTimeout(() => {
                        contactForm.style.display = 'flex';
                    }, 2000);
                }).catch(error => {
                    console.error('Error:', error);
                    alert('Something went wrong. Please try again or contact via WhatsApp.');
                }).finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                });
            }
        });
    }

    const ratingForm = document.getElementById('ratingForm');
    if (ratingForm) {
        ratingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateRatingForm()) {
                showSuccessMessage('ratingForm', 'Thank you for your feedback!');
                ratingForm.reset();
                document.querySelectorAll('.star-rating i').forEach(star => {
                    star.classList.remove('active');
                });
                setTimeout(() => {
                    ratingForm.style.display = 'flex';
                }, 2000);
            }
        });
    }
}

function validateContactForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const service = document.getElementById('service').value;
    const details = document.getElementById('details').value.trim();

    if (!name) {
        showError('name', 'Name is required');
        return false;
    }

    if (!isValidEmail(email)) {
        showError('email', 'Please enter a valid email');
        return false;
    }

    if (!service) {
        showError('service', 'Please select a service');
        return false;
    }

    if (!details) {
        showError('details', 'Please provide service details');
        return false;
    }

    clearErrors();
    return true;
}

function validateRatingForm() {
    const reviewText = document.getElementById('reviewText').value.trim();
    const ratingValue = document.querySelector('.star-rating i.active');

    if (!ratingValue) {
        showError('ratingForm', 'Please select a rating');
        return false;
    }

    if (!reviewText) {
        showError('reviewText', 'Please share your feedback');
        return false;
    }

    clearErrors();
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.style.borderColor = '#ff0000';
        let errorMsg = field.nextElementSibling;
        if (!errorMsg || !errorMsg.classList.contains('error-message')) {
            errorMsg = document.createElement('small');
            errorMsg.classList.add('error-message');
            errorMsg.style.color = '#ff0000';
            errorMsg.style.display = 'block';
            errorMsg.style.marginTop = '0.3rem';
            field.parentNode.insertBefore(errorMsg, field.nextSibling);
        }
        errorMsg.textContent = message;
    }
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(msg => {
        msg.remove();
    });
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.style.borderColor = '';
    });
}

function showSuccessMessage(formId, message) {
    const form = document.getElementById(formId);
    if (form) {
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            background-color: #25d366;
            color: white;
            padding: 1rem;
            border-radius: 5px;
            margin-bottom: 1rem;
            text-align: center;
            font-weight: 600;
            animation: slideIn 0.3s ease;
        `;
        successMsg.textContent = message;
        form.parentNode.insertBefore(successMsg, form);
        form.style.display = 'none';

        setTimeout(() => {
            successMsg.remove();
        }, 3000);
    }
}

function initializeStarRating() {
    const stars = document.querySelectorAll('.star-rating i');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            stars.forEach(s => {
                if (s.getAttribute('data-rating') <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });

        star.addEventListener('mouseenter', function() {
            const rating = this.getAttribute('data-rating');
            stars.forEach(s => {
                if (s.getAttribute('data-rating') <= rating) {
                    s.style.color = '#0066ff';
                } else {
                    s.style.color = '#333333';
                }
            });
        });
    });

    const ratingContainer = document.querySelector('.star-rating');
    if (ratingContainer) {
        ratingContainer.addEventListener('mouseleave', function() {
            stars.forEach(star => {
                if (star.classList.contains('active')) {
                    star.style.color = '#0066ff';
                } else {
                    star.style.color = '#333333';
                }
            });
        });
    }
}

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const offsetTop = target.offsetTop - 60;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                const iconWrapper = entry.target.querySelector('.focus-card-icon-wrapper, .service-icon, .skill-icon');
                if (iconWrapper) {
                    iconWrapper.style.animation = 'iconScaleIn 0.8s ease-out forwards';
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skill-card, .portfolio-item, .testimonial-card, .stat, .focus-item, .focus-card, .service-card, .certificate-item').forEach(el => {
        observer.observe(el);
    });
}

function initializeCounterAnimation() {
    const observerOptions = {
        threshold: 0.3
    };

    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(number => {
                    if (!number.classList.contains('animated')) {
                        animateCounter(number);
                        number.classList.add('animated');
                    }
                });
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const aboutStats = document.querySelector('.about-stats');
    if (aboutStats) {
        counterObserver.observe(aboutStats);
    }
}

function animateCounter(element) {
    const targetValue = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    let startTime = null;

    function update(currentTime) {
        if (startTime === null) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = Math.floor(progress * targetValue);
        element.textContent = currentValue + '+';
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function initializeFooterSocialAnimations() {
    const socialLinks = document.querySelectorAll('.footer-social a');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.animation = 'socialFloat 0.6s ease-in-out';
        });
    });
}

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

function initializeCertificateModal() {
    const viewButtons = document.querySelectorAll('.view-btn');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const img = this.closest('.certificate-image').querySelector('img');
            const src = img.src;
            const alt = img.alt;
            
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                animation: fadeIn 0.3s ease-out;
            `;
            
            const content = document.createElement('div');
            content.style.cssText = `
                max-width: 90%;
                max-height: 90vh;
                position: relative;
                animation: scaleIn 0.3s ease-out;
            `;
            
            const image = document.createElement('img');
            image.src = src;
            image.alt = alt;
            image.style.cssText = `
                max-width: 100%;
                max-height: 100%;
                border-radius: 10px;
            `;
            
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&times;';
            closeBtn.style.cssText = `
                position: absolute;
                top: -40px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 40px;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            
            closeBtn.addEventListener('mouseover', function() {
                this.style.color = '#0066ff';
                this.style.transform = 'scale(1.2)';
            });
            
            closeBtn.addEventListener('mouseout', function() {
                this.style.color = 'white';
                this.style.transform = 'scale(1)';
            });
            
            closeBtn.addEventListener('click', function() {
                modal.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => modal.remove(), 300);
            });
            
            content.appendChild(image);
            content.appendChild(closeBtn);
            modal.appendChild(content);
            
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.animation = 'fadeOut 0.3s ease-out';
                    setTimeout(() => modal.remove(), 300);
                }
            });
            
            document.body.appendChild(modal);
        });
    });
}

function initializeBackgroundOrbs() {
    if (document.querySelectorAll('.background-orb').length > 0) {
        return;
    }
    
    const orbClasses = ['orb-1', 'orb-2', 'orb-3'];
    
    orbClasses.forEach((orbClass) => {
        const orb = document.createElement('div');
        orb.className = `background-orb ${orbClass}`;
        document.body.appendChild(orb);
    });
}

function addParticleAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatingParticle {
            0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
            25% { transform: translateY(-30px) translateX(25px); opacity: 0.5; }
            50% { transform: translateY(-60px) translateX(0px); opacity: 0.3; }
            75% { transform: translateY(-30px) translateX(-25px); opacity: 0.5; }
        }
        
        @keyframes floatingParticleSlow {
            0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.15; }
            33% { transform: translateY(-40px) translateX(30px); opacity: 0.4; }
            66% { transform: translateY(-20px) translateX(-30px); opacity: 0.25; }
        }
        
        @keyframes floatingParticleFast {
            0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.25; }
            20% { transform: translateY(-15px) translateX(15px); opacity: 0.6; }
            40% { transform: translateY(-35px) translateX(0px); opacity: 0.35; }
            60% { transform: translateY(-25px) translateX(-20px); opacity: 0.55; }
            80% { transform: translateY(-10px) translateX(10px); opacity: 0.3; }
        }
        
        .floating-particle {
            position: fixed;
            background-color: rgba(0, 102, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            box-shadow: 0 0 10px rgba(0, 102, 255, 0.3);
        }
    `;
    document.head.appendChild(style);
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        const randomType = Math.random();
        let size, duration, animationType;
        
        if (randomType < 0.5) {
            size = 2 + Math.random() * 4;
            duration = 6 + Math.random() * 4;
            animationType = 'floatingParticle';
        } else if (randomType < 0.75) {
            size = 1 + Math.random() * 3;
            duration = 8 + Math.random() * 6;
            animationType = 'floatingParticleSlow';
        } else {
            size = 3 + Math.random() * 5;
            duration = 4 + Math.random() * 3;
            animationType = 'floatingParticleFast';
        }
        
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.animation = `${animationType} ${duration}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        document.body.appendChild(particle);
        
        const lifetime = duration * 1000 + 2000 + Math.random() * 3000;
        setTimeout(() => {
            particle.remove();
        }, lifetime);
    }
    
    for (let i = 0; i < 15; i++) {
        setTimeout(createParticle, i * 100);
    }
    
    setInterval(createParticle, 800);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes socialFloat {
        0%, 100% {
            transform: translateY(0) scale(1);
        }
        50% {
            transform: translateY(-10px) scale(1.2);
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
