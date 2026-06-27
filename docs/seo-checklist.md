# SEO 上线与站外提交清单

站点：`https://resume.dolfi.chat`
Sitemap：`https://resume.dolfi.chat/sitemap.xml`
Robots：`https://resume.dolfi.chat/robots.txt`

代码侧（P0–P2）已完成：构建期预渲染（vite-react-ssg）、每个路由独立 title/description/canonical/OG、JSON-LD（SoftwareApplication / ItemList / BreadcrumbList / FAQPage）、模板详情页、FAQ 页、自动 sitemap。下面是**需要人工操作**的站外与监测部分。

---

## 0. 部署后自检（每次发布先做）

- [ ] 访问 `https://resume.dolfi.chat/sitemap.xml`、`/robots.txt` 能正常打开。
- [ ] 直接访问子路由（如 `/templates/minimalist`、`/faq`）能直出内容，不是空白后再加载。
  - 用 `curl -s https://resume.dolfi.chat/faq | grep '<title'` 应能看到该页专属标题。
- [ ] 静态托管配置「未知路径回退到 index.html」：catch-all 路由不会被预渲染，乱输 URL 不能直接 404。
  - CloudBase 静态托管：在「错误页/重定向」里把 404 指向 `/index.html`。
- [ ] 用浏览器「查看网页源代码」（不是 Elements）确认 `<title>`、`<meta name="description">`、`og:*` 在源码里就存在。

## 1. Google Search Console（海外/Google）

1. [ ] 打开 https://search.google.com/search-console ，添加资源，选「网址前缀」`https://resume.dolfi.chat`。
2. [ ] 用 HTML 标签或 DNS TXT 验证所有权（HTML 标签法：把给的 `<meta>` 放进 `web/index.html` 的 `<head>`）。
3. [ ] 「站点地图」里提交 `sitemap.xml`。
4. [ ] 用「网址检查」分别测 `/`、`/templates`、`/templates/minimalist`、`/faq`，点「请求编入索引」。
5. [ ] 「富媒体结果测试」https://search.google.com/test/rich-results 测 `/faq`（应识别 FAQ）和模板页（应识别面包屑）。

## 2. 百度站长平台（国内主战场）

> 百度基本不执行 JS，本项目已做预渲染，可正常抓取。建议优先做。

1. [ ] 打开 https://ziyuan.baidu.com ，添加网站 `https://resume.dolfi.chat`，完成验证（文件验证或 HTML 标签）。
2. [ ] 「数据引入 → 链接提交 → sitemap」提交 `https://resume.dolfi.chat/sitemap.xml`。
3. [ ] 配置「主动推送（实时）」：拿到推送接口 token，把新增/更新的 URL 通过接口推送。示例：
   ```bash
   curl -H 'Content-Type:text/plain' --data-binary @urls.txt \
     "http://data.zz.baidu.com/urls?site=https://resume.dolfi.chat&token=你的TOKEN"
   ```
   `urls.txt` 每行一个 URL（可由 sitemap.xml 提取 `<loc>`）。可挂到部署流水线里发布后自动推。
4. [ ] 移动适配、抓取诊断各跑一次，确认抓取正常。

## 3. ICP 备案（强烈建议）

- [ ] `resume.dolfi.chat` 若面向国内用户，备案后百度收录与排序会明显更顺，国内访问也更稳。
- [ ] 在服务器/域名所在云厂商（腾讯云）提交备案；CloudBase 部署通常需要主体备案 + 网站备案。

## 4. Bing / 必应（可选）

- [ ] https://www.bing.com/webmasters 添加站点并提交 sitemap（可从 GSC 一键导入）。国内必应也有一定流量。

## 5. 社交分享卡片验证

- [ ] 微信：把任一页面链接发到微信对话，确认有标题、描述（OG 已在预渲染 HTML 中，无需 JS）。
- [ ] 如需大图卡片，补一张 `og:image`（当前未配，见下方待办）。

---

## 仍可优化（后续）

- [ ] **og:image**：每页加一张社交分享大图（首页/模板页可用模板预览图），提升点击率。
- [ ] **首屏性能（Core Web Vitals）**：`web/src/main.tsx` eager 引入约 25 个字体 CSS，主包偏大，拖累 LCP。建议把简历预览专用字体按路由懒加载，之后再开启 `ssgOptions.beastiesOptions` 关键 CSS 内联。
- [ ] **更多内容页**：除 FAQ 外，增加「简历怎么写」「应届生简历模板」「ATS 简历优化指南」等指南页，承接高搜索量长尾词。
- [ ] **监测**：上线 2–4 周后在 GSC / 百度站长看收录数、曝光、点击，针对性补内容。
