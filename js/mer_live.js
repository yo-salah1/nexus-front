/* ============================================================
   NEXUS — MER Live Session AI Companion Controller
   ============================================================ */

const CONFIG = window.NEXUS_CONFIG;
const API_BASE = CONFIG.API_BASE_URL;

const EMOJI_MAP = {
    'Neutral': '😶',
    'Happy':   '😊',
    'Sad':     '😢',
    'Angry':   '😠',
    'Fearful': '😨',
    'Disgust': '🤢'
};

const COLORS = {
    'Happy': '#f59e0b', 'Sad': '#60a5fa', 'Angry': '#ef4444',
    'Fearful': '#a78bfa', 'Disgust': '#10b981', 'Neutral': '#9ca3af'
};

// App State
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let recognition = null;
let finalTranscript = "";
let stream = null;
let captureCanvas = document.createElement('canvas');
let isCamMuted = false;
let isMicMuted = false;
let currentSessionId = null;

// UI Elements
const btn = document.getElementById('recordBtn');
const btnText = document.getElementById('btnText');
const micIcon = document.getElementById('micIcon');
const recIndicator = document.getElementById('recIndicator');
const transcriptText = document.getElementById('transcriptText');
const webcam = document.getElementById('webcam');
const chatHistory = document.getElementById('chatHistory');

document.addEventListener('DOMContentLoaded', async () => {
    lucide.createIcons();
    initWebcam();
    initSpeechRecognition();
    btn.addEventListener('click', toggleSession);

    document.getElementById('toggleCam').addEventListener('click', toggleCamera);
    document.getElementById('toggleMic').addEventListener('click', toggleMicrophone);
    document.getElementById('cancelBtn').addEventListener('click', resetSession);
});

function resetSession() {
    // Stop Speech synthesis if speaking
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }

    if (isRecording) {
        isRecording = false;
        if (mediaRecorder) mediaRecorder.stop();
        if (recognition) recognition.stop();
    }
    
    // UI Resets
    btn.classList.remove('recording');
    btnText.textContent = "Connect Live Companion";
    micIcon.setAttribute('data-lucide', 'mic');
    recIndicator.classList.remove('active');
    
    // Clear Results
    document.getElementById('bigEmoji').textContent = '😶';
    document.getElementById('fusionLabel').textContent = 'Companion Unconnected';
    document.getElementById('fusionConfFill').style.width = '0%';
    document.getElementById('fusionConfText').textContent = '0% Confidence';
    
    transcriptText.textContent = "Awaiting voice capture...";
    transcriptText.classList.add('placeholder');
    chatHistory.innerHTML = `<div class="text-xs text-slate-500 py-6 text-center italic">Connect the Live Companion and start speaking to activate dialogue stream.</div>`;
    
    lucide.createIcons();
    if (window.checkSystemHealth) checkSystemHealth();
    
    // Redirect to Home
    window.location.href = 'home.html';
}

function toggleCamera() {
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
        isCamMuted = !isCamMuted;
        videoTrack.enabled = !isCamMuted;
        const btn = document.getElementById('toggleCam');
        btn.classList.toggle('active', !isCamMuted);
        btn.querySelector('i').setAttribute('data-lucide', isCamMuted ? 'video-off' : 'video');
        lucide.createIcons();
    }
}

function toggleMicrophone() {
    if (!stream) return;
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
        isMicMuted = !isMicMuted;
        audioTrack.enabled = !isMicMuted;
        const btn = document.getElementById('toggleMic');
        btn.classList.toggle('active', !isMicMuted);
        btn.querySelector('i').setAttribute('data-lucide', isMicMuted ? 'mic-off' : 'mic');
        lucide.createIcons();
    }
}

async function initWebcam() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 1280, height: 720 }, 
            audio: true 
        });
        webcam.srcObject = stream;
        
        document.getElementById('toggleCam').classList.add('active');
        document.getElementById('toggleMic').classList.add('active');
    } catch (err) {
        console.error("Webcam error:", err);
        alert("Camera and Mic access required for MER Live Session.");
    }
}

