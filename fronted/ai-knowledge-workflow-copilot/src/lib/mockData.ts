  import type { ChatMessage, KnowledgeBase, Source } from '../type'

  export const knowledgeBases: KnowledgeBase[] = [
    { id: 1, name: '产品文档', documentCount: 12 },
    { id: 2, name: '学习资料', documentCount: 8 },
  ]

  export const initialMessages: ChatMessage[] = [
    { id: 1, role: 'user', content: '这个知识库主要讲了什么？' },
    { id: 2, role: 'assistant', content: '它主要包含产品说明、技术方案和项目规划资料。' },
  ]

  export const sources: Source[] = [
    { id: 1, title: '产品需求文档.pdf', excerpt: '系统需要支持文档上传、语义检索和引用溯源。' },
    { id: 2, title: 'AI 工作流设计.md', excerpt: '工作流由检索、总结、生成报告等节点组成。' },
  ]