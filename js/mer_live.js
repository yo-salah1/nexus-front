/* ============================================================
   NEXUS — MER Live Session AI Companion Controller (Fixed)
   ============================================================ */

const CONFIG = window.NEXUS_CONFIG;
const API_BASE = CONFIG.API_BASE_URL;

const EMOJI_MAP = {
    'Neutral': '😶', 'Happy': '😊', 'Sad': '😢',
    'Angry': '😠', 'Fearful': '😨', 'Disgust': '🤢'
};
const COLORS = {
    'Happy': '#f59e0b', 'Sad': '#60a5fa', 'Angry': '#ef4444',
    'Fearful': '#a78bfa', 'Disgust': '#10b981', 'Neutral': '#9ca3af'
};

// ── State ──────────────────────────────────────────────────
let isRecording         = false;
let mediaRecorder       = null;
let audioChunks         = [];
let recognition         = null;
let isRecognitionActive = false;
let recognitionRestartTimer = null;
let finalTranscript     = '';
let stream              = null;
let captureCanvas       = document.createElement('canvas');
let isCamMuted          = false;
let isMicMuted          = false;
let currentSessionId    = null;



// Visualizer state
let audioCtx            = null;
let analyser            = null;
let drawVisual          = null;

// ── UI Elements ───────────────────────────────────────────
const btn             = document.getElementById('recordBtn');
const btnText         = document.getElementById('btnText');
const micIcon         = document.getElementById('micIcon');
const recIndicator    = document.getElementById('recIndicator');
const transcriptInput = document.getElementById('transcriptInput');
const webcam          = document.getElementById('webcam');
const chatHistory     = document.getElementById('chatHistory');



// ── DOMContentLoaded ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    lucide.createIcons();
    initSpeechRecognition();
    initWebcam().catch(e => console.warn('initWebcam:', e));
    enumerateAudioDevices().catch(e => console.warn('enumDevices:', e));

    btn.addEventListener('click', toggleSession);
    document.getElementById('toggleCam').addEventListener('click', toggleCamera);
    document.getElementById('toggleMic').addEventListener('click', toggleMicrophone);
    document.getElementById('cancelBtn').addEventListener('click', resetSession);
    document.getElementById('sendTextBtn').addEventListener('click', sendTypedMessage);
    document.getElementById('transcriptInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendTypedMessage();
    });
});

// ── Session Control ───────────────────────────────────────
async function toggleSession() {
    isRecording ? await stopSession() : await startSession();
}

async function startSession() {
    if (!stream) {
        alert('محتاج ميكروفون عشان تبدأ.');
        return;
    }
    stopSpeaking();
    isRecording     = true;
    finalTranscript = '';
    audioChunks     = [];

    btn.classList.add('recording', 'speaking-pulse');
    btnText.textContent = 'Finish Speaking';
    micIcon.setAttribute('data-lucide', 'mic-off');
    recIndicator.classList.add('active');
    if (transcriptInput) transcriptInput.value = 'Listening...';
    lucide.createIcons();

    try {
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
            ? 'audio/webm;codecs=opus'
            : 'audio/webm';
        mediaRecorder = new MediaRecorder(stream, { mimeType });
    } catch {
        mediaRecorder = new MediaRecorder(stream);
    }

    mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data);
    };
    mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, 
            { type: mediaRecorder.mimeType || 'audio/webm' });
        const validAudio = audioBlob.size > 1000 ? audioBlob : null;
        const frameBlob = await captureVideoFrame();
        await performEmpatheticAIInteraction(
            frameBlob, validAudio, finalTranscript.trim()
        );
    };

    mediaRecorder.start();
    startRecognition();
}

async function stopSession() {
    isRecording = false;
    btn.classList.remove('recording', 'speaking-pulse');
    btnText.textContent = 'Processing reply...';
    micIcon.setAttribute('data-lucide', 'loader');
    recIndicator.classList.remove('active');
    lucide.createIcons();

    stopRecognition();
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
}

