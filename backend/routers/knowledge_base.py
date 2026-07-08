from fastapi import APIRouter

from schemas import KnowledgeBase, Document, CreateKnowledgeBaseRequest
from services.knowledge_base_service import list_knowledge_base, create_knowledge_base
from services.document_service import list_documents

router = APIRouter(prefix="/api", tags=["knowledge_base"])


@router.get("/knowledge-bases", response_model=list[KnowledgeBase])
async def get_knowledge_bases():
    return list_knowledge_base()


@router.get("/knowledge-bases/{knowledge_base_id}/documents", response_model=list[Document])
async def get_documents(knowledge_base_id: int):
    return list_documents(knowledge_base_id)


@router.post("/knowledge-bases", response_model=KnowledgeBase)
async def create_knowledge_base_api(payload: CreateKnowledgeBaseRequest):
    return create_knowledge_base(payload.name)