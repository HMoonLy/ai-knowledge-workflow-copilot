from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from schemas import ChatRequest, ChatResponse
from services.chat_service import generate_chat_response, generate_chat_response_stream

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest):
    return generate_chat_response(payload)


@router.post("/chat/stream")
async def chat_stream(payload: ChatRequest):
    return StreamingResponse(
        generate_chat_response_stream(payload),
        media_type="application/x-ndjson",
    )