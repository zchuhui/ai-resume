# AI 简历工具

一款基于 AI 的简历优化与生成工具。用户上传 PDF/Word 简历，填写目标岗位与优化需求，AI 自动完成简历内容结构化、岗位匹配优化、模板渲染，并导出 PDF/Word 文件。
![首页](files/1.png) 

## 项目结构

```
ai-resume/
├── web/                    # 前端 Vite + React + TypeScript
├── api/                    # 后端 Express + TypeScript
├── docs/
│   ├── design.md           # 设计规范
│   └── architecture.md     # 技术方案
├── design.md               # 设计文档（根目录副本）
├── architecture.md         # 技术方案文档（根目录副本）
└── readme.md               # 本文件
```

## 快速启动

### 前端

```bash
cd web
cp .env.example .env
npm install
npm run dev
```

前端默认运行在 http://localhost:5173

### 后端

```bash
cd api
cp .env.example .env
npm install
npm run dev
```

后端默认运行在 http://localhost:3001

## 环境变量

### 前端 `.env`

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### 后端 `.env`

```env
PORT=3001
AI_API_KEY=your_api_key
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
ALLOWED_ORIGINS=http://localhost:5173
RATE_LIMIT_MAX=10
RATE_LIMIT_WINDOW_MS=3600000
```

## 技术栈

- **前端**：Vite 5 + React 18 + TypeScript 5 + Tailwind CSS 3.4.17 + shadcn/ui + Zustand
- **后端**：Express 4 + TypeScript 5 + pdf-parse + mammoth + docx + @react-pdf/renderer + Zod
- **AI**：OpenAI SDK 兼容接口（支持 OpenAI / DeepSeek / Claude / 通义千问等）

## 核心流程

1. 上传 PDF/Word 简历 → `/api/upload`
2. AI 结构化解析 → `/api/parse-structure`
3. AI 按岗位 JD 优化 → `/api/optimize`
4. 选择模板 → 预览页
5. 导出 PDF/Word → `/api/export`

## 界面预览

| 首页 | 模板选择 |
|------|----------|
| ![首页](files/1.png) | ![模板选择](files/2.png) |

| 功能介绍与模板展示 | 上传简历 |
|------------------|----------|
| ![功能介绍与模板展示](files/3.png) | ![上传简历](files/4.png) |

## 设计文档

- `design.md`：UI/UX 设计规范、色彩系统、字体系统、页面设计、模板设计
- `architecture.md`：系统架构、API 设计、数据模型、AI 流程、部署方案

## CloudBase 部署

### 部署地址

| 服务 | 地址 |
|------|------|
| **前端（静态托管）** | [https://ai-native-d8ghthch055daacb6-1255315040.tcloudbaseapp.com/](https://ai-native-d8ghthch055daacb6-1255315040.tcloudbaseapp.com/?t=20260619) |
| **后端 API（CloudRun）** | [https://ai-resume-api-4027063-1255315040.ap-shanghai.run.tcloudbase.com](https://ai-resume-api-4027063-1255315040.ap-shanghai.run.tcloudbase.com) |

### CloudBase 资源

| 资源 | 名称/ID |
|------|---------|
| 环境 ID | `ai-native-d8ghthch055daacb6` |
| 环境别名 | `ai-native` |
| 区域 | `ap-shanghai` |
| CloudRun 服务 | `ai-resume-api` (容器模式, 0.5C/1G, MinNum=1) |
| 静态托管域名 | `ai-native-d8ghthch055daacb6-1255315040.tcloudbaseapp.com` |

### 后端环境变量

部署时需要配置以下环境变量（通过 CloudRun 环境变量设置）：

- `AI_API_KEY`：AI API Key（需替换为实际值）
- `AI_BASE_URL`：AI API 地址
- `AI_MODEL`：模型名称
- `ALLOWED_ORIGINS`：允许的跨域来源
- `RATE_LIMIT_MAX`：限流最大值
- `RATE_LIMIT_WINDOW_MS`：限流窗口（毫秒）

### 控制台链接

- [环境概览](https://tcb.cloud.tencent.com/dev?envId=ai-native-d8ghthch055daacb6#/overview)
- [CloudRun 服务](https://tcb.cloud.tencent.com/dev?envId=ai-native-d8ghthch055daacb6#/platform-run)
- [静态托管](https://tcb.cloud.tencent.com/dev?envId=ai-native-d8ghthch055daacb6#/static-hosting)

## 开发计划

详见 `.codebuddy/plans/ai-resume-builder-v3.md`
