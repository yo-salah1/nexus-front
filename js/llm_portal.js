/* ============================================================
   NEXUS — LLM & Model Gateway Integration Portal Controller
   ============================================================ */

const API_BASE_URL = window.NEXUS_CONFIG.API_BASE_URL;
let activeProvider = "gemini";
let currentSessionId = null;

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initSidebarNavigation();
    loadActiveSettings();
    loadLiveMetrics();
    loadPromptTemplate();
    loadTimelineData();

    // Set up polling intervals
    setInterval(loadLiveMetrics, 3000); // Poll metrics every 3 seconds
    setInterval(loadTimelineData, 4000); // Poll timeline shifts every 4 seconds

    // Add event listeners
    document.getElementById('saveConfigBtn').addEventListener('click', saveGatewayConfig);
    document.getElementById('personaSelector').addEventListener('change', loadPromptTemplate);
    setupProviderCards();
});

// 1. NAVIGATION & SIDEBAR ACTIVE STATES
function initSidebarNavigation() {
    const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
    const sidebar = document.getElementById('sidebar');

    if (mobileSidebarToggle && sidebar) {
        mobileSidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
}

// 2. SETUP LLM PROVIDER SELECTIONS
function setupProviderCards() {
    const cards = document.querySelectorAll('.provider-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            activeProvider = card.dataset.provider;
            console.log(`🎯 Locally selected provider: ${activeProvider}`);
        });
    });
}

// 3. LOAD SYSTEM SETTINGS
async function loadActiveSettings() {
    try {
        const response = await fetch(`${API_BASE_URL}/settings`, { headers: { 'ngrok-skip-browser-warning': 'true' } });
        if (response.ok) {
            const settings = await response.json();
            
            // Set LLM Routing Provider card highlights
            if (settings.activeLlmProvider) {
                activeProvider = settings.activeLlmProvider;
                const cards = document.querySelectorAll('.provider-card');
                cards.forEach(c => {
                    c.classList.toggle('active', c.dataset.provider === activeProvider);
                });
            }

            // Load API Keys
            if (settings.geminiApiKey !== undefined) document.getElementById('geminiKeyInput').value = settings.geminiApiKey;
            if (settings.claudeApiKey !== undefined) document.getElementById('claudeKeyInput').value = settings.claudeApiKey;
            if (settings.groqApiKey !== undefined) document.getElementById('groqKeyInput').value = settings.groqApiKey;

            // Load Orchestration presets
            if (settings.temperature !== undefined) {
                document.getElementById('tempInput').value = settings.temperature;
                document.getElementById('tempVal').textContent = settings.temperature;
            }
            if (settings.maxTokens !== undefined) {
                document.getElementById('tokensInput').value = settings.maxTokens;
                document.getElementById('tokensVal').textContent = settings.maxTokens;
            }
            if (settings.gatewayTimeout !== undefined) {
                document.getElementById('timeoutInput').value = settings.gatewayTimeout;
                document.getElementById('timeoutVal').textContent = settings.gatewayTimeout + 's';
            }
            if (settings.failoverRetries !== undefined) {
                document.getElementById('retriesInput').value = settings.failoverRetries;
                document.getElementById('retriesVal').textContent = settings.failoverRetries;
            }
        }
    } catch (err) {
        console.error("Failed to load backend settings:", err);
    }
}

