function TopBar() {
    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-6 shadow-sm backdrop-blur">
            <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-blue-600">AI Knowledge</p>
                <h1 className="text-lg font-semibold text-slate-950">Workflow Copilot</h1>
            </div>

            <div className="flex items-center gap-3">
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                    模型：DeepSeek
                </span>
                <button
                    type="button"
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-300 hover:text-blue-700"
                >
                    设置
                </button>
            </div>
        </header>
    )
}

export default TopBar
