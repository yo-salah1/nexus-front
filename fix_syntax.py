import os

FRONT_DIR = r"d:\FCI - GP\YS_NEXUS\Front"

js_files = [f for f in os.listdir(FRONT_DIR) if f.endswith('.js')]

for js_file in js_files:
    path = os.path.join(FRONT_DIR, js_file)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False

    # Fix the broken backslashes
    bad_prefix = r"fetch\(`\$\{API_BASE_URL\}/"
    good_prefix = r"fetch(`${API_BASE_URL}/"

    if bad_prefix in content:
        content = content.replace(bad_prefix, good_prefix)
        modified = True

    # Fix the ending parenthesis
    bad_suffix = r"' } }\)"
    good_suffix = r"' } })"

    if bad_suffix in content:
        content = content.replace(bad_suffix, good_suffix)
        modified = True

    # Check for others just in case, like history`, {
    bad_mid = r"`\)"
    good_mid = r"`)"
    if bad_mid in content:
        content = content.replace(bad_mid, good_mid)
        modified = True

    if modified:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed syntax in: {js_file}")

print("Syntax fix applied!")
