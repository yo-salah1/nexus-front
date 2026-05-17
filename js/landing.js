/* ============================================================
   NEXUS Landing Page - JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    
    renderFeatures();
    renderTestimonials();
    renderFAQ();
    initSmoothScroll();
    
    // UI Enhancements
    init3DTilt();
    initMouseGlow();
    initCounters();
    
    console.log('✨ NEXUS Landing Page - Ready');
});



/* ============================================================
   MOBILE MENU
   ============================================================ */

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // navbar height
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}


/* ============================================================
   FEATURES DATA & RENDERING
   ============================================================ */
const featuresData = [
    {
        icon: 'brain',
        title: 'AI-Powered Insights',
        desc: 'Advanced algorithms analyze your emotions and provide personalized recommendations for your mental wellness journey.'
    },
    {
        icon: 'heart-pulse',
        title: 'Real-Time Mood Tracking',
        desc: 'Monitor your emotional state in real-time through video, audio, and text interactions with our intelligent AI.'
    },
    {
        icon: 'layers',
        title: 'Multimodal Fusion (MER)',
        desc: 'NEXUS combines facial expressions, vocal tone, and spoken words using psychology models for 99% accuracy.'
    },
    {
        icon: 'shield-check',
        title: 'Privacy First',
        desc: 'Your conversations are encrypted end-to-end. We never share your data with third parties. Your privacy is our priority.'
    },
    {
        icon: 'clock',
        title: '24/7 Availability',
        desc: 'Access support whenever you need it. Our AI companion is always ready to listen and provide guidance day or night.'
    },
    {
        icon: 'sparkles',
        title: 'Personalized Prompts',
        desc: 'Get customized conversation starters and wellness exercises tailored to your unique emotional needs and goals.'
    },
    {
        icon: 'trending-up',
        title: 'Progress Tracking',
        desc: 'Visualize your mental wellness journey with detailed analytics and insights into your emotional patterns over time.'
    }
];

function renderFeatures() {
    const grid = document.querySelector('.features-grid');
    
    featuresData.forEach(feature => {
        const card = document.createElement('div');
        card.className = 'feature-card';
        
        card.innerHTML = `
            <div class="feature-icon-wrap">
                <i data-lucide="${feature.icon}" class="feature-icon"></i>
            </div>
            <h3 class="feature-title">${feature.title}</h3>
            <p class="feature-desc">${feature.desc}</p>
        `;
        
        grid.appendChild(card);
    });
    
    lucide.createIcons();
}

/* ============================================================
   TESTIMONIALS DATA & RENDERING
   ============================================================ */
const testimonialsData = [
    {
        rating: 5,
        text: "NEXUS has completely transformed how I manage my anxiety. The AI understands me better than I expected and provides incredible support whenever I need it. It's like having a therapist available 24/7.",
        name: "Sarah Johnson",
        role: "Marketing Manager",
        initial: "S"
    },
    {
        rating: 5,
        text: "I was skeptical at first, but NEXUS proved me wrong. The personalized insights and real-time mood tracking have helped me understand my emotions better. This app is a game-changer for mental wellness.",
        name: "Michael Chen",
        role: "Software Engineer",
        initial: "M"
    },
    {
        rating: 5,
        text: "As someone who struggles with depression, finding NEXUS was life-changing. The AI is compassionate, understanding, and always available. I feel supported in ways I never have before.",
        name: "Emily Rodriguez",
        role: "Graphic Designer",
        initial: "E"
    }
];

