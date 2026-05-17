import os
import re

FRONT_DIR = r"d:\FCI - GP\YS_NEXUS\Front"

style_files = [f for f in os.listdir(FRONT_DIR) if f.endswith('.css') and f.startswith('style')]

# We want to remove the redundant sidebar rules in @media (max-width: 768px)
# Since global.css handles it with !important now.
# Also fix header padding for mobile.

for style_file in style_files:
    path = os.path.join(FRONT_DIR, style_file)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Look for @media (max-width: 768px) or similar
    # and remove the .sidebar { ... } inside it if it's there.
    
    # Simple approach: if .sidebar is inside a media query, comment it out or remove it
    # But only if it's the fixed positioning one.
    
    pattern = r'@media\s*\(\s*max-width\s*:\s*768px\s*\)\s*\{([^}]*?\.sidebar\s*\{[^}]*?position\s*:\s*fixed[^}]*?\})'
    content = re.sub(pattern, r'@media (max-width: 768px) {/* Sidebar handled by global.css */', content, flags=re.DOTALL)
    
    # 2. Fix header padding for mobile if it's too small
    header_patterns = [r'\.chat-header', r'\.help-header', r'\.history-header', r'\.settings-header', r'\.home-header', r'\.voice-header']
    for hp in header_patterns:
        if hp in content:
            # Ensure it has enough top padding on mobile
            if '@media (max-width: 768px)' in content:
                # Add padding to the existing media query for the header if not present
                header_mobile_style = f'\n    {hp} {{ padding-top: 4.5rem !important; display: flex !important; align-items: center !important; gap: 1rem !important; }}\n'
                if hp not in content.split('@media (max-width: 768px)')[1]:
                    content = content.replace('@media (max-width: 768px) {', f'@media (max-width: 768px) {{{header_mobile_style}')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Cleaned {style_file}")

print("Style Cleanup Completed!")
