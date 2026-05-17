import os
import re

FRONT_DIR = r"d:\FCI - GP\YS_NEXUS\Front"

html_files = [f for f in os.listdir(FRONT_DIR) if f.endswith('.html')]

for html_file in html_files:
    path = os.path.join(FRONT_DIR, html_file)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "NEXUS ICON (FINAL) (2).png" in content:
        content = content.replace("NEXUS ICON (FINAL) (2).png", "NEXUS_ICON_CROPPED.png")
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated icon in: {html_file}")

print("✅ Icon replacement completed!")
