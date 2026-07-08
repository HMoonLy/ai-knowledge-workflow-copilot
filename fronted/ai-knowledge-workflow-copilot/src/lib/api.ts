import axios from 'axios'
import type { Source, KnowledgeBase, DocumentUploadResult, Document } from '../type'

type ChatApiResponse = {
    answer: string
    sources: Source[]
}

type KnowledgeBaseApiResponse = {
    id: number
    name: string
    document_count: number
}
type DocumentUploadApiResponse = {
    id: number
    filename: string
    content_type: string
    size: number
    status: string
}
type DocumentApiResponse = {
    id: number
    filename: string
    content_type: string
    size: number
}

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
    timeout: 60000
})

export async function sendChatMessage(params: {
    knowledgeBaseId: number
    question: string
    history: {
        role: 'user' | 'assistant'
        content: string
    }[]
}): Promise<ChatApiResponse> {
    const response = await apiClient.post<ChatApiResponse>('/api/chat', {
        knowledge_base_id: params.knowledgeBaseId,
        question: params.question,
        history: params.history
    })
    return response.data
}

export async function getKnowledgeBases(): Promise<KnowledgeBase[]> {
    const response = await apiClient.get<KnowledgeBaseApiResponse[]>('/api/knowledge-bases')
    return response.data.map((item) => ({
        id: item.id,
        name: item.name,
        documentCount: item.document_count,
    }))
}

export async function uploadDocument(file: File, knowledgeBaseId: number): Promise<DocumentUploadResult> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('knowledge_base_id', knowledgeBaseId.toString())

    const response = await apiClient.post<DocumentUploadApiResponse>('/api/documents/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return {
        id: response.data.id,
        filename: response.data.filename,
        contentType: response.data.content_type,
        size: response.data.size,
        status: response.data.status
    }
}

export async function getDocuments(knowledgeBaseId: number): Promise<Document[]> {
    const response = await apiClient.get<DocumentApiResponse[]>(`/api/knowledge-bases/${knowledgeBaseId}/documents`)
    return response.data.map((item) => ({
        id: item.id,
        filename: item.filename,
        contentType: item.content_type,
        size: item.size
    }))
}

export async function deleteDocument(knowledgeBaseId: number, documentId: number) {
    await apiClient.delete(`/api/documents/${knowledgeBaseId}/${documentId}`)
}

export async function createKnowledgeBase(name: string): Promise<KnowledgeBase> {
    const response = await apiClient.post<KnowledgeBaseApiResponse>('/api/knowledge-bases', {
        name,
    })

    return {
        id: response.data.id,
        name: response.data.name,
        documentCount: response.data.document_count,
    }
}
