import os
from openai import OpenAI

client=OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)

def generate_answer_with_deepseek(question:str,context:str,history)->str:
    history_text=""
    for message in history:
        history_text+=f"{message.role}:{message.content}\n"
    response=client.chat.completions.create(
        model='deepseek-v4-pro',
        messages=[
            {
                "role": "system",
                "content": "你是一个知识库问答助手。请只根据用户提供的资料回答问题，不要编造资料外的信息。",
            },
            {
                "role": "user",
                "content": f"历史对话：\n{history_text}\n\n资料内容：\n{context}\n\n用户问题：{question}",
            },
        ],
        stream=False,
    )
    return response.choices[0].message.content
