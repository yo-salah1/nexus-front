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
