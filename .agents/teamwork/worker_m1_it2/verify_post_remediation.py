import re
import sys

def verify():
    print("=== POST-REMEDIATION DIRECT VERIFICATION ===")
    
    with open('docs/templates/sdd/generic/tasks.md', 'r', encoding='utf-8') as f:
        tasks = f.read()
    with open('docs/templates/sdd/generic/plan.md', 'r', encoding='utf-8') as f:
        plan = f.read()

    # 1. plan.md line 3 nested brackets check
    plan_nested = re.findall(r'\[[^\]\n]*\[[^\]\n]+\][^\]\n]*\]', plan)
    assert len(plan_nested) == 0, f"FAIL: Nested brackets in plan.md: {plan_nested}"
    assert '`specs/[###-feature-name]/spec.md`' in plan, "FAIL: plan.md Spec path not properly backticked"
    print("1. Plan nested brackets: [] (PASS)")

    # 2. tasks.md Title standardization
    assert '# Tasks: [FEATURE_NAME]' in tasks, "FAIL: tasks.md title not standardized to [FEATURE_NAME]"
    print("2. Tasks title standardized to [FEATURE_NAME]: PASS")

    # 3. Disambiguation documentation present
    assert '### Reserved Task Syntax Flags vs. Template Placeholders' in tasks, "FAIL: Reserved syntax flags section missing"
    assert r'\[(?!(?:P|US\d+)\b)([A-Z0-9_]+)\]' in tasks, "FAIL: Extraction regex missing"
    print("3. Syntax flag protection & extraction regex present: PASS")

    # 4. T026 file path in backticks
    t026_match = re.search(r'-\s+\[\s*\]\s+T026\s+(.*)', tasks)
    assert t026_match and '`package.json`' in t026_match.group(1), f"FAIL: T026 missing `package.json`: {t026_match.group(1) if t026_match else None}"
    print("4. T026 backtick & file path present: True (PASS)")

    # 5. Zero lowercase placeholders
    lowercase_tokens = [m for m in re.findall(r'\[([a-z0-9_]+)\]', tasks) if m not in ('x', ' ')]
    assert len(lowercase_tokens) == 0, f"FAIL: Lowercase placeholders found in tasks.md: {set(lowercase_tokens)}"
    print("5. Lowercase placeholders in tasks.md: [] (PASS)")

    # 6. Terminal H2 is Convergence
    h2_headers = [l for l in tasks.splitlines() if l.startswith('## ')]
    assert len(h2_headers) > 0 and 'Convergence' in h2_headers[-1], f"FAIL: Terminal H2 header is '{h2_headers[-1]}' instead of Convergence"
    print(f"6. Last H2 header in tasks.md: {h2_headers[-1]} (PASS)")

    # 7. Total syntax flags preserved
    flags = re.findall(r'\[(P|US\d+)\]', tasks)
    assert len(flags) == 39, f"FAIL: Expected 39 syntax flags, found {len(flags)}"
    print(f"7. Total syntax flags preserved in tasks.md: {len(flags)} (PASS)")

    # 8. Distinct uppercase placeholders
    placeholders = sorted(set(re.findall(r'\[(?!(?:P|US\d+)\b)([A-Z0-9_]+)\]', tasks)))
    expected_placeholders = ['COMPONENT_NAME', 'CONFIG_FILE', 'ENHANCEMENT_NAME', 'ENTITY2_NAME', 'ENTITY_NAME', 'FEATURE_NAME', 'JOURNEY2_NAME', 'LOGGER_NAME', 'PROJECT_ROOT', 'SCENARIO3_NAME', 'SCREEN_NAME', 'SERVICE2_NAME', 'SERVICE_NAME', 'VIEW_NAME']
    assert placeholders == expected_placeholders, f"FAIL: Placeholders mismatch. Found: {placeholders}"
    print(f"8. Distinct uppercase placeholders in tasks.md: {placeholders} (PASS)")

    print("\nALL 8 POST-REMEDIATION VERIFICATION CHECKS PASSED WITH 100% SUCCESS.")

if __name__ == '__main__':
    verify()
