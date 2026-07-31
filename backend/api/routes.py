import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from api.schemas import ResearchRequest, ResearchResponse
from graph.graph import graph

router = APIRouter()


@router.post(
    "/research",
    response_model=ResearchResponse,
    tags=["Research"]
)
def research(request: ResearchRequest):
    try:
        result = graph.invoke({
            "topic": request.topic
        })

        return ResearchResponse(
            topic=result.get("topic", request.topic),
            search_results=result.get("search_results", ""),
            scraped_content=result.get("scraped_content", ""),
            report=result.get("report", ""),
            feedback=result.get("feedback", "")
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.post(
    "/research/stream",
    tags=["Research"]
)
def research_stream(request: ResearchRequest):
    def event_generator():
        try:
            yield f"data: {json.dumps({'type': 'step', 'step': 0})}\n\n"

            state = {"topic": request.topic}
            for chunk in graph.stream(state):
                for node_name, node_state in chunk.items():
                    state.update(node_state)
                    if node_name == "search":
                        yield f"data: {json.dumps({'type': 'step', 'step': 1})}\n\n"
                    elif node_name == "reader":
                        yield f"data: {json.dumps({'type': 'step', 'step': 2})}\n\n"
                    elif node_name == "writer":
                        yield f"data: {json.dumps({'type': 'step', 'step': 3})}\n\n"
                    elif node_name == "critic":
                        yield f"data: {json.dumps({'type': 'step', 'step': 4})}\n\n"

            final_data = {
                "type": "complete",
                "result": {
                    "topic": state.get("topic", request.topic),
                    "search_results": state.get("search_results", ""),
                    "scraped_content": state.get("scraped_content", ""),
                    "report": state.get("report", ""),
                    "feedback": state.get("feedback", "")
                }
            }
            yield f"data: {json.dumps(final_data)}\n\n"
        except Exception as e:
            error_data = {
                "type": "error",
                "message": str(e)
            }
            yield f"data: {json.dumps(error_data)}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")