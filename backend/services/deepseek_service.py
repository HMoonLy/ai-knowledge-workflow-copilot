import os

from langchain_deepseek import ChatDeepSeek
from langchain_core.prompts import ChatPromptTemplate


llm = ChatDeepSeek(
    model="deepseek-v4-pro",
    api_key=os.environ.get("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com",
)

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "你是一个知识库问答助手。请只根据用户提供的资料回答问题，不要编造资料外的信息。",
        ),
        (
            "human",
            "历史对话：\n{history}\n\n资料内容：\n{context}\n\n用户问题：{question}",
        ),
    ]
)

chain = prompt | llm


def build_history_text(history):
    history_text = ""

    for message in history:
        history_text += f"{message.role}: {message.content}\n"

    return history_text


def build_chain_input(question: str, context: str, history):
    return {
        "history": build_history_text(history),
        "context": context,
        "question": question,
    }


def generate_answer_with_deepseek(question: str, context: str, history) -> str:
    response = chain.invoke(
        build_chain_input(question, context, history)
    )

    return response.content or ""


def generate_answer_stream_with_deepseek(question: str, context: str, history):
    for chunk in chain.stream(
        build_chain_input(question, context, history)
    ):
        if chunk.content:
            yield chunk.content
