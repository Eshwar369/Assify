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


def sample_representative_messages(messages: List[Dict], max_messages: int = 180) -> str:
    """
    Pulls a balanced chronological and psychological slice:
    - First 40 messages (Early era / Honeymoon)
    - 60 mid-phase messages (Daily reality & power struggle)
    - 40 late-night messages (Chemistry, vulnerability, intimacy)
    - 40 most recent messages (Current trajectory)
    """
    if len(messages) <= max_messages:
        selected = messages
    else:
        first = messages[:40]
        recent = messages[-40:]
        
        # Late-night messages (between 23:00 and 04:00)
        late_night = [
            m for m in messages[40:-40]
            if "T23:" in m.get("time_stamp", "") or any(f"T0{h}:" in m.get("time_stamp", "") for h in range(4))
        ][:40]
        
        # Mid-phase distributed sample
        mid_pool = messages[40:-40]
        step = max(1, len(mid_pool) // 60)
        mid = [mid_pool[j] for j in range(0, len(mid_pool), step)][:60]
        
        combined = {m["id"]: m for m in (first + mid + late_night + recent)}
        selected = sorted(combined.values(), key=lambda x: x["time_stamp"])
        
    lines = []
    for m in selected:
        ts = m.get("time_stamp", "").replace("T", " ")[:16]
        sender = m.get("sender", "unknown")
        content = m.get("content", "").replace("\n", " ").strip()
        if content and "<media omitted>" not in content.lower():
            lines.append(f"[{ts}] {sender.upper()}: {content[:180]}")
            
    return "\n".join(lines)


def get_tone_system_prompt(vibe_mode: str = "unhinged") -> str:
    if vibe_mode == "therapy":
        return """You are a licensed clinical psychologist and senior couples therapist specializing in attachment theory, non-violent communication, and relational dynamics.
Analyze this relationship with objective compassion, clinical clarity, constructive framing, and deep psychological empathy.
Ground every insight in the provided chat transcript and statistical telemetry."""
    else:
        return """You are an unhinged, brutally honest best friend doing a comedy roast of this relationship for ASSIFY (Delulu Check style).
Zero filter. Use sharp observational humor, modern conversational internet slang (rizz, delulu, simp, breadcrumbing, clown behavior, ghosting), but make every single roast painfully accurate based on real evidence in the chat.
Never make up facts; use the actual conversation dynamics to expose their delusion."""


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
            
            sample_chat_text = sample_representative_messages(messages, max_messages=180)
            tone_prompt = get_tone_system_prompt(vibe_mode)
            
            print(f"[*] Starting 4-Pass Synthesizer on {len(messages):,} messages for '{contact['display_name']}' ({vibe_mode} mode)...")
            
            # PASS 1: Master Dossier
            dossier = self._pass_1_dossier(contact, stats, sample_chat_text, tone_prompt, vibe_mode)
            print("    [Pass 1/4 Complete] Master Dossier & Delulu Score synthesized.")
            
            # PASS 2: Acts 1-6
            acts_1_to_6 = self._pass_2_surface_and_dynamics(contact, stats, dossier, sample_chat_text, tone_prompt)
            print("    [Pass 2/4 Complete] Acts 1-6 (Power Dynamics, Delulu Meter, Behavioral Profiles) synthesized.")
            
            # PASS 3: Acts 7-12
            acts_7_to_12 = self._pass_3_chemistry_and_receipts(contact, stats, dossier, sample_chat_text, tone_prompt)
            print("    [Pass 3/4 Complete] Acts 7-12 (Chemistry, Chronemics, Evidence Locker, Pop Culture) synthesized.")
            
            # PASS 4: Acts 13-17
            acts_13_to_17 = self._pass_4_simulation_and_verdict(contact, stats, dossier, sample_chat_text, tone_prompt)
            print("    [Pass 4/4 Complete] Acts 13-17 (Simulation, Playbook, Greatest Hits, Awards, Final Verdict) synthesized.")
            
            # Combine all 17 Acts
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
    # PASS 1: High-Level Dossier
    # --------------------------------------------------------------------------
    def _pass_1_dossier(self, contact: Dict, stats: Dict, chat_text: str, tone_prompt: str, vibe_mode: str) -> RelationshipProfileDossier:
        prompt = f"""
Analyze the relationship between the USER ('user') and {contact['display_name']} ('contact').
Use this Grounded Telemetry (DO NOT HALLUCINATE DIFFERENT STATS):
- Total Messages: {stats['total_messages']:,} (User: {stats['user_msg_count']} | Contact: {stats['contact_msg_count']})
- Initiation Ratio: User {stats['user_initiation_pct']}% vs Contact {stats['contact_initiation_pct']}%
- Median Response Latency: User {stats['user_median_delay_m']}m vs Contact {stats['contact_median_delay_m']}m
- Double-Text Bursts: User {stats['user_double_texts']} vs Contact {stats['contact_double_texts']}
- Late Night Texting: {stats['late_night_pct']}%
- Longest Silence Gap: {stats['longest_gap_hours']} hours

Chat Transcript Slices:
{chat_text}

Generate the Master Relationship Dossier in JSON:
{{
  "contact_id": "{contact['id']}",
  "status_label": "e.g. Situationship with Extreme Asymmetry",
  "delulu_score": 78,
  "power_ratio_user": 32,
  "power_ratio_contact": 68,
  "user_attachment_style": "Anxious-Preoccupied",
  "contact_attachment_style": "Dismissive-Avoidant",
  "chemistry_score": 84,
  "survival_probability": 28,
  "overall_diagnosis": "One or two sharp sentences diagnosing the dynamic.",
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
    # PASS 2: Acts 1 to 6
    # --------------------------------------------------------------------------
    def _pass_2_surface_and_dynamics(self, contact: Dict, stats: Dict, dossier: RelationshipProfileDossier, chat_text: str, tone_prompt: str) -> Dict[str, Any]:
        prompt = f"""
Using the Master Dossier:
- Status: {dossier.status_label} | Delulu Score: {dossier.delulu_score}/100 | Power: User {dossier.power_ratio_user}% vs Contact {dossier.power_ratio_contact}%
- Diagnosis: {dossier.overall_diagnosis}

Chat Transcript:
{chat_text}

Generate Acts 1 through 6 in JSON format matching this exact structure:
{{
  "act_1": {{
    "act_number": 1,
    "act_name": "Opening & Power Dynamics",
    "diagnosis": "Detailed breakdown of the power dynamic",
    "power_balance": {{"user": {dossier.power_ratio_user}, "contact": {dossier.power_ratio_contact}}},
    "status_tag": "{dossier.status_label}",
    "user_archetype": "Title for User e.g. The Over-Invested Chronic Texter",
    "contact_archetype": "Title for Contact e.g. The Cryptic Minimalist",
    "summary_verdict": "Executive summary of who is driving vs who is coasting"
  }},
  "act_2": {{
    "act_number": 2,
    "act_name": "The Delulu Meter",
    "delulu_score": {dossier.delulu_score},
    "circus_level": "e.g. Ringmaster of the Hope Circus",
    "dimensions": {{
      "expectation_vs_reality": 85,
      "mixed_signal_rationalization": 90,
      "future_faking_tolerance": 70,
      "investment_asymmetry": 80,
      "excuses_manufactured": 88
    }},
    "survival_odds": "{dossier.survival_probability}% chance of lasting 6 months",
    "projected_outcome": "Prediction of how this ends"
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
    "clash_mechanism": "Why these two specific attachment styles trigger each other"
  }},
  "act_4": {{
    "act_number": 4,
    "act_name": "Hidden Dynamics & Subtext Decoders",
    "manipulation_tactics": ["Tactic 1", "Tactic 2"],
    "conversational_traps": ["Trap 1", "Trap 2"],
    "subtext_decoders": [
      {{"what_was_said": "...", "what_it_actually_meant": "..."}},
      {{"what_was_said": "...", "what_it_actually_meant": "..."}}
    ],
    "the_raw_truth": "The brutal subtext under the conversation"
  }},
  "act_5": {{
    "act_number": 5,
    "act_name": "Power Plays & Vulnerability Ledger",
    "power_plays_catalog": ["Incident 1", "Incident 2"],
    "conflict_escalation_breakdown": "How tension builds",
    "validation_imbalance": "Who begs for validation vs who withholds it",
    "vulnerability_asymmetry": "Who opens up and who retreats"
  }},
  "act_6": {{
    "act_number": 6,
    "act_name": "Communication Breakdown & Clash Vectors",
    "friction_point": "The main friction point",
    "linguistic_differences": {{
      "message_length": "User writes paragraphs; Contact sends fragments",
      "emoji_usage": "...",
      "responsiveness": "..."
    }},
    "danger_topics": ["Topic 1", "Topic 2"],
    "defensive_playbooks": {{
      "user_playbook": "Over-explains and follows up",
      "contact_playbook": "Goes cold and deflects with humor"
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
    # PASS 3: Acts 7 to 12
    # --------------------------------------------------------------------------
    def _pass_3_chemistry_and_receipts(self, contact: Dict, stats: Dict, dossier: RelationshipProfileDossier, chat_text: str, tone_prompt: str) -> Dict[str, Any]:
        prompt = f"""
Using the Master Dossier and Chat Transcript, generate Acts 7 through 12.
Inject these Grounded Chronemics Stats into Act 8:
{json.dumps(stats, default=str)}

Chat Transcript:
{chat_text}

Generate JSON matching this exact structure:
{{
  "act_7": {{
    "act_number": 7,
    "act_name": "Romantic & Chemistry Audit",
    "chemistry_score": {dossier.chemistry_score},
    "flirting_reciprocity": "Analysis of banter and flirt response",
    "escalation_analysis": "Who turns the banter romantic",
    "missed_signals": ["Signal 1 that flew over their head", "Signal 2"],
    "peak_chemistry_window": "When the chemistry peaks (e.g. Late night after 11 PM)"
  }},
  "act_8": {{
    "act_number": 8,
    "act_name": "Chronemics & Digital Rhythm",
    "grounded_stats": {json.dumps(stats, default=str)},
    "pacing_analysis": "Analysis of the 0.5m response speed and rapid-fire bursts",
    "late_night_dynamic": "Psychological meaning of {stats['late_night_pct']}% messages sent after 11 PM",
    "double_text_psychology": "Why User double-texted {stats['user_double_texts']} times vs Contact {stats['contact_double_texts']} times"
  }},
  "act_9": {{
    "act_number": 9,
    "act_name": "Timeline & Relational Phases",
    "phases": [
      {{"phase_name": "The Spark / Rapid Banter", "dates": "Phase 1", "narrative": "..."}},
      {{"phase_name": "The Shift / Delayed Replies", "dates": "Phase 2", "narrative": "..."}},
      {{"phase_name": "The Current Dynamic", "dates": "Phase 3", "narrative": "..."}}
    ],
    "current_phase": "Name of current phase",
    "trajectory": "Where the timeline is heading"
  }},
  "act_10": {{
    "act_number": 10,
    "act_name": "Red Flags & The Evidence Locker",
    "critical_red_flag": "The #1 most glaring red flag",
    "user_red_flags": [
      {{"quote": "Exact quoted chat text", "sender": "user", "severity": 4, "flag_type": "red", "commentary": "..."}}
    ],
    "contact_red_flags": [
      {{"quote": "Exact quoted chat text", "sender": "contact", "severity": 5, "flag_type": "red", "commentary": "..."}}
    ]
  }},
  "act_11": {{
    "act_number": 11,
    "act_name": "Green Flags & Relational Strengths",
    "observed_green_flags": [
      {{"quote": "Exact quoted chat text", "sender": "both", "severity": 4, "flag_type": "green", "commentary": "..."}}
    ],
    "silver_linings": "What genuinely works between them"
  }},
  "act_12": {{
    "act_number": 12,
    "act_name": "Pop Culture Receipts & Movie Parallels",
    "movie_parallel": "e.g. 500 Days of Summer",
    "celebrity_parallel": "e.g. Pete Davidson and Ariana Grande",
    "the_delusion_gap": {{
      "what_you_think_it_is": "A slow-burn Before Sunrise romance",
      "what_it_actually_is": "He's Just Not That Into You with Wi-Fi"
    }},
    "soundtrack_song": "The perfect song that represents this mess"
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
    # PASS 4: Acts 13 to 17
    # --------------------------------------------------------------------------
    def _pass_4_simulation_and_verdict(self, contact: Dict, stats: Dict, dossier: RelationshipProfileDossier, chat_text: str, tone_prompt: str) -> Dict[str, Any]:
        prompt = f"""
Using the Master Dossier and Chat Transcript, generate Acts 13 through 17.
Chat Transcript:
{chat_text}

Generate JSON matching this exact structure:
{{
  "act_13": {{
    "act_number": 13,
    "act_name": "The 'What-If' Simulation Engine",
    "scenarios": [
      {{
        "scenario": "What if you stop texting first for 7 straight days?",
        "contact_reaction_probability": 25,
        "predicted_response": "She would text 'Alive?' on day 5, then go silent.",
        "consequence": "The dynamic would officially flip or completely evaporate."
      }},
      {{
        "scenario": "What if you ask directly: 'What are we?'",
        "contact_reaction_probability": 85,
        "predicted_response": "Deflects with a joke or 'I just don't want labels right now'.",
        "consequence": "Forces the situationship to show its cards."
      }}
    ]
  }},
  "act_14": {{
    "act_number": 14,
    "act_name": "Strategy Handbook & Rules of Engagement",
    "behaviors_to_stop_immediately": [
      "Stop sending triple texts after being left on read",
      "Stop apologizing for expressing your needs"
    ],
    "dos_and_donts": [
      {{"do": "Match her reply latency during work hours", "dont": "Reply in 4 seconds when she took 3 hours"}},
      {{"do": "Keep plans concrete with date and time", "dont": "Accept vague 'we should hang out sometime' crumbs"}}
    ],
    "calibrated_responses": [
      {{
        "incoming_text": "Hey sorry, was crazy busy!",
        "optimal_reply": "No worries! Hope you crushed it.",
        "psychological_rationale": "High-value detachment with zero passive aggression."
      }}
    ]
  }},
  "act_15": {{
    "act_number": 15,
    "act_name": "Greatest Hits & Cringe Receipts",
    "hits": [
      {{"hit_type": "cringe", "quote": "Real quoted cringe text", "sender": "user", "roast_commentary": "..."}},
      {{"hit_type": "delusional", "quote": "Real quoted text showing delusion", "sender": "user", "roast_commentary": "..."}},
      {{"hit_type": "comeback", "quote": "Best savage comeback in the chat", "sender": "contact", "roast_commentary": "..."}},
      {{"hit_type": "self_own", "quote": "Accidental self-burn", "sender": "user", "roast_commentary": "..."}}
    ]
  }},
  "act_16": {{
    "act_number": 16,
    "act_name": "The Relationship Superlatives & Awards",
    "awards": [
      {{"title": "Olympic Paragraph Writer", "recipient": "user", "citation": "For consistently writing essay-length memoirs in response to two-letter replies."}},
      {{"title": "Chief Mixed-Signals Officer", "recipient": "contact", "citation": "For maintaining active flirting while being emotionally unavailable."}},
      {{"title": "The Late-Night Phantom", "recipient": "contact", "citation": "Only summons energy to message when the clock strikes 11:30 PM."}},
      {{"title": "Master of Emotional Clowning", "recipient": "user", "citation": "Making excuses for 13 days of radio silence like it was a covert military mission."}}
    ]
  }},
  "act_17": {{
    "act_number": 17,
    "act_name": "The Final Verdict & Survival Forecast",
    "survival_probability": {dossier.survival_probability},
    "time_horizon_to_breakdown": "3 to 8 weeks before the next breaking point",
    "definitive_ruling": "Definitive ruling on whether this has romantic legs or is a pure delusion loop.",
    "closing_roast_or_blessing": "Final parting words from ASSIFY."
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
            
            # 2. Upsert report_acts (All 17 Acts)
            conn.execute("DELETE FROM report_acts WHERE contact_id = ?;", (contact_id,))
            for act_key, act_model in acts.items():
                act_data = act_model.model_dump()
                conn.execute(
                    """
                    INSERT INTO report_acts (contact_id, act_number, act_name, payload_json, generated_at)
                    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP);
                    """,
                    (contact_id, act_data["act_number"], act_data["act_name"], json.dumps(act_data))
                )
                
            # 3. Populate evidence_locker from Act 10 & 11
            conn.execute("DELETE FROM evidence_locker WHERE contact_id = ?;", (contact_id,))
            act_10 = acts.get("act_10")
            if act_10:
                for item in (act_10.user_red_flags + act_10.contact_red_flags):
                    conn.execute(
                        """
                        INSERT INTO evidence_locker (contact_id, quote, sender, severity, flag_type, category, ai_commentary)
                        VALUES (?, ?, ?, ?, ?, ?, ?);
                        """,
                        (contact_id, item.quote, item.sender, item.severity, item.flag_type, "Red Flag", item.commentary)
                    )
            act_11 = acts.get("act_11")
            if act_11:
                for item in act_11.observed_green_flags:
                    conn.execute(
                        """
                        INSERT INTO evidence_locker (contact_id, quote, sender, severity, flag_type, category, ai_commentary)
                        VALUES (?, ?, ?, ?, ?, ?, ?);
                        """,
                        (contact_id, item.quote, item.sender, item.severity, item.flag_type, "Green Flag", item.commentary)
                    )
                    
            # 4. Populate greatest_hits from Act 15
            conn.execute("DELETE FROM greatest_hits WHERE contact_id = ?;", (contact_id,))
            act_15 = acts.get("act_15")
            if act_15:
                for hit in act_15.hits:
                    conn.execute(
                        """
                        INSERT INTO greatest_hits (contact_id, category, quote, sender, why_legendary)
                        VALUES (?, ?, ?, ?, ?);
                        """,
                        (contact_id, hit.hit_type, hit.quote, hit.sender, hit.roast_commentary)
                    )