function initSpeechRecognition() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!window.SpeechRecognition) {
        console.warn("SpeechRecognition not supported in this browser.");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ar-EG'; // Support Arabic natively

    recognition.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + " ";
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        
        const display = finalTranscript + interimTranscript;
        transcriptText.textContent = display || "Listening...";
        transcriptText.classList.remove('placeholder');
        
        // Interrupt/Barge-in: if user starts speaking while AI is speaking, cancel speech!
        if (display.trim().length > 0 && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
            console.log("🗣️ Barge-In trigger: Cancelling active TTS playback!");
            window.speechSynthesis.cancel();
            // Call backend interrupt to clear active tokens
            if (currentSessionId) {
                fetch(`${API_BASE}/session/interrupt`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ sessionId: currentSessionId })
                }).catch(() => {});
            }
        }
    };

    recognition.onerror = (e) => {
        console.warn("SpeechRecognition error:", e);
    };
}

async function toggleSession() {
    if (isRecording) {
        await stopSession();
    } else {
        await startSession();
    }
}

async function startSession() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Cancel any lingering speech
    }

    isRecording = true;
    finalTranscript = "";
    audioChunks = [];
    
    // UI state
    btn.classList.add('recording');
    btn.classList.add('speaking-pulse');
    btnText.textContent = "Finish Speaking";
    micIcon.setAttribute('data-lucide', 'mic-off');
    recIndicator.classList.add('active');
    
    transcriptText.textContent = "Listening...";
    transcriptText.classList.add('placeholder');
    
    lucide.createIcons();

    // Start Audio Recorder
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data);
    };
    mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const frameBlob = await captureVideoFrame();
        await performEmpatheticAIInteraction(frameBlob, audioBlob, finalTranscript.trim());
    };

    mediaRecorder.start();
    if (recognition) recognition.start();
}

async function stopSession() {
    isRecording = false;
    btn.classList.remove('recording');
    btn.classList.remove('speaking-pulse');
    btnText.textContent = "Processing reply...";
    micIcon.setAttribute('data-lucide', 'loader');
    recIndicator.classList.remove('active');
    lucide.createIcons();

    if (mediaRecorder) mediaRecorder.stop();
    if (recognition) recognition.stop();
}

function captureVideoFrame() {
    return new Promise((resolve) => {
        if (isCamMuted || !webcam.srcObject) {
            resolve(null);
            return;
        }
        
        captureCanvas.width = webcam.videoWidth || 640;
        captureCanvas.height = webcam.videoHeight || 480;
        const ctx = captureCanvas.getContext('2d');
        ctx.scale(-1, 1); // unmirror
        ctx.drawImage(webcam, -captureCanvas.width, 0, captureCanvas.width, captureCanvas.height);
        
        captureCanvas.toBlob((blob) => {
            resolve(blob);
        }, 'image/jpeg', 0.85);
    });
}

