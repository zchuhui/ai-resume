import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// 引入以激活 vite-react-ssg 对 Vite UserConfig 的 `ssgOptions` 类型增强。
import type { ViteReactSSGOptions } from 'vite-react-ssg'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    port: 8000,
  },
  ssgOptions: {
    // 每个路由输出 /route/index.html，便于静态托管直接按目录解析干净 URL。
    dirStyle: 'nested',
    // 关闭关键 CSS 内联（beasties）：自托管字体 CSS 体量大，先保证构建稳定，后续再单独优化首屏。
    beastiesOptions: false,
  } satisfies ViteReactSSGOptions,
})
