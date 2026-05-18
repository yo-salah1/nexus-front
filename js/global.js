/**
 * NEXUS Global System JS
 * - Centralized routing via NEXUS_ROUTES (defined in config.js)
 * - Unified footer injection across all pages
 * - Sidebar & mobile menu management
 * - Global particle engine
 */

document.addEventListener('DOMContentLoaded', () => {
    initGlobalParticles();
    resolveRoutes();
    injectHeader();
    injectFooter();
    initMobileSidebarToggle();
});

// ==========================================
// UNIFIED HEADER INJECTOR
// ==========================================
function injectHeader() {
    const placeholder = document.getElementById('nexus-header');
    if (!placeholder) return;

    const routes = window.NEXUS_ROUTES || {};
    const path = window.location.pathname;
    const isInPages = path.includes('/pages/');
    const isAbout = path.includes('about_us.html');
    const isIndex = !isInPages || path.endsWith('index.html');
    
    const base = isInPages ? '../' : './';
    const logoPath = isInPages ? '../assets/NEXUS_logo.png' : 'assets/NEXUS_logo.png';

    const r = (key) => {
        const val = routes[key] || '#';
        if (val === '#') return '#';
        if (val.startsWith('#')) return val;
        if (!isInPages && val.startsWith('index.html#')) return '#' + val.split('#')[1];
        if (!isInPages && val === 'index.html') return '#';
        return base + val;
    };

    placeholder.outerHTML = `
    <nav class="navbar" id="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <a href="${r('nav_logo')}">
                    <img src="${logoPath}" alt="NEXUS" class="logo-img">
                </a>
            </div>
            
            <div class="nav-links" id="navLinks">
                <a href="${r('nav_landing')}" class="nav-link ${isIndex ? 'active' : ''}">Home</a>
                <a href="${r('nav_features')}" class="nav-link">Features</a>
                <a href="${r('nav_testimonials')}" class="nav-link">Testimonials</a>
                <a href="${r('nav_faq')}" class="nav-link">FAQ</a>
                <a href="${r('nav_about')}" class="nav-link ${isAbout ? 'active' : ''}">About Us</a>
                <a href="${r('nav_get_started')}" class="nav-btn">Get Started</a>
            </div>
            
            <button class="mobile-menu-toggle" id="mobileMenuToggle">
                <i data-lucide="menu"></i>
            </button>
        </div>
        
        <div class="mobile-nav-menu" id="mobileNavMenu">
            <div class="mobile-nav-content">
                <a href="${r('nav_landing')}" class="mobile-nav-item ${isIndex ? 'active' : ''}">Home</a>
                <a href="${r('nav_features')}" class="mobile-nav-item">Features</a>
                <a href="${r('nav_testimonials')}" class="mobile-nav-item">Testimonials</a>
                <a href="${r('nav_faq')}" class="mobile-nav-item">FAQ</a>
                <a href="${r('nav_about')}" class="mobile-nav-item ${isAbout ? 'active' : ''}">About Us</a>
                <div class="mobile-nav-footer">
                    <a href="${r('nav_get_started')}" class="mobile-get-started">Get Started</a>
                </div>
            </div>
        </div>
    </nav>`;

    // Initialize Mobile Menu Logic
    const toggle = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('mobileNavMenu');
    const navbar = document.getElementById('navbar');

    if (toggle && menu) {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('active');
            navbar.classList.toggle('menu-open');
            
            const icon = toggle.querySelector('i');
            if (menu.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            if (window.lucide) lucide.createIcons();
        });

        // Close menu on click outside
        document.addEventListener('click', (e) => {
            if (menu.classList.contains('active') && !navbar.contains(e.target)) {
                menu.classList.remove('active');
                navbar.classList.remove('menu-open');
                const icon = toggle.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                if (window.lucide) lucide.createIcons();
            }
        });
    }

    // Scroll effect
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    if (window.lucide) lucide.createIcons();
}

// ==========================================
// ROUTE RESOLVER — resolves data-route attrs
// ==========================================
window.resolveRoutes = function() {
    const routes = window.NEXUS_ROUTES;
    if (!routes) return;

    // Detect if we are inside /pages/ or at root
    const isInPages = window.location.pathname.includes('/pages/');
    const base = isInPages ? '../' : './';

    // Smart resolver: if on index, convert index.html#section → #section (same-page anchor)
    const resolve = (val) => {
        if (!val || val === '#') return '#';
        if (val.startsWith('#')) return val;
        if (!isInPages && val.startsWith('index.html#')) return '#' + val.split('#')[1];
        if (!isInPages && val === 'index.html') return '#';
        return base + val;
    };

    document.querySelectorAll('a[data-route]').forEach(link => {
        const key = link.dataset.route;
        if (routes[key] !== undefined) {
            link.href = resolve(routes[key]);
        }
    });
}

