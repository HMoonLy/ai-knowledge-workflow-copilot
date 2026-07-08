import axios from 'axios'
import type { Source, KnowledgeBase, DocumentUploadResult, Document } from '../type'
import { enableDemoMode, isDemoMode } from './demoMode'
import {
    createDemoKnowledgeBase,
    deleteDemoDocument,
    getDemoDocuments,
    getDemoKnowledgeBases,
    sendDemoChatMessage,
    uploadDemoDocument,
} from './demoApi'

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
    timeout: 15000,
})

function shouldUseDemoFallback(error: unknown) {
    if (!axios.isAxiosError(error)) return false

    return !error.response || error.response.status >= 500
}

export async function sendChatMessage(params: {
    knowledgeBaseId: number
    question: string
    history: {
        role: 'user' | 'assistant'
        content: string
    }[]
}): Promise<ChatApiResponse> {
    if (isDemoMode()) {
        return sendDemoChatMessage(params)
    }

    try {
        const response = await apiClient.post<ChatApiResponse>('/api/chat', {
            knowledge_base_id: params.knowledgeBaseId,
            question: params.question,
            history: params.history,
        })
        return response.data
    } catch (error) {
        if (shouldUseDemoFallback(error)) {
            enableDemoMode()
            return sendDemoChatMessage(params)
        }

        throw error
    }
}

export async function getKnowledgeBases(): Promise<KnowledgeBase[]> {
    if (isDemoMode()) {
        return getDemoKnowledgeBases()
    }

    try {
        const response = await apiClient.get<KnowledgeBaseApiResponse[]>('/api/knowledge-bases')
        return response.data.map((item) => ({
            id: item.id,
            name: item.name,
            documentCount: item.document_count,
        }))
    } catch (error) {
        if (shouldUseDemoFallback(error)) {
            enableDemoMode()
            return getDemoKnowledgeBases()
        }

        throw error
    }
}

export async function uploadDocument(file: File, knowledgeBaseId: number): Promise<DocumentUploadResult> {
    if (isDemoMode()) {
        return uploadDemoDocument(file, knowledgeBaseId)
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('knowledge_base_id', knowledgeBaseId.toString())

    try {
        const response = await apiClient.post<DocumentUploadApiResponse>('/api/documents/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return {
            id: response.data.id,
            filename: response.data.filename,
            contentType: response.data.content_type,
            size: response.data.size,
            status: response.data.status,
        }
    } catch (error) {
        if (shouldUseDemoFallback(error)) {
            enableDemoMode()
            return uploadDemoDocument(file, knowledgeBaseId)
        }

        throw error
    }
}

export async function getDocuments(knowledgeBaseId: number): Promise<Document[]> {
    if (isDemoMode()) {
        return getDemoDocuments(knowledgeBaseId)
    }

    try {
        const response = await apiClient.get<DocumentApiResponse[]>(`/api/knowledge-bases/${knowledgeBaseId}/documents`)
        return response.data.map((item) => ({
            id: item.id,
            filename: item.filename,
            contentType: item.content_type,
            size: item.size,
        }))
    } catch (error) {
        if (shouldUseDemoFallback(error)) {
            enableDemoMode()
            return getDemoDocuments(knowledgeBaseId)
        }

        throw error
    }
}

export async function deleteDocument(knowledgeBaseId: number, documentId: number) {
    if (isDemoMode()) {
        await deleteDemoDocument(knowledgeBaseId, documentId)
        return
    }

    try {
        await apiClient.delete(`/api/documents/${knowledgeBaseId}/${documentId}`)
    } catch (error) {
        if (shouldUseDemoFallback(error)) {
            enableDemoMode()
            await deleteDemoDocument(knowledgeBaseId, documentId)
            return
        }

        throw error
    }
}

export async function createKnowledgeBase(name: string): Promise<KnowledgeBase> {
    if (isDemoMode()) {
        return createDemoKnowledgeBase(name)
    }

    try {
        const response = await apiClient.post<KnowledgeBaseApiResponse>('/api/knowledge-bases', {
            name,
        })

        return {
            id: response.data.id,
            name: response.data.name,
            documentCount: response.data.document_count,
        }
    } catch (error) {
        if (shouldUseDemoFallback(error)) {
            enableDemoMode()
            return createDemoKnowledgeBase(name)
        }

        throw error
    }
}