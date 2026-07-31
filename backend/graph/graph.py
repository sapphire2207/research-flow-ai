from langgraph.graph import StateGraph, START, END

from graph.state import ResearchState
from graph.nodes import (
    search_node,
    reader_node,
    writer_node,
    critic_node,
)

# Build Graph
builder = StateGraph(ResearchState)

# Add Nodes
builder.add_node("search", search_node)
builder.add_node("reader", reader_node)
builder.add_node("writer", writer_node)
builder.add_node("critic", critic_node)

# Define Flow
builder.add_edge(START, "search")
builder.add_edge("search", "reader")
builder.add_edge("reader", "writer")
builder.add_edge("writer", "critic")
builder.add_edge("critic", END)

# Compile Graph
graph = builder.compile()