import os
import re

FRONT_DIR = r"d:\FCI - GP\YS_NEXUS\Front"

# 1. Update HTML Files
html_files = [f for f in os.listdir(FRONT_DIR) if f.endswith('.html')]

for html_file in html_files:
    path = os.path.join(FRONT_DIR, html_file)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    
    # Check if global.css is already linked
    if '<link rel="stylesheet" href="global.css">' not in content:
        # Insert global.css before the first local CSS or just before </head>
        match = re.search(r'<link rel="stylesheet".*?>', content)
        if match:
            content = content[:match.start()] + '<link rel="stylesheet" href="global.css">\n    ' + content[match.start():]
        else:
            # If no CSS found, put it before </head>
            content = content.replace('</head>', '    <link rel="stylesheet" href="global.css">\n</head>')
        modified = True

    # Inject Favicon
    favicon_tag = '<link rel="icon" type="image/png" href="NEXUS ICON (FINAL) (2).png">'
    if favicon_tag not in content:
        content = content.replace('</head>', f'    {favicon_tag}\n</head>')
        modified = True
        
    if modified:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated HTML: {html_file}")


# 2. Update CSS Files
css_files = [f for f in os.listdir(FRONT_DIR) if f.endswith('.css') and f != 'global.css' and f != 'landing.css' and f != 'style8.css']

for css_file in css_files:
    path = os.path.join(FRONT_DIR, css_file)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    modified = False
    
    # Strip :root blocks safely
    # Regex finds :root { ... }
    root_pattern = r':root\s*\{[^}]*\}'
    if re.search(root_pattern, content):
        content = re.sub(root_pattern, '/* Removed legacy :root block - Now using global.css */', content)
        modified = True
        
    # Replace old purple gradients with indigo gradients
    old_gradient = r'linear-gradient\([^,]+,\s*#6d5aa0[^,]+,\s*#7c67c4[^,]+,\s*#8b78d4[^)]+\)'
    new_gradient = 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)'
    if re.search(old_gradient, content):
        content = re.sub(old_gradient, new_gradient, content)
        modified = True
        
    if modified:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated CSS: {css_file}")

print("✅ UI Refactor Script Completed!")
