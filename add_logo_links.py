import os
import re

base_dir = r"d:\NEXUS_DEMO\V1\Front"
pages_dir = os.path.join(base_dir, "pages")

def wrap_logo(filepath, link_target):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    # Remove existing anchor tags around the logo to prevent double wrapping
    new_content = re.sub(r'<a[^>]*>\s*(<img[^>]*NEXUS_logo\.png[^>]*>)\s*</a>', r'\1', new_content, flags=re.IGNORECASE)
    
    def replacer(match):
        img_tag = match.group(1)
        return f'<a href="{link_target}">{img_tag}</a>'
        
    # Wrap all logos
    new_content = re.sub(r'(<img[^>]*NEXUS_logo\.png[^>]*>)', replacer, new_content, flags=re.IGNORECASE)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

index_path = os.path.join(base_dir, "index.html")
if os.path.exists(index_path):
    wrap_logo(index_path, "index.html")

if os.path.exists(pages_dir):
    for filename in os.listdir(pages_dir):
        if filename.endswith('.html'):
            wrap_logo(os.path.join(pages_dir, filename), "../index.html")

print("Done")
