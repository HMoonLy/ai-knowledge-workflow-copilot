  export type KnowledgeBase = {
    id: number
    name: string
    documentCount: number
  }

  export type ChatMessage = {
    id: number
    role: 'user' | 'assistant'
    content: string
    sourceIds?: number[]
  }

  export type Source = {
    id: number
    title: string
    excerpt: string
  }

  export type DocumentUploadResult={
    id:number
    filename:string
    contentType:string
    size:number
    status:string
  }

  export type Document={
    id:number
    filename:string
    contentType:string
    size:number
  }

  export type CreateKnowledgeBaseApiResponse = {
      id: number
      name: string
      document_count: number
  }