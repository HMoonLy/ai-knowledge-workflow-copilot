from fastapi import APIRouter
from schemas import  ChatRequest,ChatResponse
from services.chat_service import generate_chat_response

router=APIRouter(prefix='/api',tags=['chat'])


@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest):
    return generate_chat_response(payload)