// 4. SAVE GATEWAY CONFIG
async function saveGatewayConfig() {
    const saveBtn = document.getElementById('saveConfigBtn');
    const originalHTML = saveBtn.innerHTML;
    
    // UI state indicator
    saveBtn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Applying...`;
    lucide.createIcons();
    saveBtn.disabled = true;

    try {
        const payload = {
            activeLlmProvider: activeProvider,
            geminiApiKey: document.getElementById('geminiKeyInput').value.trim(),
            claudeApiKey: document.getElementById('claudeKeyInput').value.trim(),
            groqApiKey: document.getElementById('groqKeyInput').value.trim(),
            temperature: parseFloat(document.getElementById('tempInput').value),
            maxTokens: parseInt(document.getElementById('tokensInput').value),
            gatewayTimeout: parseInt(document.getElementById('timeoutInput').value),
            failoverRetries: parseInt(document.getElementById('retriesInput').value)
        };

        const res = await fetch(`${API_BASE_URL}/settings`, {
            method: 'PUT',
            headers: {
                'ngrok-skip-browser-warning': 'true',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            setTimeout(() => {
                saveBtn.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> Applied to Gateway`;
                saveBtn.classList.remove('bg-blue-600');
                saveBtn.classList.add('bg-emerald-600');
                lucide.createIcons();
                
                setTimeout(() => {
                    saveBtn.innerHTML = originalHTML;
                    saveBtn.classList.remove('bg-emerald-600');
                    saveBtn.classList.add('bg-blue-600');
                    lucide.createIcons();
                    saveBtn.disabled = false;
                }, 2000);
            }, 800);
        } else {
            throw new Error("API responded with an error");
        }
    } catch (err) {
        console.error("Failed to save provider config:", err);
        saveBtn.innerHTML = `❌ Error Saving`;
        saveBtn.disabled = false;
        setTimeout(() => { saveBtn.innerHTML = originalHTML; lucide.createIcons(); }, 2500);
    }
}

// 5. LOAD LIVE METRICS
async function loadLiveMetrics() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/metrics`, { headers: { 'ngrok-skip-browser-warning': 'true' } });
        if (!response.ok) throw new Error();
        
        const metrics = await response.json();
        
        // Update counters
        document.getElementById('metricLatency').textContent = metrics.avgLatencyMs || 0;
        document.getElementById('metricTokens').textContent = (metrics.totalTokens || 0).toLocaleString();
        document.getElementById('metricSessions').textContent = metrics.activeSessions || 0;
        document.getElementById('metricRequests').textContent = metrics.totalRequests || 0;

        // Update active provider badge if any
        if (metrics.activeLlmProvider) {
            const cards = document.querySelectorAll('.provider-card');
            cards.forEach(c => {
                const isCurrent = c.dataset.provider === metrics.activeLlmProvider;
                c.classList.toggle('active', isCurrent);
                const badge = c.querySelector('span.uppercase');
                if (badge) {
                    if (isCurrent) {
                        badge.textContent = "Active";
                        badge.className = "text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full";
                    } else {
                        badge.textContent = "Standby";
                        badge.className = "text-[10px] uppercase font-bold text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded-full";
                    }
                }
            });
        }

        // Update sensor tags
        updateStatusLamp('FER', metrics.sensorStatus?.fer);
        updateStatusLamp('SER', metrics.sensorStatus?.ser);
        updateStatusLamp('TER', metrics.sensorStatus?.ter);

    } catch (err) {
        console.warn("Metrics endpoint connection down, waiting for server fallback...");
    }
}

function updateStatusLamp(id, status) {
    const el = document.getElementById(`status${id}`);
    if (!el) return;
    
    el.className = "font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider";
    if (status === "online") {
        el.classList.add("text-emerald-400", "bg-emerald-500/10");
        el.textContent = "ONLINE";
    } else if (status === "degraded") {
        el.classList.add("text-amber-400", "bg-amber-500/10");
        el.textContent = "DEGRADED";
    } else {
        el.classList.add("text-red-400", "bg-red-500/10");
        el.textContent = "OFFLINE";
    }
}

// 6. MASTER SYSTEM PROMPT PREVIEW & PERSONAS INTERPOLATOR
const STATIC_PROMPTS = {
    companion: `You are active in 'Companion Mode'. Be exceptionally warm, reassuring, and empathetic.\nFocus on listening, comforting, and being a steady presence in their day.`,
    therapist: `You are active in 'Therapist Mode'. Use active listening, ask gentle open-ended questions,\nand provide grounding techniques (like 4-7-8 breathing) when anxiety is high.\nPrioritize soft reassurance, calming pacing, and a safe, non-judgmental atmosphere.`,
    jarvis: `You are active in 'Jarvis Mode'. Sound highly intelligent, futuristic, cinematic, and calm.\nUse professional yet cool tones. Be polite, refer to the user naturally (but casual),\nand sound like an advanced operating system companion.`,
    egyptian: `You are active in 'Friendly Egyptian Mode'. Speak in natural, casual, everyday Egyptian Arabic dialect (العامية المصرية).\nBe warm, humorous, supportive, and extremely down-to-earth (ابن بلد). Use casual Egyptian friendly expressions\n(like 'يا صديقي'، 'يا غالي'، 'كل حاجة هتبقى تمام'، 'فضفضلي') naturally and without robotic framing.`
};

function loadPromptTemplate() {
    const selectedPersona = document.getElementById('personaSelector').value;
    const personaPrompt = STATIC_PROMPTS[selectedPersona] || STATIC_PROMPTS.companion;

    const masterPrompt = `# NEXUS AI — MASTER SYSTEM PROMPT

