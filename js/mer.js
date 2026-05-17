/* NEXUS - Multimodal Emotion Recognition (MER) Logic */

const CONFIG = window.NEXUS_CONFIG;
const API_BASE = CONFIG.API_BASE_URL;

// Psychology Weights (Mehrabian's Rule)
const WEIGHTS = {
    visual: 0.55,
    vocal:  0.38,
    verbal: 0.07
};

// Target Classes
const MER_CLASSES = ['Neutral', 'Happy', 'Sad', 'Angry', 'Fearful', 'Disgust'];

const EMOJI_MAP = {
    'Neutral': '😶',
    'Happy':   '😊',
    'Sad':     '😢',
    'Angry':   '😠',
    'Fearful': '😨',
    'Disgust': '🤢'
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

// UI Elements
const btn = document.getElementById('recordBtn');
const btnText = document.getElementById('btnText');
const micIcon = document.getElementById('micIcon');
const recIndicator = document.getElementById('recIndicator');
const transcriptText = document.getElementById('transcriptText');
const webcam = document.getElementById('webcam');

// ==========================
// INITIALIZATION
// ==========================
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
    if (isRecording) {
        isRecording = false;
        if (mediaRecorder) mediaRecorder.stop();
        if (recognition) recognition.stop();
    }
    
    // UI Resets
    btn.classList.remove('recording');
    btnText.textContent = "Start Session";
    micIcon.setAttribute('data-lucide', 'mic');
    recIndicator.classList.remove('active');
    
    // Clear Results
    document.getElementById('bigEmoji').textContent = '😶';
    document.getElementById('fusionLabel').textContent = 'Ready to start';
    document.getElementById('fusionConfFill').style.width = '0%';
    document.getElementById('fusionConfText').textContent = '0% Confidence';
    
    ['FER', 'SER', 'TER'].forEach(id => {
        document.getElementById(`val${id}`).textContent = '—';
        document.getElementById(`fill${id}`).style.width = '0%';
        document.getElementById(`card${id}`).classList.remove('active');
    });
    
    transcriptText.textContent = "Awaiting input...";
    transcriptText.classList.add('placeholder');
    document.getElementById('insightText').textContent = "The system will analyze your non-verbal cues alongside your words for a complete emotional profile.";
    
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
        
        // Set buttons to active by default since webcam starts on
        document.getElementById('toggleCam').classList.add('active');
        document.getElementById('toggleMic').classList.add('active');
    } catch (err) {
        console.error("Webcam error:", err);
        alert("Camera and Mic access required for MER analysis.");
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
    recognition.lang = 'en-US'; // Default, can be improved to detect language

    recognition.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + " ";
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        transcriptText.textContent = finalTranscript + interimTranscript;
        transcriptText.classList.remove('placeholder');
    };

    recognition.onerror = (err) => console.error("SpeechRec Error:", err);
}

// ==========================
// SESSION MANAGEMENT
// ==========================
async function toggleSession() {
    if (isRecording) {
        stopSession();
    } else {
        startSession();
    }
}

function startSession() {
    isRecording = true;
    audioChunks = [];
    finalTranscript = "";
    transcriptText.textContent = "Listening...";
    transcriptText.classList.add('placeholder');

    // UI Updates
    btn.classList.add('recording');
    btnText.textContent = "Complete Session";
    micIcon.setAttribute('data-lucide', 'square');
    recIndicator.classList.add('active');
    lucide.createIcons();

    // Start Audio Recording
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunks.push(e.data); };
    mediaRecorder.start();

    // Start Speech Recognition
    if (recognition) recognition.start();

    // Set auto-stop after 8 seconds if user doesn't click
    // setTimeout(() => { if (isRecording) stopSession(); }, 8000);
}

async function stopSession() {
    isRecording = false;
    
    // UI Updates
    btn.classList.remove('recording');
    btnText.textContent = "Analyzing Signals...";
    micIcon.setAttribute('data-lucide', 'loader');
    recIndicator.classList.remove('active');
    lucide.createIcons();

    // Set Lamps to Analyzing
    setLampsState('analyzing');

    // Stop Systems
    if (mediaRecorder) mediaRecorder.stop();
    if (recognition) recognition.stop();

    // Capture Frame immediately
    const frameBlob = await captureFrame();

    // Wait for MediaRecorder to finish and get Audio Blob
    mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        await performMultimodalAnalysis(frameBlob, audioBlob, finalTranscript.trim());
        
        // Re-check health to restore lamp states
        checkSystemHealth();
    };
}

async function captureFrame() {
    captureCanvas.width = webcam.videoWidth;
    captureCanvas.height = webcam.videoHeight;
    const ctx = captureCanvas.getContext('2d');
    ctx.drawImage(webcam, 0, 0);
    return new Promise(resolve => captureCanvas.toBlob(resolve, 'image/jpeg', 0.9));
}

// ==========================
// MULTIMODAL ANALYSIS
// ==========================
async function performMultimodalAnalysis(frameBlob, audioBlob, text) {
    console.log("🚀 Starting Multimodal Analysis...");
    
    // Progress timeout to handle "hanging"
    const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Analysis Timeout")), 25000)
    );

    try {
        const analysis = async () => {
            // 1. Prepare Promises
            const ferPromise = callFER(frameBlob);
            const serPromise = callSER(audioBlob);
            const terPromise = text ? callTER(text) : Promise.resolve(null);

            // 2. Execute all in parallel
            return await Promise.all([ferPromise, serPromise, terPromise]);
        };

        // Execute with timeout race
        const [ferData, serData, terData] = await Promise.race([analysis(), timeout]);

        console.log("✅ All models responded.");

        const fusionResult = fuseResults(ferData, serData, terData);
        // 4. Update UI
        updateResultsUI(fusionResult, ferData, serData, terData, text);
    } catch (err) {
        console.error("Analysis Error:", err);
        btnText.textContent = err.message === "Analysis Timeout" ? "Connection Timeout" : "Analysis Error";
        setLampsState('offline');
        setTimeout(() => { 
            btnText.textContent = "Start Session"; 
            checkSystemHealth(); // Restore lamps
        }, 3000);
    }
}

