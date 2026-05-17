import os
import re

# تأكد أن هذا المسار هو مسار فولدر الفرونت عندك
FRONT_DIR = r"d:\FCI - GP\YS_NEXUS\Front"

print("--- Start Automating NEXUS Front-end ---")

# 1. تحديث ملفات HTML (عشان تقرأ ملف config.js)
html_files = [f for f in os.listdir(FRONT_DIR) if f.endswith('.html')]
for html_file in html_files:
    path = os.path.join(FRONT_DIR, html_file)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    config_script = '<script src="config.js"></script>'
    if config_script not in content:
        if '</head>' in content:
            # بنحط config.js في الأول خالص عشان باقي الملفات تشوفه
            content = content.replace('</head>', f'    {config_script}\n</head>')
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Injected config.js into: {html_file}")

# 2. تحديث ملفات JS (عشان تستخدم المتغيرات من config.js بدل localhost)
js_files = [f for f in os.listdir(FRONT_DIR) if f.endswith('.js') and f != 'config.js']

# الـ Regex ده بيصطاد أي رابط مكتوب قديم (سواء localhost أو IP)
url_pattern = r"const\s+API_BASE_URL\s*=\s*['\"]http://[^'\"]+/api['\"];"
fer_pattern = r"const\s+FER_API_URL\s*=\s*['\"]http://[^'\"]+['\"];"

for js_file in js_files:
    path = os.path.join(FRONT_DIR, js_file)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    # استبدال الروابط القديمة بمتغيرات من الملف المركزي
    if re.search(url_pattern, content):
        content = re.sub(url_pattern, "const API_BASE_URL = window.NEXUS_CONFIG.API_BASE_URL;", content)
        modified = True
    
    if re.search(fer_pattern, content):
        content = re.sub(fer_pattern, "const FER_API_URL = window.NEXUS_CONFIG.FER_API_URL;", content)
        modified = True
        
    if modified:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"🚀 Linked {js_file} to Central Config")

print("\n--- ✅ All done! Your project is now dynamic ---")