/* ============================================================
   NEXUS About Us Page - JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    initParticles();
    renderValues();
    renderTeam();
    initSmoothScroll();

    console.log('✨ NEXUS About Us Page - Ready');
});

/* ============================================================
   NAVBAR
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
                const offset = 80;
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
   PARTICLE ANIMATION
   ============================================================ */
function initParticles() {
    createParticleAnimation('heroParticles');
    createParticleAnimation('ctaParticles');
}

function createParticleAnimation(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 25 : 50;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedY: Math.random() * 0.5 + 0.2,
            opacity: Math.random() * 0.5 + 0.3
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            p.y -= p.speedY;
            if (p.y < -10) {
                p.y = canvas.height + 10;
                p.x = Math.random() * canvas.width;
            }
        });

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    });
}

/* ============================================================
   CORE VALUES DATA & RENDERING
   ============================================================ */
const valuesData = [
    {
        icon: 'heart',
        title: 'Empathy First',
        desc: 'We build technology with compassion at its core, always prioritizing human connection and understanding.'
    },
    {
        icon: 'shield-check',
        title: 'Privacy & Trust',
        desc: 'Your data is yours alone. We maintain the highest standards of security and never compromise on privacy.'
    },
    {
        icon: 'trending-up',
        title: 'Continuous Innovation',
        desc: 'We push the boundaries of AI technology to deliver better, smarter, and more personalized mental health support.'
    },
    {
        icon: 'users',
        title: 'Accessibility for All',
        desc: 'Mental health support should be available to everyone, regardless of location, language, or financial situation.'
    }
];

function renderValues() {
    const grid = document.querySelector('.values-grid');

    valuesData.forEach(value => {
        const card = document.createElement('div');
        card.className = 'value-card';

        card.innerHTML = `
            <div class="value-icon-wrap">
                <i data-lucide="${value.icon}" class="value-icon"></i>
            </div>
            <h3 class="value-title">${value.title}</h3>
            <p class="value-desc">${value.desc}</p>
        `;

        grid.appendChild(card);
    });

    lucide.createIcons();
}

/* ============================================================
   TEAM DATA & RENDERING
   ============================================================ */
const teamData = [
    {
        name: 'Seba Ahmed',
        role: 'Front-End Design',
        initial: 'S',
        bio: "Front-End Design",
        social: {
            linkedin: 'https://www.linkedin.com/in/sebaa-ahmed-2747a7286',
            email: 'sebaa7025@gmail.com'
        }

    },
    {
        name: 'Yousif Salah',
        role: 'AI',
        initial: 'YS',
        bio: "AI",
        social: {
            linkedin: 'https://www.linkedin.com/in/yousif-salah/',
            email: 'yosalah100@gmail.com'
        }

    },
    {
        name: 'Nada Hassan',
        role: 'Front-End Design',
        initial: 'N',
        bio: "Front-End Design",
        social: {
            linkedin: 'https://www.linkedin.com/in/nada-hassan-294102378',
            email: 'nadahassann227@gmail.com'
        }
    },
    {
        name: 'Shahd Gamal',
        role: 'Back-End',
        initial: 'E',
        bio: "Back-End",
        social: {
            linkedin: 'https://www.linkedin.com/in/shahd-gamal-1a727424a',
            email: 'shahdg999@gmail.com'
        }

    },
    {
        name: 'Ahmed Seif',
        role: 'BACK-END',
        initial: 'A',
        bio: "BACK-END",
        social: {
            linkedin: 'https://www.linkedin.com/in/ahmed-seif-225436311',
            email: 'seif86166@gmail.com'
        }

    },
    {
        name: 'Nada Ahmed',
        role: 'UI/UX',
        initial: 'N',
        bio: "Ui/Ux",
        social: {
            linkedin: 'https://www.linkedin.com/in/nada-abdel-salam-234b79315',
            email: 'na0089259@gmail.com'
        }

    }
];

