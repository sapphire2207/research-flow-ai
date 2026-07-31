from graph.state import ResearchState

from agents.search_agent import build_search_agent
from agents.reader_agent import build_reader_agent
from agents.writer_agent import writer_chain
from agents.critic_agent import critic_chain


def _get_text(content) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        return "".join(
            item.get("text", "") if isinstance(item, dict) else str(item)
            for item in content
        )
    return str(content)


def search_node(state: ResearchState) -> ResearchState:
    print("\n" + "=" * 50)
    print("Step 1 - Search Agent is working...")
    print("=" * 50)

    search_agent = build_search_agent()

    search_result = search_agent.invoke(
        {
            "messages": [
                (
                    "user",
                    f"Find recent, reliable and detailed information about: {state['topic']}"
                )
            ]
        }
    )

    state["search_results"] = _get_text(search_result["messages"][-1].content)

    print("\nSearch Result:\n")
    print(state["search_results"])

    return state


def reader_node(state: ResearchState) -> ResearchState:
    print("\n" + "=" * 50)
    print("Step 2 - Reader Agent is scraping top resources...")
    print("=" * 50)

    reader_agent = build_reader_agent()

    reader_result = reader_agent.invoke(
        {
            "messages": [
                (
                    "user",
                    f"Based on the following search results about '{state['topic']}', "
                    f"pick the most relevant URL and scrape it for deeper content.\n\n"
                    f"Search Results:\n{state['search_results'][:800]}"
                )
            ]
        }
    )

    state["scraped_content"] = _get_text(reader_result["messages"][-1].content)

    print("\nScraped Content:\n")
    print(state["scraped_content"])

    return state


def writer_node(state: ResearchState) -> ResearchState:
    print("\n" + "=" * 50)
    print("Step 3 - Writer is drafting the report...")
    print("=" * 50)

    research_combined = (
        f"SEARCH RESULTS:\n{state['search_results']}\n\n"
        f"DETAILED SCRAPED CONTENT:\n{state['scraped_content']}"
    )

    state["report"] = _get_text(writer_chain.invoke(
        {
            "topic": state["topic"],
            "research": research_combined
        }
    ))

    print("\nFinal Report:\n")
    print(state["report"])

    return state


def critic_node(state: ResearchState) -> ResearchState:
    print("\n" + "=" * 50)
    print("Step 4 - Critic is reviewing the report...")
    print("=" * 50)

    state["feedback"] = _get_text(critic_chain.invoke(
        {
            "report": state["report"]
        }
    ))

    print("\nCritic Report:\n")
    print(state["feedback"])

    return state