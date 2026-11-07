import os
import re

def audit_research_doc():
    path = "docs/sdd_patterns_and_best_practices.md"
    assert os.path.exists(path), f"Missing {path}"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    print(f"=== {path} ===")
    print(f"Lines: {len(content.splitlines())}")
    print(f"Bytes: {len(content.encode('utf-8'))}")
    
    # 8-stage funnel check
    funnel_matches = re.findall(r"Stage\s+[0-8]", content, re.IGNORECASE)
    print(f"Stage matches: {len(funnel_matches)}")
    
    # Fowler & Böckeler
    has_fowler = "Fowler" in content
    has_bockeler = "Böckeler" in content or "Bockeler" in content
    print(f"Fowler & Böckeler: Fowler={has_fowler}, Böckeler={has_bockeler}")
    
    # 3 tiers
    has_tiers = "Tier 1" in content and "Tier 2" in content and "Tier 3" in content
    print(f"3 Tiers: {has_tiers}")
    
    # Pitfalls and anti-patterns
    anti_patterns = re.findall(r"Anti-Pattern\s+\d+", content, re.IGNORECASE)
    print(f"Anti-patterns found: {len(anti_patterns)}")
    
    # Placeholders
    placeholders = re.findall(r"\b(TODO|TBD|FIXME|XXX)\b|\[insert|\[placeholder", content, re.IGNORECASE)
    print(f"Placeholders: {len(placeholders)}")
    
    # Code fence balance
    fences = [line for line in content.splitlines() if line.strip().startswith("```")]
    print(f"Code fences: {len(fences)} (even={len(fences)%2==0})")
    
def audit_generic_templates():
    generic_dir = "docs/templates/sdd/generic"
    templates = ["constitution.md", "spec.md", "plan.md", "tasks.md"]
    
    print("\n=== Generic Templates Audit ===")
    for t in templates:
        path = os.path.join(generic_dir, t)
        assert os.path.exists(path), f"Missing {path}"
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        
        lines = content.splitlines()
        rfc_matches = re.findall(r"\b(MUST|MUST NOT|SHOULD|SHOULD NOT|MAY|REQUIRED)\b", content)
        fences = [l for l in lines if l.strip().startswith("```")]
        
        # Check for agent instructions
        has_agent_instructions = bool(re.search(r"agent|instruction|guidance", content, re.I))
        # Check for intent
        has_intent = bool(re.search(r"intent|purpose|rationale", content, re.I))
        
        print(f"[{t}] Lines: {len(lines)}, Bytes: {len(content.encode('utf-8'))}")
        print(f"  RFC 2119 keywords: {len(rfc_matches)}")
        print(f"  Code fences: {len(fences)} (even={len(fences)%2==0})")
        print(f"  Agent instructions: {has_agent_instructions}")
        print(f"  Section intent: {has_intent}")

def audit_example_templates():
    examples_dir = "docs/templates/sdd/examples"
    print("\n=== Concrete Project Reference Templates Audit ===")
    
    # 1. constitution.md
    const_path = os.path.join(examples_dir, "constitution.md")
    with open(const_path, "r", encoding="utf-8") as f:
        c_text = f.read()
    print(f"[constitution.md] Lines: {len(c_text.splitlines())}, Bytes: {len(c_text.encode('utf-8'))}")
    tells = re.findall(r"\d+\.\s+\*\*No\s+([^\*]+)\*", c_text)
    print(f"  Anti-Slop tells count: {len(tells)}")
    print(f"  Component-First primitives present: {all(p in c_text for p in ['StatStrip', 'SegmentedControl', 'EditorialSection', 'ReceiptQuote', 'DeluluGauge'])}")
    print(f"  Light Apple HIG tokens present: {all(tok in c_text for tok in ['#FFFFFF', '#F5F5F7', '#BF9B28'])}")
    print(f"  BaseDatabaseProvider present: {'BaseDatabaseProvider' in c_text}")
    
    # 2. spec.md
    spec_path = os.path.join(examples_dir, "spec.md")
    with open(spec_path, "r", encoding="utf-8") as f:
        s_text = f.read()
    print(f"[spec.md] Lines: {len(s_text.splitlines())}, Bytes: {len(s_text.encode('utf-8'))}")
    stories = re.findall(r"###\s+User Story\s+(\d+)", s_text)
    evidence_checks = re.findall(r"\*\*Evidence Check\*\*", s_text)
    frs = sorted(list(set(re.findall(r"\bFR-\d+\b", s_text))))
    scs = sorted(list(set(re.findall(r"\bSC-\d+\b", s_text))))
    edge_cases = re.findall(r"####\s+Edge Case\s+(\d+)", s_text)
    print(f"  User Stories: {stories}")
    print(f"  Evidence Checks: {len(evidence_checks)}")
    print(f"  FRs: {frs}")
    print(f"  SCs: {scs}")
    print(f"  Edge cases: {len(edge_cases)}")
    print(f"  Chronemics math formulas: {'median_latency' in s_text or 'response_latency' in s_text}")
    print(f"  Terminal turn exclusion: {'Terminal Turn Exclusion' in s_text}")
    print(f"  Incremental delta ingestion: {'Incremental' in s_text and 'Delta' in s_text}")
    print(f"  Indian phone format (+91): {'+91' in s_text}")
    
    # 3. plan.md
    plan_path = os.path.join(examples_dir, "plan.md")
    with open(plan_path, "r", encoding="utf-8") as f:
        p_text = f.read()
    print(f"[plan.md] Lines: {len(p_text.splitlines())}, Bytes: {len(p_text.encode('utf-8'))}")
    ts_matches = re.findall(r"(\w+)\s+(INTEGER|BIGINT)\s+NOT\s+NULL", p_text)
    print(f"  Timestamp columns: {ts_matches}")
    print(f"  BaseDatabaseProvider present: {'BaseDatabaseProvider' in p_text}")
    print(f"  Provider registry functions: {'registerDatabaseProvider' in p_text and 'getDatabaseProvider' in p_text}")
    print(f"  Expo SDK 54 mentioned: {'Expo' in p_text or 'SDK 54' in p_text}")
    print(f"  Component boundaries: {'mobile/src/components' in p_text}")
    print(f"  Zustand stores: {'mobile/src/stores' in p_text}")
    print(f"  SQLite WAL mode: {'WAL' in p_text}")

    # 4. tasks.md
    tasks_path = os.path.join(examples_dir, "tasks.md")
    with open(tasks_path, "r", encoding="utf-8") as f:
        t_text = f.read()
    print(f"[tasks.md] Lines: {len(t_text.splitlines())}, Bytes: {len(t_text.encode('utf-8'))}")
    tasks = re.findall(r"^- \[ \] (T\d+)", t_text, re.MULTILINE)
    print(f"  Active task items: {len(tasks)}")
    print(f"  Unique task IDs: {len(set(tasks))}")
    print(f"  Task IDs: {tasks}")
    print(f"  SegmentedControl task: {'SegmentedControl' in t_text}")
    print(f"  vault.tsx task: {'vault.tsx' in t_text}")
    print(f"  report.tsx task: {'report.tsx' in t_text}")
    print(f"  T015 dependency line: {[l.strip() for l in t_text.splitlines() if 'T015' in l and l.startswith('- [ ]')]}")
    print(f"  T023 dependency line: {[l.strip() for l in t_text.splitlines() if 'T023' in l and l.startswith('- [ ]')]}")

if __name__ == "__main__":
    audit_research_doc()
    audit_generic_templates()
    audit_example_templates()
