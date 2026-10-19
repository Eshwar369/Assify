import json
import os
from datetime import datetime

class RAGTracer:
    def __init__(self, trace_dir="logs"):
        os.makedirs(trace_dir, exist_ok=True)
        self.md_path = os.path.join(trace_dir, "last_trace.md")
        self.jsonl_path = os.path.join(trace_dir, "traces.jsonl")

    def log_turn(self, query: str, search_target: str, results: list, prompt_messages: list, response: str):
        record = {
            "timestamp": datetime.now().isoformat(),
            "query": query,
            "search_target": search_target,
            "results_count": len(results),
            "results": [
                {"id": r.get("id"), "sim": round(r.get("similarity", 0), 4), "snippet": r.get("content", "")[:150]}
                for r in results
            ],
            "response": response
        }

        # 1. Append JSONL for persistent tracking
        with open(self.jsonl_path, "a", encoding="utf-8") as f:
            f.write(json.dumps(record) + "\n")

        # 2. Overwrite last_trace.md for instant live viewing in IDE
        md_content = f"""# 🔬 Latest RAG Trace ({record['timestamp']})

### 👤 User Query:
> **{query}**

### 🎯 Rewritten Search Target:
`{search_target}`

### 📦 Retrieved Context ({len(results)} chunks):
"""
        for i, r in enumerate(results, 1):
            md_content += f"""
#### Hit #{i} [Sim: {r.get('similarity', 0):.4f}] ({r.get('contact_name')})
```text
{r.get('content', '').strip()}
