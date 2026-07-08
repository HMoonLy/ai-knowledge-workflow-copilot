import { useState } from 'react'
import { uploadDocument } from '../lib/api'
import type { DocumentUploadResult } from '../type'
import axios from 'axios'
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