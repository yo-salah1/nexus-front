import os
import re

FRONT_DIR = r"d:\FCI - GP\YS_NEXUS\Front"

html_files = [f for f in os.listdir(FRONT_DIR) if f.endswith('.html')]

for html_file in html_files:
    path = os.path.join(FRONT_DIR, html_file)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    
    # 1. Inject global.js before </body>
    if 'global.js' not in content:
        content = content.replace('</body>', '    <script src="global.js"></script>\n</body>')
        modified = True
        
    # 2. Standardize Sidebar Logo
    # Old logo: <div> <img src="NEXUS_logo.png" /> </div>
    # Needs to become .logo-container
    old_logo_pattern = r'<div>\s*<img src="NEXUS_logo.png".*?>\s*</div>'
    new_logo = '''<div class="logo-container">
                    <img src="NEXUS_logo.png" class="logo-full" alt="NEXUS" />
                    <img src="NEXUS ICON (FINAL) (2).png" class="logo-icon" alt="N" />
                </div>'''
    
    if re.search(old_logo_pattern, content):
        content = re.sub(old_logo_pattern, new_logo, content)
        modified = True
        
    # 3. Standardize Chat Header (Mobile Toggle)
    header_pattern = r'(<header class="chat-header">)(\s*)(<!-- Logo Section -->)'
    new_header = r'\1\2<button class="mobile-sidebar-toggle" id="mobileSidebarToggle"><i data-lucide="menu"></i></button>\2\3'
    
    # Wait, some pages might not have <!-- Logo Section --> comment.
    # Let's just look for <header class="chat-header">
    if '<header class="chat-header">' in content and 'mobile-sidebar-toggle' not in content:
        content = content.replace('<header class="chat-header">', '<header class="chat-header">\n                <button class="mobile-sidebar-toggle" id="mobileSidebarToggle"><i data-lucide="menu"></i></button>')
        modified = True

    if modified:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated HTML: {html_file}")

print("✅ Sidebar & JS Refactoring Completed!")
