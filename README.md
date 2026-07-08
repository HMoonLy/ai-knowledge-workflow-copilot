# AI Knowledge Workflow Copilot

一个面向个人知识库的 AI 问答系统。用户可以创建知识库、上传文档，并基于文档内容向 AI 提问。系统会先检索相关文档片段，再调用 DeepSeek 生成回答，同时展示引用来源。

## 项目亮点

- **知识库管理**：支持创建多个知识库，并统计每个知识库下的文档数量。
- **文档上传解析**：支持 `.txt`、`.md`、`.pdf`、`.docx` 文档上传与文本抽取。
- **RAG 问答流程**：根据用户问题检索相关文档内容，再把上下文发送给 DeepSeek 生成回答。
- **多轮对话**：前端保留最近对话历史，后端组合历史问题与文档上下文生成回答。
- **来源引用**：回答时返回相关文档来源，方便用户追溯答案依据。
- **本地持久化**：知识库和文档数据使用 JSON 文件保存，便于快速演示和部署 MVP。
- **现代化 UI**：React + Tailwind CSS 实现三栏工作台布局，文档删除使用组件化确认弹窗。

## 技术栈

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Radix UI Alert Dialog

### Backend

- Python
- FastAPI
- Pydantic
- OpenAI SDK
- DeepSeek API
- pypdf
- python-docx

## 项目结构

```text
AI Knowledge/
├── backend/
│   ├── routers/                 # API 路由
│   ├── services/                # 业务逻辑
│   ├── main.py                  # FastAPI 入口
│   ├── schemas.py               # 数据模型
│   ├── requirements.txt         # 后端依赖
│   └── .env.example             # 后端环境变量示例
├── fronted/
│   └── ai-knowledge-workflow-copilot/
│       ├── src/
│       │   ├── components/      # 页面组件
│       │   ├── hooks/           # 业务 hooks
│       │   ├── lib/             # API 请求封装
│       │   └── pages/           # 页面入口
│       ├── package.json
│       └── .env.example         # 前端环境变量示例
└── .gitignore
```

## 核心功能

### 1. 知识库

- 创建知识库
- 切换当前知识库
- 展示知识库文档数量

### 2. 文档管理

- 上传文档
- 自动解析文档内容
- 查看当前知识库文档列表
- 删除文档并同步刷新文档数量

### 3. AI 问答

- 基于当前知识库提问
- 自动检索相关文档内容
- 结合历史对话生成回答
- 展示答案来源文档

## 本地运行

### 1. 启动后端

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

设置 DeepSeek API Key：

```bash
# Windows PowerShell
$env:DEEPSEEK_API_KEY="your_deepseek_api_key_here"
```

启动服务：

```bash
uvicorn main:app --reload
```

后端默认运行在：

```text
http://127.0.0.1:8000
```

健康检查：

```text
http://127.0.0.1:8000/health
```

### 2. 启动前端

```bash
cd fronted/ai-knowledge-workflow-copilot
npm install
```

创建 `.env`：

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
```

启动前端：

```bash
npm run dev
```

前端默认运行在：

```text
http://localhost:5173
```

## 环境变量

### Backend

| 变量名 | 说明 |
| --- | --- |
| `DEEPSEEK_API_KEY` | DeepSeek API Key |

### Frontend

| 变量名 | 说明 |
| --- | --- |
| `VITE_API_BASE_URL` | 后端 API 地址 |

## API 简览

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/health` | 健康检查 |
| `GET` | `/api/knowledge-bases` | 获取知识库列表 |
| `POST` | `/api/knowledge-bases` | 创建知识库 |
| `GET` | `/api/knowledge-bases/{knowledge_base_id}/documents` | 获取知识库文档列表 |
| `POST` | `/api/documents/upload` | 上传文档 |
| `DELETE` | `/api/documents/{knowledge_base_id}/{document_id}` | 删除文档 |
| `POST` | `/api/chat` | 基于知识库问答 |

## 构建

前端生产构建：

```bash
cd fronted/ai-knowledge-workflow-copilot
npm run build
```

## 部署建议

- 前端：Vercel / Netlify
- 后端：Render / Railway / Fly.io
- 后端部署时需要配置环境变量 `DEEPSEEK_API_KEY`
- 前端部署时需要配置环境变量 `VITE_API_BASE_URL` 为线上后端地址

## 简历描述参考

> 开发 AI Knowledge Workflow Copilot，一个基于 React + FastAPI + DeepSeek 的个人知识库问答系统。项目支持多知识库管理、文档上传解析、基于文档内容的 RAG 问答、多轮对话历史和答案来源追溯。前端使用 React、TypeScript、Tailwind CSS 构建工作台式交互界面，后端使用 FastAPI 封装知识库、文档管理和 AI 问答 API，并通过 OpenAI SDK 接入 DeepSeek 模型。

## 注意事项

- 不要把真实 API Key 提交到 GitHub。
- `backend/uploads/`、`backend/documents.json`、`backend/knowledge_bases.json` 是本地运行数据，已在 `.gitignore` 中忽略。
- 当前版本使用 JSON 文件做轻量持久化，适合作为 MVP 和在线演示。后续可以升级为 MySQL / PostgreSQL / SQLite。