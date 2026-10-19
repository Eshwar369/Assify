from deepagents import create_deep_agent
from langchain.messages import HumanMessage

EXAMPLE_QUERY = "How do I stream intermediate tool results from a subagent?"

baseline_agent = create_deep_agent(
    model="ollama:gemma4:12b",
    tools=[],
    system_prompt=(
        "You are a helpful LangChain documentation assistant. "
        "Answer questions about LangChain APIs and patterns."
    ),
)

result = baseline_agent.invoke(
    {"messages": [HumanMessage(content=EXAMPLE_QUERY)]}
)

print(result["messages"][-1].text)