function renderTestimonials() {
    const grid = document.querySelector('.testimonials-grid');
    
    testimonialsData.forEach(testimonial => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        
        const stars = Array(testimonial.rating).fill(0).map(() => 
            '<i data-lucide="star" class="star-icon"></i>'
        ).join('');
        
        card.innerHTML = `
            <div class="testimonial-rating">${stars}</div>
            <p class="testimonial-text">"${testimonial.text}"</p>
            <div class="testimonial-author">
                <div class="author-avatar">${testimonial.initial}</div>
                <div class="author-info">
                    <div class="author-name">${testimonial.name}</div>
                    <div class="author-role">${testimonial.role}</div>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
    
    lucide.createIcons();
}

/* ============================================================
   FAQ DATA & RENDERING
   ============================================================ */
const faqData = [
    {
        question: 'Is NEXUS really free to use?',
        answer: 'Yes! NEXUS offers a generous free plan that includes unlimited text chats, basic mood tracking, and access to our AI companion. Premium features like video/audio analysis and advanced analytics are available with our paid plans.'
    },
    {
        question: 'How does the AI understand my emotions?',
        answer: 'NEXUS uses advanced natural language processing and sentiment analysis to understand your emotional state through text, voice tone, and facial expressions (with your permission). Our AI learns from each interaction to provide increasingly personalized support.'
    },
    {
        question: 'Is my data private and secure?',
        answer: 'Absolutely. We use enterprise-grade encryption to protect all your conversations. Your data is never shared with third parties, and you have complete control over your information. You can delete your data at any time.'
    },
    {
        question: 'Can NEXUS replace my therapist?',
        answer: 'NEXUS is designed to complement professional mental health care, not replace it. While our AI provides valuable support and insights, we always recommend working with licensed mental health professionals for serious conditions.'
    },
    {
        question: 'What devices can I use NEXUS on?',
        answer: 'NEXUS works on any device with a modern web browser - desktop, tablet, or mobile. We also offer native mobile apps for iOS and Android for the best experience on the go.'
    }
];

function renderFAQ() {
    const container = document.querySelector('.faq-container');
    
    faqData.forEach((faq, index) => {
        const item = document.createElement('div');
        item.className = 'faq-item';
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-expanded', 'false');
        
        item.innerHTML = `
            <div class="faq-question-wrap">
                <div class="faq-question">${faq.question}</div>
                <i data-lucide="chevron-down" class="faq-icon"></i>
            </div>
            <div class="faq-answer-wrap">
                <p class="faq-answer">${faq.answer}</p>
            </div>
        `;
        
        const questionWrap = item.querySelector('.faq-question-wrap');
        questionWrap.addEventListener('click', () => toggleFAQ(item));
        
        // Keyboard support
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(item);
            }
        });
        
        container.appendChild(item);
    });
    
    lucide.createIcons();
}

function toggleFAQ(item) {
    const isOpen = item.classList.contains('open');
    
    // Close all FAQs
    document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('open');
        faq.setAttribute('aria-expanded', 'false');
    });
    
    // Open clicked FAQ if it was closed
    if (!isOpen) {
        item.classList.add('open');
        item.setAttribute('aria-expanded', 'true');
    }
}

/* ============================================================
   PREMIUM SCROLL ANIMATIONS (OPPO STYLE)
   ============================================================ */
function initPremiumAnimations() {
    // 1. Initial State: add reveal classes to elements
    const revealElements = document.querySelectorAll(
        '.feature-card, .testimonial-card, .faq-item, .section-title, .section-desc, .section-badge'
    );
    
    revealElements.forEach(el => el.classList.add('reveal-up'));
    
    // 2. Observer setup
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    let staggerTimeout;
    let currentDelay = 0;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply current delay and increment
                entry.target.style.transitionDelay = `${currentDelay}ms`;
                
                // Allow the browser to register the transitionDelay before adding the visible class
                setTimeout(() => {
                    entry.target.classList.add('reveal-visible');
                }, 10);
                
                observer.unobserve(entry.target);
                
                currentDelay += 150; // Stagger by 150ms
                
                // Reset stagger counter after a batch finishes
                clearTimeout(staggerTimeout);
                staggerTimeout = setTimeout(() => {
                    currentDelay = 0;
                }, 300);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => observer.observe(el));
    
    // 3. Simple Parallax on Hero elements
    const heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (heroContent && scrolled < 800) {
            heroContent.style.transform = `translateY(${scrolled * 0.4}px) scale(${1 - scrolled*0.0005})`;
            heroContent.style.opacity = 1 - (scrolled * 0.002);
        }
    }, { passive: true });
}

initPremiumAnimations();

/* ============================================================
   NUMBER COUNTER ANIMATION
   ============================================================ */
function initCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const targetText = stat.innerText;
        const targetNumber = parseInt(targetText.replace(/\D/g, ''));
        const hasPercentage = targetText.includes('%');
        
        // Ignore non-numeric strings like "24/7"
        if (isNaN(targetNumber) || targetText.includes('24/7')) return;
        
        let currentNumber = 0;
        // Increase speed at the start, slow down at the end (ease-out logic simplified)
        const duration = 1500; 
        const stepTime = Math.max(10, Math.floor(duration / targetNumber));
        
        stat.innerText = hasPercentage ? '0%' : '0';
        
        // Wait for the hero staggered animation to finish before counting
        setTimeout(() => {
            const timer = setInterval(() => {
                currentNumber += 1;
                stat.innerText = hasPercentage ? `${currentNumber}%` : currentNumber;
                
                if (currentNumber >= targetNumber) {
                    clearInterval(timer);
                    stat.innerText = targetText; // Restore exact original text just in case
                }
            }, stepTime);
        }, 800); // 800ms delay matches the staggered entry
    });
}

/* ============================================================
   KEYBOARD SHORTCUTS
   ============================================================ */
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search or CTA
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.cta-primary').focus();
    }
    
    // Escape to close mobile menu
    if (e.key === 'Escape') {
        document.getElementById('mobileNav').classList.remove('active');
    }
});

/* ============================================================
   PERFORMANCE OPTIMIZATION
   ============================================================ */
// Lazy load images when they come into view
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Debounce scroll events for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = window.requestAnimationFrame(() => {
        // Scroll-based animations can go here
    });
}, { passive: true });

console.log('🚀 Landing page fully loaded and optimized');

/* ============================================================
   3D TILT EFFECT & MOUSE INTERACTION
   ============================================================ */
function init3DTilt() {
    const cards = document.querySelectorAll('.feature-card, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate subtle tilt (max 3 degrees)
            const rotateX = ((y - centerY) / centerY) * -3; 
            const rotateY = ((x - centerX) / centerX) * 3;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none'; // Remove transition during move for instant response
        });
    });
}

function initMouseGlow() {
    // Create the glow element
    const glow = document.createElement('div');
    glow.className = 'mouse-glow';
    document.body.appendChild(glow);
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Subtle ambient trailing animation
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        glow.style.transform = `translate(${glowX}px, ${glowY}px)`;
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
}
