from schemas import ChatRequest, ChatResponse, Source, Document
from services.document_service import list_documents
from services.deepseek_service import generate_answer_with_deepseek

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

def build_ai_context(matched_documents:list[Document],question:str):
    MAX_CONTEXT_LENGTH = 3000

    context = ""

    for document in matched_documents:
        if len(context) > MAX_CONTEXT_LENGTH:
            break

        context_lower = document.content.lower()
        question_words=split_question_words(question)
        for word in question_words:
            word_index=context_lower.find(word)

            if word_index != -1:
                start_index=max(word_index-300,0)
                end_index=word_index+1000

                context+=f"文档：{document.filename}\n"
                context+=f"内容：{document.content[start_index:end_index]}\n\n"
                break
    return context[:MAX_CONTEXT_LENGTH]