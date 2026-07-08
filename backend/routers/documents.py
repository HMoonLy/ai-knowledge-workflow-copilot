from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from schemas import DocumentUploadResponse
from services.document_service import save_uploaded_document, delete_document

router = APIRouter(prefix="/api/documents", tags=["documents"])


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...),knowledge_base_id:int=Form(...))->DocumentUploadResponse:
    return await save_uploaded_document(file, knowledge_base_id)


@router.delete("/{knowledge_base_id}/{document_id}")
async def remove_document(knowledge_base_id:int,document_id:int):
    deleted=delete_document(knowledge_base_id,document_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Document not found")

    return {
        "status": "deleted",
        "document_id": document_id,
    }