You are NEXUS AI — an advanced multimodal emotionally-aware conversational AI system.
Your role is NOT to act like a generic chatbot.
You are a real-time empathetic AI companion capable of understanding human emotions.

# EMOTION FUSION CONTEXT
* Fused Emotion: {fused_emotion} (calculated using 55% Face, 38% Voice, 7% Text)
* Current User Transcript: {transcript}
* Recent Emotion History: {timeline}

# PERSONA SPECIFIC INSTRUCTIONS:
${personaPrompt}

# RESPONSE RULES:
* Respond naturally, warmly, and empathetically.
* Preserve Egyptian Arabic dialect naturally if the user switches.`;

    document.getElementById('systemPromptArea').value = masterPrompt;
}

// 7. EMOTIONAL TIMELINE LOADER
async function loadTimelineData() {
    try {
        // Fetch last session from history first to get ID
        const historyRes = await fetch(`${API_BASE_URL}/chat/history`, { headers: { 'ngrok-skip-browser-warning': 'true' } });
        if (historyRes.ok) {
            const data = await historyRes.json();
            if (data.sessionId) {
                currentSessionId = data.sessionId;
                
                const timelineRes = await fetch(`${API_BASE_URL}/session/timeline?sessionId=${currentSessionId}`, { headers: { 'ngrok-skip-browser-warning': 'true' } });
                if (timelineRes.ok) {
                    const timeline = await timelineRes.json();
                    renderTimeline(timeline);
                    return;
                }
            }
        }
        
        // Show empty if no session active
        document.getElementById('timelineContainer').innerHTML = `<div class="text-xs text-slate-500 py-3 italic">No active session timeline detected yet. Start a chat or session to begin monitoring logs.</div>`;
    } catch (err) {
        // Silent fallback
    }
}

function renderTimeline(timeline) {
    const container = document.getElementById('timelineContainer');
    if (!timeline || timeline.length === 0) {
        container.innerHTML = `<div class="text-xs text-slate-500 py-3 italic font-medium">Timeline empty. Waiting for multimodal analysis triggers...</div>`;
        return;
    }

    container.innerHTML = '';
    
    // Sort timeline descending (most recent first)
    const reversed = [...timeline].reverse();

    reversed.forEach((item, idx) => {
        const time = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const pct = (item.confidence * 100).toFixed(0);
        
        const colors = {
            Happy: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
            Sad: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
            Angry: 'text-red-400 bg-red-500/10 border-red-500/20',
            Fearful: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
            Disgust: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
            Neutral: 'text-slate-400 bg-slate-500/10 border-slate-500/20'
        };

        const activeClass = idx === 0 ? "border-l-2 border-blue-500 pl-2 bg-blue-500/5 py-1.5 rounded-r-lg" : "";
        const badgeColor = colors[item.emotion] || 'text-slate-400 bg-slate-500/10 border-slate-500/20';

        const row = document.createElement('div');
        row.className = `text-xs flex items-center justify-between gap-3 ${activeClass}`;
        row.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="text-[10px] text-slate-500 code-fira">${time}</span>
                <span class="px-2 py-0.5 border rounded-md font-semibold ${badgeColor}">${item.emotion}</span>
            </div>
            <span class="text-slate-400 font-medium">${pct}% Fused Conf</span>
        `;
        container.appendChild(row);
    });
}
