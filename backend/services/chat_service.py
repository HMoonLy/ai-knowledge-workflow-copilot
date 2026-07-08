import json
from langchain_core.documents import Document as LangChainDocument
from langchain_text_splitters import RecursiveCharacterTextSplitter


from schemas import ChatRequest, ChatResponse, Source, Document
from services.document_service import list_documents
from services.deepseek_service import (
    generate_answer_with_deepseek,
    generate_answer_stream_with_deepseek,
)

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=100,
)

def split_question_words(question: str):
    words = []
    current_word = ""

    for char in question.lower():
        if char.isspace():
            if current_word:
                words.append(current_word)
                current_word = ""
            continue

        if char.isascii() and char.isalnum():
            current_word += char
            continue

        if current_word:
            words.append(current_word)
            current_word = ""

        words.append(char)

    if current_word:
        words.append(current_word)

    return words

def split_documents_to_chunks(documents:list[Document]):
    langchain_documents = []

    for document in documents:
        langchain_document=LangChainDocument(
            page_content=document.content,
            metadata={
                "document_id": document.id,
                "filename": document.filename,
            }
        )
        langchain_documents.append(langchain_document)
    return text_splitter.split_documents(langchain_documents)

def generate_chat_response(payload:ChatRequest)->ChatResponse:
    documents = list_documents(payload.knowledge_base_id)
    matched_documents = search_documents_by_question(
        documents,
        payload.question,
    )
    if not documents:
        return ChatResponse(
            answer="当前知识库还没有上传文档，请先上传文档后再提问。",
            sources=[],
        )

    if not matched_documents:
        return ChatResponse(
            answer=f"我没有在当前知识库中找到和「{payload.question}」相关的内容。",
            sources=[],
        )

    sources = []
    for document in matched_documents:
        source = Source(
            id=document.id,
            title=document.filename,
            excerpt=build_source_excerpt(document, payload.question)
        )
        sources.append(source)

    context = build_ai_context(matched_documents, payload.question)
    try:
        answer_text = generate_answer_with_deepseek(
        payload.question,
        context,
        payload.history
    )
    except Exception:
        answer_text = "调用 DeepSeek失败，请稍后再试"

    return ChatResponse(
        answer=answer_text,
        sources=sources,
    )

def build_stream_event(event_type:str,data):
    return json.dumps(
        {
            "type": event_type,
            "data": data
        },
        ensure_ascii=False
    )+"\n"

def search_documents_by_question(documents, question: str):
    question_words = split_question_words(question)

    matched_documents = []

    for document in documents:
        filename_lower = document.filename.lower()
        content_lower = document.content.lower()

        for word in question_words:
            if word in filename_lower or word in content_lower:
                matched_documents.append(document)
                break

    if matched_documents:
        return matched_documents[:3]

    return []

def build_source_excerpt(document:Document,question:str):
    content_lower = document.content.lower()
    question_words=split_question_words(question)

    for word in question_words:
        word_index=content_lower.find(word)

        if word_index != -1:
            start_index=max(word_index-50,0)
            end_index=word_index+150
            return document.content[start_index:end_index]
    return document.content[:150]


def build_ai_context(matched_documents: list[Document], question: str):
    MAX_CONTEXT_LENGTH = 3000

    context = ""
    question_words = split_question_words(question)
    chunks = split_documents_to_chunks(matched_documents)

    for chunk in chunks:
        if len(context) > MAX_CONTEXT_LENGTH:
            break

        chunk_content_lower = chunk.page_content.lower()

        for word in question_words:
            if word in chunk_content_lower:
                context += f"文档：{chunk.metadata['filename']}\n"
                context += f"内容：{chunk.page_content}\n\n"
                break

    return context[:MAX_CONTEXT_LENGTH]

def generate_chat_response_stream(payload:ChatRequest):
    documents=list_documents(payload.knowledge_base_id)

    matched_documents = search_documents_by_question(
        documents,
        payload.question,
    )
    if not documents:
        yield build_stream_event("error","当前知识库还没有上传文档，请先上传文档后再提问。")
        yield build_stream_event("done", None)
        return

    if not matched_documents:
        yield build_stream_event("error", f"我没有在当前知识库中找到和「{payload.question}」相关的内容。")
        yield build_stream_event("done", None)
        return

    sources = []
    for document in matched_documents:
        source = Source(
            id=document.id,
            title=document.filename,
            excerpt=build_source_excerpt(document, payload.question)
        )
        sources.append(source)

    sources_data=[]

    for source in sources:
        sources_data.append(
            {
                "id": source.id,
                "title": source.title,
                "excerpt": source.excerpt
            }
        )
    yield build_stream_event("sources", sources_data)

    context=build_ai_context(matched_documents, payload.question)

    try:
        for text in generate_answer_stream_with_deepseek(
            payload.question,
            context,
            payload.history
        ):
            yield build_stream_event("text", text)
    except Exception:
        yield build_stream_event("error", "调用 DeepSeek失败，请稍后再试")

    yield build_stream_event("done", None)