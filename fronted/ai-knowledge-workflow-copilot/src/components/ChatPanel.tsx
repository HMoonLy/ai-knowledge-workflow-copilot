import { useEffect, useRef, useState } from 'react'
import type { ChatMessage, KnowledgeBase } from '../type'

type ChatPanelProps = {
    messages: ChatMessage[]
    selectedKnowledgeBase?: KnowledgeBase
    onSendMessage: (content: string) => void
    isGenerating: boolean
    onSelectSource: (id: number) => void
    canSend: boolean
    disabledReason?: string
}

function ChatPanel({
    selectedKnowledgeBase,
    messages,
    onSendMessage,
    isGenerating,
    onSelectSource,
    canSend,
    disabledReason,
}: ChatPanelProps) {
    const [inputValue, setInputValue] = useState('')
    const messageEndRef = useRef<HTMLDivElement | null>(null)

    function handleSubmit() {
        if (!inputValue.trim()) return
        if (!canSend) return
        onSendMessage(inputValue)
        setInputValue('')
    }

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({
            behavior: 'auto',
            block: 'end',
        })
    }, [messages, isGenerating])

    return (
        <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="shrink-0 border-b border-slate-100 px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Knowledge Q&A</p>
                <div className="mt-1 flex items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-slate-950">
                        {selectedKnowledgeBase?.name ?? '请选择知识库'}
                    </h2>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                        多轮问答 · 引用溯源
                    </span>
                </div>
            </div>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-slate-50/70 px-6 py-6">
                {messages.map((message) => {
                    const isUser = message.role === 'user'

                    return (
                        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`} key={message.id}>
                            <div className={`max-w-[78%] rounded-3xl px-5 py-4 shadow-sm ${isUser
                                ? 'rounded-br-lg bg-blue-600 text-white'
                                : 'rounded-bl-lg border border-slate-100 bg-white text-slate-800'
                                }`}>
                                <div className={`mb-2 text-xs font-semibold ${isUser ? 'text-blue-100' : 'text-slate-500'}`}>
                                    {isUser ? '你' : 'AI'}
                                </div>
                                {!isUser && isGenerating && !message.content ? (
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></span>
                                        正在生成回答...
                                    </div>
                                ) : (
                                    <p className="whitespace-pre-wrap text-sm leading-7">{message.content}</p>
                                )}
                                {message.sourceIds && message.sourceIds.length > 0 && (
                                    <button
                                        className="mt-4 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                                        type="button"
                                        onClick={() => {
                                            if (message.sourceIds?.[0]) {
                                                onSelectSource(message.sourceIds[0])
                                            }
                                        }}
                                    >
                                        引用 {message.sourceIds.length} 条
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}

                <div ref={messageEndRef}></div>
            </div>

            <div className="shrink-0 border-t border-slate-100 bg-white p-5">
                <div className="flex items-end gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-2 shadow-inner focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50">
                    <textarea
                        className="min-h-12 max-h-36 flex-1 resize-none bg-transparent px-3 py-3 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
                        value={inputValue}
                        onChange={(event) => { setInputValue(event.target.value) }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' && !event.shiftKey) {
                                event.preventDefault()
                                handleSubmit()
                            }
                        }}
                        placeholder={disabledReason ?? '输入问题，Enter 发送，Shift + Enter 换行'}
                        disabled={isGenerating}
                        rows={1}
                    />
                    <button
                        className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        type="button"
                        onClick={handleSubmit}
                        disabled={isGenerating || !canSend}
                    >
                        {isGenerating ? '生成中' : '发送'}
                    </button>
                </div>
            </div>
        </section>
    )
}

export default ChatPanel
