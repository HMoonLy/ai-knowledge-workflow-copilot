import { useState } from 'react'
import axios from 'axios'
import { uploadDocument } from '../lib/api'
import type { DocumentUploadResult } from '../type'

export function useDocumentUpload() {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [uploadResult, setUploadResult] = useState<DocumentUploadResult | null>(null)

    async function handleUpload(file: File, knowledgeBaseId: number): Promise<DocumentUploadResult | null> {
        try {
            setIsUploading(true)
            setUploadError(null)

            const result = await uploadDocument(file, knowledgeBaseId)
            setUploadResult(result)
            setUploadError(null)
            return result
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const detail = error.response?.data?.detail
                if (typeof detail === 'string') {
                    setUploadError(detail)
                    return null
                }
            }
            setUploadError('上传文档失败')
            return null
        } finally {
            setIsUploading(false)
        }
    }

    return {
        isUploading,
        uploadResult,
        uploadError,
        handleUpload,
    }
}