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