function resetSession() {
    stopSpeaking();
    if (isRecording) {
        isRecording = false;
        stopRecognition();
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
    }
    btn.classList.remove('recording', 'speaking-pulse');
    btnText.textContent = 'Connect Live Companion';
    micIcon.setAttribute('data-lucide', 'mic');
    recIndicator.classList.remove('active');

    document.getElementById('bigEmoji').textContent = '😶';
    document.getElementById('fusionLabel').textContent = 'Companion Unconnected';
    document.getElementById('fusionConfFill').style.width = '0%';
    document.getElementById('fusionConfText').textContent = '0% Confidence';
    if (transcriptInput) {
        transcriptInput.value = '';
        transcriptInput.placeholder = 'Awaiting voice capture or type here...';
    }
    chatHistory.innerHTML = `Connect the Live Companion and start speaking to activate dialogue stream.`;

    lucide.createIcons();
    if (window.checkSystemHealth) checkSystemHealth();
    window.location.href = 'home.html';
}

// ── Speech Recognition ────────────────────────────────────
function initSpeechRecognition() {
    window.SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!window.SpeechRecognition) {
        console.warn('SpeechRecognition not supported'); return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous      = true;
    recognition.interimResults  = true;
    recognition.maxAlternatives = 1;
    recognition.lang            = 'ar-EG';

    recognition.onstart = () => { isRecognitionActive = true; };

    recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + ' ';
            } else {
                interim += event.results[i][0].transcript;
            }
        }
        const display = (finalTranscript + interim).trim();
        if (transcriptInput && display) transcriptInput.value = display;

        // Barge-in
        if (isRecording && display.length > 2 && isTTSSpeaking) {
            stopSpeaking();
            if (currentSessionId) {
                fetch(`${API_BASE}/session/interrupt`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId: currentSessionId })
                }).catch(() => {});
            }
        }
    };

    recognition.onerror = (e) => {
        console.warn('Recognition error:', e.error);
        isRecognitionActive = false;
        if (isRecording && !['not-allowed','service-not-allowed'].includes(e.error)) {
            scheduleRecognitionRestart();
        }
    };

    recognition.onend = () => {
        isRecognitionActive = false;
        if (isRecording) scheduleRecognitionRestart();
    };
}

function scheduleRecognitionRestart(delay = 300) {
    clearTimeout(recognitionRestartTimer);
    recognitionRestartTimer = setTimeout(() => {
        if (isRecording && !isRecognitionActive && recognition) {
            try { recognition.start(); } catch(e) {}
        }
    }, delay);
}

function startRecognition() {
    if (!recognition || isRecognitionActive) return;
    try { recognition.start(); } catch(e) {}
}

function stopRecognition() {
    clearTimeout(recognitionRestartTimer);
    isRecognitionActive = false;
    if (recognition) { try { recognition.stop(); } catch(e) {} }
}

// ── Camera / Mic Toggle ───────────────────────────────────
async function initWebcam() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: true
        });
        webcam.srcObject = stream;
        document.getElementById('toggleCam').classList.add('active');
        document.getElementById('toggleMic').classList.add('active');
        initAudioVisualizer(stream);
    } catch {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            document.getElementById('toggleMic').classList.add('active');
            webcam.style.display = 'none';
            initAudioVisualizer(stream);
        } catch {
            alert('Microphone access required for MER session.');
        }
    }
}

function toggleCamera() {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (!track) return;
    isCamMuted = !isCamMuted;
    track.enabled = !isCamMuted;
    const b = document.getElementById('toggleCam');
    b.classList.toggle('active', !isCamMuted);
    b.querySelector('i').setAttribute('data-lucide', isCamMuted ? 'video-off' : 'video');
    lucide.createIcons();
}

