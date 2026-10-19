import json
import re
from typing import List, Dict, Any, Optional
from datetime import datetime


TRIGGER_KEYWORDS = {
    "food": ["crav", "eat", "food", "drink", "matcha", "coffee", "pizza", "biryani", "sweet", "chocolate", "restaurant", "cafe", "burger", "tea", "snack", "cook", "kaaram", "neyyi", "ice cream"],
    "movie": ["watch", "movie", "show", "series", "season", "episode", "netflix", "anime", "cinema", "film", "documentary", "trailer"],
    "gift": ["wish", "saving up", "buy", "gift", "present", "hoodie", "necklace", "earring", "perfume", "flowers", "shoes", "jacket", "bag", "ring", "sneakers", "book"],
    "place": ["visit", "trip", "travel", "flight", "explore", "vacation", "beach", "pondicherry", "cafe", "park", "hills", "resort", "sunset"],
    "dislike": ["hate", "can't stand", "allergic", "annoying", "disgust", "don't like", "worst", "gross", "irritat", "screenshots"],
    "nickname": ["zombiee", "babu", "idiot", "pookie", "bro", "cutie", "babe", "honey", "sweetie", "jaan", "dumdum", "chotu", "psycho", "captain"],
}


EXTRACTOR_SYSTEM_PROMPT = """You are an expert Relationship Memory Analyst for ASSIFY.
Your task is to extract durable, high-value relationship memories, tastes, and preferences from a curated selection of chat turns.

THE KEEP CATEGORIES:
1. "food": Cravings, favorite dishes, drink orders, comfort snacks.
2. "movie": Movies, shows, series, anime, or YouTube videos they want to watch or love. (Resolve pronouns if previous context mentioned it).
3. "gift": Explicit wishlists, items they fawn over (perfumes, hoodies, jewelry, tech, flowers).
4. "place": Travel destinations, cafes, activities, or bucket-list spots they mentioned.
5. "dislike": Genuine pet peeves, food dislikes, or things that trigger annoyance (e.g. screenshots during video calls).
6. "nickname": Affectionate, teasing, or unique pet names used between the parties.
7. "inside_joke": Unique slang, running jokes, or shared meme references.

CRITICAL RULES:
- EXHAUSTIVE RECALL: Be extremely thorough! Extract EVERY distinct taste, food, movie, place, gift hint, nickname, and genuine pet peeve found in the text (aim to extract 20 to 35 high-quality items). Do NOT stop after just 3 or 4.
- DEDUPLICATION: Do not output duplicate items for the exact same entity in the same category. For example, if 'beach' is mentioned 5 times, extract it only ONCE with the most descriptive quote.
- NICKNAMES & PET NAMES: Look for how they address each other (e.g., 'Zombiee', 'Babu', 'Idiot', 'Captain') and extract them under 'nickname'.
- ACTIVE DESIRE vs PASSIVE MENTION:
  * ONLY extract items showing active, genuine forward-looking interest, persistent cravings, or enduring habits ("I want to watch X", "We should go to Y", "Craving Z", "My favorite is W").
  * DO NOT extract passive background mentions (e.g. a movie playing on TV, or saying "I feel like I'm in a movie").
  * DO NOT extract past completed trips ("when I went on North trip") as future places to visit.
  * DO NOT extract momentary situational complaints about physical objects (e.g. "I hate this uncomfortable chair/seat") as permanent dislikes!
- BANTER & SARCASM FILTER: Ignore playful banter or mock insults! E.g. "I hate you" or "You are so stupid" between friends is teasing, NOT a dislike. DO NOT extract playful teasing as a dislike.
- TRANSIENT FRUSTRATION: Ignore generic complaints about traffic, work, or bad luck ("I hate that it happens").
- Clean entity names: Normalize titles into proper nouns (e.g., "Ellipai Kaaram Neyyi Annam", "Severance", "Zara Vanilla Perfume", "Zombiee", "Beach Sunrise").
- Target person: Indicate who holds the preference ("contact", "user", or "both").

OUTPUT FORMAT:
Return JSON ONLY:
{
  "items": [
    {
      "category": "food",
      "item_name": "Ellipai Kaaram Neyyi Annam",
      "context_quote": "I'm craving that ellipai kaaram neyyi n annam now",
      "target_person": "contact",
      "time_stamp": "2026-08-12T23:14:00"
    }
  ]
}
"""