function renderTeam() {
    const grid = document.querySelector('.team-grid');

    teamData.forEach(member => {
        const card = document.createElement('div');
        card.className = 'team-card';

        // Build social links
        let socialLinks = '';
        if (member.social.linkedin) {
            socialLinks += `
                <a href="${member.social.linkedin}" target="_blank" class="social-link" aria-label="LinkedIn">
                    <img src="../assets/icons/LI-In-Bug.png" alt="LinkedIn" class="social-icon" style="object-fit: contain;">
                </a>
            `;
        }
        if (member.social.twitter) {
            socialLinks += `
                <a href="${member.social.twitter}" class="social-link" aria-label="Twitter">
                    <i data-lucide="twitter" class="social-icon"></i>
                </a>
            `;
        }
        if (member.social.github) {
            socialLinks += `
                <a href="${member.social.github}" class="social-link" aria-label="GitHub">
                    <i data-lucide="github" class="social-icon"></i>
                </a>
            `;
        }
        if (member.social.email) {
            socialLinks += `
                <a href="mailto:${member.social.email}" class="social-link" aria-label="Email">
                    <i data-lucide="mail" class="social-icon"></i>
                </a>
            `;
        }

        card.innerHTML = `
            <div class="team-avatar">${member.initial}</div>
            <h3 class="team-name">${member.name}</h3>
            <div class="team-role">${member.role}</div>
            <p class="team-bio">${member.bio}</p>
            <div class="team-social">
                ${socialLinks}
            </div>
        `;

        grid.appendChild(card);
    });

    lucide.createIcons();
}

/* ============================================================
   INTERSECTION OBSERVER FOR ANIMATIONS
   ============================================================ */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe specific elements to animate them on scroll
const elementsToAnimate = [
    '.section-header',
    '.section-badge',
    '.section-title',
    '.story-text p',
    '.stat-box',
    '.mv-card',
    '.value-card',
    '.team-card',
    '.contact-btn',
    '.cta-primary-large'
];

document.querySelectorAll(elementsToAnimate.join(', ')).forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
});

/* ============================================================
   SCROLL REVEAL FOR STORY STATS
   ============================================================ */
let statsAnimated = false;

window.addEventListener('scroll', () => {
    if (statsAnimated) return;

    const statsSection = document.querySelector('.story-stats');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

    if (isVisible) {
        animateStats();
        statsAnimated = true;
    }
});

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach((stat, index) => {
        const text = stat.textContent;
        const hasPlus = text.includes('+');
        const numericValue = parseInt(text.replace(/[^0-9]/g, ''));

        if (isNaN(numericValue)) return;

        let current = 0;
        const increment = numericValue / 50;
        const duration = 1500;
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }

            if (hasPlus) {
                stat.textContent = Math.floor(current) + 'K+';
            } else if (text.includes('K')) {
                stat.textContent = Math.floor(current) + 'K';
            } else {
                stat.textContent = Math.floor(current);
            }
        }, stepTime);
    });
}

/* ============================================================
   KEYBOARD SHORTCUTS
   ============================================================ */
document.addEventListener('keydown', (e) => {
    // Escape to close mobile menu
    if (e.key === 'Escape') {
        document.getElementById('mobileNav').classList.remove('active');
    }

    // Ctrl/Cmd + K to focus contact
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.contact-cta-section').scrollIntoView({ behavior: 'smooth' });
    }
});

/* ============================================================
   EMAIL COPY FUNCTIONALITY
   ============================================================ */
document.querySelectorAll('.contact-btn[href^="mailto:"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const email = btn.getAttribute('href').replace('mailto:', '');

        // Try to copy to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(email).then(() => {
                showNotification('Email copied to clipboard!');
            }).catch(() => {
                // If clipboard fails, just follow the mailto link
            });
        }
    });
});

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: var(--btn-send);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: slideInFromRight 0.3s ease;
        z-index: 9999;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutToRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add animation styles
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes slideInFromRight {
        from { opacity: 0; transform: translateX(100px); }
        to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideOutToRight {
        from { opacity: 1; transform: translateX(0); }
        to   { opacity: 0; transform: translateX(100px); }
    }
`;
document.head.appendChild(animationStyle);

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
        // Scroll-based animations handled by observers
    });
}, { passive: true });

console.log('🚀 About Us page fully loaded and optimized');