// ── DOMContentLoaded is handled above, let's keep other parts in sync.
function toggleMicrophone() {
    if (!stream) return;
    const track = stream.getAudioTracks()[0];
    if (!track) return;
    isMicMuted = !isMicMuted;
    track.enabled = !isMicMuted;
    const b = document.getElementById('toggleMic');
    b.classList.toggle('active', !isMicMuted);
    b.querySelector('i').setAttribute('data-lucide', isMicMuted ? 'mic-off' : 'mic');
    lucide.createIcons();
}

// ── Frame Capture ─────────────────────────────────────────
function captureVideoFrame() {
    return new Promise((resolve) => {
        if (!webcam?.srcObject || isCamMuted || webcam.readyState < 2) {
            resolve(null); return;
        }
        const w = webcam.videoWidth, h = webcam.videoHeight;
        if (!w || !h) { resolve(null); return; }

        try {
            captureCanvas.width  = w;
            captureCanvas.height = h;
            const ctx = captureCanvas.getContext('2d');
            ctx.save();
            ctx.translate(w, 0);
            ctx.scale(-1, 1); // unmirror
            ctx.drawImage(webcam, 0, 0, w, h);
            ctx.restore();
            captureCanvas.toBlob(
                (blob) => resolve(blob || null),
                'image/jpeg', 0.82
            );
        } catch (e) {
            console.warn('Frame capture error:', e);
            resolve(null);
        }
    });
}

// ── Core AI Interaction ───────────────────────────────────
async function performEmpatheticAIInteraction(frameBlob, audioBlob, transcript) {
    let ferEmotion = 'Neutral', serEmotion = 'Neutral', emotionConf = 0.8;

    try {
        const headers = { 'ngrok-skip-browser-warning': 'true' };
        const promises = [];

        if (frameBlob) {
            const fd = new FormData();
            fd.append('file', frameBlob, 'frame.jpg');
            promises.push(
                fetch(`${API_BASE}/fer/analyze`, { method:'POST', headers, body:fd })
                    .then(r => r.ok ? r.json() : { emotion:'Neutral', confidence:0 })
                    .catch(() => ({ emotion:'Neutral', confidence:0 }))
            );
        } else {
            promises.push(Promise.resolve({ emotion:'Neutral', confidence:0 }));
        }

        if (audioBlob) {
            const fd = new FormData();
            fd.append('file', audioBlob, 'voice.webm');
            promises.push(
                fetch(`${API_BASE}/voice/analyze`, { method:'POST', headers, body:fd })
                    .then(r => r.ok ? r.json() : { emotion:'Neutral', confidence:0 })
                    .catch(() => ({ emotion:'Neutral', confidence:0 }))
            );
        } else {
            promises.push(Promise.resolve({ emotion:'Neutral', confidence:0 }));
        }

        const [ferRes, serRes] = await Promise.all(promises);
        ferEmotion  = ferRes.emotion    || 'Neutral';
        serEmotion  = serRes.emotion    || 'Neutral';
        emotionConf = Math.max(ferRes.confidence||0, serRes.confidence||0) || 0.8;

        let activeTranscript = transcript;
        if (!activeTranscript?.trim() || activeTranscript === 'Listening...') {
            if (serRes?.transcript?.trim()) {
                activeTranscript = serRes.transcript.trim();
                if (transcriptInput) transcriptInput.value = activeTranscript;
            }
        }

        currentSessionId = currentSessionId || 'live_sess_' + Date.now();
        appendChatBubble('user', activeTranscript || '[Sensory cues sent silently]');

        const res = await fetch(`${API_BASE}/chat`, {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: activeTranscript || '...',
                sessionId: currentSessionId,
                fer_emotion: ferEmotion,
                ser_emotion: serEmotion,
                emotion_confidence: emotionConf
            })
        });

        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();

        const fused    = data.emotion   || 'Neutral';
        const fusedPct = Math.round((data.confidence || 0) * 100);

        document.getElementById('bigEmoji').textContent      = EMOJI_MAP[fused] || '😶';
        document.getElementById('fusionLabel').textContent   = fused;
        document.getElementById('fusionLabel').style.color   = COLORS[fused] || '#e2e8f0';
        document.getElementById('fusionConfFill').style.width = `${fusedPct}%`;
        document.getElementById('fusionConfFill').style.backgroundColor = COLORS[fused];
        document.getElementById('fusionConfText').textContent = `${fusedPct}% Confidence`;

        const capitalize = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

        const bFER = document.getElementById('badgeFER');
        const bSER = document.getElementById('badgeSER');
        const bTER = document.getElementById('badgeTER');
        if (bFER) { bFER.textContent = ferEmotion; bFER.style.color = COLORS[ferEmotion]||'#9ca3af'; }
        if (bSER) { bSER.textContent = serEmotion; bSER.style.color = COLORS[serEmotion]||'#9ca3af'; }
        if (bTER) {
            const t = capitalize(data.ter_emotion || 'Neutral');
            bTER.textContent = t; bTER.style.color = COLORS[t]||'#9ca3af';
        }

        appendChatBubble('assistant', data.reply || '...');
        speakEmotively(data.reply || '', fused);

    } catch (err) {
        console.error('AI Interaction error:', err);
        const fallback = 'سامحني يا غالي، حصلت مشكلة في الربط بالسيرفر. فضفضلي تاني وهكون معاك. 🤍';
        appendChatBubble('assistant', fallback);
        speakEmotively(fallback, 'Sad');
    } finally {
        btnText.textContent = 'Connect Live Companion';
        micIcon.setAttribute('data-lucide', 'mic');
        lucide.createIcons();
    }
}

