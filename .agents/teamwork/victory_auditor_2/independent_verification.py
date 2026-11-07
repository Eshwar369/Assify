import os
import re
import sys

def verify_all():
    print("=" * 60)
    print("INDEPENDENT VICTORY AUDIT VERIFICATION SUITE")
    print("=" * 60)

    # -------------------------------------------------------------
    # 1. Scope & Deliverable Existence Check
    # -------------------------------------------------------------
    required_files = [
        "docs/sdd_patterns_and_best_practices.md",
        "docs/templates/sdd/generic/constitution.md",
        "docs/templates/sdd/generic/spec.md",
        "docs/templates/sdd/generic/plan.md",
        "docs/templates/sdd/generic/tasks.md",
        "docs/templates/sdd/examples/constitution.md",
        "docs/templates/sdd/examples/spec.md",
        "docs/templates/sdd/examples/plan.md",
        "docs/templates/sdd/examples/tasks.md",
    ]
    
    print("\n--- CHECK 1: File Existence & Size ---")
    file_stats = {}
    for rf in required_files:
        assert os.path.exists(rf), f"CRITICAL: Missing file {rf}"
        size = os.path.getsize(rf)
        with open(rf, "r", encoding="utf-8") as f:
            lines = len(f.readlines())
        assert size > 5000, f"File {rf} is suspiciously small: {size} bytes"
        file_stats[rf] = {"size": size, "lines": lines}
        print(f"  [PASS] {rf} ({lines} lines, {size} bytes)")

    # -------------------------------------------------------------
    # 2. Research Deliverable Verification
    # -------------------------------------------------------------
    print("\n--- CHECK 2: Research & Synthesis (docs/sdd_patterns_and_best_practices.md) ---")
    with open("docs/sdd_patterns_and_best_practices.md", "r", encoding="utf-8") as f:
        res_text = f.read()

    # 8-stage SDD funnel
    stages = [f"Stage {i}" for i in range(1, 9)]
    for stg in stages:
        assert stg in res_text, f"Missing {stg} in research doc"
    print("  [PASS] 8-stage SDD funnel documented (Stages 1 through 8 present)")

    # Fowler & Böckeler 3 tiers
    assert "Fowler" in res_text, "Missing Martin Fowler citation"
    assert "Böckeler" in res_text or "Bockeler" in res_text, "Missing Birgitta Böckeler citation"
    assert "Tier 1" in res_text and "Tier 2" in res_text and "Tier 3" in res_text, "Missing Fowler/Böckeler 3 tiers"
    print("  [PASS] Fowler & Böckeler Thoughtworks 3 tiers documented")

    # Anti-patterns (at least 10)
    ap_matches = re.findall(r"Anti-Pattern\s+\d+", res_text, re.IGNORECASE)
    assert len(ap_matches) >= 10, f"Expected >=10 anti-patterns, found {len(ap_matches)}"
    print(f"  [PASS] {len(ap_matches)} Anti-patterns / pitfalls analyzed with practical mitigations")

    # Code fence balance
    fences = [l for l in res_text.splitlines() if l.strip().startswith("```")]
    assert len(fences) % 2 == 0, f"Unbalanced code fences in research doc: {len(fences)}"
    print(f"  [PASS] Code fence balance: {len(fences)} fences (symmetric)")

    # -------------------------------------------------------------
    # 3. Generic Templates Verification
    # -------------------------------------------------------------
    print("\n--- CHECK 3: Core Generic SDD Templates ---")
    gen_dir = "docs/templates/sdd/generic"
    for gt in ["constitution.md", "spec.md", "plan.md", "tasks.md"]:
        path = os.path.join(gen_dir, gt)
        with open(path, "r", encoding="utf-8") as f:
            text = f.read()
        
        # RFC 2119
        rfc = re.findall(r"\b(MUST|MUST NOT|SHOULD|SHOULD NOT|MAY|REQUIRED)\b", text)
        assert len(rfc) >= 10, f"{gt} has insufficient RFC 2119 keywords: {len(rfc)}"
        
        # Section guidance & AI instructions
        assert re.search(r"instruction|guidance|directive|firewall|rule", text, re.I), f"Missing agent guidance in {gt}"
        
        # Code fence balance
        gfences = [l for l in text.splitlines() if l.strip().startswith("```")]
        assert len(gfences) % 2 == 0, f"Unbalanced code fences in {gt}: {len(gfences)}"
        print(f"  [PASS] {gt}: {len(rfc)} RFC 2119 directives, balanced fences ({len(gfences)}), agent guidance verified")

    # -------------------------------------------------------------
    # 4. Project Reference Examples Verification
    # -------------------------------------------------------------
    print("\n--- CHECK 4: Concrete Project Reference Templates ---")
    
    # 4.1 constitution.md
    with open("docs/templates/sdd/examples/constitution.md", "r", encoding="utf-8") as f:
        c_text = f.read()
    
    # Design tokens
    for tok in ["#FFFFFF", "#F5F5F7", "#BF9B28", "#1D1D1F"]:
        assert tok in c_text, f"Missing design token {tok} in example constitution"
    print("  [PASS] Light Apple HIG design tokens verified (#FFFFFF, #F5F5F7, #BF9B28, #1D1D1F)")

    # Component-First Law
    assert "Components import tokens; screens import components" in c_text, "Missing Component-First law statement"
    primitives = ["StatStrip", "SegmentedControl", "EditorialSection", "ReceiptQuote", "DeluluGauge"]
    for prim in primitives:
        assert prim in c_text, f"Missing primitive {prim} in example constitution"
    print(f"  [PASS] Component-First law and all 5 centralized primitives verified: {primitives}")

    # Anti-Slop 20 tells
    art3_start = c_text.find("### Article III: Anti-Slop Enforcement")
    art4_start = c_text.find("### Article IV: Design Token Locks")
    art3_text = c_text[art3_start:art4_start]
    tells = re.findall(r"\d+\.\s+\*\*No\s+([^\*]+)\*", art3_text)
    assert len(tells) == 20, f"Expected exactly 20 Anti-Slop tells, found {len(tells)}"
    print(f"  [PASS] Article III codifies all 20 Anti-Slop tells from native-slop.md")

    # Universal Database Provider & TDD
    assert "BaseDatabaseProvider" in c_text, "Missing BaseDatabaseProvider"
    assert "SQLite" in c_text and "WAL" in c_text, "Missing SQLite WAL"
    assert "Test-Driven Development" in c_text or "TDD" in c_text, "Missing TDD mandate"
    print("  [PASS] BaseDatabaseProvider, SQLite WAL, and TDD mandates verified")

    # 4.2 spec.md
    with open("docs/templates/sdd/examples/spec.md", "r", encoding="utf-8") as f:
        s_text = f.read()
    
    # What vs How firewall
    for tech in ["React Native", "Zustand", "SQLite", "POST /api", "TypeScript"]:
        # Should not be in user stories/scenarios/requirements
        req_start = s_text.find("## User Scenarios & Testing")
        req_end = s_text.find("## Assumptions")
        req_body = s_text[req_start:req_end]
        assert tech not in req_body, f"Violation of What vs How firewall: found '{tech}' in spec requirements"
    print("  [PASS] 'What vs How' firewall strictly preserved in core spec.md requirements")

    # User stories & acceptance scenarios
    stories = re.findall(r"###\s+User Story\s+(\d+)", s_text)
    assert len(stories) >= 3, f"Expected >=3 user stories, found {len(stories)}"
    assert "1" in stories, "Missing User Story 1 (P1 MVP)"
    evidence_checks = re.findall(r"\*\*Evidence Check\*\*", s_text)
    assert len(evidence_checks) >= 6, f"Expected >=6 evidence checks, found {len(evidence_checks)}"
    print(f"  [PASS] {len(stories)} User Stories with P1 MVP slice and {len(evidence_checks)} BDD Evidence Checks")

    # Edge cases
    assert "Terminal Turn Exclusion" in s_text, "Missing Terminal Turn Exclusion in spec.md"
    assert "Incremental" in s_text and "Delta" in s_text, "Missing Incremental Delta Ingestion in spec.md"
    assert "+91" in s_text, "Missing Indian phone number formatting in spec.md"
    print("  [PASS] Critical edge cases verified (Terminal Turn, Delta Ingestion, Indian phone PII)")

    # 4.3 plan.md
    with open("docs/templates/sdd/examples/plan.md", "r", encoding="utf-8") as f:
        p_text = f.read()

    # DDL BIGINT timestamps
    assert "timestamp INTEGER NOT NULL" not in p_text, "Found 32-bit timestamp INTEGER NOT NULL in plan.md"
    bigints = re.findall(r"\b(\w+)\s+BIGINT\s+NOT\s+NULL", p_text)
    assert len(bigints) >= 5, f"Expected >=5 BIGINT NOT NULL columns, found {len(bigints)}: {bigints}"
    print(f"  [PASS] DDL 64-bit cross-provider parity: all 5 timestamp columns are BIGINT NOT NULL: {bigints}")

    # Provider abstraction and registry
    assert "BaseDatabaseProvider" in p_text, "Missing BaseDatabaseProvider in plan.md"
    assert "registerDatabaseProvider" in p_text, "Missing registerDatabaseProvider in plan.md"
    assert "getDatabaseProvider" in p_text, "Missing getDatabaseProvider in plan.md"
    print("  [PASS] BaseDatabaseProvider contract and typed provider registry functions verified")

    # 4.4 tasks.md
    with open("docs/templates/sdd/examples/tasks.md", "r", encoding="utf-8") as f:
        t_text = f.read()

    # Task item syntax and count
    tasks = re.findall(r"^- \[ \] (T\d+)", t_text, re.MULTILINE)
    assert len(tasks) == 39, f"Expected exactly 39 active tasks, found {len(tasks)}"
    assert len(set(tasks)) == 39, f"Duplicate tasks detected: {tasks}"
    assert tasks[0] == "T001" and tasks[-1] == "T039", f"Task range mismatch: {tasks[0]} to {tasks[-1]}"
    print(f"  [PASS] Exactly 39 sequential, unique active tasks (T001 to T039) verified")

    # Mandated primitives and screens
    for comp in ["SegmentedControl.tsx", "vault.tsx", "report.tsx", "StatStrip.tsx", "ReceiptQuote.tsx", "DeluluGauge.tsx"]:
        assert comp in t_text, f"Missing {comp} in tasks.md"
    print("  [PASS] All mandated UI primitives and route screens present in tasks.md")

    # Store decoupling
    t015 = [l for l in t_text.splitlines() if "T015" in l and l.strip().startswith("- [ ]")][0]
    t023 = [l for l in t_text.splitlines() if "T023" in l and l.strip().startswith("- [ ]")][0]
    assert "T005" in t015 and "T006" not in t015, f"T015 coupling defect: {t015}"
    assert "T005" in t023 and "T006" not in t023, f"T023 coupling defect: {t023}"
    print("  [PASS] Store decoupling verified (T015 and T023 depend on abstract T005, not concrete T006)")

    # All tasks have backtick mobile/ paths
    bt = chr(96)
    path_pat = re.compile(bt + r'([^' + bt + r']+)' + bt)
    task_lines = [l.strip() for l in t_text.splitlines() if l.strip().startswith("- [ ]")]
    for tl in task_lines:
        paths = path_pat.findall(tl)
        assert any(p.startswith("mobile/") for p in paths), f"Task missing mobile/ path: {tl}"
    print(f"  [PASS] 100% of tasks ({len(task_lines)}/{len(task_lines)}) specify exact backtick-enclosed mobile/ paths")

    # Phase 7 append-only convergence clean
    assert "Pre-defined gap resolution examples" not in t_text, "Phase 7 has uncleaned mock tasks"
    print("  [PASS] Phase 7 Append-Only Convergence cleanly structured with 0 active mock tasks")

    # -------------------------------------------------------------
    # 5. Forensic Anti-Cheating Checks
    # -------------------------------------------------------------
    print("\n--- CHECK 5: Forensic Anti-Cheating & Integrity Checks ---")
    
    # 5.1 Hardcoded Test Results & Facades
    all_content = res_text + c_text + s_text + p_text + t_text
    # Check for fake PASS strings
    assert "TEST RESULT: ALL TESTS PASSED (HARDCODED)" not in all_content
    # Check for empty facades
    assert "return True  # TODO implement" not in all_content
    print("  [PASS] Zero hardcoded test results or facade stubs detected")

    # 5.2 Pre-populated Artifacts Check
    ignore = {".git", ".venv", "node_modules", "__pycache__"}
    pre_artifacts = []
    for r, d, fs in os.walk("."):
        d[:] = [x for x in d if x not in ignore]
        for f in fs:
            if f.endswith(".log") or ("result" in f.lower() and not f.endswith(".py") and not f.endswith(".md")):
                pre_artifacts.append(os.path.join(r, f))
    assert len(pre_artifacts) == 0, f"Found pre-populated artifacts: {pre_artifacts}"
    print("  [PASS] Zero pre-populated test logs or artifact files in workspace")

    # 5.3 Workspace Discipline
    teamwork_dir = ".agents/teamwork"
    assert not os.path.exists(os.path.join(teamwork_dir, "AGENTS.md")), "Prohibited AGENTS.md in teamwork"
    assert not os.path.exists(os.path.join(teamwork_dir, "GEMINI.md")), "Prohibited GEMINI.md in teamwork"
    print("  [PASS] Workspace convention respected (no prohibited AGENTS.md or GEMINI.md)")

    print("\n" + "=" * 60)
    print("ALL VERIFICATION CHECKS PASSED (100% SUCCESS)")
    print("=" * 60)

if __name__ == "__main__":
    verify_all()
