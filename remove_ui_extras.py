import os
import re

FRONT_DIR = r"d:\FCI - GP\YS_NEXUS\Front"

html_files = [f for f in os.listdir(FRONT_DIR) if f.endswith('.html')]

# Patterns to remove
# 1. toggleTheme buttons
# 2. toggleLanguage buttons
# 3. div/container containing them

patterns = [
    r'<button[^>]*toggleTheme[^>]*>.*?</button>',
    r'<button[^>]*toggleLanguage[^>]*>.*?</button>',
    r'<div[^>]*display:\s*flex[^>]*gap:\s*0\.5rem[^>]*align-items:\s*center[^>]*>.*?</div>', # Matches the container I saw in index.html
    r'<div[^>]*class="header-controls"[^>]*>.*?</div>' # Matches standard header controls if they exist
]

for html_file in html_files:
    path = os.path.join(FRONT_DIR, html_file)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for p in patterns:
        new_content = re.sub(p, '', new_content, flags=re.DOTALL)
    
    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Cleaned UI buttons in {html_file}")

print("Language/Theme Button Removal Completed!")