/* ============================================================
   NEXUS Edge TTS Engine — يستبدل كل كود Web Speech القديم
   ============================================================ */

let currentAudio    = null;   // الـ Audio object الشغال دلوقتي
let ttsQueue        = [];     // طابور النصوص
let isTTSSpeaking   = false;  // flag

/**
 * الفنكشن الرئيسية — بتستدعيها بدل speakEmotively القديمة
 * @param {string} text    - النص اللي هيتاقال
 * @param {string} emotion - Neutral | Happy | Sad | Angry | Fearful | Disgust
 */
async function speakEmotively(text, emotion = "Neutral") {
    if (!text?.trim()) return;

    // وقف أي كلام شغال وفضي الطابور
    stopSpeaking();

    const cleaned = text.replace(/[*_~`#]/g, "").trim();
    if (!cleaned) return;

    ttsQueue.push({ text: cleaned, emotion });
    if (!isTTSSpeaking) processNextTTS();
}

async function processNextTTS() {
    if (ttsQueue.length === 0) {
        isTTSSpeaking = false;
        return;
    }
    isTTSSpeaking = true;
    const { text, emotion } = ttsQueue.shift();

    try {
        const res = await fetch(`${API_BASE}/tts/synthesize`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
            body: JSON.stringify({ text, emotion }),
        });

        if (!res.ok) {
            console.warn("TTS API error:", res.status, await res.text());
            isTTSSpeaking = false;
            processNextTTS();
            return;
        }

        const audioBlob = await res.blob();
        const audioUrl  = URL.createObjectURL(audioBlob);

        currentAudio = new Audio(audioUrl);

        currentAudio.onended = () => {
            URL.revokeObjectURL(audioUrl);  // حرر الذاكرة
            currentAudio = null;
            isTTSSpeaking = false;
            processNextTTS();   // الكلمة الجاية في الطابور
        };

        currentAudio.onerror = (e) => {
            console.warn("Audio playback error:", e);
            URL.revokeObjectURL(audioUrl);
            currentAudio = null;
            isTTSSpeaking = false;
            processNextTTS();
        };

        await currentAudio.play();
        console.log(`TTS playing — emotion: ${emotion}, voice: ${res.headers.get("X-Voice")}`);

    } catch (err) {
        console.error("Edge TTS fetch failed:", err);
        isTTSSpeaking = false;
        processNextTTS();
    }
}

/**
 * بيوقف الكلام فوراً ويفضي الطابور
 * استدعيها في barge-in وفي resetSession
 */
function stopSpeaking() {
    if (currentAudio) {
        currentAudio.onended = null;
        currentAudio.onerror = null;
        currentAudio.pause();
        currentAudio.src = "";
        currentAudio = null;
    }
    ttsQueue     = [];
    isTTSSpeaking = false;
}

// ── Chat Bubbles ──────────────────────────────────────────
function appendChatBubble(role, text) {
    if (chatHistory.querySelector('div.text-slate-500')) chatHistory.innerHTML = '';
    const bubble  = document.createElement('div');
    bubble.className = `chat-bubble ${role}`;
    const label   = document.createElement('span');
    label.className = 'chat-bubble-label';
    label.textContent = role === 'user'
        ? 'أنت — You' : 'المساعد الذكي — NEXUS LLM Response';
    label.style.color = role === 'user' ? '#a1a1aa' : '#34d399';
    const content = document.createElement('div');
    content.textContent = text;
    bubble.appendChild(label);
    bubble.appendChild(content);
    chatHistory.appendChild(bubble);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// ── Typed Message ─────────────────────────────────────────
async function sendTypedMessage() {
    if (!transcriptInput) return;
    const val = transcriptInput.value.trim();
    if (!val || val === 'Awaiting voice capture or type here...'
             || val === 'Listening...') return;

    btnText.textContent = 'Processing reply...';
    micIcon.setAttribute('data-lucide', 'loader');
    lucide.createIcons();

    try {
        const frameBlob = await captureVideoFrame();
        await performEmpatheticAIInteraction(frameBlob, null, val);
    } catch(e) { console.error(e); }
    finally { transcriptInput.value = ''; }
}

// ── Mic Selector & Visualizer ─────────────────────────────
async function enumerateAudioDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const inputs  = devices.filter(d => d.kind === 'audioinput');
    const select  = document.getElementById('micSelect');
    if (!select) return;
    select.innerHTML = '';
    inputs.forEach((d, i) => {
        const opt = document.createElement('option');
        opt.value = d.deviceId;
        opt.textContent = d.label || `Microphone ${i+1}`;
        select.appendChild(opt);
    });
    select.addEventListener('change', () => switchMicrophone(select.value));
}

async function switchMicrophone(deviceId) {
    if (!stream) return;
    stream.getAudioTracks().forEach(t => t.stop());
    try {
        const ns = await navigator.mediaDevices.getUserMedia({
            audio: { deviceId: { exact: deviceId } }
        });
        stream.getAudioTracks().forEach(t => stream.removeTrack(t));
        stream.addTrack(ns.getAudioTracks()[0]);
        initAudioVisualizer(ns);
    } catch(e) { console.error('Mic switch failed:', e); }
}

function initAudioVisualizer(audioStream) {
    if (drawVisual) cancelAnimationFrame(drawVisual);
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!audioCtx || audioCtx.state === 'closed') {
            audioCtx = new AudioContext();
        }
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        audioCtx.createMediaStreamSource(audioStream).connect(analyser);

        const canvas    = document.getElementById('micVisualizer');
        if (!canvas) return;
        const canvasCtx = canvas.getContext('2d');
        const bufLen    = analyser.frequencyBinCount;
        const data      = new Uint8Array(bufLen);
        const fallback  = document.getElementById('visualizerFallback');
        if (fallback) fallback.style.display = 'none';

        function draw() {
            drawVisual = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(data);
            canvasCtx.fillStyle = 'rgba(0,0,0,0.2)';
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
            const bw = (canvas.width / bufLen) * 2.5;
            let x = 0;
            for (let i = 0; i < bufLen; i++) {
                const bh = data[i] / 2.5;
                canvasCtx.fillStyle = `hsla(${160 + i*2},100%,50%,0.85)`;
                canvasCtx.fillRect(x, canvas.height - bh, bw - 2, bh);
                x += bw;
            }
        }
        draw();
    } catch(e) { console.warn('Visualizer error:', e); }
}
