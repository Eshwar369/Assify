import re

with open('docs/templates/sdd/examples/plan.md', 'r', encoding='utf-8') as f:
    plan = f.read()

with open('docs/templates/sdd/examples/tasks.md', 'r', encoding='utf-8') as f:
    tasks = f.read()

lines = plan.splitlines()[306:361]
print("Tree lines in plan.md:")
tree_files = []
for l in lines:
    m = re.search(r'([a-zA-Z0-9_\-]+\.[a-zA-Z0-9]+)', l)
    if m:
        fname = m.group(1)
        in_tasks = fname in tasks
        print(f"{fname:<35} | in tasks: {in_tasks}")
        if not in_tasks:
            tree_files.append(fname)

print("\nFiles in plan tree NOT in tasks:")
for fn in tree_files:
    print(f"  - {fn}")
