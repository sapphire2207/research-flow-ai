from langchain.agents import create_agent

from services.llm import llm
from tools.search_tool import web_search


def build_search_agent():
    return create_agent(
        model=llm,
        tools=[web_search]
    )