import os
import re

FRONT_DIR = r"d:\FCI - GP\YS_NEXUS\Front"

html_files = [f for f in os.listdir(FRONT_DIR) if f.endswith('.html')]

canvas_tag = '<canvas id="nexusParticles" class="global-particles"></canvas>'

for html_file in html_files:
    path = os.path.join(FRONT_DIR, html_file)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already exists
    if 'id="nexusParticles"' in content:
        continue
        
    # Inject after <body>
    new_content = re.sub(r'(<body[^>]*>)', r'\1\n    ' + canvas_tag, content, flags=re.IGNORECASE)
    
    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Injected particles into {html_file}")

print("Global Particle Injection Completed!")
