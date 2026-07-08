import type { Source } from '../type'

type SourcePanelProps = {
    sources: Source[]
    selectedSourceId: number | null
    onSelectSource: (id: number) => void
}

function SourcePanel({
    sources,
    selectedSourceId,
    onSelectSource,
}: SourcePanelProps) {
    const selectedSource = sources.find((source) => source.id === selectedSourceId)

    return (
        <aside className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Sources</p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">引用来源</h2>

                {selectedSource && (
                    <div className="mt-4 rounded-2xl bg-blue-50 p-3 text-sm text-blue-800">
                        <p className="text-xs font-semibold text-blue-500">当前选中</p>
                        <p className="mt-1 line-clamp-2 font-medium">{selectedSource.title}</p>
                    </div>
                )}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
                {sources.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
                        <p className="text-sm font-medium text-slate-600">暂无引用</p>
                        <p className="mt-1 text-xs text-slate-400">提问后会展示命中的文档片段</p>
                    </div>
                )}

                <div className="space-y-3">
                    {sources.map((source) => (
                        <button
                            className={`w-full rounded-2xl border p-4 text-left transition ${selectedSourceId === source.id
                                ? 'border-blue-200 bg-blue-50 shadow-sm'
                                : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                                }`}
                            onClick={() => onSelectSource(source.id)}
                            key={source.id}
                            type="button"
                        >
                            <div className="mb-2 flex items-center gap-2">
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">DOC</span>
                                <h4 className="line-clamp-1 text-sm font-semibold text-slate-900">{source.title}</h4>
                            </div>
                            <p className="line-clamp-6 text-sm leading-6 text-slate-600">{source.excerpt}</p>
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    )
}

export default SourcePanel