// ── CORE MULTIMODAL AI TRANSACTION ──
async function performEmpatheticAIInteraction(frameBlob, audioBlob, transcript) {
    let ferEmotion = "Neutral";
    let serEmotion = "Neutral";
    let emotionConf = 0.8;

    try {
        // A. Parallel Sensor Analysis Calls
        const fdImg = new FormData();
        if (frameBlob) fdImg.append('file', frameBlob, 'frame.jpg');

        const fdAud = new FormData();
        fdAud.append('file', audioBlob, 'voice.webm');

        const promises = [];
        
        // 1. Image sensor prediction
        if (frameBlob) {
            promises.push(
                fetch(`${API_BASE}/fer/analyze`, { method: 'POST', headers: {'ngrok-skip-browser-warning':'true'}, body: fdImg })
                .then(r => r.json())
                .catch(() => ({ emotion: 'Neutral', confidence: 0.0 }))
            );
        } else {
            promises.push(Promise.resolve({ emotion: 'Neutral', confidence: 0.0 }));
        }

        // 2. Audio sensor prediction
        promises.push(
            fetch(`${API_BASE}/voice/analyze`, { method: 'POST', headers: {'ngrok-skip-browser-warning':'true'}, body: fdAud })
            .then(r => r.json())
            .catch(() => ({ emotion: 'Neutral', confidence: 0.0 }))
        );

        const [ferRes, serRes] = await Promise.all(promises);
        
        ferEmotion = ferRes.emotion || "Neutral";
        serEmotion = serRes.emotion || "Neutral";
        emotionConf = Math.max(ferRes.confidence || 0.0, serRes.confidence || 0.0) || 0.8;

        // B. Send sensory tokens and transcription to primary LLM Router!
        currentSessionId = currentSessionId || 'live_sess_' + Date.now();
        
        // Render user message bubble immediately
        appendChatBubble("user", transcript || "[Sensory cues sent silently]");

        const response = await fetch(`${API_BASE}/chat`, {
            method: 'POST',
            headers: {
                'ngrok-skip-browser-warning': 'true',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: transcript || "...",
                sessionId: currentSessionId,
                fer_emotion: ferEmotion,
                ser_emotion: serEmotion,
                emotion_confidence: emotionConf
            })
        });

        if (!response.ok) throw new Error("API Connection broken");
        const data = await response.json();

        // C. Update Dynamic MER Fusion UI Gauges
        const fused = data.emotion || "Neutral";
        const fusedPct = (data.confidence * 100).toFixed(0);
        
        document.getElementById('bigEmoji').textContent = EMOJI_MAP[fused] || '😶';
        document.getElementById('fusionLabel').textContent = fused;
        document.getElementById('fusionLabel').style.color = COLORS[fused] || '#e2e8f0';
        document.getElementById('fusionConfFill').style.width = `${fusedPct}%`;
        document.getElementById('fusionConfFill').style.backgroundColor = COLORS[fused] || '#3b82f6';
        document.getElementById('fusionConfText').textContent = `${fusedPct}% Confidence`;

        // D. Render Generative Assistant Reply Bubble
        appendChatBubble("assistant", data.reply || "...");

        // E. Synthesize Spoken Audio with Emotional Voice Modulation parameters!
        speakEmotively(data.reply || "", fused);

    } catch (err) {
        console.error(err);
        appendChatBubble("assistant", "سامحني يا غالي، حصلت مشكلة في الربط بالسيرفر. فضفضلي تاني وهكون معاك. 🤍");
        speakEmotively("سامحني يا غالي، حصلت مشكلة في الربط بالسيرفر. فضفضلي تاني وهكون معاك.", "Sad");
    } finally {
        // Restore CTA state
        btnText.textContent = "Connect Live Companion";
        micIcon.setAttribute('data-lucide', 'mic');
        lucide.createIcons();
    }
}

// ── RENDER DIALOGUE BUBBLES ──
function appendChatBubble(role, text) {
    // Clear placeholder text if first message
    if (chatHistory.querySelector('div.text-slate-500')) {
        chatHistory.innerHTML = '';
    }

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${role}`;
    bubble.textContent = text;
    chatHistory.appendChild(bubble);
    
    // Auto Scroll to bottom
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// ── EMOTIONAL TTS VOICE SYNTHESIS ENGINE ──
function speakEmotively(text, emotion) {
    if (!('speechSynthesis' in window)) return;
    
    // Cancel active synthesis first to clear buffer
    window.speechSynthesis.cancel();
    
    // Standardize string formatting
    const cleanedText = text.replace(/[*_~`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    
    // Auto-detect language
    const isArabic = /[\u0600-\u06FF]/.test(cleanedText);
    utterance.lang = isArabic ? 'ar-EG' : 'en-US';
    
    // Dynamic Parameter Modulation based on fused emotion!
    if (emotion === 'Sad') {
        utterance.rate = 0.76; // Softer & Slower
        utterance.pitch = 0.85; // Calmer and lower tone
    } else if (emotion === 'Happy') {
        utterance.rate = 1.16; // Expressive & Fast
        utterance.pitch = 1.15; // Energetic and bright pitch
    } else if (emotion === 'Fearful') {
        utterance.rate = 0.85; // Grounding pace
        utterance.pitch = 1.0;
    } else if (emotion === 'Angry') {
        utterance.rate = 0.92; // Grounded & emotionally controlled
        utterance.pitch = 0.95;
    } else {
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
    }

    console.log(`🔊 Speaking with Emotional Voice Modulation [Rate: ${utterance.rate}, Pitch: ${utterance.pitch}]`);
    window.speechSynthesis.speak(utterance);
}
