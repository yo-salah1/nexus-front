import os
import shutil
import re

base_dir = r"d:\NEXUS_DEMO\V1\Front"
pages_dir = os.path.join(base_dir, "pages")
css_dir = os.path.join(base_dir, "css")
js_dir = os.path.join(base_dir, "js")
assets_dir = os.path.join(base_dir, "assets")

for d in [pages_dir, css_dir, js_dir, assets_dir]:
    os.makedirs(d, exist_ok=True)

html_map = {
    "index1.html": "loading.html",
    "index2.html": "ai_assistant.html",
    "index3.html": "login.html",
    "index4.html": "signup.html",
    "index5.html": "login_phone.html",
    "index6.html": "otp_verification.html",
    "index7.html": "voice_assistant.html",
    "index8.html": "ai_chat.html",
    "index9.html": "premium_voice.html",
    "index10.html": "video_chat.html",
    "index11.html": "chat_history.html",
    "index12.html": "settings.html",
    "index13.html": "dashboard.html",
    "index14.html": "help_support.html",
    "About_Us.html": "about_us.html",
    "Forget_Password.html": "forgot_password.html"
}

css_map = {
    "style1.css": "loading.css",
    "style2.css": "ai_assistant.css",
    "style3.css": "login.css",
    "style4.css": "signup.css",
    "style5.css": "login_phone.css",
    "style6.css": "otp_verification.css",
    "style7.css": "voice_assistant.css",
    "style8.css": "ai_chat.css",
    "style9.css": "premium_voice.css",
    "style10.css": "video_chat.css",
    "style11.css": "chat_history.css",
    "style12.css": "settings.css",
    "style13.css": "dashboard.css",
    "style14.css": "help_support.css",
    "style-about.css": "about_us.css",
    "style-forgot-password.css": "forgot_password.css",
    "landing.css": "landing.css",
    "global.css": "global.css"
}

js_map = {
    "script1.js": "loading.js",
    "script2.js": "ai_assistant.js",
    "script3.js": "login.js",
    "script4.js": "signup.js",
    "script5.js": "login_phone.js",
    "script6.js": "otp_verification.js",
    "script7.js": "voice_assistant.js",
    "script8.js": "ai_chat.js",
    "script9.js": "premium_voice.js",
    "script10.js": "video_chat.js",
    "script11.js": "chat_history.js",
    "script12.js": "settings.js",
    "script13.js": "dashboard.js",
    "script14.js": "help_support.js",
    "script-about.js": "about_us.js",
    "script-forgot-password.js": "forgot_password.js",
    "landing.js": "landing.js",
    "global.js": "global.js",
    "config.js": "config.js",
    "sidebar.js": "sidebar.js"
}

images = [f for f in os.listdir(base_dir) if os.path.isfile(os.path.join(base_dir, f)) and f.lower().endswith(('.png', '.jpg', '.jpeg', '.ico', '.svg', '.gif'))]

for img in images:
    shutil.move(os.path.join(base_dir, img), os.path.join(assets_dir, img))

for old_name, new_name in html_map.items():
    if os.path.exists(os.path.join(base_dir, old_name)):
        shutil.move(os.path.join(base_dir, old_name), os.path.join(pages_dir, new_name))

for old_name, new_name in css_map.items():
    if os.path.exists(os.path.join(base_dir, old_name)):
        shutil.move(os.path.join(base_dir, old_name), os.path.join(css_dir, new_name))

for old_name, new_name in js_map.items():
    if os.path.exists(os.path.join(base_dir, old_name)):
        shutil.move(os.path.join(base_dir, old_name), os.path.join(js_dir, new_name))

def replace_in_file(filepath, replacements):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Failed to read {filepath}: {e}")
        return

    new_content = content
    # Sort replacements by length of old_str descending to prevent partial replacements
    replacements = sorted(replacements, key=lambda x: len(x[0]), reverse=True)
    
    for old_str, new_str in replacements:
        # Match old_str exactly inside quotes or parentheses
        pattern = r'(["\'/(])(?:\./)?' + re.escape(old_str) + r'(["\'/)])'
        new_content = re.sub(pattern, r'\g<1>' + new_str + r'\g<2>', new_content)
        
    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {filepath}")

# Index replacements
root_replacements = []
for old, new in html_map.items():
    root_replacements.append((old, f"pages/{new}"))
for old, new in css_map.items():
    root_replacements.append((old, f"css/{new}"))
for old, new in js_map.items():
    root_replacements.append((old, f"js/{new}"))
for img in images:
    root_replacements.append((img, f"assets/{img}"))

if os.path.exists(os.path.join(base_dir, "index.html")):
    replace_in_file(os.path.join(base_dir, "index.html"), root_replacements)

# Pages replacements
pages_replacements = []
for old, new in html_map.items():
    pages_replacements.append((old, new))
pages_replacements.append(("index.html", "../index.html"))
for old, new in css_map.items():
    pages_replacements.append((old, f"../css/{new}"))
for old, new in js_map.items():
    pages_replacements.append((old, f"../js/{new}"))
for img in images:
    pages_replacements.append((img, f"../assets/{img}"))

for html_file in os.listdir(pages_dir):
    if html_file.endswith('.html'):
        replace_in_file(os.path.join(pages_dir, html_file), pages_replacements)

# CSS replacements
css_replacements = []
for img in images:
    css_replacements.append((img, f"../assets/{img}"))
for old, new in css_map.items():
    css_replacements.append((old, new))

for css_file in os.listdir(css_dir):
    if css_file.endswith('.css'):
        replace_in_file(os.path.join(css_dir, css_file), css_replacements)

# JS replacements
root_js = ["landing.js"]
for js_file in os.listdir(js_dir):
    if js_file.endswith('.js'):
        if js_file in root_js:
            replace_in_file(os.path.join(js_dir, js_file), root_replacements)
        else:
            replace_in_file(os.path.join(js_dir, js_file), pages_replacements)

print("All done!")
