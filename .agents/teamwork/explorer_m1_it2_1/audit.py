import re

with open('docs/templates/sdd/generic/tasks.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("=== ALL BRACKETED TOKENS IN TASKS.MD ===")
for i, line in enumerate(lines, 1):
    tokens = re.findall(r'\[([^\]\n]+)\]', line)
    # filter out checkbox [ ] and [x]
    non_cb = [t for t in tokens if t not in (' ', 'x')]
    if non_cb:
        # check if any token is not purely UPPERCASE with optional underscore
        not_upper = [t for t in non_cb if not re.match(r'^[A-Z0-9_]+$', t)]
        if not_upper:
            safe_line = line.strip().encode('ascii', 'backslashreplace').decode('ascii')
            print(f"Line {i:3d}: {safe_line}")
            print(f"   Non-uppercase tokens: {not_upper}")
