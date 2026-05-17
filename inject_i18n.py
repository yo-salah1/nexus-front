import re

path = r"d:\FCI - GP\YS_NEXUS\Front\index8.html"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add data-i18n tags
replacements = {
    '>Home</span>': ' data-i18n="nav_home">Home</span>',
    '>New Chat</span>': ' data-i18n="nav_new_chat">New Chat</span>',
    '>Video</span>': ' data-i18n="nav_video_chat">Video</span>',
    '>Audio</span>': ' data-i18n="nav_audio_chat">Audio</span>',
    '>Text</span>': ' data-i18n="nav_text_chat">Text</span>',
    '>History</span>': ' data-i18n="nav_history">History</span>',
    '>Settings</span>': ' data-i18n="nav_settings">Settings</span>',
    '>prompets</span>': ' data-i18n="nav_prompts">prompets</span>',
    'Hello, I am NEXUS': '<span data-i18n="welcome_ai">Hello, I am NEXUS</span>',
    "Your AI mental wellness companion. How are you feeling today?": '<span data-i18n="welcome_sub">Your AI mental wellness companion. How are you feeling today?</span>',
    'placeholder="Type your message here..."': 'placeholder="Type your message here..." data-i18n="input_placeholder"'
}

for old, new in replacements.items():
    content = content.replace(old, new)

# Fix the duplicate comment
content = content.replace('<!-- Header -->\n            <!-- Header -->', '<!-- Header -->')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("i18n tags injected into index8.html")
