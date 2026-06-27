# ResumeCraft Web

ResumeCraft 前端应用，负责简历上传流程、模板预览、导出入口，以及公开 SEO 页面。项目基于 Vite、React、TypeScript 和 `vite-react-ssg`，公开页面支持静态生成，应用流程页保持客户端交互体验。

## 核心能力

- 多页路由：首页、模板库、模板详情、上传、预览、下载、AI 优化页、FAQ、简历指南。
- 模板详情页可跳转到 `/upload?template=模板ID`，上传页会默认套用来源模板。
- 上传页支持真实文件解析，也支持“使用示例简历体验”快速进入预览。
- SEO 页面支持独立标题、描述、Canonical、Open Graph 和结构化数据。
- `/admin` 简易后台可查看匿名访问、模板转化、解析优化、导出和错误事件。
- 构建后自动生成 `sitemap.xml` 和 `robots.txt`。

## 常用命令

```bash
npm install
npm run dev
npm run build
npm run lint
```

开发服务默认使用 `vite-react-ssg dev`。如果端口被占用，Vite 会自动切换到可用端口。

## 环境变量

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_SITE_URL=https://resume.dolfi.chat
```

`VITE_API_BASE_URL` 用于调用后端 API。`VITE_SITE_URL` 用于 canonical、OG URL、robots 和 sitemap 生成。

后台账号密码在后端环境变量里配置：

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=请换成强密码
```

部署后访问 `/admin`，输入这组账号密码查看统计。

## 目录说明

```text
src/
├── components/       # 导航、SEO、上传、模板卡片等通用组件
├── lib/              # API、状态、模板配置、FAQ 与指南数据
├── pages/            # 页面级组件
├── routes.tsx        # SSG 路由配置
└── types/            # 简历数据结构类型
```

## SEO 内容维护

- 模板元数据维护在 `src/lib/template-config.ts`。
- 简历指南维护在 `src/lib/guides.ts`，新增指南后路由和 sitemap 会自动覆盖。
- FAQ 内容维护在 `src/lib/faq.ts`。
- `npm run build` 会执行类型检查、SSG 构建和 sitemap 生成。
- 如需单独刷新 sitemap，运行 `npm run seo:sitemap`。
