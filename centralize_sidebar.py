import os
import re

FRONT_DIR = r"d:\FCI - GP\YS_NEXUS\Front"

html_files = [f for f in os.listdir(FRONT_DIR) if f.endswith('.html')]

# Regex to match the sidebar block
# Matches <aside class="sidebar" ...> ... </aside>
SIDEBAR_PATTERN = re.compile(r'<aside class="sidebar".*?id="sidebar".*?>.*?</aside>', re.DOTALL)

for html_file in html_files:
    path = os.path.join(FRONT_DIR, html_file)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<aside class="sidebar"' not in content:
        continue
        
    # Replace the sidebar block
    new_content = SIDEBAR_PATTERN.sub('<aside class="sidebar" id="sidebar"></aside>', content)
    
    # Add sidebar.js script if not already there
    if 'src="sidebar.js"' not in new_content:
        new_content = new_content.replace('</body>', '    <script src="sidebar.js"></script>\n</body>')
    
    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Refactored {html_file}")

print("Centralized Sidebar Injection Completed!")
