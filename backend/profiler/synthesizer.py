import os
import sys
import json
import time
from pathlib import Path
from typing import Dict, Any, List, Optional
from openai import OpenAI

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT_DIR))

from backend.database.db import get_db_connection
from backend.ingestion.sanitizer import sanitize_text
from backend.profiler.acts_schemas import (
    RelationshipProfileDossier,
    Act1Opening,
    Act2DeluluMeter,
    Act3BehavioralProfiles,
    Act4HiddenDynamics,
    Act5PowerPlays,
    Act6CommunicationBreakdown,
    Act7ChemistryAudit,
    Act8DigitalRhythm,
    Act9TimelineOfDecay,
    Act10RedFlagsLocker,
    Act11GreenFlags,
    Act12PopCultureMirror,
    Act13SimulationEngine,
    Act14StrategyHandbook,
    Act15GreatestHits,
    Act16AwardsCeremony,
    Act17FinalVerdict,
)


# ==============================================================================
# CULTURAL PRAGMATICS & SOCIOLINGUISTIC DECODING PROTOCOL
# ==============================================================================
CULTURAL_PRAGMATICS_ENGINE = """
SOCIOLINGUISTIC & CULTURAL DECODING PROTOCOL (Delulu Benchmark Standards):
1. CODE-SWITCHING & COLLOQUIAL REGIONAL PRAGMATICS (Telugu/South Asian/Hinglish):
   - "Pulihora raja" / "Pulihora": Classic playful South Asian slang for someone trying to be smooth, flirtatious, or sweet-talking. It is FLIRTATIOUS BANTER, never a vicious insult or contempt.
   - "Chi po ra" / "Babu entra" / "Vedhava" / "Dengey": Colloquial informal banter between very close partners/friends indicating deep informal comfort, familiarity, and sparring. Do NOT interpret as verbal hostility or toxicity.
   - "Babe entra 😂": Playful teasing about breaking formality or accidentally using romantic pet names.
2. FAMILY PROXIMITY & PRIVACY PROTOCOLS:
   - "Call me, mom is sleeping so talk low", "Can't pick up, mom is right here", or muting video calls:
     Standard living reality for young adults living with conservative families.
     STRICTLY FORBIDDEN: Do NOT interpret family-mandated quietness or muting as emotional evasion, cheating, or cold detachment!
3. GENUINE VULNERABILITY (HEALTH & SURGERY):
   - Inquiries about surgery, health, "eat good, sleep good, take medicines ❤️", and checking in on recovery:
     This is GENUINE CARE, affection, and emotional bonding. Do NOT cynically invert this into condescension or sarcasm.
4. DELULU CHECK COMEDY STYLE:
   - Roast them for what they ACTUALLY do: their late-night 1 AM calls, their chronically online 30-second reply speeds, the mutual denial of their obvious feelings, the flirty sparring ("pulihora"), and the clownery of pretending they are 'just friends' while texting 40,000 times!
   - Ground comedy in REAL empirical facts. Comedy based on real truth hits 10x harder than comedy based on lazy stereotypes.
"""


