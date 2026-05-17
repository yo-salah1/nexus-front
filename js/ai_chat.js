/* ============================================================
   NEXUS — Text Chat (../js/ai_chat.js) — TER Integrated
   ============================================================ */

const API_BASE_URL = window.NEXUS_CONFIG.API_BASE_URL;
let currentSessionId = null;

const EMOTION_COLORS = {
    anger: '#ef4444', angry: '#ef4444',
    sadness: '#60a5fa', sad: '#60a5fa',
    joy: '#f59e0b', happy: '#f59e0b',
    fear: '#a78bfa', fearful: '#a78bfa',
    surprise: '#fb923c',
    disgust: '#10b981',
    neutral: '#9ca3af',
};

const EMOTION_ICONS = {
    anger: '😤', angry: '😤',
    sadness: '😢', sad: '😢',
    joy: '😊', happy: '😊',
    fear: '😨', fearful: '😨',
    surprise: '😲',
    disgust: '😟',
    neutral: '😐',
};

const EMOTION_AR = {
    angry: 'غاضب',
    sad: 'حزين',
    happy: 'سعيد',
    fear: 'خائف',
    surprise: 'متفاجئ',
    disgust: 'اشمئزاز',
    neutral: 'محايد',
};

const NEXUS_REPLIES_AR = {
    happy: 'يسعدني أنك بخير! 😊',
    sad: 'أنا هنا معاك، كل حاجة هتعدي. 💙',
    angry: 'خد نفس عميق، أنا فاهم إحساسك. 😤',
    fear: 'مفيش داعي للخوف، أنا هنا. 🤍',
    surprise: 'يبدو إن في حاجة مفاجأتك! 😲',
    disgust: 'أحياناً بعض الأشياء بتضايقنا، قولي أكتر. 😟',
    neutral: 'أنا بسمعك، قولي اللي في بالك. 🙂',
};

const NEXUS_REPLIES_EN = {
    happy: "You seem happy! That's wonderful. 😊",
    sad: "I'm sorry you're feeling sad. I'm here for you. 💙",
    angry: "I can sense some frustration. Take a deep breath — it's okay. 😤",
    fear: "It's okay to feel scared. You're safe here. 🤍",
    surprise: "Looks like something caught you off guard! 😲",
    disgust: "Something seems off. Want to talk about it? 😟",
    neutral: "I'm here and listening. Feel free to share anything. 🙂",
};

// Raw model labels → unified MER labels
const MER_MAP = {
    anger: 'angry', sadness: 'sad', joy: 'happy', love: 'happy',
    fear: 'fear', surprise: 'surprise', disgust: 'angry', neutral: 'neutral',
    happy: 'happy', sad: 'sad', angry: 'angry', fearful: 'fear',
};

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initChat();
    initNavigation();
    loadChatHistory();
});

// ==================== SIDEBAR ====================
// Handled by global.js (initGlobalSidebar)

// ==================== NAVIGATION ====================
function initNavigation() {
    const map = {
        homeNav: 'home.html',
        historyNav: 'chat_history.html',
        settingsNav: 'settings.html',
    };
    Object.entries(map).forEach(([id, href]) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', () => window.location.href = href);
    });

    ['videoChatBtn', 'audioChatBtn', 'textChatBtn'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', () => {
            const type = id.replace('ChatBtn', '');
            startNewChat(type);
        });
    });
}

async function startNewChat(type) {
    try {
        const res = await fetch(`${API_BASE_URL}/chat/session`, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': 'true', 'Content-Type': 'application/json' },
            body: JSON.stringify({ type })
        });
        const data = await res.json();
        currentSessionId = data.sessionId;
    } catch (_) { }
    hideWelcomeScreen();
    showChatMessages();
}

// ==================== CHAT ====================
function initChat() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');

    sendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
    });
}

async function handleSendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    if (!message) return;

    hideWelcomeScreen();
    showChatMessages();
    addUserMessage(message);
    chatInput.value = '';
    showTypingIndicator();
    if (window.setLampsState) setLampsState('analyzing');

    try {
        const res = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': 'true', 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, sessionId: currentSessionId || generateSessionId() })
        });
        const data = await res.json();
        if (data.sessionId) currentSessionId = data.sessionId;

        hideTypingIndicator();
        addEmotionMessage(data);
        if (window.checkSystemHealth) {
            setLampsState(null);
            checkSystemHealth();
        }

    } catch (err) {
        hideTypingIndicator();
        addEmotionMessage({ emotion: 'neutral', mer_emotion: 'neutral', confidence: 0, all_probs: {}, lang: 'en' });
        console.error(err);
        if (window.setLampsState) setLampsState('offline');
        setTimeout(() => { if (window.checkSystemHealth) checkSystemHealth(); }, 2000);
    }
}

// ==================== PROB BARS ====================
/**
 * Build merged MER probability bars.
 *
 * If the API flagged overridden=true, we skip the raw all_probs (which belong
 * to the pre-override model output) and build a synthetic distribution instead:
 *   - overridden label  → confidence value
 *   - everything else   → split the remainder equally
 *
 * This keeps the header % and the bars consistent.
 */
