import re
import json
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, ValidationError

from agents.llm_provider import get_llm
from config import LLM_PROVIDER

# 1. Strict Enum Contract (Prevents Multi-Select Arrays)
class RouteType(str, Enum):
    TIMED = "TIMED"          # Recent emotional dynamics, conflicts, current mood
    UNTIMED = "UNTIMED"      # Static facts, preferences, birthdays, past statements
    SQL = "SQL"              # Calendar dates, days of week, exact hours ("last Friday", "3pm")
    NMESSAGES = "NMESSAGES"  # Explicit message count caps ("last 20 messages")
    SKIP = "SKIP"            # Chit-chat, meta questions, general advice (zero DB lookup)


# 2. Strict Pydantic Output Model
class RouteDecision(BaseModel):
    route: RouteType = Field(description="Exactly ONE route from the RouteType enum")
    target_query: Optional[str] = Field(default=None, description="Cleaned search keywords (no filler words)")
    time_hint: Optional[str] = Field(default=None, description="Raw temporal phrase extracted from query")
    limit: Optional[int] = Field(default=None, description="Integer message count if requested")
    reason: str = Field(description="1-sentence explanation")


# 3. Rigorous Prompt with Anchors
ROUTER_SYSTEM_PROMPT = """You are the Assify Query Router.
CRITICAL RULE: You are an Intent Dispatcher, NOT a conversational assistant. 
Do NOT try to answer the user's question. Your ONLY job is to classify which database lookup engine will fetch past WhatsApp messages to answer it.

ROUTING TAXONOMY:
- "UNTIMED": The user is asking about facts, preferences, opinions, tastes, or past statements that do NOT expire with time (e.g., favorite food, birthday, music, car, hobbies).
- "TIMED": The user is asking about current emotional states, recent conflicts, mood, or today's/tonight's plans where recency matters.
- "SQL": The user mentions a specific calendar date, day of week, or time of day (e.g., "last Friday", "yesterday between 3pm and 6pm", "September 15th").
- "NMESSAGES": The user asks for the last N messages (e.g., "show last 20 messages", "recent 5 chats").
- "SKIP": Greetings, meta-questions about Assify, or general advice that requires NO past chat history.

FEW-SHOT EXAMPLES:
User: "what colour does she like"
Output: {"route": "UNTIMED", "target_query": "favorite color", "time_hint": null, "limit": null, "reason": "Static preference inquiry"}

User: "why is she upset right now"
Output: {"route": "TIMED", "target_query": "upset angry annoyed", "time_hint": null, "limit": null, "reason": "Current emotional state inquiry"}

User: "give me chats from last friday"
Output: {"route": "SQL", "target_query": null, "time_hint": "last friday", "limit": null, "reason": "Specific calendar day requested"}

User: "so what did she say in last 100 messages"
Output: {"route": "NMESSAGES", "target_query": null, "time_hint": null, "limit": 100, "reason": "Message count limit requested"}

User: "hey good morning, who are you?"
Output: {"route": "SKIP", "target_query": null, "time_hint": null, "limit": null, "reason": "Greeting and meta inquiry"}

OUTPUT REQUIREMENT:
Output valid JSON ONLY matching the schema. The "route" field MUST be a single string, NEVER an array.
"""


class Router:
    def __init__(self, model: str = "llama3.1:8b"):
        # Initialize your fast LLM with JSON mode enabled
        self.llm = get_llm(model=model, provider=LLM_PROVIDER, format="json")

    def Route(self, query: str) -> RouteDecision:
        messages = [
            {"role": "system", "content": ROUTER_SYSTEM_PROMPT},
            {"role": "user", "content": f"User: \"{query}\"\nOutput:"}
        ]

        raw_response = self.llm.chat(messages)

        # ----------------------------------------------------------------------
        # TODO [Connecting Logic 1: Sanitization]:
        # Local models sometimes wrap JSON in markdown backticks: ```json ... ```
        # Use regex (e.g. re.search(r"\{.*\}", raw_response, re.DOTALL))
        # to isolate the pure JSON substring:
        # ----------------------------------------------------------------------
        clean_json_str = ...

        # ----------------------------------------------------------------------
        # TODO [Connecting Logic 2: Pydantic Validation & Fallback]:
        # Use RouteDecision.model_validate_json(clean_json_str) to validate.
        # Wrap in a try-except block: if parsing fails, safely return a 
        # default RouteDecision(route=RouteType.UNTIMED, target_query=query, reason="fallback")
        # ----------------------------------------------------------------------
        try:
            decision = ...
            return decision
        except (ValidationError, Exception) as e:
            # Safe fallback so the pipeline never crashes
            return RouteDecision(
                route=RouteType.UNTIMED,
                target_query=query,
                reason=f"Parser fallback: {str(e)}"
            )


if __name__ == "__main__":
    r = Router(model="llama3.1:8b")
    print("Testing Router with llama3.1:8b...")
    print(r.Route("what colour does she like").model_dump_json(indent=2))
    print(r.Route("give me chats from last friday").model_dump_json(indent=2))
