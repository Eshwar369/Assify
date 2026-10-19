from config import FAST_LLM, VEC_DB_PATH, LLM_PROVIDER , MAX_HISTORY
from memory.vector_store import VectorStore
from agents.llm_provider import get_llm


class FastChatAgent:
    def __init__(self):
        self.ml_model = FAST_LLM
        self.llm=get_llm(model=FAST_LLM,provider=LLM_PROVIDER)
        self.vector_store= VectorStore(path=VEC_DB_PATH)
        SYSTEM_PROMPT = """You are Assify, an empathetic, highly intelligent private relationship copilot.
Your job is to answer questions about the user's past chats based strictly on the provided Context.
STRICT OPERATING RULES:
1. ONLY use facts directly stated in the Context.
2. If the context does not explicitly answer the question (e.g. asking for a favorite color, but context only has banter or unrelated words), concisely state: "I couldn't find any mention of that in your chat history."
3. NEVER make up stories, guess hidden meanings, or give long philosophical speeches.
4. Keep answers brief (2-3 sentences max), direct, and natural.
"""
        self.history=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            }
        ]

    def extract_search_target(self, query: str) -> str:
        """
        Transforms user questions into target WhatsApp chat phrases.
        Example: 'did she ever say i like you?' -> 'i like you'
        """
        rewrite_prompt = [
            {
                "role": "system",
                "content": (
                    "You are a search query optimizer. Given a user question about past chats, "
                    "extract ONLY the core words or statement that would appear in the chat message.\n\n"
                    "Examples:\n"
                    "Question: did sleepless zombie ever say thank you?\n"
                    "Target: thank you\n\n"
                    "Question: did she ever say i like you?\n"
                    "Target: i like you\n\n"
                    "Question: when did we talk about going to goa?\n"
                    "Target: goa trip"
                )
            },
            {
                "role": "user",
                "content": f"Question: {query}\nTarget:"
            }
        ]
        # Call your lightweight provider to get the clean phrase!
        target_phrase = self.llm.chat(rewrite_prompt).strip()
        return target_phrase
        
            
        
        
        

    def fast_reply(self, query: str) -> str:
        target= self.extract_search_target(query)
        results=self.vector_store.timed_search(target,k=5)

        if results:
            formatted_context = "\n---\n".join([r["content"] for r in results[:2] if "content" in r and r["content"]])
            if not formatted_context:
                context_messages = self.vector_store.context_window_messages(results[0]["id"], window=5)
                formatted_context = "\n".join([f"[{msg[1]}] {msg[2]}: {msg[3]}" for msg in context_messages])
        else:
            formatted_context = "no data found"

        self.history.append({
            "role": "user",
            "content": f"Query: {query}\n\nContext:\n{formatted_context}"
        })
        reply = self.llm.chat(messages=self.history)
        self.history.append(
            {
                "role":"assistant",
                "content": reply
            }
        )
        if len(self.history)> MAX_HISTORY:
            self.history= [self.history[0]] + self.history[-MAX_HISTORY:]
        return reply


if __name__ == "__main__":
    agent = FastChatAgent()
    print("\n💬 Assify Fast Copilot Online! (Type 'exit' to quit)\n" + "-"*50)
    while True:
        q = input("\nYou: ")
        if q.strip().lower() in ["exit", "quit"]:
            break
        print(f"\nAssify: {agent.fast_reply(q)}\n" + "-"*50)