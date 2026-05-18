/* NEXUS — Voice (../js/premium_voice.js) - SER INTEGRATED */

const API_BASE_URL = window.NEXUS_CONFIG.API_BASE_URL;
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let currentSessionId = null;
let premiumVoices = [];

function loadVoices() {
    if ('speechSynthesis' in window) {
        premiumVoices = window.speechSynthesis.getVoices();
    }
}
if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
}

const COLORS = {
    Happy:'#f59e0b', Sad:'#60a5fa', Angry:'#ef4444',
    Fearful:'#a78bfa', Disgust:'#10b981', Neutral:'#9ca3af'
};

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initVoice();
    initParticles();
});

// ── VOICE ──
function initVoice() {
    const btn = document.getElementById('voiceBtn');
    if (btn) btn.addEventListener('click', toggleRecording);
}

document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        toggleRecording();
    }
});

async function toggleRecording() {
    isRecording ? stopRecording() : await startRecording();
}

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunks = [];
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunks.push(e.data); };
        mediaRecorder.onstop = async () => { stream.getTracks().forEach(t => t.stop()); await processAudio(); };
        mediaRecorder.start();
        isRecording = true;

        // UI
        document.getElementById('voiceBtn').classList.add('listening');
        document.getElementById('avatarImg').classList.add('speaking');
        document.getElementById('waveLeft').classList.add('active');
        document.getElementById('waveRight').classList.add('active');
        setStatus('Listening...', true);
        setQuery('🎙️ Recording... click to stop');
        setMicLabel('recording');

    } catch (err) {
        setQuery('❌ Microphone access denied');
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    isRecording = false;

    // UI
    document.getElementById('voiceBtn').classList.remove('listening');
    document.getElementById('avatarImg').classList.remove('speaking');
    document.getElementById('waveLeft').classList.remove('active');
    document.getElementById('waveRight').classList.remove('active');
    setStatus('Processing...', true);
    setMicLabel('analyzing...');
}

async function processAudio() {
    try {
        const blob = new Blob(audioChunks, { type: 'audio/webm' });
        setQuery('🧠 Analyzing emotion...');
        if (window.setLampsState) setLampsState('analyzing');

        const fd = new FormData();
        fd.append('file', blob, 'recording.webm');

        const serRes  = await fetch(`${API_BASE_URL}/voice/analyze`, { method:'POST', headers: {'ngrok-skip-browser-warning': 'true'}, body:fd });
        const serData = await serRes.json();
        const emotion    = serData.emotion    || 'Neutral';
        const confidence = serData.confidence || 0;

        showEmotionCard(emotion, confidence, serData.all_probs || {});
        setQuery(`Detected: ${emotion} (${(confidence*100).toFixed(0)}%)`);

        currentSessionId = currentSessionId || genId();
        const chatRes  = await fetch(`${API_BASE_URL}/chat`, {
            method:'POST',
            headers:{'ngrok-skip-browser-warning': 'true','Content-Type':'application/json'},
            body: JSON.stringify({
                message: `I'm feeling ${emotion.toLowerCase()}`,
                sessionId: currentSessionId,
                emotion,
                emotion_confidence: confidence
            })
        });
        const chatData = await chatRes.json();
        showAICard(chatData.reply || '');
        speakEmotively(chatData.reply || '', emotion);

        setStatus('Ready', false);
        setMicLabel('tap to speak');
        if (window.checkSystemHealth) {
            setLampsState(null);
            checkSystemHealth();
        }

    } catch (err) {
        setQuery('❌ ' + err.message);
        setStatus('Ready', false);
        setMicLabel('tap to speak');
        if (window.setLampsState) setLampsState('offline');
        setTimeout(() => { if (window.checkSystemHealth) checkSystemHealth(); }, 2000);
    }
}

// ── UI ──
function showEmotionCard(emotion, confidence, allProbs) {
    const color = COLORS[emotion] || '#9ca3af';

    document.getElementById('idleCard').style.display = 'none';

    const card = document.getElementById('emotionCard');
    card.style.display = 'block';
    card.style.borderColor = color + '55';

    document.getElementById('emotionName').textContent = emotion;
    document.getElementById('emotionName').style.color = color;
    document.getElementById('emotionConf').textContent = `${(confidence*100).toFixed(0)}% confidence`;

    const sorted = Object.entries(allProbs).sort((a,b) => b[1]-a[1]);
    document.getElementById('probBars').innerHTML = sorted.map(([lbl, p]) => `
        <div class="prob-row">
            <span class="prob-lbl">${lbl}</span>
            <div class="prob-track">
                <div class="prob-fill" style="width:${(p*100).toFixed(0)}%;background:${COLORS[lbl]||'#9ca3af'}"></div>
            </div>
            <span class="prob-pct">${(p*100).toFixed(0)}%</span>
        </div>
    `).join('');
}

