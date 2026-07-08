import TopBar from '../components/TopBar'
import SourcePanel from '../components/SourcePanel'
import Sidebar from '../components/Sidebar'
import ChatPanel from '../components/ChatPanel'
import { useKnowledgeBases } from '../hooks/useKnowledgeBases'
import { useChatSession } from '../hooks/useChatSession'
import { useDocumentUpload } from '../hooks/useDocumentUpload'
import { useDocuments } from '../hooks/useDocuments'

function WorkspacePage() {
    const {
        knowledgeBases,
        selectedKbId,
        selectedKnowledgeBase,
        isLoading,
        errorMessage,
        setSelectedKbId,
        reloadKnowledgeBases,
        handleCreateKnowledgeBase,
    } = useKnowledgeBases()

    const {
        messages,
        isGenerating,
        currentSources,
        selectedSourceId,
        setSelectedSourceId,
        handleSendMessage,
    } = useChatSession(selectedKbId)

    const {
        isUploading,
        uploadResult,
        uploadError,
        handleUpload,
    } = useDocumentUpload()

    const {
        documents,
        isLoadingDocuments,
        documentsError,
        reloadDocuments,
        handleDeleteDocument,
        deletingDocumentId,
    } = useDocuments(selectedKbId)

    async function handleUploadDocument(file: File) {
        if (selectedKbId === null) return
        const result = await handleUpload(file, selectedKbId)
        if (result) {
            await reloadKnowledgeBases()
            await reloadDocuments()
        }
    }

    async function handleDeleteDocumentAndRefresh(documentId: number) {
        await handleDeleteDocument(documentId)
        await reloadKnowledgeBases()
    }

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-slate-100 text-slate-900">
            <TopBar />
            <main className="grid min-h-0 flex-1 grid-cols-[300px_minmax(0,1fr)_360px] gap-4 overflow-hidden p-4">
                <Sidebar
                    knowledgeBases={knowledgeBases}
                    selectedKbId={selectedKbId}
                    documents={documents}
                    isLoadingDocuments={isLoadingDocuments}
                    documentsError={documentsError}
                    isLoading={isLoading}
                    errorMessage={errorMessage}
                    isUploading={isUploading}
                    uploadResult={uploadResult}
                    uploadError={uploadError}
                    onUploadDocument={handleUploadDocument}
                    onSelectKnowledgeBase={(id) => setSelectedKbId(id)}
                    onCreateKnowledgeBase={handleCreateKnowledgeBase}
                    handleDeleteDocument={handleDeleteDocumentAndRefresh}
                    deletingDocumentId={deletingDocumentId}
                />
                <ChatPanel
                    selectedKnowledgeBase={selectedKnowledgeBase}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isGenerating={isGenerating}
                    onSelectSource={setSelectedSourceId}
                    canSend={selectedKbId !== null && !isLoading}
                    disabledReason={selectedKbId === null ? '请先选择知识库' : undefined}
                />
                <SourcePanel
                    sources={currentSources}
                    selectedSourceId={selectedSourceId}
                    onSelectSource={setSelectedSourceId}
                />
            </main>
        </div>
    )
}

export default WorkspacePage