def build_grounding_matrix(contact: Dict, stats: Dict) -> str:
    """
    Constructs a deterministic mathematical truth table and behavioral boundary rules
    that strictly constrain LLM generation, preventing hallucinated caricatures.
    """
    total = max(1, stats.get("total_messages", 0))
    user_cnt = stats.get("user_msg_count", 0)
    contact_cnt = stats.get("contact_msg_count", 0)
    user_pct = round((user_cnt / total) * 100, 1)
    contact_pct = round((contact_cnt / total) * 100, 1)

    user_dt = stats.get("user_double_texts", 0)
    contact_dt = stats.get("contact_double_texts", 0)

    user_delay = stats.get("user_median_delay_m", 0.5)
    contact_delay = stats.get("contact_median_delay_m", 0.5)
    late_night = stats.get("late_night_pct", 0.0)

    if contact_pct >= 55.0:
        volume_status = (
            f"Contact-Dominant High Volume ({contact_pct}% Contact vs {user_pct}% User). "
            f"Contact sent {contact_cnt:,} messages and {contact_dt:,} double-texts. "
            "Contact is an exceptionally vocal, active, highly engaged participant."
        )
        forbidden_contact = "STRICTLY FORBIDDEN: Do NOT label Contact as 'The Minimalist', 'The Ghost', 'Dry Texter', or 'Absent Bystander'."
        forbidden_user = "STRICTLY FORBIDDEN: Do NOT label User as 'The Desperate Simp', 'One-Person Show', or 'Unrequited Beggar'."
        archetype_hint = (
            "Permissible Contact Archetypes: 'The Sarcastic Anchor', 'The Chaotic Firehose', 'The Playful Sparring Partner', 'The Midnight Instigator'.\n"
            "Permissible User Archetypes: 'The Flirtatious Sparring Partner', 'The Steady Foil', 'The Patient Co-Pilot', 'The Resilient Banter-Partner'."
        )
    elif user_pct >= 65.0:
        volume_status = f"User-Dominant High Volume ({user_pct}% User vs {contact_pct}% Contact)."
        forbidden_contact = "Contact is relatively low-volume; do not overstate Contact's conversational dominance."
        forbidden_user = "User is the primary conversational driver."
        archetype_hint = "Reflect User's conversational heavy-lifting vs Contact's selective responses."
    else:
        volume_status = f"Symmetrical & Balanced Volume ({user_pct}% User vs {contact_pct}% Contact)."
        forbidden_contact = "Neither person is absent or dominant."
        forbidden_user = "Neither person is a sole chaser."
        archetype_hint = "Permissible Archetypes: 'The Co-Pilots of Chaos', 'Mutual Banter Addicts', 'Symmetrical Sparring Partners'."

    return f"""=== DETERMINISTIC GROUNDING MATRIX (HARD EMPIRICAL TRUTH) ===
- Total Messages: {total:,} | User: {user_cnt:,} ({user_pct}%) | Contact: {contact_cnt:,} ({contact_pct}%)
- Volume Classification: {volume_status}
- Response Pacing: User {user_delay}m vs Contact {contact_delay}m (Both respond in sub-minute rapid fire!)
- Double-Text Bursts: User {user_dt:,} vs Contact {contact_dt:,} (Contact floods more double-texts)
- Late-Night Intensity: {late_night}% of all messages sent after 11 PM
- Longest Silence Gap: {stats.get('longest_gap_hours', 0)} hours

NON-NEGOTIABLE ARCHETYPE & POWER BOUNDS:
1. {forbidden_contact}
2. {forbidden_user}
3. {archetype_hint}
4. Power Balance Bounds: With sub-minute response speeds and Contact holding 60% of message volume and 6,400+ double texts, power balance MUST remain between 40/60 and 60/40 (playful parity or slight edge). DO NOT invent an extreme 20/80 or 10/90 asymmetry!
5. 75% Recency Rule: Act 1 (Diagnosis), Act 2 (Delulu Score), Act 7 (Chemistry), and Act 17 (Verdict) MUST be derived 75% from Epoch 4 (The Present Operating Reality). Use Epochs 1-3 strictly as historical context."""


