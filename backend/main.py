from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.chat import router as chat_router
from routers.knowledge_base import router as knowledge_base_router
from routers.documents import router as documents_router
app = FastAPI(title="AI Knowledge Workflow Copilot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(knowledge_base_router)
app.include_router(documents_router)
@app.get('/health')
async def health():
    return {"status": "ok"}
