import { useState } from 'react'
import { sendChatMessage } from '../lib/api'
import type { ChatMessage, Source } from '../type'
import { initialMessages, sources } from '../lib/mockData'

export function useChatSession(selectedKbId: number | null) {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
    const [isGenerating, setIsGenerating] = useState(false)
    const [currentSources, setCurrentSources] = useState<Source[]>(sources)
    const [selectedSourceId, setSelectedSourceId] = useState<number | null>(sources[0]?.id ?? null)

    async function handleSendMessage(content: string) {
        if (!content.trim() || selectedKbId === null) return

        const userMessage: ChatMessage = {
            id: Date.now(),
            role: 'user',
            content,
        }

        setMessages((prevMessages) => [...prevMessages, userMessage])
        setIsGenerating(true)

        try {
            const history = messages.slice(-6).map((message) => ({
                role: message.role,
                content: message.content,
            }))

            const data = await sendChatMessage({
                knowledgeBaseId: selectedKbId,
                question: content,
                history,
            })

            const aiResponse: ChatMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: data.answer,
                sourceIds: data.sources.map((source) => source.id),
            }

            setMessages((prevMessages) => [...prevMessages, aiResponse])
            setCurrentSources(data.sources)
            setSelectedSourceId(data.sources[0]?.id ?? null)
        } catch (error) {
            const errorMessage: ChatMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: '抱歉，获取回答时出错，请稍后再试。',
            }
            setMessages((prevMessages) => [...prevMessages, errorMessage])
        } finally {
            setIsGenerating(false)
        }
    }

    return {
        messages,
        isGenerating,
        currentSources,
        selectedSourceId,
        setSelectedSourceId,
        handleSendMessage,
    }
}
