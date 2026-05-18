# NEXUS - MER Live Session Consolidated Codebase

هذا الملف يحتوي على جميع الأكواد الخاصة بصفحة الـ **MER Live Session (`mer_live.html`)** وجميع الملفات المرتبطة بها (سواء ملفات الـ Javascript أو الـ CSS) مجمعة بالكامل في ملف واحد لتسهيل الرجوع إليها ونسخها بسرعة.

---

## جدول المحتويات (Table of Contents)
1. [`Front/pages/mer_live.html`](#1-frontpagesmer_livehtml)
2. [`Front/js/mer_live.js`](#2-frontjsmer_livejs)
3. [`Front/css/mer.css`](#3-frontcssmercss)
4. [`Front/js/config.js`](#4-frontjsconfigjs)
5. [`Front/js/global.js`](#5-frontjsglobaljs)
6. [`Front/js/sidebar.js`](#6-frontjssidebarjs)
7. [`Front/css/ai_chat.css`](#7-frontcssai_chatcss)
8. [`Front/css/global.css`](#8-frontcssglobalcss)

---

## 1. `Front/pages/mer_live.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NEXUS - MER Live Session</title>

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <!-- Custom Styles -->
    <link rel="stylesheet" href="../css/global.css">
    <link rel="stylesheet" href="../css/ai_chat.css">
    <link rel="stylesheet" href="../css/mer.css">

    <link rel="icon" type="image/png" href="../assets/NEXUS_ICON_CROPPED.png">
    <script src="../js/config.js"></script>
    
    <style>
        /* Viewport-Compact overrides for the MER Live Dashboard */
        .mer-main {
            padding: 1.25rem !important;
            height: 100vh !important;
            display: flex !important;
            flex-direction: column !important;
            overflow: hidden !important;
        }
        
        .mer-header {
            margin-bottom: 0.75rem !important;
        }

        .mer-header h1 {
            font-size: 1.5rem !important;
            margin-bottom: 0.15rem !important;
        }

        .mer-header p {
            font-size: 0.75rem !important;
        }

        .mer-grid-container {
            height: calc(100vh - 90px) !important;
            min-height: 0;
        }

        .video-container {
            max-height: 260px !important;
            border-radius: 16px !important;
        }

        .controls-area {
            padding: 0.75rem !important;
            border-radius: 16px !important;
        }

        .universal-controls {
            margin-bottom: 0.75rem !important;
            gap: 1.25rem !important;
        }

        .mer-record-btn {
            height: 44px !important;
            border-radius: 22px !important;
            font-size: 0.9rem !important;
            width: 210px !important;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2) !important;
        }

        .btn-icon {
            width: 24px !important;
            height: 24px !important;
        }

        .transcript-box {
            padding: 0.75rem !important;
            border-radius: 16px !important;
            min-height: 60px !important;
        }

        .fusion-card {
            padding: 0.75rem !important;
            border-radius: 16px !important;
        }

        .big-emoji {
            font-size: 2.5rem !important;
            margin-bottom: 0.25rem !important;
        }

        .fusion-emotion {
            font-size: 1.1rem !important;
            margin-bottom: 0.5rem !important;
        }

        .fusion-conf-bar {
            height: 6px !important;
            margin-top: 0.5rem !important;
            margin-bottom: 0.25rem !important;
        }

        .live-chat-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            backdrop-filter: blur(16px);
            padding: 16px;
            height: 100%;
            display: flex;
            flex-direction: column;
            min-height: 200px !important;
        }

        .chat-bubble {
            padding: 10px 14px;
            border-radius: 14px;
            max-width: 85%;
            font-size: 13px;
            line-height: 1.45;
            margin-bottom: 10px;
            animation: fadeInBubble 0.3s ease-out;
        }

        .chat-bubble-label {
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
            display: block;
        }

        .chat-bubble.user {
            background: rgba(255, 255, 255, 0.07);
            color: #f1f5f9;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .chat-bubble.assistant {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15));
            color: #ffffff;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
            border: 1px solid rgba(59, 130, 246, 0.1);
            box-shadow: 0 4px 20px rgba(59, 130, 246, 0.05);
        }

        @keyframes fadeInBubble {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .speaking-pulse {
            animation: pulseVolume 1.5s ease-in-out infinite;
        }

        @keyframes pulseVolume {
            0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
            50% { transform: scale(1.05); box-shadow: 0 0 20px 4px rgba(59, 130, 246, 0.2); }
        }
    </style>
</head>
<body>
    <canvas id="nexusParticles" class="global-particles"></canvas>
    
    <div class="app-container">
        <!-- Sidebar Navigation -->
        <aside class="sidebar" id="sidebar"></aside>

        <!-- Main Workspace -->
        <main class="mer-main">
            <button class="mobile-sidebar-toggle" id="mobileSidebarToggle"><i data-lucide="menu"></i></button>

            <!-- Header Section -->
            <header class="mer-header">
                <div class="header-content">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="px-2.5 py-0.5 text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">Core Experience</span>
                        <div class="flex items-center gap-1.5">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                            <span class="text-[10px] text-slate-400 font-semibold">Live Mode</span>
                        </div>
                    </div>
                    <h1>NEXUS Live Companion</h1>
                    <p>Conversational Real-Time Empathetic Intelligence</p>
                </div>

                <div class="status-lamps">
                    <div class="lamp-item" id="lampFER">
                        <span class="lamp-dot"></span>
                        <span class="lamp-label">FER</span>
                    </div>
                    <div class="lamp-item" id="lampSER">
                        <span class="lamp-dot"></span>
                        <span class="lamp-label">SER</span>
                    </div>
                    <div class="lamp-item" id="lampTER">
                        <span class="lamp-dot"></span>
                        <span class="lamp-label">TER</span>
                    </div>
                    <div class="lamp-item" id="lampLLM">
                        <span class="lamp-dot"></span>
                        <span class="lamp-label">LLM</span>
                    </div>
                </div>
            </header>

            <!-- Grid Layout -->
            <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 mer-grid-container flex-1">
                
                <!-- LEFT COLUMN (Xl: 7 Cols) - Webcams & Controls -->
                <div class="xl:col-span-7 flex flex-col gap-4 h-full min-h-0">
                    <div class="video-container relative rounded-2xl overflow-hidden border border-white/8 bg-black/30 aspect-video">
                        <video id="webcam" autoplay playsinline muted class="w-full h-full object-cover scale-x-[-1]"></video>
                        <div class="overlay-visuals absolute inset-0 pointer-events-none">
                            <canvas id="visualGraph" class="w-full h-full"></canvas>
                        </div>
                        
                        <div class="recording-indicator" id="recIndicator">
                            <span class="pulse-dot"></span>
                            LIVE SENSOR
                        </div>
                    </div>

                    <!-- Sensor Controller Binds -->
                    <div class="controls-area flex flex-col items-center p-6 bg-white/3 border border-white/5 rounded-2xl">
                        <div class="universal-controls flex items-center justify-center gap-6 mb-6">
                            <div class="u-ctrl-wrap flex flex-col items-center">
                                <button class="u-ctrl-btn p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition" id="toggleCam" title="Toggle Camera">
                                    <i data-lucide="video" class="w-5 h-5"></i>
                                </button>
                                <div class="u-ctrl-label text-[10px] text-slate-400 mt-1">Camera</div>
                            </div>
                            
                            <div class="u-ctrl-wrap flex flex-col items-center">
                                <button class="u-ctrl-btn p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition" id="toggleMic" title="Toggle Microphone">
                                    <i data-lucide="mic" class="w-5 h-5"></i>
                                </button>
                                <div class="u-ctrl-label text-[10px] text-slate-400 mt-1">Mic</div>
                            </div>

                            <div class="u-ctrl-wrap flex flex-col items-center">
                                <button class="u-ctrl-btn danger p-3 bg-red-600 border border-red-500 rounded-full hover:bg-red-500 transition text-white" id="cancelBtn" title="End Session & Exit">
                                    <i data-lucide="phone-off" class="w-5 h-5"></i>
                                </button>
                                <div class="u-ctrl-label text-[10px] text-slate-400 mt-1">End</div>
                            </div>
                        </div>

                        <!-- Microphone Device Selector -->
                        <div class="mic-selector-wrap flex flex-col gap-1.5 w-full max-w-xs mb-4">
                            <label for="micSelect" class="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 justify-center">
                                <i data-lucide="settings" class="w-3.5 h-3.5 text-blue-400"></i>
                                <span>Select Active Microphone</span>
                            </label>
                            <select id="micSelect" class="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition cursor-pointer">
                                <option value="" disabled selected>Enumerating audio devices...</option>
                            </select>
                        </div>

                        <!-- Live Microphone Audio Waveform Visualizer -->
                        <div class="visualizer-wrap w-full max-w-sm h-14 bg-black/40 border border-white/10 rounded-xl overflow-hidden mb-6 relative">
                            <canvas id="micVisualizer" class="w-full h-full"></canvas>
                            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span id="visualizerFallback" class="text-[9px] font-medium text-slate-500 uppercase tracking-widest">Visualizer Inactive</span>
                            </div>
                        </div>

                        <button class="mer-record-btn flex items-center gap-3 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/25" id="recordBtn">
                            <div class="btn-icon">
                                <i data-lucide="mic" id="micIcon" class="w-5 h-5"></i>
                            </div>
                            <span id="btnText">Connect Live Companion</span>
                        </button>
                        <p class="instruction text-xs text-slate-400 mt-3 font-medium">Click to connect, speak naturally, and watch the AI companion reply.</p>
                    </div>

                    <!-- Live Transcription Output / Hybrid Input -->
                    <div class="transcript-box p-4 bg-white/3 border border-white/5 rounded-2xl" id="transcriptBox">
                        <div class="box-label text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center justify-between mb-2">
                            <span class="flex items-center gap-1.5">
                                <i data-lucide="type" class="w-4 h-4 text-blue-400"></i>
                                <span>Active Speech Input / Type Fallback</span>
                            </span>
                            <span class="text-[9px] text-slate-500 font-medium">Speak or type directly</span>
                        </div>
                        <div class="flex gap-2">
                            <input type="text" id="transcriptInput" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition placeholder-slate-500" placeholder="Awaiting voice capture or type here..." />
                            <button id="sendTextBtn" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5">
                                <i data-lucide="send" class="w-3.5 h-3.5"></i>
                                <span>Send</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- RIGHT COLUMN (Xl: 5 Cols) - Live AI Dialogue & MER Fusion -->
                <div class="xl:col-span-5 flex flex-col gap-4 h-full min-h-0">
                    
                    <!-- Fused State Card -->
                    <div class="fusion-card p-6 bg-white/4 border border-white/8 rounded-2xl text-center flex flex-col items-center">
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Empathetic State Fused</span>
                        <div class="big-emoji text-5xl mb-2" id="bigEmoji">😶</div>
                        <div class="fusion-emotion text-xl font-extrabold text-white heading-sora" id="fusionLabel">Companion Unconnected</div>
                        <div class="fusion-conf-bar w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-3">
                            <div class="conf-fill bg-blue-500 h-full rounded-full transition-all duration-300" id="fusionConfFill" style="width: 0%"></div>
                        </div>
                        <div class="fusion-conf-text text-xs text-slate-400 mt-1" id="fusionConfText">0% Confidence</div>
                        
                        <!-- Sensory Modality Breakdown Panel -->
                        <div class="sensory-breakdown w-full grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
                            <div class="sensor-badge p-2 bg-white/3 border border-white/5 rounded-xl text-center">
                                <div class="text-[8px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                                    <i data-lucide="video" class="w-2.5 h-2.5 text-cyan-400"></i>
                                    <span>وجهك (Face)</span>
                                </div>
                                <div id="badgeFER" class="text-xs font-extrabold text-slate-400">Neutral</div>
                            </div>
                            <div class="sensor-badge p-2 bg-white/3 border border-white/5 rounded-xl text-center">
                                <div class="text-[8px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                                    <i data-lucide="mic" class="w-2.5 h-2.5 text-violet-400"></i>
                                    <span>صوتك (Voice)</span>
                                </div>
                                <div id="badgeSER" class="text-xs font-extrabold text-slate-400">Neutral</div>
                            </div>
                            <div class="sensor-badge p-2 bg-white/3 border border-white/5 rounded-xl text-center">
                                <div class="text-[8px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                                    <i data-lucide="type" class="w-2.5 h-2.5 text-amber-400"></i>
                                    <span>نبرتك (Text)</span>
                                </div>
                                <div id="badgeTER" class="text-xs font-extrabold text-slate-400">Neutral</div>
                            </div>
                        </div>
                    </div>

                    <!-- Interactive Real-Time AI Chat Card (NEXUS LLM Response) -->
                    <div class="live-chat-card flex-1 min-h-[200px]">
                        <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between border-b border-white/5 pb-2">
                            <span class="flex items-center gap-1.5">
                                <i data-lucide="message-square" class="w-4 h-4 text-emerald-400"></i>
                                <span>رد المساعد الذكي — NEXUS LLM Response</span>
                            </span>
                            <span class="px-2 py-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded">Active LLM</span>
                        </div>
                        
                        <div id="chatHistory" class="flex-1 overflow-y-auto space-y-3 pr-2 flex flex-col">
                            <!-- Populated dynamically -->
                            <div class="text-xs text-slate-500 py-6 text-center italic">Connect the Live Companion and start speaking to activate dialogue stream.</div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    </div>

    <!-- Frontend Live Script logic -->
    <script src="../js/mer_live.js"></script>
    <script src="../js/global.js"></script>
    <script src="../js/sidebar.js"></script>
</body>
</html>

---

## 2. `Front/js/mer_live.js`

```javascript
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
        const frameBlob = await captureVideoFrame();
        await performEmpatheticAIInteraction(
            frameBlob, audioBlob, finalTranscript.trim()
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
```

---

## 3. `Front/css/mer.css`
```css
/* NEXUS - MER Page Styling */

.mer-main {
    flex: 1;
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 2rem;
    overflow-y: auto;
    position: relative;
    z-index: 1;
}

/* Header */
.mer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.mer-header h1 {
    font-family: 'Sora', sans-serif;
    font-size: 2.2rem;
    background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
}

.mer-header p {
    color: var(--text-muted);
    font-size: 0.95rem;
}

.psych-badge {
    background: rgba(79, 70, 229, 0.1);
    border: 1px solid rgba(79, 70, 229, 0.2);
    padding: 0.75rem 1.25rem;
    border-radius: 99px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #818cf8;
    font-size: 0.85rem;
    font-weight: 600;
}

/* Grid Layout */
.mer-grid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 2rem;
    flex: 1;
    min-height: 0;
}

/* Viewport Section */
.viewport-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.video-container {
    position: relative;
    background: #000;
    border-radius: 24px;
    overflow: hidden;
    aspect-ratio: 16 / 9;
    border: 1px solid var(--glass-border);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

#webcam {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scaleX(-1);
}

.overlay-visuals {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.recording-indicator {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background: rgba(220, 38, 38, 0.2);
    border: 1px solid rgba(220, 38, 38, 0.4);
    color: #ef4444;
    padding: 0.4rem 0.8rem;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 800;
    display: none;
    align-items: center;
    gap: 0.5rem;
}

.recording-indicator.active { display: flex; }

.pulse-dot {
    width: 8px;
    height: 8px;
    background: #ef4444;
    border-radius: 50%;
    animation: pulse-red 1.5s infinite;
}

@keyframes pulse-red {
    0% { transform: scale(0.9); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.5; }
    100% { transform: scale(0.9); opacity: 1; }
}

.controls-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.mer-record-btn {
    width: 240px;
    height: 64px;
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    border: none;
    border-radius: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    color: white;
    font-weight: 700;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 10px 25px rgba(79, 70, 229, 0.4);
}

.mer-record-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(79, 70, 229, 0.5);
}

.mer-record-btn.recording {
    background: #dc2626;
    box-shadow: 0 10px 25px rgba(220, 38, 38, 0.4);
}

.btn-icon {
    width: 32px;
    height: 32px;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.instruction {
    color: var(--text-muted);
    font-size: 0.85rem;
}

.transcript-box {
    background: var(--card-bg);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    padding: 1.25rem;
    min-height: 100px;
}

.box-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
}

#transcriptText {
    font-family: 'DM Sans', sans-serif;
    color: var(--text-white);
    line-height: 1.6;
}

#transcriptText.placeholder {
    color: var(--text-muted);
    opacity: 0.5;
}

/* Results Section */
.results-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.fusion-card {
    background: linear-gradient(180deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
    border: 1px solid rgba(79, 70, 229, 0.3);
    border-radius: 28px;
    padding: 2.5rem 2rem;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.fusion-card::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%);
    pointer-events: none;
}

.big-emoji {
    font-size: 5rem;
    margin-bottom: 1rem;
    filter: drop-shadow(0 0 20px rgba(255,255,255,0.2));
    transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fusion-emotion {
    font-family: 'Sora', sans-serif;
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    color: #f8fafc;
}

.fusion-conf-bar {
    height: 10px;
    background: rgba(255,255,255,0.05);
    border-radius: 5px;
    margin: 0 auto 1rem;
    width: 80%;
    overflow: hidden;
}

.conf-fill {
    height: 100%;
    background: linear-gradient(90deg, #4f46e5, #7c3aed);
    transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.fusion-conf-text {
    font-size: 0.9rem;
    color: var(--text-muted);
}

/* Breakdown Grid */
.breakdown-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}

.component-card {
    background: var(--card-bg);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    transition: all 0.3s ease;
}

.component-card.active {
    border-color: rgba(129, 140, 248, 0.4);
    background: rgba(129, 140, 248, 0.05);
}

.comp-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.8rem;
    color: var(--text-muted);
    font-weight: 600;
}

.comp-header svg {
    width: 16px;
    height: 16px;
}

.comp-value {
    font-family: 'Sora', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
}

.comp-mini-bar {
    height: 4px;
    background: rgba(255,255,255,0.05);
    border-radius: 2px;
}

.mini-fill {
    height: 100%;
    background: #6366f1;
    width: 0%;
    transition: width 0.8s ease;
}

/* Insight Box */
.insight-box {
    background: rgba(255, 255, 255, 0.03);
    border: 1px dashed rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 1.25rem;
    display: flex;
    gap: 1rem;
    align-items: flex-start;
}

.insight-box svg {
    width: 20px;
    height: 20px;
    color: #f59e0b;
    flex-shrink: 0;
}

.insight-box p {
    font-size: 0.85rem;
    color: var(--text-gray);
    line-height: 1.5;
}

/* Responsive */
@media (max-width: 1200px) {
    .mer-grid { grid-template-columns: 1fr; }
    .mer-main { height: auto; }
}

@media (max-width: 768px) {
    .mer-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
    .big-emoji { font-size: 4rem; }
    .fusion-emotion { font-size: 2rem; }
}
```

---

## 4. `Front/js/config.js`
```javascript
// config.js - Centralized API Configuration

/* 
   👇 التبديل بين المحلي والـ Ngrok بكلمة واحدة:
   true  -> يستخدم رابط Ngrok
   false -> يستخدم الرابط المحلي (localhost)
*/
const USE_NGROK = false;

const NGROK_URL = 'https://lyrically-importer-heaving.ngrok-free.dev';
const LOCAL_URL = 'http://localhost:8080';

const BASE_URL = USE_NGROK ? NGROK_URL : LOCAL_URL;

window.NEXUS_CONFIG = {
    // الباك إند الأساسي
    API_BASE_URL: `${BASE_URL}/api`,

    // روابط الموديلات
    CHAT_API_URL: `${BASE_URL}/api/chat`,
    FER_API_URL: `${BASE_URL}/api/fer/analyze`,
    SER_API_URL: `${BASE_URL}/api/voice/analyze`,
    TER_API_URL: `${BASE_URL}/api/text/analyze`,

    // مسارات إضافية
    HISTORY_API_URL: `${BASE_URL}/api/history`,
    SETTINGS_API_URL: `${BASE_URL}/api/settings`
};

/* ============================================================
   NEXUS CENTRALIZED ROUTES
   — عدّل أي رابط هنا وهيتغير تلقائياً في كل الصفحات —
   ============================================================ */
window.NEXUS_ROUTES = {
    // ——— Navbar Links ———
    nav_logo: 'index.html',
    nav_landing: 'index.html#hero',
    nav_features: 'index.html#features',
    nav_testimonials: 'index.html#testimonials',
    nav_faq: 'index.html#faq',
    nav_about: 'pages/about_us.html',
    nav_get_started: 'pages/home.html',

    // ——— Auth ———
    nav_login: 'pages/login.html',
    nav_signup: 'pages/signup.html',
    nav_dashboard: 'pages/dashboard.html',

    // ——— Sidebar Links ———
    sidebar_home: 'pages/home.html',
    sidebar_chat: 'pages/ai_chat.html',
    sidebar_audio: 'pages/premium_voice.html',
    sidebar_video: 'pages/video_chat.html',
    sidebar_dashboard: 'pages/dashboard.html',
    sidebar_history: 'pages/chat_history.html',
    sidebar_settings: 'pages/settings.html',
    sidebar_help: 'pages/help_support.html',
    sidebar_about: 'pages/about_us.html',

    // ——— Footer ———
    footer_features: 'index.html#features',
    footer_testimonials: 'index.html#testimonials',
    footer_faq: 'index.html#faq',
    footer_get_started: 'pages/ai_chat.html',
    footer_help: 'pages/help_support.html',
    footer_docs: '#',
    footer_privacy: '#',
    footer_terms: '#'
};
```

---

## 5. `Front/js/global.js`
```javascript
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
```

---

## 6. `Front/js/sidebar.js`
```javascript
/**
 * NEXUS Centralized Sidebar Component
 * This script injects the sidebar HTML into pages and handles all its logic.
 */

(function() {
    // 1. Define Sidebar HTML
    const sidebarHTML = `
        <button class="sidebar-toggle" id="sidebarToggle">
            <i data-lucide="chevrons-right" class="toggle-icon"></i>
        </button>
        
        <nav class="sidebar-nav">
            <div class="logo-container">
                <img src="../assets/NEXUS_logo.png" class="logo-full" alt="NEXUS" />
                <img src="../assets/NEXUS_ICON_CROPPED.png" class="logo-icon" alt="N" />
            </div>
            <br/><br/>

            <!-- Home -->
            <a href="home.html">
                <div class="nav-item" id="nav-home">
                    <i data-lucide="home" class="nav-icon"></i>
                    <span class="nav-label">Home</span>
                </div>
            </a>
            
            <!-- New Chat / Interaction -->
            <div class="nav-item" id="nav-newchat">
                <i data-lucide="plus" class="nav-icon"></i>
                <span class="nav-label">New Chat</span>
            </div>
            
            <!-- Submenu -->
            <div class="submenu" id="chatTypeSubmenu">
                <a href="video_chat.html">
                    <div class="submenu-item" id="nav-video">
                        <i data-lucide="video" class="submenu-icon"></i>
                        <span class="submenu-label">Video</span>
                    </div>
                </a>
                <a href="premium_voice.html">
                    <div class="submenu-item" id="nav-audio">
                        <i data-lucide="mic" class="submenu-icon"></i>
                        <span class="submenu-label">Audio</span>
                    </div>
                </a>
                <a href="ai_chat.html">
                    <div class="submenu-item" id="nav-text">
                        <i data-lucide="message-square" class="submenu-icon"></i>
                        <span class="submenu-label">Text</span>
                    </div>
                </a>
                <a href="mer_live.html">
                    <div class="submenu-item" id="nav-mer-live">
                        <i data-lucide="sparkles" class="submenu-icon"></i>
                        <span class="submenu-label">MER Live Session</span>
                    </div>
                </a>
                <a href="mer.html">
                    <div class="submenu-item" id="nav-mer">
                        <i data-lucide="layers" class="submenu-icon"></i>
                        <span class="submenu-label">MER Analysis</span>
                    </div>
                </a>
            </div>

            <!-- Prompts -->
            <a href="dashboard.html">
                <div class="nav-item" id="nav-prompts">
                    <i data-lucide="target" class="nav-icon"></i>
                    <span class="nav-label">Prompts</span>
                </div>
            </a>

            <!-- LLM Hub -->
            <a href="llm_portal.html">
                <div class="nav-item" id="nav-llm-portal">
                    <i data-lucide="cpu" class="nav-icon"></i>
                    <span class="nav-label">LLM Hub</span>
                </div>
            </a>
            
            <!-- History -->
            <a href="chat_history.html">
                <div class="nav-item" id="nav-history">
                    <i data-lucide="clock" class="nav-icon"></i>
                    <span class="nav-label">History</span>
                </div>
            </a>
        </nav>
        
        <div class="sidebar-bottom">
            <a href="settings.html">
                <div class="nav-item" id="nav-settings">
                    <i data-lucide="settings" class="nav-icon"></i>
                    <span class="nav-label">Settings</span>
                </div>
            </a>
            <a href="help_support.html">
                <div class="nav-item" id="nav-help">
                    <i data-lucide="help-circle" class="nav-icon"></i>
                    <span class="nav-label">Help & Support</span>
                </div>
            </a>
        </div>
    `;

    // 2. Injection Logic
    function injectSidebar() {
        const sidebarElement = document.getElementById('sidebar');
        if (!sidebarElement) return;

        const isInPages = window.location.pathname.includes('/pages/');
        const assetBase = isInPages ? '../assets/' : 'assets/';
        
        // Update paths in HTML before injection
        const finalHTML = sidebarHTML
            .replace('../assets/NEXUS_logo.png', assetBase + 'NEXUS_logo.png')
            .replace('../assets/NEXUS_ICON_CROPPED.png', assetBase + 'NEXUS_ICON_CROPPED.png');

        sidebarElement.innerHTML = finalHTML;
        
        // Handle Active State
        const currentPath = window.location.pathname;
        const page = currentPath.split('/').pop() || 'index.html';

        const activeMap = {
            'home.html': 'nav-home',
            'ai_chat.html': 'nav-text',
            'premium_voice.html': 'nav-audio',
            'video_chat.html': 'nav-video',
            'mer_live.html': 'nav-mer-live',
            'mer.html': 'nav-mer',
            'chat_history.html': 'nav-history',
            'settings.html': 'nav-settings',
            'dashboard.html': 'nav-prompts',
            'llm_portal.html': 'nav-llm-portal',
            'help_support.html': 'nav-help'
        };

        const activeId = activeMap[page];
        if (activeId) {
            const el = document.getElementById(activeId);
            if (el) el.classList.add('active');
            
            // Auto-open submenu if a chat type is active
            if (['nav-text', 'nav-audio', 'nav-video', 'nav-mer-live', 'nav-mer'].includes(activeId)) {
                const submenu = document.getElementById('chatTypeSubmenu');
                const newChat = document.getElementById('nav-newchat');
                if (submenu) submenu.classList.add('active');
                if (newChat) newChat.classList.add('active');
            }
        }

        // Initialize Toggle Logic (Shared with global.js)
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebarElement.classList.toggle('collapsed');
                // Store state if needed
            });
        }

        const newChatNav = document.getElementById('nav-newchat');
        const chatTypeSubmenu = document.getElementById('chatTypeSubmenu');
        if (newChatNav && chatTypeSubmenu) {
            newChatNav.addEventListener('click', () => {
                chatTypeSubmenu.classList.toggle('active');
                newChatNav.classList.toggle('active');
            });
        }

        // Re-run Lucide icons & Resolve Routes
        if (window.lucide) window.lucide.createIcons();
        if (window.resolveRoutes) window.resolveRoutes();
    }

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectSidebar);
    } else {
        injectSidebar();
    }
})();
```

---

## 7. `Front/css/ai_chat.css`
```css
:root {
    /* Calm, Unified Slate & Indigo Palette for Mental Wellness UX */
    --bg-deep: #0f172a;
    /* Slate 900 */
    --bg-primary: #1e293b;
    /* Slate 800 */
    --bg-accent1: #334155;
    /* Slate 700 */
    --bg-accent2: #0f172a;

    --sidebar-bg: rgba(15, 23, 42, 0.98);
    --sidebar-hover: rgba(255, 255, 255, 0.06);

    --chat-bg: rgba(30, 41, 59, 0.5);
    --input-bg: rgba(30, 41, 59, 0.85);
    --input-border: rgba(255, 255, 255, 0.1);

    --btn-primary: #6366f1;
    /* Soft Indigo */
    --btn-send: #4f46e5;
    --btn-send-hover: #4338ca;

    --text-white: #f8fafc;
    --text-gray: #cbd5e1;
    --text-muted: #94a3b8;

    --ai-glow: rgba(99, 102, 241, 0.2);
    --glass-border: rgba(255, 255, 255, 0.06);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    overflow: hidden;
    height: 100vh;
    height: 100dvh;
}

/* App Container - Calm Subtle Gradient */
.app-container {
    display: flex;
    height: 100dvh;
    width: 100vw;
    position: relative;
    color: var(--text-white);
    background: transparent;
}

@keyframes calmGradientShift {
    0% {
        background-position: 0% 50%;
    }

    100% {
        background-position: 100% 50%;
    }
}

/* Sidebar styles fully inherited from global.css */

/* Main Content */
.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Chat Header */
.chat-header {
    padding: 0.75rem 1.5rem;
    border-bottom: 1px solid var(--glass-border);
    background: rgba(15, 23, 42, 0.8);
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
    z-index: 90;
}

.logo-section {
    flex: 1;
    display: flex;
    justify-content: center;
    margin-right: 40px;
    /* Offset for the toggle to keep logo centered */
}

.logo-section .logo {
    height: 24px;
    width: auto;
    filter: brightness(1.2);
}

.global-controls {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    margin-left: auto;
}

.mobile-sidebar-toggle {
    display: none;
    background: var(--card-bg);
    border: 1px solid var(--glass-border);
    border-radius: 8px;
    width: 40px;
    height: 40px;
    cursor: pointer;
    color: var(--text-white);
    justify-content: center;
    align-items: center;
    transition: all 0.3s;
}

@media (max-width: 768px) {
    .chat-header {
        padding: 0 1rem;
    }

    .logo-section .logo {
        height: 24px;
    }

    .global-controls {
        gap: 0.5rem;
    }
}

.logo-section {
    display: flex;
    justify-content: center;
    align-items: center;
}

.logo {
    height: 40px;
    width: auto;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.1));
    transition: all 0.3s ease;
}

.logo:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.2));
}

/* Chat Container */
.chat-container {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
}

/* Messages Area */
.messages-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 2rem;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
}

/* Welcome Screen */
.welcome-screen {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    animation: fadeIn 0.8s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* AI Avatar */
.ai-avatar-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.ai-avatar {
    width: 140px;
    height: 140px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: float 6s ease-in-out infinite;
    /* Slower, calmer float */
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

.avatar-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 50%;
    position: relative;
    z-index: 2;
    filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));
}

.avatar-glow {
    position: absolute;
    inset: -20px;
    background: radial-gradient(circle, var(--ai-glow) 0%, transparent 60%);
    border-radius: 50%;
    filter: blur(20px);
    opacity: 0.5;
    animation: glowPulse 5s ease-in-out infinite alternate;
    z-index: 1;
}

@keyframes glowPulse {
    0% {
        opacity: 0.3;
        transform: scale(0.95);
    }

    100% {
        opacity: 0.6;
        transform: scale(1.05);
    }
}

/* Welcome Message */
.welcome-message {
    text-align: center;
}

.welcome-title {
    font-family: 'Sora', sans-serif;
    font-size: clamp(1.8rem, 4vw, 2.5rem);
    font-weight: 600;
    color: var(--text-white);
    background: linear-gradient(to right, #fff, #cbd5e1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: fadeIn 0.8s ease 0.2s both;
}

/* Chat Messages */
.chat-messages {
    display: none;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem 0 3rem;
}

.chat-messages.active {
    display: flex;
}

/* Message Bubbles */
.message {
    display: flex;
    gap: 1rem;
    animation: messagePop 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes messagePop {
    from {
        opacity: 0;
        transform: translateY(15px) scale(0.98);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.message.user {
    flex-direction: row-reverse;
}

.message-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--bg-accent1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.message-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.message-content {
    max-width: 75%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--glass-border);
    padding: 1rem 1.25rem;
    border-radius: 4px 20px 20px 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.message.user .message-content {
    background: var(--btn-primary);
    border: none;
    border-radius: 20px 4px 20px 20px;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
}

.message-text {
    font-size: 15px;
    line-height: 1.6;
    color: var(--text-white);
}

.message-time {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 0.5rem;
    text-align: right;
}

.message.user .message-time {
    color: rgba(255, 255, 255, 0.7);
}

/* Floating Input Area */
.input-area {
    padding: 1rem 2rem 2rem;
    background: linear-gradient(to top, var(--bg-deep) 60%, transparent);
    position: relative;
    z-index: 10;
}

.input-container {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    gap: 1rem;
    align-items: center;
    background: var(--input-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--input-border);
    border-radius: 99px;
    padding: 0.5rem 0.5rem 0.5rem 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

.input-container:focus-within {
    border-color: #6366f1;
    background: rgba(30, 41, 59, 0.95);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(99, 102, 241, 0.3);
    transform: translateY(-2px);
}

.chat-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    padding: 0.75rem 0.5rem;
    font-size: 15px;
    color: var(--text-white);
    font-family: 'DM Sans', sans-serif;
}

.chat-input::placeholder {
    color: var(--text-muted);
}

.send-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--btn-send);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
    box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
}

.send-btn:hover {
    background: var(--btn-send-hover);
    transform: scale(1.08) rotate(-5deg);
    box-shadow: 0 6px 15px rgba(79, 70, 229, 0.4);
}

.send-btn:active {
    transform: scale(0.95);
}

.send-icon {
    width: 18px;
    height: 18px;
    color: var(--text-white);
    margin-left: -2px;
}

/* Scrollbar */
.chat-container::-webkit-scrollbar {
    width: 6px;
}

.chat-container::-webkit-scrollbar-track {
    background: transparent;
}

.chat-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
}

.chat-container::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
}

/* Typing Indicator */
.typing-indicator {
    display: flex;
    gap: 0.4rem;
    padding: 1rem 1.25rem;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(12px);
    border-radius: 4px 20px 20px 20px;
    width: fit-content;
}

.typing-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--text-muted);
    animation: typingBounce 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(1) {
    animation-delay: -0.32s;
}

.typing-dot:nth-child(2) {
    animation-delay: -0.16s;
}

@keyframes typingBounce {

    0%,
    80%,
    100% {
        transform: scale(0.8);
        opacity: 0.3;
    }

    40% {
        transform: scale(1);
        opacity: 1;
        background: #818cf8;
    }
}

/* ============================================================
   NEXUS — Calm Emotion Card
   ============================================================ */

.message-content.emotion-card {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    border-radius: 4px 20px 20px 20px;
    padding: 1.25rem;
    min-width: 260px;
    max-width: 360px;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
}

.emotion-header {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    margin-bottom: 1rem;
}

.emotion-icon {
    font-size: 30px;
    line-height: 1;
    filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2));
    animation: gentleFloat 4s ease-in-out infinite;
}

@keyframes gentleFloat {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-3px);
    }
}

.emotion-label {
    font-family: 'Sora', sans-serif;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: -0.01em;
}

.emotion-confidence {
    margin-left: auto;
    font-family: 'Sora', sans-serif;
    font-size: 22px;
    font-weight: 600;
}

/* Probability Bars - Calm UX */
.prob-bars {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 1rem;
}

.prob-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.prob-lbl {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: var(--text-gray);
    width: 60px;
    flex-shrink: 0;
    text-transform: capitalize;
}

.prob-track {
    flex: 1;
    height: 5px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 99px;
    overflow: hidden;
}

.prob-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;
}

.prob-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
    animation: calmShimmer 4s infinite linear;
}

@keyframes calmShimmer {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(100%);
    }
}

.prob-pct {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-gray);
    width: 28px;
    text-align: right;
    flex-shrink: 0;
}

/* Language Badge */
.lang-badge {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 99px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
}

.lang-badge.lang-ar {
    background: rgba(99, 102, 241, 0.15);
    color: #c7d2fe;
    border: 1px solid rgba(99, 102, 241, 0.3);
}

.lang-badge.lang-en {
    background: rgba(56, 189, 248, 0.15);
    color: #bae6fd;
    border: 1px solid rgba(56, 189, 248, 0.3);
}

/* NEXUS Calm Reply Line */
.nexus-reply {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    color: #e2e8f0;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    padding: 0.75rem 0.875rem;
    margin-top: 0.5rem;
    border-left: 2px solid var(--btn-primary);
}

/* Responsive Adjustments */
@media (max-width: 1024px) {
    .ai-avatar {
        width: 130px;
        height: 130px;
    }
}

@media (max-width: 768px) {
    .message-content {
        max-width: 85%;
        padding: 0.85rem 1rem;
    }

    .input-area {
        padding: 0.75rem 1rem 1.5rem;
    }

    .input-container {
        padding: 0.25rem 0.25rem 0.25rem 1rem;
        gap: 0.5rem;
    }

    .chat-input {
        font-size: 14px;
        padding: 0.5rem 0.25rem;
    }

    .send-btn {
        width: 38px;
        height: 38px;
    }

    .welcome-title {
        font-size: 1.5rem;
    }
}
```

---

## 8. `Front/css/global.css`
```css
/* ============================================================
   NEXUS Global Design System - Premium Slate & Indigo
   ============================================================ */

:root {
    /* Base Colors - Fixed Slate Theme */
    --bg-deep: #0f172a;
    --bg-primary: #1e293b;
    --bg-accent1: #334155;

    /* Legacy Mapping */
    --bg-deep-purple: var(--bg-deep);
    --bg-primary-purple: var(--bg-primary);
    --bg-mid-purple: var(--bg-accent1);
    --bg-accent-purple: #475569;

    /* Buttons and Accents */
    --btn-primary: #4f46e5;
    --btn-send: #6366f1;
    --btn-send-hover: #818cf8;
    --success-color: #10b981;
    --error-color: #ef4444;

    /* Typography */
    --text-white: #f8fafc;
    --text-gray: #cbd5e1;
    --text-muted: #94a3b8;

    /* UI Glassmorphism & Cards */
    --card-bg: rgba(30, 41, 59, 0.6);
    --card-hover-bg: rgba(51, 65, 85, 0.7);
    --glass-border: rgba(255, 255, 255, 0.08);

    /* Sidebar Specific */
    --sidebar-bg: rgba(15, 23, 42, 0.98);
    --sidebar-hover: rgba(255, 255, 255, 0.06);
    --ai-glow: rgba(99, 102, 241, 0.2);

    --input-bg: rgba(30, 41, 59, 0.5);
    --input-border: rgba(248, 250, 252, 0.15);

    --icon-bg: rgba(99, 102, 241, 0.15);
    --icon-border: rgba(99, 102, 241, 0.25);

    --glass-border: rgba(255, 255, 255, 0.05);
    --glass-bg: rgba(15, 23, 42, 0.75);

    /* Responsive Tokens */
    --header-height: 64px;
    --sidebar-width: 280px;
}

/* ============================================================
   RESPONSIVE LAYOUT
   ============================================================ */
*,
*::before,
*::after {
    box-sizing: border-box;
}

* {
    margin: 0;
    padding: 0;
}

html,
body {
    height: 100%;
    min-height: 100dvh;
    background-color: var(--bg-deep);
}

body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    font-family: 'DM Sans', sans-serif;
    background: radial-gradient(circle at 15% 50%, #1e293b, transparent 50%),
        radial-gradient(circle at 85% 30%, #334155, transparent 60%),
        var(--bg-deep);
    background-attachment: fixed;
    color: var(--text-white);
}

img,
picture,
video,
canvas,
svg {
    display: block;
    max-width: 100%;
}

input,
button,
textarea,
select {
    font: inherit;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
    overflow-wrap: break-word;
}

/* ============================================================
   FLUID TYPOGRAPHY & SPACING
   ============================================================ */
h1 {
    font-size: clamp(1.75rem, 5vw, 3rem);
    font-weight: 800;
    line-height: 1.1;
}

h2 {
    font-size: clamp(1.5rem, 4vw, 2.25rem);
    font-weight: 700;
    line-height: 1.2;
}

h3 {
    font-size: clamp(1.25rem, 3vw, 1.75rem);
    font-weight: 600;
}

/* ============================================================
   GLOBAL RESPONSIVE COMPONENTS
   ============================================================ */

/* Standard Mobile & Tablet Sidebar */
@media (max-width: 1024px) {
    .sidebar {
        position: fixed !important;
        left: 0 !important;
        top: 0 !important;
        height: 100vh !important;
        height: 100dvh !important;
        z-index: 2000 !important;
        transform: translateX(-100%) !important;
        background: var(--sidebar-bg) !important;
        width: min(280px, 85vw) !important;
        box-shadow: 10px 0 40px rgba(0, 0, 0, 0.6) !important;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        padding-top: 5rem !important;
        border-right: 1px solid var(--glass-border) !important;
    }

    .sidebar.open {
        transform: translateX(0) !important;
    }

    .mobile-sidebar-toggle {
        display: flex !important;
        position: absolute !important;
        top: 1rem !important;
        left: 1rem !important;
        z-index: 1000 !important;
    }

    .sidebar-toggle {
        display: none !important;
    }

    body.sidebar-open .app-container::after {
        content: '';
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.8);
        z-index: 1999;
        animation: fadeInSidebarBackdrop 0.3s ease;
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        pointer-events: auto;
    }

    @keyframes fadeInSidebarBackdrop {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }
}

.mobile-sidebar-toggle {
    display: none;
    background: var(--card-bg);
    border: 1px solid var(--glass-border);
    border-radius: 8px;
    width: 42px;
    height: 42px;
    cursor: pointer;
    color: var(--text-white);
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    flex-shrink: 0;
}

.mobile-sidebar-toggle:hover {
    background: var(--card-hover-bg);
}

/* Global Background Particles */
.global-particles {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    opacity: 0.6;
}

/* Ensure other content is above particles */
.app-container,
.page-wrapper,
.main-container,
.mer-main {
    position: relative;
    z-index: 10;
    background: transparent !important;
}

/* ============================================================
   GLOBAL NAVBAR & HEADER
   ============================================================ */
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    background: transparent;
}

.navbar.scrolled {
    background: rgba(15, 23, 42, 0.98);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.navbar.menu-open {
    background: #0f172a !important;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.25rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo-img {
    height: 32px;
    width: auto;
    transition: transform 0.3s ease;
}

.logo-img:hover {
    transform: scale(1.05);
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 2.25rem;
}

.nav-link {
    color: var(--text-gray);
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.3s ease;
    position: relative;
}

.nav-link:hover,
.nav-link.active {
    color: var(--text-white);
}

.nav-btn {
    background: var(--btn-primary);
    color: white;
    padding: 0.7rem 1.5rem;
    border-radius: 10px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
}

.nav-btn:hover {
    background: var(--btn-send);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
}

.mobile-menu-toggle {
    display: none;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    padding: 0.6rem;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.3s;
}

.mobile-menu-toggle:hover {
    background: rgba(255, 255, 255, 0.1);
}

/* Mobile Navigation Menu (Bootstrap Style Accordion) */
.mobile-nav-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: #0f172a;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    max-height: 0;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    visibility: hidden;
}

.mobile-nav-menu.active {
    max-height: 100vh;
    opacity: 1;
    visibility: visible;
    padding-bottom: 2rem;
}

.mobile-nav-content {
    display: flex;
    flex-direction: column;
    padding: 1rem 1.5rem;
}

.mobile-nav-item {
    color: var(--text-gray);
    text-decoration: none;
    font-size: 1.1rem;
    font-weight: 500;
    padding: 1.25rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    transition: 0.3s;
}

.mobile-nav-item:last-child {
    border-bottom: none;
}

.mobile-nav-item:hover,
.mobile-nav-item.active {
    color: #818cf8;
    padding-left: 0.5rem;
}

.mobile-nav-footer {
    margin-top: 1.5rem;
}

.mobile-get-started {
    display: block;
    background: var(--btn-primary);
    color: white;
    text-align: center;
    padding: 1rem;
    border-radius: 12px;
    font-weight: 600;
    text-decoration: none;
    font-size: 1.1rem;
    box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
}

@media (max-width: 992px) {
    .nav-links {
        display: none;
    }

    .mobile-menu-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

/* RTL Support */
[dir="rtl"] .ml-auto {
    margin-right: auto;
    margin-left: 0;
}

[dir="rtl"] .mr-auto {
    margin-left: auto;
    margin-right: 0;
}

/* Status Lamps */
.status-lamps {
    display: flex;
    gap: 1.5rem;
    background: rgba(15, 23, 42, 0.4);
    padding: 0.6rem 1.5rem;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(5px);
}

.lamp-item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
}

.lamp-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #475569;
    /* Default gray/offline */
    transition: all 0.4s ease;
    position: relative;
}

.lamp-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-muted);
    letter-spacing: 0.5px;
}

/* Online State */
.lamp-item.online .lamp-dot {
    background: #10b981;
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
}

.lamp-item.online .lamp-label {
    color: var(--text-white);
}

/* Offline State */
.lamp-item.offline .lamp-dot {
    background: #ef4444;
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.6);
}

/* Analyzing State */
.lamp-item.analyzing .lamp-dot {
    background: #6366f1;
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.8);
    animation: lamp-pulse 1s infinite alternate;
}

@keyframes lamp-pulse {
    from {
        transform: scale(1);
        opacity: 0.7;
    }

    to {
        transform: scale(1.3);
        opacity: 1;
    }
}

/* Exit Button */
.exit-btn {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: #ef4444;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.exit-btn:hover {
    background: #ef4444;
    color: white;
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
}

.exit-btn i {
    width: 18px;
    height: 18px;
}

/* ── Universal Model Controls (FER Style) ── */
.universal-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
}

.u-ctrl-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.u-ctrl-btn {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.07);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    color: rgba(255, 255, 255, 0.7);
}

.u-ctrl-btn:hover {
    background: rgba(255, 255, 255, 0.14);
    transform: translateY(-3px) scale(1.05);
    color: white;
}

.u-ctrl-btn.active {
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    border-color: transparent;
    color: white;
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.45);
}

.u-ctrl-btn.danger {
    background: #dc2626;
    border: none;
    color: white;
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
}

.u-ctrl-btn.danger:hover {
    background: #ef4444;
    color: white;
    transform: translateY(-3px) scale(1.08);
    box-shadow: 0 8px 25px rgba(220, 38, 38, 0.5);
}

.u-ctrl-label {
    font-size: 10px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.35);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* ============================================================
   GLOBAL SIDEBAR & APP CONTAINER LAYOUTS
   ============================================================ */
.app-container {
    display: flex;
    height: 100vh;
    height: 100dvh;
    width: 100vw;
    position: relative;
    overflow: hidden;
}

.sidebar {
    width: 280px;
    background: var(--sidebar-bg);
    display: flex;
    flex-direction: column;
    padding: 1.5rem 1rem;
    border-right: 1px solid var(--glass-border);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    z-index: 100;
}

.sidebar.collapsed {
    width: 80px;
}

.sidebar.collapsed .nav-label,
.sidebar.collapsed .submenu-label {
    opacity: 0;
    width: 0;
    pointer-events: none;
}

.sidebar.collapsed .submenu {
    display: none;
}

/* Sidebar Toggle */
.sidebar-toggle {
    position: absolute;
    top: 1.5rem;
    right: -16px;
    background: var(--bg-primary);
    border: 1px solid var(--glass-border);
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    z-index: 10;
}

.sidebar-toggle:hover {
    transform: scale(1.1);
    background: var(--bg-accent1);
}

.toggle-icon {
    width: 18px;
    height: 18px;
    color: var(--text-white);
    transition: transform 0.4s ease;
}

.sidebar.collapsed .toggle-icon {
    transform: rotate(180deg);
}

/* Logo Transition */
.logo-container {
    position: relative;
    height: 60px;
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    padding: 0 0.5rem;
}

.logo-full {
    height: 40px;
    width: auto;
    left: 1rem;
    transition: opacity 0.4s ease, transform 0.4s ease;
    transform-origin: left center;
}

.logo-icon {
    position: absolute;
    height: 40px;
    width: auto;
    left: 50%;
    transform: translateX(-50%) scale(0.8);
    opacity: 0;
    transition: opacity 0.4s ease, transform 0.4s ease;
}

.sidebar.collapsed .logo-full {
    opacity: 0;
    transform: scale(0.8);
    pointer-events: none;
}

.sidebar.collapsed .logo-icon {
    opacity: 1;
    transform: translateX(-50%) scale(1.4);
}

/* Sidebar Navigation */
.sidebar-nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 3rem;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    /* Firefox */
    -webkit-overflow-scrolling: touch;
}

.sidebar-nav::-webkit-scrollbar {
    display: none;
    /* Chrome/Safari */
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.875rem 1rem;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
}

.nav-item:hover {
    background: var(--sidebar-hover);
    transform: translateX(4px);
}

.nav-item.active {
    background: rgba(99, 102, 241, 0.15);
    border: 1px solid rgba(99, 102, 241, 0.2);
}

.nav-icon {
    width: 22px;
    height: 22px;
    color: var(--text-muted);
    flex-shrink: 0;
    transition: color 0.3s ease;
}

.nav-item:hover .nav-icon,
.nav-item.active .nav-icon {
    color: #818cf8;
}

.nav-label {
    font-size: 15px;
    font-weight: 500;
    color: var(--text-white);
    white-space: nowrap;
    transition: all 0.3s ease;
}

/* Submenu */
.submenu {
    display: none;
    flex-direction: column;
    gap: 0.4rem;
    margin-left: 2.5rem;
    margin-top: 0.5rem;
    padding-left: 1rem;
    border-left: 2px solid rgba(99, 102, 241, 0.3);
    animation: slideDown 0.3s ease;
}

.submenu.active {
    display: flex;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.submenu-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.875rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.submenu-item:hover {
    background: var(--sidebar-hover);
    color: var(--text-white);
    transform: translateX(4px);
}

.submenu-icon {
    width: 18px;
    height: 18px;
    color: var(--text-muted);
    flex-shrink: 0;
    transition: color 0.3s ease;
}

.submenu-item:hover .submenu-icon {
    color: #818cf8;
}

.submenu-label {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-gray);
    white-space: nowrap;
    transition: all 0.3s ease;
}

/* Sidebar Bottom */
.sidebar-bottom {
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid var(--glass-border);
}

/* Ensure desktop sidebar collapse toggle is hidden on all touch/mobile/tablet viewports */
@media (max-width: 1024px) {
    .sidebar-toggle {
        display: none !important;
    }
}
```
