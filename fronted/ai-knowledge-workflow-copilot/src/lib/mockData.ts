import type { ChatMessage, KnowledgeBase, Source } from '../type'

export const knowledgeBases: KnowledgeBase[] = [
    { id: 1, name: '项目文档', documentCount: 2 },
    { id: 2, name: '学习资料', documentCount: 1 },
]

export const initialMessages: ChatMessage[] = [
    { id: 1, role: 'user', content: '这个知识库主要讲了什么？' },
    { id: 2, role: 'assistant', content: '它主要展示 AI 知识库问答、文档检索和引用溯源流程。' },
]

export const sources: Source[] = [
    { id: 1, title: 'AI 知识库项目说明.md', excerpt: '系统支持文档上传、知识库管理、AI 问答和引用来源展示。' },
    { id: 2, title: 'RAG 工作流设计.md', excerpt: '工作流包括检索、构建上下文、调用模型和返回引用来源。' },
]