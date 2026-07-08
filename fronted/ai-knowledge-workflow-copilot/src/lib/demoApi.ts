import type { Document, DocumentUploadResult, KnowledgeBase, Source } from '../type'

type DemoDocument = Document & {
    knowledgeBaseId: number
    content: string
}

type ChatResponse = {
    answer: string
    sources: Source[]
}

let demoKnowledgeBases: KnowledgeBase[] = [
    { id: 1, name: '项目文档', documentCount: 2 },
    { id: 2, name: '学习资料', documentCount: 1 },
    { id: 3, name: '面试准备', documentCount: 1 },
]

let demoDocuments: DemoDocument[] = [
    {
        id: 101,
        knowledgeBaseId: 1,
        filename: 'AI 知识库项目说明.md',
        contentType: 'text/markdown',
        size: 4096,
        content: '这个项目是一个 AI 知识库问答系统，支持创建知识库、上传文档、解析文档内容、检索相关资料，并调用 DeepSeek 生成带引用来源的回答。前端使用 React、TypeScript、Tailwind CSS，后端使用 FastAPI。',
    },
    {
        id: 102,
        knowledgeBaseId: 1,
        filename: 'RAG 工作流设计.md',
        contentType: 'text/markdown',
        size: 3584,
        content: 'RAG 流程包括文档上传、文本抽取、问题关键词匹配、构建上下文、调用大模型、返回答案和引用来源。引用来源用于帮助用户追溯回答依据。',
    },
    {
        id: 201,
        knowledgeBaseId: 2,
        filename: 'React Hooks 学习笔记.md',
        contentType: 'text/markdown',
        size: 3072,
        content: 'React Hooks 可以把组件中的状态和副作用逻辑拆出来。项目中使用 useKnowledgeBases 管理知识库，useDocuments 管理文档，useChatSession 管理对话。',
    },
    {
        id: 301,
        knowledgeBaseId: 3,
        filename: '项目面试介绍.md',
        contentType: 'text/markdown',
        size: 2688,
        content: '面试介绍时可以强调项目完整实现了前后端分离、文档上传解析、知识库管理、RAG 问答、引用溯源和线上 Demo 兜底机制。',
    },
]

function waitDemoResponse() {
    return new Promise((resolve) => {
        window.setTimeout(resolve, 300)
    })
}

function refreshDocumentCounts() {
    demoKnowledgeBases = demoKnowledgeBases.map((knowledgeBase) => ({
        ...knowledgeBase,
        documentCount: demoDocuments.filter((document) => document.knowledgeBaseId === knowledgeBase.id).length,
    }))
}

function toDocument(document: DemoDocument): Document {
    return {
        id: document.id,
        filename: document.filename,
        contentType: document.contentType,
        size: document.size,
    }
}

function splitQuestionWords(question: string) {
    const words: string[] = []
    let currentWord = ''

    for (const char of question.toLowerCase()) {
        if (/\s/.test(char)) {
            if (currentWord) {
                words.push(currentWord)
                currentWord = ''
            }
            continue
        }

        if (/^[a-z0-9]$/i.test(char)) {
            currentWord += char
            continue
        }

        if (currentWord) {
            words.push(currentWord)
            currentWord = ''
        }

        words.push(char)
    }

    if (currentWord) {
        words.push(currentWord)
    }

    return words
}

function searchDemoDocuments(knowledgeBaseId: number, question: string) {
    const questionWords = splitQuestionWords(question)
    const documents = demoDocuments.filter((document) => document.knowledgeBaseId === knowledgeBaseId)
    const matchedDocuments: DemoDocument[] = []

    for (const document of documents) {
        const filenameLower = document.filename.toLowerCase()
        const contentLower = document.content.toLowerCase()

        for (const word of questionWords) {
            if (filenameLower.includes(word) || contentLower.includes(word)) {
                matchedDocuments.push(document)
                break
            }
        }
    }

    if (matchedDocuments.length > 0) {
        return matchedDocuments.slice(0, 3)
    }

    return documents.slice(0, 2)
}

function buildDemoExcerpt(document: DemoDocument, question: string) {
    const contentLower = document.content.toLowerCase()
    const questionWords = splitQuestionWords(question)

    for (const word of questionWords) {
        const wordIndex = contentLower.indexOf(word)

        if (wordIndex !== -1) {
            const startIndex = Math.max(wordIndex - 40, 0)
            const endIndex = wordIndex + 140
            return document.content.slice(startIndex, endIndex)
        }
    }

    return document.content.slice(0, 160)
}

export async function getDemoKnowledgeBases() {
    await waitDemoResponse()
    refreshDocumentCounts()
    return demoKnowledgeBases
}

export async function createDemoKnowledgeBase(name: string) {
    await waitDemoResponse()

    const newKnowledgeBase = {
        id: Date.now(),
        name,
        documentCount: 0,
    }

    demoKnowledgeBases = [...demoKnowledgeBases, newKnowledgeBase]
    return newKnowledgeBase
}

export async function getDemoDocuments(knowledgeBaseId: number) {
    await waitDemoResponse()

    return demoDocuments
        .filter((document) => document.knowledgeBaseId === knowledgeBaseId)
        .map(toDocument)
}

export async function uploadDemoDocument(file: File, knowledgeBaseId: number): Promise<DocumentUploadResult> {
    await waitDemoResponse()

    const newDocument: DemoDocument = {
        id: Date.now(),
        knowledgeBaseId,
        filename: file.name,
        contentType: file.type || 'text/plain',
        size: file.size,
        content: `这是演示模式下上传的文档：${file.name}。演示模式会模拟文档保存、列表刷新和引用来源展示，用于保证线上作品集稳定可访问。`,
    }

    demoDocuments = [newDocument, ...demoDocuments]
    refreshDocumentCounts()

    return {
        id: newDocument.id,
        filename: newDocument.filename,
        contentType: newDocument.contentType,
        size: newDocument.size,
        status: 'demo_uploaded',
    }
}

export async function deleteDemoDocument(knowledgeBaseId: number, documentId: number) {
    await waitDemoResponse()

    demoDocuments = demoDocuments.filter((document) => {
        return !(document.knowledgeBaseId === knowledgeBaseId && document.id === documentId)
    })
    refreshDocumentCounts()
}

export async function sendDemoChatMessage(params: {
    knowledgeBaseId: number
    question: string
}): Promise<ChatResponse> {
    await waitDemoResponse()

    const matchedDocuments = searchDemoDocuments(params.knowledgeBaseId, params.question)
    const sources = matchedDocuments.map((document) => ({
        id: document.id,
        title: document.filename,
        excerpt: buildDemoExcerpt(document, params.question),
    }))

    if (matchedDocuments.length === 0) {
        return {
            answer: '演示模式：当前知识库还没有文档。你可以先上传一个文件，再继续提问。',
            sources: [],
        }
    }

    const sourceNames = matchedDocuments.map((document) => document.filename).join('、')

    return {
        answer: `演示模式：我根据「${sourceNames}」整理了回答。这个知识库主要展示文档上传、知识库管理、RAG 检索、AI 回答和引用来源追溯的完整流程。真实后端可用时，系统会自动调用 FastAPI 和 DeepSeek 返回真实答案。`,
        sources,
    }
}
