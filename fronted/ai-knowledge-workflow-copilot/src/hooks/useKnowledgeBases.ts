import { useEffect, useState } from 'react'
import { getKnowledgeBases, createKnowledgeBase } from '../lib/api'
import type { KnowledgeBase } from '../type'

export function useKnowledgeBases() {
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([])
    const [selectedKbId, setSelectedKbId] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')


    async function reloadKnowledgeBases() {
        try {
            setIsLoading(true)
            setErrorMessage('')

            const data = await getKnowledgeBases()

            setKnowledgeBases(data)
            setSelectedKbId((currentSelectedId) => {
                if (data.some((kb) => kb.id === currentSelectedId)) {
                    return currentSelectedId
                }

                return data[0]?.id ?? null
            })
        } catch (error) {
            setErrorMessage('获取知识库列表失败，请稍后再试。')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleCreateKnowledgeBase(name: string) {
        if (!name.trim()) return

        const newKnowledgeBase = await createKnowledgeBase(name.trim())

        await reloadKnowledgeBases()
        setSelectedKbId(newKnowledgeBase.id)
    }

    useEffect(() => {
        reloadKnowledgeBases()
    }, [])

    const selectedKnowledgeBase = knowledgeBases.find(
        (kb) => kb.id === selectedKbId
    )
    return {
        knowledgeBases,
        selectedKbId,
        selectedKnowledgeBase,
        isLoading,
        errorMessage,
        setSelectedKbId,
        reloadKnowledgeBases,
        handleCreateKnowledgeBase
    }
}