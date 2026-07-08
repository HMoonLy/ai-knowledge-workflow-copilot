import { useState } from 'react'
import { sendChatMessageStream } from '../lib/api'
import type { ChatMessage, Source } from '../type'

export function useChatSession(selectedKbId: number | null) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [currentSources, setCurrentSources] = useState<Source[]>([])
    const [selectedSourceId, setSelectedSourceId] = useState<number | null>(null)

    async function handleSendMessage(content: string) {
        if (!content.trim() || selectedKbId === null) return

        const userMessageId = Date.now()
        const aiMessageId = userMessageId + 1

        const userMessage: ChatMessage = {
            id: userMessageId,
            role: 'user',
            content,
        }

        const aiMessage: ChatMessage = {
            id: aiMessageId,
            role: 'assistant',
            content: '',
            sourceIds: [],
        }

        const history = messages.slice(-6).map((message) => ({
            role: message.role,
            content: message.content,
        }))

        setMessages((prevMessages) => [...prevMessages, userMessage, aiMessage])
        setCurrentSources([])
        setSelectedSourceId(null)
        setIsGenerating(true)

        try {
            await sendChatMessageStream({
                knowledgeBaseId: selectedKbId,
                question: content,
                history,
                onSources: (sources) => {
                    setCurrentSources(sources)
                    setSelectedSourceId(sources[0]?.id ?? null)
                    setMessages((prevMessages) => prevMessages.map((message) => {
                        if (message.id !== aiMessageId) return message

                        return {
                            ...message,
                            sourceIds: sources.map((source) => source.id),
                        }
                    }))
                },
                onText: (text) => {
                    setMessages((prevMessages) => prevMessages.map((message) => {
                        if (message.id !== aiMessageId) return message

                        return {
                            ...message,
                            content: message.content + text,
                        }
                    }))
                },
                onError: (messageText) => {
                    setMessages((prevMessages) => prevMessages.map((message) => {
                        if (message.id !== aiMessageId) return message

                        return {
                            ...message,
                            content: messageText,
                        }
                    }))
                },
            })
        } catch (error) {
            setMessages((prevMessages) => prevMessages.map((message) => {
                if (message.id !== aiMessageId) return message

                return {
                    ...message,
                    content: '\u62b1\u6b49\uff0c\u83b7\u53d6\u56de\u7b54\u65f6\u51fa\u9519\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002',
                }
            }))
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