# ==============================================================================
# DYNAMIC 4-EPOCH RELATIONAL SAMPLER
# ==============================================================================
def sample_representative_messages(
    messages: List[Dict],
    max_messages: int = 200,
    user_name: Optional[str] = None,
    contact_name: Optional[str] = None,
) -> str:
    """
    Partitions the full conversation into 4 distinct chronological Epochs:
    - Epoch 1: Genesis & Inception (First 15% | Early calibration & first spark)
    - Epoch 2: The Crucible & Vulnerability (15%-40% | Health, surgery, emotional tests)
    - Epoch 3: Habitual Equilibrium (40%-70% | Daily comfort, nicknames, inside lore)
    - Epoch 4: The Present Operating Reality (Last 30% | Recent dynamic - 75% weight)
    """
    n = len(messages)
    if n <= max_messages:
        selected_epochs = {"Epoch 1": messages}
    else:
        idx_e1 = int(n * 0.15)
        idx_e2 = int(n * 0.40)
        idx_e3 = int(n * 0.70)

        e1_pool = messages[:idx_e1]
        e2_pool = messages[idx_e1:idx_e2]
        e3_pool = messages[idx_e2:idx_e3]
        e4_pool = messages[idx_e3:]

        # Epoch 1: Sample 30 messages (first 15 messages + 15 stepped)
        e1_sample = e1_pool[:15]
        if len(e1_pool) > 15:
            step = max(1, (len(e1_pool) - 15) // 15)
            e1_sample.extend([e1_pool[j] for j in range(15, len(e1_pool), step)][:15])

        # Epoch 2: Sample 45 messages (prioritize vulnerability/health markers + stepped)
        vulnerability_stems = [
            "surgery", "hospital", "pain", "care", "rest", "feel", "scared",
            "miss", "sorry", "love", "babe", "❤️", "take care", "medicine"
        ]
        e2_vuln = [m for m in e2_pool if any(stem in m.get("content", "").lower() for stem in vulnerability_stems)]
        e2_step = max(1, len(e2_pool) // 30)
        e2_regular = [e2_pool[j] for j in range(0, len(e2_pool), e2_step)][:30]
        e2_combined = {m["id"]: m for m in (e2_vuln[:15] + e2_regular)}
        e2_sample = sorted(e2_combined.values(), key=lambda x: x["time_stamp"])[:45]

        # Epoch 3: Sample 45 messages (lore, nicknames, daily banter)
        e3_step = max(1, len(e3_pool) // 45)
        e3_sample = [e3_pool[j] for j in range(0, len(e3_pool), e3_step)][:45]

        # Epoch 4: Sample 80 messages (last 40 messages of entire chat + 40 stepped)
        e4_recent = e4_pool[-40:]
        e4_pool_early = e4_pool[:-40] if len(e4_pool) > 40 else []
        e4_step = max(1, len(e4_pool_early) // 40) if e4_pool_early else 1
        e4_stepped = [e4_pool_early[j] for j in range(0, len(e4_pool_early), e4_step)][:40]
        e4_combined = {m["id"]: m for m in (e4_stepped + e4_recent)}
        e4_sample = sorted(e4_combined.values(), key=lambda x: x["time_stamp"])[:80]

        selected_epochs = {
            "EPOCH 1: GENESIS & INCEPTION (Early Days | Historical Origin)": e1_sample,
            "EPOCH 2: THE CRUCIBLE & VULNERABILITY (Pivotal Turning Points & Health/Emotional Events)": e2_sample,
            "EPOCH 3: HABITUAL EQUILIBRIUM & INSIDE LORE (Comfort Zone, Nicknames & Daily Banter)": e3_sample,
            "EPOCH 4: THE PRESENT OPERATING REALITY (Last 30% | CURRENT OPERATING DYNAMIC - 75% WEIGHT)": e4_sample,
        }

    output_blocks = []
    for epoch_name, epoch_msgs in selected_epochs.items():
        lines = [f"\n=== {epoch_name} ==="]
        for m in epoch_msgs:
            ts = m.get("time_stamp", "").replace("T", " ")[:16]
            sender = m.get("sender", "unknown")
            content = m.get("content", "").replace("\n", " ").strip()
            if content and "<media omitted>" not in content.lower():
                clean_content = sanitize_text(
                    content[:180],
                    user_name=user_name,
                    contact_name=contact_name,
                )
                lines.append(f"[{ts}] {sender.upper()}: {clean_content}")
        output_blocks.append("\n".join(lines))

    return "\n".join(output_blocks)


def get_tone_system_prompt(vibe_mode: str = "unhinged") -> str:
    base = CULTURAL_PRAGMATICS_ENGINE
    if vibe_mode == "therapy":
        return base + """
You are a licensed clinical psychologist and senior couples therapist specializing in attachment theory, non-violent communication, and chronemics.
Analyze this relationship with objective compassion, clinical clarity, constructive framing, and deep psychological empathy.
Ground every insight strictly in the provided chat transcript, epochs, and deterministic telemetry."""
    else:
        return base + """
You are an unhinged, brutally honest best friend doing a comedy roast of this relationship for ASSIFY (Delulu Check style).
Zero filter. Use sharp observational humor, modern conversational internet slang (rizz, delulu, simp, clown behavior,Situationship purgatory), but make every single roast painfully accurate based on real evidence in the chat.
Never make up facts; use the actual conversation dynamics to expose their delusion."""


# ==============================================================================
# PROFILER SYNTHESIZER ENGINE (4-PASS ARCHITECTURE)
# ==============================================================================
class ProfilerSynthesizer:
    def __init__(self, openai_client: OpenAI, model: str = "gpt-4o-mini"):
        self.client = openai_client
        self.model = model

    def run_full_profiler(
        self,
        contact_id: str,
        vibe_mode: str = "unhinged",
        db_path: Optional[Path | str] = None,
    ) -> Dict[str, Any]:
        """
        Executes the 4-Pass Synthesis pipeline and commits the dossier and 17 Acts into SQLite.
        """
        conn = get_db_connection(db_path)
        try:
            # 1. Fetch Contact, Chronemics, and Messages
            contact_row = conn.execute("SELECT * FROM contacts WHERE id = ?", (contact_id,)).fetchone()
            if not contact_row:
                raise ValueError(f"Contact '{contact_id}' not found in database.")

            stats_row = conn.execute("SELECT * FROM chronemics_stats WHERE contact_id = ?", (contact_id,)).fetchone()
            if not stats_row:
                raise ValueError(f"No chronemics stats found for contact '{contact_id}'. Run ingestion first.")

            msg_rows = conn.execute(
                "SELECT id, time_stamp, sender, content FROM messages WHERE contact_id = ? ORDER BY time_stamp ASC",
                (contact_id,)
            ).fetchall()

            messages = [dict(r) for r in msg_rows]
            contact = dict(contact_row)
            stats = dict(stats_row)

            sample_chat_text = sample_representative_messages(
                messages,
                max_messages=200,
                user_name=contact.get("user_name"),
                contact_name=contact.get("display_name") or contact.get("raw_name"),
            )
            grounding_matrix = build_grounding_matrix(contact, stats)
            tone_prompt = get_tone_system_prompt(vibe_mode)

            print(f"[*] Starting 4-Pass Synthesizer on {len(messages):,} messages for '{contact['display_name']}' ({vibe_mode} mode)...")

            # PASS 1: Master Dossier
            dossier = self._pass_1_dossier(contact, stats, grounding_matrix, sample_chat_text, tone_prompt, vibe_mode)
            print("    [Pass 1/4 Complete] Master Dossier & Delulu Score synthesized.")

            # PASS 2: Acts 1-6
            acts_1_to_6 = self._pass_2_surface_and_dynamics(contact, stats, grounding_matrix, dossier, sample_chat_text, tone_prompt)
            print("    [Pass 2/4 Complete] Acts 1-6 (Power Dynamics, Delulu Meter, Behavioral Profiles) synthesized.")

            # PASS 3: Acts 7-12
            acts_7_to_12 = self._pass_3_chemistry_and_receipts(contact, stats, grounding_matrix, dossier, sample_chat_text, tone_prompt)
            print("    [Pass 3/4 Complete] Acts 7-12 (Chemistry, Chronemics, Evidence Locker, Pop Culture) synthesized.")

            # PASS 4: Acts 13-17
            acts_13_to_17 = self._pass_4_simulation_and_verdict(contact, stats, grounding_matrix, dossier, sample_chat_text, tone_prompt)
            print("    [Pass 4/4 Complete] Acts 13-17 (Simulation, Playbook, Greatest Hits, Awards, Final Verdict) synthesized.")

            all_acts = {**acts_1_to_6, **acts_7_to_12, **acts_13_to_17}

            # ATOMIC DATABASE PERSISTENCE
            self._persist_to_database(conn, contact_id, dossier, all_acts)
            print(f"[*] Successfully saved complete 17-Act report and Dossier to database for '{contact['display_name']}'.")

            return {
                "status": "success",
                "contact_id": contact_id,
                "dossier": dossier.model_dump(),
                "acts": {k: v.model_dump() for k, v in all_acts.items()},
            }
        finally:
            conn.close()

    # --------------------------------------------------------------------------
    # PASS 1: Master Dossier (High-Level Anchors)
    # --------------------------------------------------------------------------
    def _pass_1_dossier(
        self,
        contact: Dict,
        stats: Dict,
        grounding_matrix: str,
        chat_text: str,
        tone_prompt: str,
        vibe_mode: str
    ) -> RelationshipProfileDossier:
        prompt = f"""
Analyze the relationship between USER ('user') and {contact['display_name']} ('contact').

{grounding_matrix}

CHAT TRANSCRIPT SLICES (ORGANIZED BY EPOCH):
{chat_text}

GENERATE THE MASTER RELATIONSHIP DOSSIER IN JSON:
{{
  "contact_id": "{contact['id']}",
  "status_label": "An incisive, accurate title for their dynamic grounded in Epoch 4 (e.g. 'High-Volume Flirtatious Sparring with Mutual Romantic Denial')",
  "delulu_score": 75,
  "power_ratio_user": 48,
  "power_ratio_contact": 52,
  "user_attachment_style": "Attachment classification (e.g. Secure-leaning, Anxious-Preoccupied, Avoidant-Dismissive, Fearful-Avoidant)",
  "contact_attachment_style": "Attachment classification",
  "chemistry_score": 85,
  "survival_probability": 65,
  "overall_diagnosis": "Two sharp, incisive sentences diagnosing the real operating dynamic based on Epoch 4.",
  "vibe_mode": "{vibe_mode}"
}}
"""
        resp = self.client.chat.completions.create(
            model=self.model,
            temperature=0.4,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": tone_prompt},
                {"role": "user", "content": prompt}
            ]
        )
        data = json.loads(resp.choices[0].message.content)
        return RelationshipProfileDossier(**data)

    # --------------------------------------------------------------------------
    # PASS 2: Acts 1 to 6 (Dynamics & Profiles)
    # --------------------------------------------------------------------------
    def _pass_2_surface_and_dynamics(
        self,
        contact: Dict,
        stats: Dict,
        grounding_matrix: str,
        dossier: RelationshipProfileDossier,
        chat_text: str,
        tone_prompt: str
    ) -> Dict[str, Any]:
        prompt = f"""
Using the Master Dossier:
- Status: {dossier.status_label} | Delulu Score: {dossier.delulu_score}/100 | Power: User {dossier.power_ratio_user}% vs Contact {dossier.power_ratio_contact}%
- Diagnosis: {dossier.overall_diagnosis}

{grounding_matrix}

CHAT TRANSCRIPT (ORGANIZED BY EPOCH):
{chat_text}

Generate Acts 1 through 6 in JSON format matching this exact structure:
{{
  "act_1": {{
    "act_number": 1,
    "act_name": "Opening & Power Dynamics",
    "diagnosis": "Detailed breakdown of the power dynamic grounded in their actual 0.5m response speed, double-text velocity, and banter",
    "power_balance": {{"user": {dossier.power_ratio_user}, "contact": {dossier.power_ratio_contact}}},
    "status_tag": "{dossier.status_label}",
    "user_archetype": "Title for User adhering strictly to Grounding Matrix guidance",
    "contact_archetype": "Title for Contact adhering strictly to Grounding Matrix guidance",
    "summary_verdict": "Executive summary of the dynamic based primarily on Epoch 4"
  }},
  "act_2": {{
    "act_number": 2,
    "act_name": "The Delulu Meter",
    "delulu_score": {dossier.delulu_score},
    "circus_level": "Satirical circus/delusion title matching their real dynamic",
    "dimensions": {{
      "expectation_vs_reality": 75,
      "mixed_signal_rationalization": 80,
      "future_faking_tolerance": 60,
      "investment_asymmetry": 50,
      "excuses_manufactured": 70
    }},
    "survival_odds": "{dossier.survival_probability}% chance of going the distance",
    "projected_outcome": "Prediction of where this leads"
  }},
  "act_3": {{
    "act_number": 3,
    "act_name": "Behavioral & Attachment Profiles",
    "user_profile": {{
      "attachment_style": "{dossier.user_attachment_style}",
      "core_insecurity": "...",
      "primary_trigger": "...",
      "blindspot": "...",
      "toxic_loop": "..."
    }},
    "contact_profile": {{
      "attachment_style": "{dossier.contact_attachment_style}",
      "core_insecurity": "...",
      "primary_trigger": "...",
      "blindspot": "...",
      "toxic_loop": "..."
    }},
    "clash_mechanism": "Why their interaction patterns create tension or mutual obsession"
  }},
  "act_4": {{
    "act_number": 4,
    "act_name": "Hidden Dynamics & Subtext Decoders",
    "manipulation_tactics": ["Tactic 1", "Tactic 2"],
    "conversational_traps": ["Trap 1", "Trap 2"],
    "subtext_decoders": [
      {{"what_was_said": "Exact quote from chat", "what_it_actually_meant": "The real psychological meaning"}},
      {{"what_was_said": "Exact quote from chat", "what_it_actually_meant": "The real psychological meaning"}}
    ],
    "the_raw_truth": "The brutal subtext under the conversation"
  }},
  "act_5": {{
    "act_number": 5,
    "act_name": "Power Plays & Vulnerability Ledger",
    "power_plays_catalog": ["Incident 1 from transcript", "Incident 2 from transcript"],
    "conflict_escalation_breakdown": "How banter or tension builds",
    "validation_imbalance": "Analysis of who seeks validation and how it is reciprocated",
    "vulnerability_asymmetry": "Analysis of who opens up first (reference Epoch 2 health/surgery/emotional moments)"
  }},
  "act_6": {{
    "act_number": 6,
    "act_name": "Communication Breakdown & Clash Vectors",
    "friction_point": "The main friction point between them",
    "linguistic_differences": {{
      "message_length": "Actual observed comparison of message lengths",
      "emoji_usage": "Analysis of emoji habits and tone markers",
      "responsiveness": "Analysis of their rapid 0.5m response speed"
    }},
    "danger_topics": ["Topic 1", "Topic 2"],
    "defensive_playbooks": {{
      "user_playbook": "How User defends or responds when cornered",
      "contact_playbook": "How Contact defends or deflects"
    }}
  }}
}}
"""
        resp = self.client.chat.completions.create(
            model=self.model,
            temperature=0.5,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": tone_prompt},
                {"role": "user", "content": prompt}
            ]
        )
        d = json.loads(resp.choices[0].message.content)
        return {
            "act_1": Act1Opening(**d["act_1"]),
            "act_2": Act2DeluluMeter(**d["act_2"]),
            "act_3": Act3BehavioralProfiles(**d["act_3"]),
            "act_4": Act4HiddenDynamics(**d["act_4"]),
            "act_5": Act5PowerPlays(**d["act_5"]),
            "act_6": Act6CommunicationBreakdown(**d["act_6"]),
        }

    # --------------------------------------------------------------------------
    # PASS 3: Acts 7 to 12 (Chemistry, Chronemics & Receipts)
    # --------------------------------------------------------------------------
    def _pass_3_chemistry_and_receipts(
        self,
        contact: Dict,
        stats: Dict,
        grounding_matrix: str,
        dossier: RelationshipProfileDossier,
        chat_text: str,
        tone_prompt: str
    ) -> Dict[str, Any]:
        prompt = f"""
Using the Master Dossier and Chat Transcript, generate Acts 7 through 12.
Inject these Grounded Chronemics Stats into Act 8:
{json.dumps(stats, default=str)}

{grounding_matrix}

CHAT TRANSCRIPT (ORGANIZED BY EPOCH):
{chat_text}

Generate JSON matching this exact structure:
{{
  "act_7": {{
    "act_number": 7,
    "act_name": "Romantic & Chemistry Audit",
    "chemistry_score": {dossier.chemistry_score},
    "flirting_reciprocity": "Analysis of banter and flirt response (note pulihora/teasing reciprocity)",
    "escalation_analysis": "Who turns the banter romantic or drops emotional hints",
    "missed_signals": ["Signal 1 that flew over their head", "Signal 2"],
    "peak_chemistry_window": "When the chemistry peaks (e.g. Late night after 11 PM or during video calls)"
  }},
  "act_8": {{
    "act_number": 8,
    "act_name": "Chronemics & Digital Rhythm",
    "grounded_stats": {json.dumps(stats, default=str)},
    "pacing_analysis": "Psychological analysis of their sub-minute response speed and constant engagement",
    "late_night_dynamic": "Psychological meaning of {stats['late_night_pct']}% of messages sent after 11 PM",
    "double_text_psychology": "Why Contact double-texted {stats['contact_double_texts']} times vs User {stats['user_double_texts']} times"
  }},
  "act_9": {{
    "act_number": 9,
    "act_name": "Timeline & Relational Phases",
    "phases": [
      {{"phase_name": "Epoch 1: Genesis & First Impressions", "dates": "Phase 1 dates", "narrative": "How they started and calibrated their dynamic"}},
      {{"phase_name": "Epoch 2: The Crucible & Vulnerability Threshold", "dates": "Phase 2 dates", "narrative": "The health/emotional turning point where real care surfaced"}},
      {{"phase_name": "Epoch 3: Habitual Equilibrium & Inside Lore", "dates": "Phase 3 dates", "narrative": "Comfort zone, nicknames, memes, daily banter"}},
      {{"phase_name": "Epoch 4: The Present Operating Reality", "dates": "Phase 4 dates", "narrative": "Current late-night dynamic and active trajectory"}}
    ],
    "current_phase": "Epoch 4: The Present Operating Reality",
    "trajectory": "Where the timeline is heading based on recent velocity"
  }},
  "act_10": {{
    "act_number": 10,
    "act_name": "Red Flags & The Evidence Locker",
    "critical_red_flag": "The #1 most glaring red flag or toxic loop",
    "user_red_flags": [
      {{"quote": "Verbatim quote from chat by User", "sender": "user", "severity": 3, "flag_type": "red", "commentary": "Psychological breakdown"}}
    ],
    "contact_red_flags": [
      {{"quote": "Verbatim quote from chat by Contact", "sender": "contact", "severity": 3, "flag_type": "red", "commentary": "Psychological breakdown"}}
    ]
  }},
  "act_11": {{
    "act_number": 11,
    "act_name": "Green Flags & Relational Strengths",
    "observed_green_flags": [
      {{"quote": "Verbatim quote from chat showing care/support", "sender": "both", "severity": 4, "flag_type": "green", "commentary": "Relational strength"}}
    ],
    "silver_linings": "What genuinely works between them and bonds them"
  }},
  "act_12": {{
    "act_number": 12,
    "act_name": "Pop Culture Receipts & Movie Parallels",
    "movie_parallel": "A movie parallel that matches their real dynamic (e.g. When Harry Met Sally, Crazy Stupid Love)",
    "celebrity_parallel": "A celebrity or iconic duo parallel",
    "the_delusion_gap": {{
      "what_you_think_it_is": "What the user delusionally romanticizes this as",
      "what_it_actually_is": "The reality check"
    }},
    "soundtrack_song": "Song title and artist that captures their dynamic"
  }}
}}
"""
        resp = self.client.chat.completions.create(
            model=self.model,
            temperature=0.5,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": tone_prompt},
                {"role": "user", "content": prompt}
            ]
        )
        d = json.loads(resp.choices[0].message.content)
        return {
            "act_7": Act7ChemistryAudit(**d["act_7"]),
            "act_8": Act8DigitalRhythm(**d["act_8"]),
            "act_9": Act9TimelineOfDecay(**d["act_9"]),
            "act_10": Act10RedFlagsLocker(**d["act_10"]),
            "act_11": Act11GreenFlags(**d["act_11"]),
            "act_12": Act12PopCultureMirror(**d["act_12"]),
        }

    # --------------------------------------------------------------------------
    # PASS 4: Acts 13 to 17 (Simulation, Playbook & Verdict)
    # --------------------------------------------------------------------------
    def _pass_4_simulation_and_verdict(
        self,
        contact: Dict,
        stats: Dict,
        grounding_matrix: str,
        dossier: RelationshipProfileDossier,
        chat_text: str,
        tone_prompt: str
    ) -> Dict[str, Any]:
        prompt = f"""
Using the Master Dossier and Chat Transcript, generate Acts 13 through 17.

{grounding_matrix}

CHAT TRANSCRIPT (ORGANIZED BY EPOCH):
{chat_text}

Generate JSON matching this exact structure:
{{
  "act_13": {{
    "act_number": 13,
    "act_name": "The 'What-If' Simulation Engine",
    "scenarios": [
      {{
        "scenario": "A plausible hypothetical scenario tailored to their real dynamic",
        "contact_reaction_probability": 75,
        "predicted_response": "Predicted reaction grounded in Contact's actual personality",
        "consequence": "Relational consequence"
      }},
      {{
        "scenario": "A second high-stakes scenario (e.g. addressing romantic feelings directly)",
        "contact_reaction_probability": 80,
        "predicted_response": "Predicted reaction grounded in Contact's actual personality",
        "consequence": "Relational consequence"
      }}
    ]
  }},
  "act_14": {{
    "act_number": 14,
    "act_name": "Strategy Handbook & Rules of Engagement",
    "behaviors_to_stop_immediately": [
      "Behavior 1 tailored to User's actual blindspots",
      "Behavior 2 tailored to User's actual blindspots"
    ],
    "dos_and_donts": [
      {{"do": "Calibrated recommendation based on their rapid 0.5m pacing", "dont": "Mistake to avoid"}},
      {{"do": "Calibrated recommendation", "dont": "Mistake to avoid"}}
    ],
    "calibrated_responses": [
      {{
        "incoming_text": "Realistic incoming text from Contact",
        "optimal_reply": "Calculated, high-value, witty reply",
        "psychological_rationale": "Why this reply shifts the dynamic favorably"
      }}
    ]
  }},
  "act_15": {{
    "act_number": 15,
    "act_name": "Greatest Hits & Cringe Receipts",
    "hits": [
      {{"hit_type": "cringe", "quote": "Verbatim quote from chat", "sender": "user", "roast_commentary": "Hilarious roast"}},
      {{"hit_type": "delusional", "quote": "Verbatim quote from chat", "sender": "user", "roast_commentary": "Hilarious roast"}},
      {{"hit_type": "comeback", "quote": "Verbatim quote from chat", "sender": "contact", "roast_commentary": "Hilarious roast"}},
      {{"hit_type": "self_own", "quote": "Verbatim quote from chat", "sender": "user", "roast_commentary": "Hilarious roast"}}
    ]
  }},
  "act_16": {{
    "act_number": 16,
    "act_name": "The Relationship Superlatives & Awards",
    "awards": [
      {{"title": "Award Title matching their real dynamic", "recipient": "user", "citation": "Funny citation grounded in their real texts"}},
      {{"title": "Award Title matching their real dynamic", "recipient": "contact", "citation": "Funny citation grounded in their real texts"}},
      {{"title": "Award Title matching their real dynamic", "recipient": "contact", "citation": "Funny citation grounded in their real texts"}},
      {{"title": "Award Title matching their real dynamic", "recipient": "user", "citation": "Funny citation grounded in their real texts"}}
    ]
  }},
  "act_17": {{
    "act_number": 17,
    "act_name": "The Final Verdict & Survival Forecast",
    "survival_probability": {dossier.survival_probability},
    "time_horizon_to_breakdown": "Projected timeline based on Epoch 4 velocity",
    "definitive_ruling": "Definitive ruling on whether this is genuine romantic potential, enduring mutual chaos, or situationship purgatory.",
    "closing_roast_or_blessing": "Final witty, unforgettable parting words from ASSIFY."
  }}
}}
"""
        resp = self.client.chat.completions.create(
            model=self.model,
            temperature=0.6,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": tone_prompt},
                {"role": "user", "content": prompt}
            ]
        )
        d = json.loads(resp.choices[0].message.content)
        return {
            "act_13": Act13SimulationEngine(**d["act_13"]),
            "act_14": Act14StrategyHandbook(**d["act_14"]),
            "act_15": Act15GreatestHits(**d["act_15"]),
            "act_16": Act16AwardsCeremony(**d["act_16"]),
            "act_17": Act17FinalVerdict(**d["act_17"]),
        }

    # --------------------------------------------------------------------------
    # Database Persistence
    # --------------------------------------------------------------------------
    def _persist_to_database(self, conn, contact_id: str, dossier: RelationshipProfileDossier, acts: Dict[str, Any]):
        with conn:
            # 1. Upsert relationship_profiles
            conn.execute(
                """
                INSERT INTO relationship_profiles (
                    contact_id, status_label, delulu_score, power_ratio_user, power_ratio_contact,
                    user_attachment_style, contact_attachment_style, chemistry_score,
                    survival_probability, overall_diagnosis, vibe_mode, analyzed_at
                ) VALUES (
                    :contact_id, :status_label, :delulu_score, :power_ratio_user, :power_ratio_contact,
                    :user_attachment_style, :contact_attachment_style, :chemistry_score,
                    :survival_probability, :overall_diagnosis, :vibe_mode, CURRENT_TIMESTAMP
                )
                ON CONFLICT(contact_id) DO UPDATE SET
                    status_label = excluded.status_label,
                    delulu_score = excluded.delulu_score,
                    power_ratio_user = excluded.power_ratio_user,
                    power_ratio_contact = excluded.power_ratio_contact,
                    user_attachment_style = excluded.user_attachment_style,
                    contact_attachment_style = excluded.contact_attachment_style,
                    chemistry_score = excluded.chemistry_score,
                    survival_probability = excluded.survival_probability,
                    overall_diagnosis = excluded.overall_diagnosis,
                    vibe_mode = excluded.vibe_mode,
                    analyzed_at = CURRENT_TIMESTAMP;
                """,
                dossier.model_dump()
            )

            # 2. Upsert each of the 17 theatrical acts
            for act_key, act_model in acts.items():
                act_data = act_model.model_dump()
                act_num = act_data.get("act_number")
                act_name = act_data.get("act_name")
                payload_json = json.dumps(act_data)

                conn.execute(
                    """
                    INSERT INTO report_acts (contact_id, act_number, act_name, payload_json, generated_at)
                    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                    ON CONFLICT(contact_id, act_number) DO UPDATE SET
                        act_name = excluded.act_name,
                        payload_json = excluded.payload_json,
                        generated_at = CURRENT_TIMESTAMP;
                    """,
                    (contact_id, act_num, act_name, payload_json)
                )
