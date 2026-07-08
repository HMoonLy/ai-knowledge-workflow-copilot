import { useEffect, useState } from 'react'
import { getDocuments, deleteDocument } from '../lib/api'
import type { Document } from '../type'

export function useDocuments(knowledgeBaseId: number | null) {
    const [documents, setDocuments] = useState<Document[]>([])
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(false)
    const [documentsError, setDocumentsError] = useState('')
    const [deletingDocumentId, setDeletingDocumentId] = useState<number | null>(null)

    async function reloadDocuments() {
        if (knowledgeBaseId === null) {
            setDocuments([])
            return
        }

        try {
            setIsLoadingDocuments(true)
            setDocumentsError('')

            const data = await getDocuments(knowledgeBaseId)
            setDocuments(data)
        } catch (error) {
            setDocumentsError('获取文档列表失败')
        } finally {
            setIsLoadingDocuments(false)
        }
    }

    async function handleDeleteDocument(documentId: number) {
        if (knowledgeBaseId === null) {
            setDocumentsError('知识库 ID 为空，无法删除文档')
            return
        }

        try {
            setDeletingDocumentId(documentId)
            setDocumentsError('')
            await deleteDocument(knowledgeBaseId, documentId)
            await reloadDocuments()
        } catch (error) {
            setDocumentsError('删除文档失败')
        } finally {
            setDeletingDocumentId(null)
        }
    }

    useEffect(() => {
        reloadDocuments()
    }, [knowledgeBaseId])

    return {
        documents,
        isLoadingDocuments,
        documentsError,
        reloadDocuments,
        handleDeleteDocument,
        deletingDocumentId,
    }
}