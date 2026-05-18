/* NEXUS — Home/Prompts (../js/dashboard.js) - API INTEGRATED */

const API_BASE_URL = window.NEXUS_CONFIG.API_BASE_URL;

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    loadAndRenderPrompts();
    initCTA();
    console.log('✨ NEXUS Home - API Ready');
});

// Load prompts from API
async function loadAndRenderPrompts() {
    try {
        const response = await fetch(`${API_BASE_URL}/prompts`, { headers: { 'ngrok-skip-browser-warning': 'true' } });
        
        if (!response.ok) throw new Error('Failed to load prompts');
        
        const promptCards = await response.json();
        renderPromptCards(promptCards);
        
    } catch (error) {
        console.error('Error loading prompts:', error);
        
        // Fallback to mock data if API fails
        const fallbackPrompts = [
            { icon: 'message-circle', title: 'Healthy food', desc: 'Navigate interpersonal challenges', link: 'Use Prompt →' },
            { icon: 'sparkles', title: 'Confidence Booster', desc: 'Build self-esteem and positive mindset', link: 'Use Prompt →' },
            { icon: 'heart', title: 'Stress Relief Coach', desc: 'Calm anxiety and manage stress effectively', link: 'Use Prompt →' },
            { icon: 'target', title: 'Healthy food', desc: 'Improve concentration and productivity', link: 'Use Prompt →' },
            { icon: 'flame', title: 'Anger Cooldown', desc: 'De-escalate frustration and find peace', link: 'Use Prompt →' },
            { icon: 'moon', title: 'Sleep Routine', desc: 'Wind down and prepare for rest', link: 'Use Prompt →' }
        ];
        
        renderPromptCards(fallbackPrompts);
    }
}

function renderPromptCards(promptCards) {
    const grid = document.getElementById('promptGrid');
    grid.innerHTML = '';

    promptCards.forEach((card, i) => {
        const el = document.createElement('div');
        el.className = 'prompt-card';
        el.tabIndex = 0;
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', card.title);

        el.innerHTML = `
            <div class="card-icon-wrap">
                <i data-lucide="${card.icon}" class="card-icon"></i>
            </div>
            <div class="card-title">${card.title}</div>
            <div class="card-desc">${card.desc}</div>
            <a href="#" class="card-link" data-index="${i}">${card.link}</a>
        `;

        el.addEventListener('click', (e) => {
            if (e.target.closest('.card-link')) return;
            startPromptChat(card);
        });

        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                startPromptChat(card);
            }
        });

        grid.appendChild(el);
    });

    grid.querySelectorAll('.card-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const idx = parseInt(link.dataset.index);
            startPromptChat(promptCards[idx]);
        });
    });

    lucide.createIcons();
}

async function startPromptChat(card) {
    console.log('💬 Starting prompt chat →', card.title);
    
    try {
        // Send prompt to API to start session
        const response = await fetch(`${API_BASE_URL}/chat/prompt`, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': 'true','Content-Type': 'application/json'},
            body: JSON.stringify({ promptTitle: card.title, promptDesc: card.desc })
        });
        
        if (response.ok) {
            const data = await response.json();
            // Redirect to chat with session ID
            window.location.href = `index8.html?session=${data.sessionId}`;
        } else {
            window.location.href = 'ai_chat.html';
        }
        
    } catch (error) {
        console.error('Error starting prompt chat:', error);
        window.location.href = 'ai_chat.html';
    }
}

function initCTA() {
    document.getElementById('ctaBtn').addEventListener('click', () => {
        console.log('✨ Create New Session clicked');
        window.location.href = 'ai_chat.html';
    });
}
