import os
import re

FRONT_DIR = r"d:\FCI - GP\YS_NEXUS\Front"

print("--- Injecting ngrok-skip-browser-warning headers ---")

js_files = [f for f in os.listdir(FRONT_DIR) if f.endswith('.js') and f != 'config.js' and f != 'global.js']

for js_file in js_files:
    path = os.path.join(FRONT_DIR, js_file)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False

    # 1. Inject into existing headers: {
    # We look for "headers: {" or "headers: {" and insert our header right after.
    # Note: 'Content-Type' might be inside.
    if 'headers: {' in content:
        content = content.replace("headers: {", "headers: { 'ngrok-skip-browser-warning': 'true',")
        modified = True
    elif 'headers:{' in content:
        content = content.replace("headers:{", "headers:{'ngrok-skip-browser-warning': 'true',")
        modified = True

    # 2. Inject into fetch() calls that don't have an options object
    # e.g., fetch(`${API_BASE_URL}/chat/history`)
    # e.g., fetch(`${API_BASE_URL}/faqs`)
    # e.g., fetch(`${API_BASE_URL}/settings`)
    # We'll use a regex that finds fetch(something) where something doesn't contain a comma, 
    # but that's risky if the URL contains a comma. We know the exact API calls from grep.
    
    simple_fetches = [
        r"fetch\(`\$\{API_BASE_URL\}/chat/history`\)",
        r"fetch\(`\$\{API_BASE_URL\}/faqs`\)",
        r"fetch\(`\$\{API_BASE_URL\}/prompts`\)",
        r"fetch\(`\$\{API_BASE_URL\}/settings`\)",
        r"fetch\(`\$\{API_BASE_URL\}/history`\)"
    ]
    
    for sf in simple_fetches:
        if re.search(sf, content):
            replacement = sf.replace(r"\)", r", { headers: { 'ngrok-skip-browser-warning': 'true' } }\)")
            content = re.sub(sf, replacement, content)
            modified = True

    # 3. What about fetch calls that have an options object but NO headers?
    # e.g., script9.js: fetch(`${API_BASE_URL}/voice/analyze`, { method:'POST', body:fd })
    # script10.js: fetch(`${API_BASE_URL}/fer/analyze`, { method:'POST', body:formData })
    
    if "method:'POST', body:fd" in content:
        content = content.replace("method:'POST', body:fd", "method:'POST', headers: {'ngrok-skip-browser-warning': 'true'}, body:fd")
        modified = True
        
    if "method:'POST', body:formData" in content:
        content = content.replace("method:'POST', body:formData", "method:'POST', headers: {'ngrok-skip-browser-warning': 'true'}, body:formData")
        modified = True

    if modified:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Injected headers into: {js_file}")

print("--- Done! ---")