function buildMerProbs(allProbs, merLabel, confidence, overridden) {
    if (overridden) {
        // Build a clean synthetic distribution
        const allMerLabels = ['angry', 'sad', 'happy', 'fear', 'surprise', 'disgust', 'neutral'];
        const others = allMerLabels.filter(l => l !== merLabel);
        const remainder = Math.max(0, 1 - confidence);
        const perOther = others.length ? remainder / others.length : 0;

        const result = {};
        result[merLabel] = confidence;
        others.forEach(l => { result[l] = perOther; });
        return result;
    }

    // Normal path: collapse raw model labels → MER labels and sum
    const merProbs = {};
    Object.entries(allProbs).forEach(([lbl, prob]) => {
        const mer = MER_MAP[lbl.toLowerCase()] || lbl.toLowerCase();
        merProbs[mer] = (merProbs[mer] || 0) + prob;
    });
    return merProbs;
}

// ==================== MESSAGE RENDERERS ====================
function addUserMessage(text) {
    const chatMessages = document.getElementById('chatMessages');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const el = document.createElement('div');
    el.className = 'message user';
    el.innerHTML = `
        <div class="message-avatar"><i data-lucide="user"></i></div>
        <div class="message-content">
            <div class="message-text">${escapeHtml(text)}</div>
            <div class="message-time">${time}</div>
        </div>`;
    chatMessages.appendChild(el);
    lucide.createIcons();
    scrollToBottom();
}

function addEmotionMessage(data) {
    const chatMessages = document.getElementById('chatMessages');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const lang = (data.lang || 'en').toLowerCase();
    const isAr = lang === 'ar';
    const overridden = !!data.overridden;

    const rawLabel = (data.emotion || 'neutral').toLowerCase();
    const label = (data.mer_emotion || rawLabel).toLowerCase();   // unified MER label
    const confidence = data.confidence || 0;
    const allProbs = data.all_probs || {};

    const color = EMOTION_COLORS[label] || '#9ca3af';
    const icon = EMOTION_ICONS[label] || '🙂';

    const displayLabel = isAr ? (EMOTION_AR[label] || label) : capitalize(label);

    const replyText = data.reply || (isAr
        ? (NEXUS_REPLIES_AR[label] || 'أنا هنا معاك. 🤍')
        : (NEXUS_REPLIES_EN[label] || "I'm here for you. Feel free to share. 🤍"));

    const langBadge = isAr
        ? `<span class="lang-badge lang-ar">🇪🇬 عربي</span>`
        : `<span class="lang-badge lang-en">🇺🇸 EN</span>`;

    // Build consistent probability bars
    const merProbs = buildMerProbs(allProbs, label, confidence, overridden);
    const sorted = Object.entries(merProbs)
        .filter(([, v]) => v > 0.001)                  // hide near-zero entries
        .sort((a, b) => b[1] - a[1]);

    const barsHTML = sorted.map(([lbl, prob]) => {
        const c = EMOTION_COLORS[lbl.toLowerCase()] || '#9ca3af';
        const pct = (prob * 100).toFixed(0);
        const barLabel = isAr
            ? (EMOTION_AR[lbl.toLowerCase()] || capitalize(lbl))
            : capitalize(lbl);
        return `
        <div class="prob-row">
            <span class="prob-lbl">${barLabel}</span>
            <div class="prob-track">
                <div class="prob-fill" style="width:${pct}%;background:${c}"></div>
            </div>
            <span class="prob-pct">${pct}%</span>
        </div>`;
    }).join('');

    const el = document.createElement('div');
    el.className = 'message ai';
    el.innerHTML = `
        <div class="message-avatar">
            <img src="../assets/avatar.png" alt="NEXUS">
        </div>
        <div class="message-content emotion-card" style="border-color:${color}33" dir="${isAr ? 'rtl' : 'ltr'}">
            <div class="emotion-header">
                <span class="emotion-icon">${icon}</span>
                <div class="emotion-label" style="color:${color}">${displayLabel}</div>
                <div class="emotion-confidence" style="color:${color}">${(confidence * 100).toFixed(0)}%</div>
                ${langBadge}
            </div>
            <div class="nexus-reply" style="color:#cbd5e1;font-size:.85rem;margin:.45rem 0 .3rem;">${replyText}</div>
            ${barsHTML ? `<div class="prob-bars">${barsHTML}</div>` : ''}
            <div class="message-time">${time}</div>
        </div>`;
    chatMessages.appendChild(el);
    scrollToBottom();
}

// ==================== TYPING ====================
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const el = document.createElement('div');
    el.className = 'message ai';
    el.id = 'typingIndicator';
    el.innerHTML = `
        <div class="message-avatar"><img src="../assets/avatar.png" alt="NEXUS"></div>
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>`;
    chatMessages.appendChild(el);
    scrollToBottom();
}

function hideTypingIndicator() {
    document.getElementById('typingIndicator')?.remove();
}

// ==================== HELPERS ====================
function hideWelcomeScreen() { document.getElementById('welcomeScreen').style.display = 'none'; }
function showChatMessages() { document.getElementById('chatMessages').classList.add('active'); }
function scrollToBottom() {
    const c = document.getElementById('chatContainer');
    c.scrollTop = c.scrollHeight;
}
function escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}
function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }
function generateSessionId() { return 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8); }

async function loadChatHistory() {
    try {
        const res = await fetch(`${API_BASE_URL}/chat/history`, { headers: { 'ngrok-skip-browser-warning': 'true' } });
        const data = await res.json();
        if (data.messages?.length) {
            currentSessionId = data.sessionId;
            hideWelcomeScreen();
            showChatMessages();
            data.messages.forEach(m => {
                if (m.sender === 'user') addUserMessage(m.text);
            });
            lucide.createIcons();
        }
    } catch (_) { }
}

// ==================== KEYBOARD ====================
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.getElementById('chatTypeSubmenu').classList.remove('active');
        document.getElementById('newChatNav').classList.remove('active');
    }
});