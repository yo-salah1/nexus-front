import os
import re

FRONT_DIR = r"d:\FCI - GP\YS_NEXUS\Front"

html_files = [f for f in os.listdir(FRONT_DIR) if f.endswith('.html')]

TOGGLE_HTML = '<button class="mobile-sidebar-toggle" id="mobileSidebarToggle"><i data-lucide="menu"></i></button>'

header_classes = ['chat-header', 'help-header', 'history-header', 'settings-header', 'prompts-header', 'voice-header', 'video-header']
main_classes = ['main-content', 'video-main', 'voice-main', 'chat-main']

for html_file in html_files:
    if html_file == 'index.html' or html_file == 'landing.html':
        continue
        
    path = os.path.join(FRONT_DIR, html_file)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'class="sidebar"' not in content or 'id="mobileSidebarToggle"' in content:
        continue
        
    modified = False
    
    # Try header classes
    for h_class in header_classes:
        pattern = f'(<header class="{h_class}".*?>)'
        if re.search(pattern, content):
            content = re.sub(pattern, f'\\1\n                {TOGGLE_HTML}', content)
            modified = True
            break
            
    # Try main classes
    if not modified:
        for m_class in main_classes:
            pattern = f'(<main class="{m_class}".*?>)'
            if re.search(pattern, content):
                content = re.sub(pattern, f'\\1\n            {TOGGLE_HTML}', content)
                modified = True
                break
                
    # Fallback to general header or main
    if not modified:
        if '<header>' in content:
            content = content.replace('<header>', f'<header>\n                {TOGGLE_HTML}')
            modified = True
        elif '<main>' in content:
            content = content.replace('<main>', f'<main>\n            {TOGGLE_HTML}')
            modified = True

    if modified:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {html_file}")

print("Header Standardization Completed!")
