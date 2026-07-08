from typing import List
from pydantic import BaseModel

class ChatHistoryMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    knowledge_base_id:int
    question:str
    history: List[ChatHistoryMessage] = []

class Source(BaseModel):
    id: int
    title: str
    excerpt: str

class ChatResponse(BaseModel):
    answer:str
    sources:List[Source]

class KnowledgeBase(BaseModel):
    id: int
    name: str
    document_count: int

class DocumentUploadResponse(BaseModel):
    id:int
    filename: str
    content_type: str
    size: int
    status: str

class Document(BaseModel):
    id:int
    filename:str
    content_type:str
    size:int
    content:str

class CreateKnowledgeBaseRequest(BaseModel):
    name: str



