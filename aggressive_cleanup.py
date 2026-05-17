import os
import re

FRONT_DIR = r"d:\FCI - GP\YS_NEXUS\Front"

html_files = [f for f in os.listdir(FRONT_DIR) if f.endswith('.html')]

# More aggressive patterns
patterns = [
    r'<button[^>]*onclick="[^"]*toggleTheme[^"]*"[^>]*>.*?</button>',
    r'<button[^>]*onclick="[^"]*toggleLanguage[^"]*"[^>]*>.*?</button>',
    r'<div[^>]*style="[^"]*display:\s*flex[^"]*gap:\s*0\.5rem[^"]*">.*?</div>',
    r'<div[^>]*class="global-controls"[^>]*>.*?</div>',
    r'<div[^>]*class="header-controls"[^>]*>.*?</div>',
    r'EN / ع'
]

for html_file in html_files:
    path = os.path.join(FRONT_DIR, html_file)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for p in patterns:
        new_content = re.sub(p, '', new_content, flags=re.DOTALL | re.IGNORECASE)
    
    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Cleaned UI extras in {html_file}")

print("Aggressive UI Cleanup Completed!")
