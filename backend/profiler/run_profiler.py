import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT_DIR))

from backend.profiler.synthesizer import ProfilerSynthesizer
from backend.database.db import get_db_connection


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    load_dotenv(ROOT_DIR / ".env")
    
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("[ERROR] OPENAI_API_KEY is missing from .env!")
        return

    client = OpenAI(api_key=api_key)
    conn = get_db_connection()
    
    # Fetch first available contact
    contact = conn.execute("SELECT id, display_name FROM contacts LIMIT 1;").fetchone()
    conn.close()
    
    if not contact:
        print("[ERROR] No contacts found in database. Run ingestion first!")
        return
        
    contact_id = contact["id"]
    display_name = contact["display_name"]
    
    print("=" * 65)
    print(f"ASSIFY THEATRICAL PROFILER — GENERATING 17 ACTS FOR '{display_name}'")
    print("=" * 65)
    
    synthesizer = ProfilerSynthesizer(openai_client=client, model="gpt-4o-mini")
    
    result = synthesizer.run_full_profiler(
        contact_id=contact_id,
        vibe_mode="unhinged",
    )
    
    dossier = result["dossier"]
    acts = result["acts"]
    
    print("\n" + "=" * 65)
    print("🎯 MASTER DOSSIER (THE DELULU DASHBOARD)")
    print("=" * 65)
    print(f"Status Label         : {dossier['status_label']}")
    print(f"Delulu Score         : {dossier['delulu_score']}/100")
    print(f"Power Balance        : User {dossier['power_ratio_user']}% vs {display_name} {dossier['power_ratio_contact']}%")
    print(f"User Attachment      : {dossier['user_attachment_style']}")
    print(f"Contact Attachment   : {dossier['contact_attachment_style']}")
    print(f"Chemistry Score      : {dossier['chemistry_score']}/100")
    print(f"Survival Odds        : {dossier['survival_probability']}%")
    print(f"Overall Diagnosis    : {dossier['overall_diagnosis']}")
    
    print("\n" + "=" * 65)
    print("🎭 SAMPLE HIGHLIGHTS FROM THE 17 ACTS")
    print("=" * 65)
    
    act_1 = acts.get("act_1", {})
    print(f"[Act 1] Archetypes: User='{act_1.get('user_archetype')}' vs Contact='{act_1.get('contact_archetype')}'")
    
    act_2 = acts.get("act_2", {})
    print(f"[Act 2] Circus Level: '{act_2.get('circus_level')}'")
    
    act_12 = acts.get("act_12", {})
    delusion_gap = act_12.get("the_delusion_gap", {})
    print(f"[Act 12] Movie Parallel: {act_12.get('movie_parallel')}")
    print(f"         What You Think It Is : {delusion_gap.get('what_you_think_it_is')}")
    print(f"         What It Actually Is  : {delusion_gap.get('what_it_actually_is')}")
    
    act_15 = acts.get("act_15", {})
    print(f"\n[Act 15] Greatest Hits ({len(act_15.get('hits', []))} receipts logged)")
    for hit in act_15.get("hits", [])[:2]:
        print(f"  • [{hit.get('hit_type').upper()}] \"{hit.get('quote')}\"")
        print(f"    Roast: {hit.get('roast_commentary')}")
        
    act_16 = acts.get("act_16", {})
    print(f"\n[Act 16] Relationship Awards ({len(act_16.get('awards', []))} awards presented)")
    for aw in act_16.get("awards", [])[:3]:
        print(f"  🏆 {aw.get('title')} ({aw.get('recipient').upper()}): {aw.get('citation')}")
        
    act_17 = acts.get("act_17", {})
    print(f"\n[Act 17] Final Verdict: {act_17.get('definitive_ruling')}")
    print(f"         Closing Words: \"{act_17.get('closing_roast_or_blessing')}\"")
    print("=" * 65)


if __name__ == "__main__":
    main()
