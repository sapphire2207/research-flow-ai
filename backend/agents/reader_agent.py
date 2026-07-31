from langchain.agents import create_agent

from services.llm import llm
from tools.scraper_tool import scrape_url


def build_reader_agent():
    return create_agent(
        model=llm,
        tools=[scrape_url]
    )