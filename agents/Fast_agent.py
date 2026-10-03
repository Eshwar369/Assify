from email import message
import ollama
from config import FAST_LLM, VEC_DB_PATH
from memory.vector_store import VectorStore
from agents.llm_provider import OllamaLLM


class FastChatAgent:
    def __init__(self):
        self.ml_model = FAST_LLM
        self.llm=OllamaLLM(model=self.ml_model)
        self.vector_store= VectorStore(path=VEC_DB_PATH)
        self.history=[
            {
                "role": "system",
                "content": "You are Assify, a private relationship intelligence copilot..."
            }
        ]

    def fast_reply(self, query: str) -> str:
        results=self.vector_store.timed_search(query,k=5)
        context_messages=self.vector_store.context_window_messages(results[0]['id'],window=5)
            
        self.history.append({
            "role": "user",
            "content": f"Query: {query}\n\nContext:\n{context_messages}"
        })
        reply = self.llm.chat(messages=self.history)
        self.history.append(
            {
                "role":"assistant",
                "content": reply
            }
        )
        return reply