ORACLE_SYSTEM_PROMPT = """You are the Date & Gift Oracle for ASSIFY.
Based on the extracted relationship preferences, cravings, and inside lore, generate:
1. 3 Bespoke Date Ideas tailored to their unique dynamic and favorite cravings.
2. 3 Creative Gift Ideas tailored to their specific mentions.

OUTPUT FORMAT:
Return JSON ONLY:
{
  "date_ideas": [
    {
      "title": "Midnight Spicy Comfort Food Run",
      "description": "Surprise them with authentic Ellipai Kaaram Neyyi Annam followed by a late-night rooftop drive.",
      "reason": "Directly satisfies their recurring late-night comfort food craving."
    }
  ],
  "gift_ideas": [
    {
      "title": "Cozy Oversized Fleece Hoodie",
      "description": "A high-comfort warm hoodie paired with their favorite snack basket.",
      "reason": "Matches their late-night texting aesthetic and comfort cravings."
    }
  ]
}
"""


def mine_candidate_snippets(messages: List[Dict], max_snippets: int = 70) -> List[Dict[str, Any]]:
    """
    STAGE 1 & 2 (Symbolic Funnel):
    Scans messages for high-yield semantic trigger stems and attaches preceding context.
    """
    candidates = []
    
    for i in range(len(messages)):
        msg = messages[i]
        content = msg.get("content", "").strip()
        lower = content.lower()
        
        # Filter out 1-2 word replies or media markers
        if len(content) < 14 or len(content) > 350 or "<media omitted>" in lower:
            continue
            
        # Check for trigger hits
        matched_category = None
        for cat, keywords in TRIGGER_KEYWORDS.items():
            if any(kw in lower for kw in keywords):
                matched_category = cat
                break
                
        if matched_category:
            prev_context = ""
            if i > 0:
                prev_msg = messages[i - 1]
                prev_context = f"{prev_msg.get('sender', 'unknown')}: {prev_msg.get('content', '')[:120]}"
                
            candidates.append({
                "msg_id": msg.get("id"),
                "sender": msg.get("sender"),
                "time_stamp": msg.get("time_stamp"),
                "prev_turn": prev_context,
                "target_turn": f"{msg.get('sender')}: {content}",
                "detected_hint": matched_category,
            })
            
    # Stratified Sampling: Ensure balanced representation across all 6 chambers
    by_category = {}
    for c in candidates:
        by_category.setdefault(c["detected_hint"], []).append(c)

    # Priority keywords that denote strong preference over casual usage
    priority_words = ["crav", "fav", "love", "hate", "wish", "saving", "recommend", "visit", "trip", "allergic", "must watch", "binge"]
    
    selected: List[Dict[str, Any]] = []
    # Quotas per chamber to reach ~120 balanced candidates
    quotas = {
        "food": 25,
        "movie": 25,
        "gift": 25,
        "place": 20,
        "dislike": 15,
        "nickname": 15,
    }

    for cat, items in by_category.items():
        limit = quotas.get(cat, 20)
        # Sort items with priority words first
        sorted_items = sorted(
            items,
            key=lambda x: any(pw in x["target_turn"].lower() for pw in priority_words),
            reverse=True
        )
        selected.extend(sorted_items[:limit])

    return selected