function showAICard(text) {
    if (!text) return;
    const card = document.getElementById('aiCard');
    card.style.display = 'block';

    const el = document.getElementById('aiText');
    el.innerHTML = '<span class="ai-cursor"></span>';
    let i = 0;
    const iv = setInterval(() => {
        if (i < text.length) {
            el.innerHTML = text.slice(0, ++i) + '<span class="ai-cursor"></span>';
        } else {
            el.innerHTML = text;
            clearInterval(iv);
        }
    }, 18);
}

function setQuery(text) {
    const el = document.getElementById('userQuery');
    if (el) el.textContent = text;
}

function setStatus(text, active) {
    const pill = document.getElementById('statusPill');
    const txt  = document.getElementById('statusText');
    if (pill) pill.classList.toggle('active', active);
    if (txt)  txt.textContent = text;
}

function setMicLabel(text) {
    const el = document.getElementById('micLabel');
    if (el) el.textContent = text;
}

// ── PARTICLES ──
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const pts = Array.from({length:28}, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 0.5,
        vy: Math.random() * 0.35 + 0.15,
        o: Math.random() * 0.4 + 0.15
    }));

    (function animate() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        pts.forEach(p => {
            ctx.fillStyle = `rgba(255,255,255,${p.o})`;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
            p.y -= p.vy;
            if (p.y < -8) { p.y = canvas.height+8; p.x = Math.random()*canvas.width; }
        });
        requestAnimationFrame(animate);
    })();
}

function genId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2,8);
}

// ── EMOTIONAL TTS VOICE SYNTHESIS ENGINE ──
function speakEmotively(text, emotion) {
    if (!('speechSynthesis' in window)) return;
    
    // Cancel active synthesis first to clear buffer
    window.speechSynthesis.cancel();
    
    // Standardize string formatting
    const cleanedText = text.replace(/[*_~`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    window.activeUtterance = utterance; // Prevent garbage collection
    
    // Auto-detect language
    const isArabic = /[\u0600-\u06FF]/.test(cleanedText);
    utterance.lang = isArabic ? 'ar-EG' : 'en-US';
    
    // Select premium/natural voice if available
    const voices = premiumVoices.length ? premiumVoices : window.speechSynthesis.getVoices();
    let selectedVoice = null;
    
    if (isArabic) {
        // Look for premium online/natural Arabic voices
        selectedVoice = voices.find(v => v.lang.startsWith('ar') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural') || v.name.includes('Online')));
        if (!selectedVoice) {
            selectedVoice = voices.find(v => v.lang.startsWith('ar') && v.name.includes('Salma'));
        }
        if (!selectedVoice) {
            selectedVoice = voices.find(v => v.lang.startsWith('ar') && v.name.includes('Naayf'));
        }
        if (!selectedVoice) {
            selectedVoice = voices.find(v => v.lang.startsWith('ar') && v.name.includes('Hoda'));
        }
        if (!selectedVoice) {
            selectedVoice = voices.find(v => v.lang.startsWith('ar'));
        }
    } else {
        // Look for premium online/natural English voices
        selectedVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural') || v.name.includes('Online')));
        if (!selectedVoice) {
            selectedVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('David'));
        }
        if (!selectedVoice) {
            selectedVoice = voices.find(v => v.lang.startsWith('en'));
        }
    }
    
    if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log(`🎙️ Selected Premium Voice: ${selectedVoice.name}`);
    }
    
    // Dynamic Parameter Modulation based on fused emotion!
    if (emotion === 'Sad') {
        utterance.rate = 0.85; // Safe softer rate
        utterance.pitch = 0.95; // Safe pitch
    } else if (emotion === 'Happy') {
        utterance.rate = 1.05; // Safe bright rate
        utterance.pitch = 1.05; 
    } else {
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
    }

    console.log(`🔊 Speaking with Emotional Voice Modulation [Rate: ${utterance.rate}, Pitch: ${utterance.pitch}]`);
    window.speechSynthesis.speak(utterance);
}