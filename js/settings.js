/* NEXUS — Settings (../js/settings.js) - API INTEGRATED */

const API_BASE_URL = window.NEXUS_CONFIG.API_BASE_URL;

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    loadSettings();
    initSliders();
    initPills();
    initToggles();
    console.log('✨ NEXUS Settings - API Ready');
});

// Load settings from API
async function loadSettings() {
    try {
        const response = await fetch(`${API_BASE_URL}/settings`, { headers: { 'ngrok-skip-browser-warning': 'true' } });
        
        if (!response.ok) throw new Error('Failed to load settings');
        
        const settings = await response.json();
        
        // Apply settings to UI
        document.getElementById('adaptiveSlider').value = settings.adaptiveSensitivity || 75;
        document.getElementById('adaptiveVal').textContent = (settings.adaptiveSensitivity || 75) + '%';
        
        document.getElementById('toneSlider').value = settings.toneWeight || 50;
        document.getElementById('toneVal').textContent = (settings.toneWeight || 50) + '%';
        
        document.getElementById('faceSlider').value = settings.faceWeight || 50;
        document.getElementById('faceVal').textContent = (settings.faceWeight || 50) + '%';
        
        document.getElementById('privacyToggle').checked = settings.privacyMode || false;
        document.getElementById('summaryToggle').checked = settings.autoSummaries !== false;
        document.getElementById('moodToggle').checked = settings.moodAlerts !== false;
        document.getElementById('checkinToggle').checked = settings.dailyCheckin !== false;
        
        // Update slider fills
        updateSliderFill(document.getElementById('adaptiveSlider'));
        updateSliderFill(document.getElementById('toneSlider'));
        updateSliderFill(document.getElementById('faceSlider'));
        
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

function initSliders() {
    const sliders = [
        { id: 'adaptiveSlider', labelId: 'adaptiveVal', key: 'adaptiveSensitivity' },
        { id: 'toneSlider', labelId: 'toneVal', key: 'toneWeight' },
        { id: 'faceSlider', labelId: 'faceVal', key: 'faceWeight' }
    ];

    sliders.forEach(({ id, labelId, key }) => {
        const slider = document.getElementById(id);
        const label = document.getElementById(labelId);

        updateSliderFill(slider);

        slider.addEventListener('input', () => {
            label.textContent = slider.value + '%';
            updateSliderFill(slider);
            saveSetting(key, parseInt(slider.value));
        });
    });
}

function updateSliderFill(slider) {
    const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, var(--slider-fill) ${pct}%, var(--slider-track) ${pct}%)`;
}

function initPills() {
    const group = document.getElementById('faceDetectionGroup');
    const pills = group.querySelectorAll('.pill');

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            saveSetting('faceDetection', pill.dataset.value);
        });
    });
}

function initToggles() {
    const toggles = [
        { id: 'privacyToggle', key: 'privacyMode' },
        { id: 'summaryToggle', key: 'autoSummaries' },
        { id: 'moodToggle', key: 'moodAlerts' },
        { id: 'checkinToggle', key: 'dailyCheckin' }
    ];

    toggles.forEach(({ id, key }) => {
        const input = document.getElementById(id);
        input.addEventListener('change', () => {
            saveSetting(key, input.checked);
        });
    });
}

// Save setting to API
async function saveSetting(key, value) {
    try {
        const response = await fetch(`${API_BASE_URL}/settings`, {
            method: 'PUT',
            headers: { 'ngrok-skip-browser-warning': 'true','Content-Type': 'application/json'},
            body: JSON.stringify({ [key]: value })
        });
        
        if (!response.ok) throw new Error('Failed to save setting');
        
        console.log(`Setting saved: ${key} = ${value}`);
        
    } catch (error) {
        console.error('Error saving setting:', error);
    }
}
