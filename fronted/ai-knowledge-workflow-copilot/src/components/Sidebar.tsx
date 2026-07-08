import { useState } from 'react'
import type { Document, DocumentUploadResult, KnowledgeBase } from '../type'
import DeleteConfirmDialog from './DeleteConfirmDialog'

type SidebarProps = {
  knowledgeBases: KnowledgeBase[]
  selectedKbId: number | null
  documents: Document[]
  isLoadingDocuments: boolean
  documentsError: string
  isLoading: boolean
  errorMessage: string
  isUploading: boolean
  uploadResult: DocumentUploadResult | null
  uploadError: string | null
  onUploadDocument: (file: File) => void
  onSelectKnowledgeBase: (id: number) => void
  handleDeleteDocument: (documentId: number) => void
  deletingDocumentId: number | null
  onCreateKnowledgeBase: (name: string) => void
}

function Sidebar({
  knowledgeBases,
  selectedKbId,
  documents,
  isLoadingDocuments,
  documentsError,
  isLoading,
  errorMessage,
  onSelectKnowledgeBase,
  isUploading,
  uploadResult,
  uploadError,
  onUploadDocument,
  handleDeleteDocument,
  deletingDocumentId,
  onCreateKnowledgeBase,
}: SidebarProps) {
  const [newKbName, setNewKbName] = useState('')

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Workspace</p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">知识库</h2>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {knowledgeBases.length} 个库
          </span>
        </div>

        <div className="flex gap-2">
          <input
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
            value={newKbName}
            placeholder="新建知识库"
            onChange={(event) => setNewKbName(event.target.value)}
          />
          <button
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            type="button"
            disabled={!newKbName.trim()}
            onClick={() => {
              onCreateKnowledgeBase(newKbName)
              setNewKbName('')
            }}
          >
            新建
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">知识库列表</h3>
            {isLoading && <span className="text-xs text-slate-400">加载中</span>}
          </div>

          {errorMessage && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">{errorMessage}</p>}
          {!isLoading && !errorMessage && knowledgeBases.length === 0 && (
            <p className="rounded-xl bg-slate-50 px-3 py-4 text-center text-sm text-slate-500">暂无知识库</p>
          )}

          <div className="space-y-2">
            {!isLoading && !errorMessage && knowledgeBases.map((kb) => (
              <button
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${selectedKbId === kb.id
                  ? 'border-blue-200 bg-blue-50 shadow-sm'
                  : 'border-transparent bg-slate-50 hover:border-slate-200 hover:bg-white'
                  }`}
                key={kb.id}
                type="button"
                onClick={() => onSelectKnowledgeBase(kb.id)}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`font-semibold ${selectedKbId === kb.id ? 'text-blue-700' : 'text-slate-800'}`}>{kb.name}</span>
                  <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-500 shadow-sm">
                    {kb.documentCount} 文档
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl bg-white px-4 py-5 text-center shadow-sm transition hover:shadow-md">
            <span className="text-sm font-semibold text-slate-900">{isUploading ? '上传中...' : '上传文档'}</span>
            <span className="mt-1 text-xs text-slate-500">支持 .md / .txt / .pdf / .docx</span>
            <input
              type="file"
              accept=".pdf,.docx,.txt,.md"
              hidden
              disabled={isUploading}
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (!file) return
                onUploadDocument(file)
                event.target.value = ''
              }}
            />
          </label>

          {uploadResult && <p className="mt-3 text-xs text-emerald-600">已上传：{uploadResult.filename}</p>}
          {uploadError && <p className="mt-3 text-xs text-rose-600">{uploadError}</p>}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">最近文档</h3>
            {isLoadingDocuments && <span className="text-xs text-slate-400">加载中</span>}
          </div>

          {documentsError && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">{documentsError}</p>}
          {!isLoadingDocuments && !documentsError && documents.length === 0 && (
            <p className="rounded-xl bg-slate-50 px-3 py-4 text-center text-sm text-slate-500">当前知识库暂无文档</p>
          )}

          <div className="space-y-3">
            {!isLoadingDocuments && !documentsError && documents.map((document) => (
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm" key={document.id}>
                <h4 className="line-clamp-2 text-sm font-semibold text-slate-900">{document.filename}</h4>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-slate-500">{Math.ceil(document.size / 1024)} KB</p>
                  <DeleteConfirmDialog
                    filename={document.filename}
                    isDeleting={document.id === deletingDocumentId}
                    disabled={document.id === deletingDocumentId}
                    onConfirm={() => handleDeleteDocument(document.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </aside>
  )
}

export default Sidebar