def extract_the_keep_items(
    messages: List[Dict],
    openai_client=None,
    model: str = "gpt-4o-mini",
    include_ai_oracle: bool = True
) -> List[Dict[str, Any]]:
    """
    STAGE 3 (Neuro Extraction & Oracle Synthesis):
    Extracts durable memories into The Keep using GPT-4o-mini with fallback heuristics.
    """
    candidates = mine_candidate_snippets(messages, max_snippets=70)
    
    if not openai_client or not candidates:
        return _heuristic_keep_extractor(candidates)
        
    payload = json.dumps([
        {
            "sender": c["sender"],
            "prev_context": c["prev_turn"],
            "message": c["target_turn"],
            "time_stamp": c["time_stamp"],
        }
        for c in candidates
    ], ensure_ascii=False)
    
    extracted_items = []
    
    try:
        # 1. Neuro Memory Extraction
        resp = openai_client.chat.completions.create(
            model=model,
            temperature=0.1,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": EXTRACTOR_SYSTEM_PROMPT},
                {"role": "user", "content": f"Extract the genuine Keep items from these conversations:\n{payload}"}
            ]
        )
        data = json.loads(resp.choices[0].message.content)
        raw_items = data.get("items", [])
        
        seen_keys = set()
        for item in raw_items:
            cat = item.get("category", "other")
            name = item.get("item_name", "Unknown").strip()
            key = f"{cat}:{name.lower()}"
            if key in seen_keys:
                continue
            seen_keys.add(key)
            extracted_items.append({
                "category": cat,
                "item_name": name,
                "context_quote": item.get("context_quote", ""),
                "time_stamp": item.get("time_stamp"),
                "status": "saved",
                "target_person": item.get("target_person", "contact"),
                "ai_generated": 0,
                "metadata": None,
            })
            
        # 2. Date & Gift Oracle Synthesis
        if include_ai_oracle and extracted_items:
            oracle_payload = json.dumps([
                {"category": it["category"], "item": it["item_name"], "quote": it["context_quote"]}
                for it in extracted_items[:20]
            ], ensure_ascii=False)
            
            oracle_resp = openai_client.chat.completions.create(
                model=model,
                temperature=0.7,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": ORACLE_SYSTEM_PROMPT},
                    {"role": "user", "content": f"Synthesize Date & Gift ideas based on these tastes:\n{oracle_payload}"}
                ]
            )
            oracle_data = json.loads(oracle_resp.choices[0].message.content)
            
            # Append Date Ideas
            for date_item in oracle_data.get("date_ideas", []):
                extracted_items.append({
                    "category": "date_idea",
                    "item_name": date_item.get("title", "Custom Date Idea"),
                    "context_quote": date_item.get("description", ""),
                    "time_stamp": datetime.utcnow().isoformat(),
                    "status": "saved",
                    "target_person": "both",
                    "ai_generated": 1,
                    "metadata": json.dumps({"reason": date_item.get("reason", "")}),
                })
                
            # Append AI Gift Oracle recommendations
            for gift_item in oracle_data.get("gift_ideas", []):
                extracted_items.append({
                    "category": "gift",
                    "item_name": gift_item.get("title", "Recommended Gift"),
                    "context_quote": gift_item.get("description", ""),
                    "time_stamp": datetime.utcnow().isoformat(),
                    "status": "saved",
                    "target_person": "contact",
                    "ai_generated": 1,
                    "metadata": json.dumps({"reason": gift_item.get("reason", "")}),
                })
                
    except Exception as e:
        print(f"Warning: Neuro Keep extraction failed ({e}), using fallback.")
        return _heuristic_keep_extractor(candidates)
        
    return extracted_items


def _heuristic_keep_extractor(candidates: List[Dict]) -> List[Dict[str, Any]]:
    """Safe offline rule-based fallback."""
    items = []
    seen = set()
    for c in candidates:
        cat = c["detected_hint"]
        quote = c["target_turn"]
        if cat in ("food", "movie", "gift") and quote not in seen:
            seen.add(quote)
            items.append({
                "category": cat,
                "item_name": f"{cat.title()} Mention",
                "context_quote": quote,
                "time_stamp": c["time_stamp"],
                "status": "saved",
                "target_person": "contact",
                "ai_generated": 0,
                "metadata": None,
            })
    return items