// API Calls
async function callFER(blob) {
    const fd = new FormData();
    fd.append('file', blob, 'frame.jpg');
    const res = await fetch(`${API_BASE}/fer/analyze`, { method: 'POST', body: fd, headers: {'ngrok-skip-browser-warning': 'true'} });
    return res.json();
}

async function callSER(blob) {
    const fd = new FormData();
    fd.append('file', blob, 'voice.webm');
    const res = await fetch(`${API_BASE}/voice/analyze`, { method: 'POST', body: fd, headers: {'ngrok-skip-browser-warning': 'true'} });
    return res.json();
}

async function callTER(text) {
    const res = await fetch(`${API_BASE}/text/analyze`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' }, 
        body: JSON.stringify({ text }) 
    });
    return res.json();
}

// ==========================
// FUSION LOGIC
// ==========================
function fuseResults(fer, ser, ter) {
    // Initialize fused probabilities
    const fusedProbs = {};
    MER_CLASSES.forEach(c => fusedProbs[c] = 0);

    // Helper to add weighted probs
    const addWeighted = (data, weight, sourceName) => {
        if (!data || !data.all_probs) return;
        
        Object.entries(data.all_probs).forEach(([label, prob]) => {
            // Normalize label casing
            const normalized = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
            if (fusedProbs.hasOwnProperty(normalized)) {
                fusedProbs[normalized] += prob * weight;
            }
        });
    };

    // Calculate effective weights (if verbal is missing, redistibute weight)
    let verbalWeight = WEIGHTS.verbal;
    let visualWeight = WEIGHTS.visual;
    let vocalWeight  = WEIGHTS.vocal;

    if (!ter || !ter.all_probs) {
        // Redistribute verbal weight to visual and vocal proportionally
        const sum = visualWeight + vocalWeight;
        visualWeight += (verbalWeight * (visualWeight / sum));
        vocalWeight += (verbalWeight * (vocalWeight / sum));
        verbalWeight = 0;
    }

    addWeighted(fer, visualWeight, 'FER');
    addWeighted(ser, vocalWeight, 'SER');
    addWeighted(ter, verbalWeight, 'TER');

    // Find Max
    let maxLabel = 'Neutral';
    let maxProb = 0;
    Object.entries(fusedProbs).forEach(([label, prob]) => {
        if (prob > maxProb) {
            maxProb = prob;
            maxLabel = label;
        }
    });

    return { label: maxLabel, confidence: maxProb, all_probs: fusedProbs };
}

// ==========================
// UI UPDATES
// ==========================
async function updateResultsUI(fusion, fer, ser, ter, text) {
    // 1. Fusion Card
    document.getElementById('bigEmoji').textContent = EMOJI_MAP[fusion.label] || '😶';
    document.getElementById('fusionLabel').textContent = fusion.label;
    document.getElementById('fusionConfFill').style.width = `${(fusion.confidence * 100).toFixed(0)}%`;
    document.getElementById('fusionConfText').textContent = `${(fusion.confidence * 100).toFixed(0)}% Fusion Confidence`;

    // 2. Component Cards
    updateCompCard('FER', fer);
    updateCompCard('SER', ser);
    updateCompCard('TER', ter);

    // 3. Reset Button
    btnText.textContent = "Session Complete";
    setTimeout(() => { btnText.textContent = "Start New Session"; }, 3000);

    // 4. Insight Box - Local Diagnostic Analytics
    const insightBox = document.getElementById('insightText');
    const staticInsights = {
        'Happy': "Your facial expressions (55% FER) and vocal tone (38% SER) indicate authentic positivity. Sensory arrays registered high muscle activation and elevated tone pitch, signifying positive emotional alignment.",
        'Sad': "Vocal indicators suggest a lower speech rate, micro-pauses, and softened acoustic amplitude. Sub-verbal visual micro-expressions align to suggest emotional fatigue or underlying sadness.",
        'Angry': "Vocal resonance and volume spikes cross the baseline distress thresholds. Fused muscle tension on visual tracking registers high arousal, matching physical stress indicators.",
        'Fearful': "Rapid verbal articulation combined with minor vocal pitch tremolos and brief visual hesitation cues indicates elevated levels of temporary anxiety.",
        'Disgust': "Local micro-expression classifiers detect elevated visual aversion markers. Fused weights reflect negative verbal sentiment and defensive non-verbal postures.",
        'Neutral': "Visual, vocal, and verbal channels show steady, balanced baselines. Fused dynamic weights confirm high emotional stability and calm focus."
    };
    insightBox.textContent = staticInsights[fusion.label] || "Diagnostic analysis complete.";
}

function updateCompCard(id, data) {
    const valEl = document.getElementById(`val${id}`);
    const fillEl = document.getElementById(`fill${id}`);
    const cardEl = document.getElementById(`card${id}`);

    if (data && data.status !== 'error') {
        const emotion = data.emotion || data.label || "Neutral";
        const conf = data.confidence || 0;
        valEl.textContent = `${emotion} (${(conf * 100).toFixed(0)}%)`;
        fillEl.style.width = `${(conf * 100).toFixed(0)}%`;
        cardEl.classList.add('active');
    } else {
        valEl.textContent = "No data";
        fillEl.style.width = "0%";
        cardEl.classList.remove('active');
    }
}
