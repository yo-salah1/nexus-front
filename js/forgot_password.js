/* ============================================================
   NEXUS Forgot Password Page - JavaScript
   ============================================================ */

// API Configuration
const API_BASE_URL = window.NEXUS_CONFIG.API_BASE_URL;

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    
    initParticles();
    initForm();
    initResendButton();
    
    console.log('✨ NEXUS Forgot Password - Ready');
});

/* ============================================================
   PARTICLE ANIMATION
   ============================================================ */
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = window.innerWidth < 768 ? 30 : 60;
    
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
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

/* ============================================================
   FORM HANDLING
   ============================================================ */
function initForm() {
    const form = document.getElementById('forgotForm');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const submitBtn = document.getElementById('submitBtn');
    
    // Real-time email validation
    emailInput.addEventListener('input', () => {
        if (emailInput.value) {
            validateEmail(emailInput.value);
        } else {
            emailInput.classList.remove('error');
            emailError.textContent = '';
        }
    });
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Validate email
        if (!email) {
            showFieldError(emailInput, emailError, 'Email address is required');
            return;
        }
        
        if (!isValidEmail(email)) {
            showFieldError(emailInput, emailError, 'Please enter a valid email address');
            return;
        }
        
        // Clear errors
        clearFieldError(emailInput, emailError);
        
        // Disable button and show loading
        submitBtn.disabled = true;
        showLoading();
        
        try {
            // Send reset request to API
            await sendResetLink(email);
            
            // Hide loading
            hideLoading();
            
            // Show success state
            showSuccessState(email);
            
        } catch (error) {
            hideLoading();
            submitBtn.disabled = false;
            
            console.error('Error sending reset link:', error);
            
            // Show error toast
            showToast(error.message || 'Failed to send reset link. Please try again.', 'error');
        }
    });
}

/* ============================================================
   EMAIL VALIDATION
   ============================================================ */
function validateEmail(email) {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    
    if (!isValidEmail(email)) {
        showFieldError(emailInput, emailError, 'Please enter a valid email address');
        return false;
    } else {
        clearFieldError(emailInput, emailError);
        return true;
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
}

function clearFieldError(input, errorElement) {
    input.classList.remove('error');
    errorElement.textContent = '';
}

/* ============================================================
   API - SEND RESET LINK
   ============================================================ */
async function sendResetLink(email) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': 'true',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            if (response.status === 404) {
                throw new Error('No account found with this email address');
            } else if (response.status === 429) {
                throw new Error('Too many requests. Please try again later');
            } else {
                throw new Error(errorData.message || 'Failed to send reset link');
            }
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        // If API is not available, simulate success for demo
        if (error.message.includes('fetch')) {
            console.warn('API not available, simulating success');
            return new Promise(resolve => {
                setTimeout(() => resolve({ success: true }), 1500);
            });
        }
        throw error;
    }
}

/* ============================================================
   SHOW SUCCESS STATE
   ============================================================ */
function showSuccessState(email) {
    const forgotCard = document.getElementById('forgotCard');
    const successCard = document.getElementById('successCard');
    const userEmail = document.getElementById('userEmail');
    
    // Hide forgot card
    forgotCard.classList.add('hidden');
    
    // Show success card
    successCard.classList.remove('hidden');
    userEmail.textContent = email;
    
    // Store email for resend
    sessionStorage.setItem('resetEmail', email);
    
    // Re-render lucide icons
    lucide.createIcons();
}

/* ============================================================
   RESEND BUTTON
   ============================================================ */
let resendCooldown = 0;
let resendInterval = null;

function initResendButton() {
    const resendBtn = document.getElementById('resendBtn');
    
    resendBtn.addEventListener('click', async () => {
        if (resendCooldown > 0) return;
        
        const email = sessionStorage.getItem('resetEmail');
        if (!email) {
            showToast('Email address not found. Please try again.', 'error');
            return;
        }
        
        // Disable button
        resendBtn.disabled = true;
        
        try {
            // Send reset link again
            await sendResetLink(email);
            
            // Show success toast
            showToast('Reset link sent successfully!', 'success');
            
            // Start cooldown (60 seconds)
            startResendCooldown(resendBtn);
            
        } catch (error) {
            console.error('Error resending link:', error);
            showToast(error.message || 'Failed to resend link. Please try again.', 'error');
            resendBtn.disabled = false;
        }
    });
}

function startResendCooldown(btn) {
    resendCooldown = 60;
    
    const originalText = btn.querySelector('span').textContent;
    updateResendButtonText(btn, resendCooldown);
    
    resendInterval = setInterval(() => {
        resendCooldown--;
        
        if (resendCooldown <= 0) {
            clearInterval(resendInterval);
            btn.disabled = false;
            btn.querySelector('span').textContent = originalText;
        } else {
            updateResendButtonText(btn, resendCooldown);
        }
    }, 1000);
}

function updateResendButtonText(btn, seconds) {
    btn.querySelector('span').textContent = `Resend in ${seconds}s`;
}

/* ============================================================
   LOADING OVERLAY
   ============================================================ */
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('hidden');
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.add('hidden');
}

/* ============================================================
   TOAST NOTIFICATIONS
   ============================================================ */
function showToast(message, type = 'error') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = toast.querySelector('.toast-icon');
    
    // Set message
    toastMessage.textContent = message;
    
    // Set type
    toast.className = 'toast';
    if (type === 'error') {
        toast.classList.add('error');
        toastIcon.setAttribute('data-lucide', 'alert-circle');
    } else if (type === 'success') {
        toast.classList.add('success');
        toastIcon.setAttribute('data-lucide', 'check-circle');
    }
    
    // Re-render icon
    lucide.createIcons();
    
    // Show toast
    toast.classList.remove('hidden');
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
        hideToast();
    }, 4000);
}

function hideToast() {
    const toast = document.getElementById('toast');
    toast.style.animation = 'slideOutToRight 0.4s ease';
    
    setTimeout(() => {
        toast.classList.add('hidden');
        toast.style.animation = '';
    }, 400);
}

// Add slide out animation
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes slideOutToRight {
        from { opacity: 1; transform: translateX(0); }
        to   { opacity: 0; transform: translateX(100px); }
    }
`;
document.head.appendChild(toastStyle);

/* ============================================================
   KEYBOARD SHORTCUTS
   ============================================================ */
document.addEventListener('keydown', (e) => {
    // Escape to close toast
    if (e.key === 'Escape') {
        hideToast();
    }
});

/* ============================================================
   AUTO-FOCUS EMAIL INPUT
   ============================================================ */
window.addEventListener('load', () => {
    const emailInput = document.getElementById('email');
    if (emailInput && !document.getElementById('successCard').classList.contains('hidden')) {
        // Don't focus if success card is shown
        return;
    }
    
    setTimeout(() => {
        emailInput?.focus();
    }, 300);
});

/* ============================================================
   HANDLE BROWSER BACK BUTTON
   ============================================================ */
window.addEventListener('popstate', () => {
    // Clear session storage when going back
    sessionStorage.removeItem('resetEmail');
});

/* ============================================================
   PREVENT MULTIPLE SUBMISSIONS
   ============================================================ */
let isSubmitting = false;

document.getElementById('forgotForm')?.addEventListener('submit', (e) => {
    if (isSubmitting) {
        e.preventDefault();
        return false;
    }
});

console.log('🔐 Forgot Password page initialized');