// ==========================================
// UNIFIED FOOTER INJECTOR
// ==========================================
function injectFooter() {
    const placeholder = document.getElementById('nexus-footer');
    if (!placeholder) return;

    const routes = window.NEXUS_ROUTES || {};
    const isInPages = window.location.pathname.includes('/pages/');
    const base = isInPages ? '../' : './';
    const logoPath = isInPages ? '../assets/NEXUS_logo.png' : 'assets/NEXUS_logo.png';

    // Smart link resolver:
    // On index page, section anchors (#features etc.) resolve directly without base prefix
    const r = (key) => {
        const val = routes[key] || '#';
        if (val === '#') return '#';
        // If it's a pure anchor (starts with #), use as-is
        if (val.startsWith('#')) return val;
        // If it points to index.html#section and we're ON index, just use the anchor
        if (!isInPages && val.startsWith('index.html#')) return '#' + val.split('#')[1];
        return base + val;
    };

    placeholder.outerHTML = `
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-main">
                <div class="footer-brand">
                    <a href="${base}index.html">
                        <img src="${logoPath}" alt="NEXUS" class="footer-logo">
                    </a>
                    <p class="footer-brand-text">Your AI-powered companion for emotional wellness and mental health support.</p>
                </div>

                <div class="footer-col">
                    <h4 class="footer-col-title">Product</h4>
                    <a href="${r('footer_features')}" class="footer-link">Features</a>
                    <a href="${r('footer_testimonials')}" class="footer-link">Testimonials</a>
                    <a href="${r('footer_faq')}" class="footer-link">FAQ</a>
                    <a href="${r('footer_get_started')}" class="footer-link">Get Started</a>
                </div>

                <div class="footer-col">
                    <h4 class="footer-col-title">Resources</h4>
                    <a href="${r('footer_help')}" class="footer-link">Help &amp; Support</a>
                    <a href="${r('footer_docs')}" class="footer-link">Documentation</a>
                    <a href="${r('footer_privacy')}" class="footer-link">Privacy Policy</a>
                    <a href="${r('footer_terms')}" class="footer-link">Terms of Service</a>
                </div>

                <div class="footer-col">
                    <h4 class="footer-col-title">Connect</h4>
                    <a href="${r('footer_twitter')}" class="footer-link">Twitter</a>
                    <a href="${r('footer_linkedin')}" class="footer-link">LinkedIn</a>
                    <a href="${r('footer_instagram')}" class="footer-link">Instagram</a>
                    <a href="${r('footer_facebook')}" class="footer-link">Facebook</a>
                </div>
            </div>

            <div class="footer-bottom">
                <p class="footer-copyright">© 2026 NEXUS. All rights reserved.</p>
                <div class="footer-badges">
                    <span class="footer-badge">
                        <i data-lucide="shield-check" class="footer-badge-icon"></i>
                        <span>Secure &amp; Private</span>
                    </span>
                    <span class="footer-badge">
                        <i data-lucide="award" class="footer-badge-icon"></i>
                        <span>Award Winning</span>
                    </span>
                </div>
            </div>
        </div>
    </footer>`;

    // Re-run lucide if available
    if (window.lucide) lucide.createIcons();
}


// ==========================================
// 1. GLOBAL PARTICLE ENGINE
// ==========================================
function initGlobalParticles() {
    // Inject canvas if it doesn't exist and we want it on every page
    // For now, we assume the HTML has <canvas id="nexusParticles"></canvas>
    createParticleAnimation('nexusParticles');
}

function createParticleAnimation(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();
    
    const particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 30), 40);
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedY: Math.random() * 0.4 + 0.1,
            opacity: Math.random() * 0.4 + 0.2
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
}

// ==========================================
// 1. MOBILE HEADER TOGGLE LOGIC
// ==========================================
function initMobileSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');

    if (!sidebar || !mobileSidebarToggle) return;

    mobileSidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('open');
        document.body.classList.toggle('sidebar-open', sidebar.classList.contains('open'));
    });
    
    // Close sidebar when clicking outside on mobile & tablet
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && sidebar.classList.contains('open') && !sidebar.contains(e.target) && !mobileSidebarToggle.contains(e.target)) {
            sidebar.classList.remove('open');
            document.body.classList.remove('sidebar-open');
        }
    });

    // Landing Page Mobile Menu
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
        });
        
        // Close menu on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
            });
        });
    }
}

// ==========================================
// GLOBAL SYSTEM HEALTH MONITOR
// ==========================================
async function checkSystemHealth() {
    try {
        const config = window.NEXUS_CONFIG || { API_BASE_URL: 'http://localhost:8080/api' };
        const res = await fetch(`${config.API_BASE_URL}/health/services`, { 
            headers: {'ngrok-skip-browser-warning': 'true'} 
        });
        const data = await res.json();
        
        updateLamp('FER', data.FER === 'online');
        updateLamp('SER', data.SER === 'online');
        updateLamp('TER', data.TER === 'online');
        updateLamp('LLM', data.LLM === 'online');
    } catch (err) {
        ['FER', 'SER', 'TER', 'LLM'].forEach(m => updateLamp(m, false));
    }
}

function updateLamp(id, isOnline) {
    const el = document.getElementById(`lamp${id}`);
    if (!el) return;
    if (el.classList.contains('analyzing')) return;
    el.classList.remove('online', 'offline');
    el.classList.add(isOnline ? 'online' : 'offline');
}

function setLampsState(state) {
    ['FER', 'SER', 'TER', 'LLM'].forEach(m => {
        const el = document.getElementById(`lamp${m}`);
        if (!el) return;
        el.classList.remove('online', 'offline', 'analyzing');
        if (state) el.classList.add(state);
    });
}

// Start polling if status-lamps container exists
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.status-lamps')) {
        checkSystemHealth();
        setInterval(checkSystemHealth, 10000);
    }
});
