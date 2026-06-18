import type { Resume } from '@/types/resume'

export const defaultResume: Resume = {
  basicInfo: {
    name: '张 三',
    title: '高级前端工程师',
    email: 'zhangsan@example.com',
    phone: '138-0000-0000',
    location: '北京市朝阳区',
    website: 'zhangsan.dev',
    github: 'github.com/zhangsan',
    linkedin: 'linkedin.com/in/zhangsan',
  },
  summary:
    '5 年前端开发经验，专注于 React 生态与高性能 Web 应用。擅长组件化设计、工程化建设和跨团队协作，有带领 3 人小组完成百万级用户产品的经验。',
  education: [
    {
      school: '北京大学',
      degree: '本科',
      field: '计算机科学与技术',
      startDate: '2014-09',
      endDate: '2018-06',
    },
  ],
  experience: [
    {
      company: '某互联网科技公司',
      position: '高级前端工程师',
      startDate: '2021-03',
      endDate: '至今',
      location: '北京',
      description: [
        '主导公司核心 SaaS 平台前端架构升级，将首屏加载时间从 3.2s 降至 1.1s',
        '设计并实现可复用的组件库，覆盖 30+ 业务场景，提升团队开发效率 40%',
        '推动前端工程化落地，建立 CI/CD 流水线与自动化测试体系',
      ],
    },
    {
      company: '某电商平台',
      position: '前端工程师',
      startDate: '2018-07',
      endDate: '2021-02',
      location: '上海',
      description: [
        '负责移动端 H5 活动页开发，支持千万级并发活动，页面崩溃率低于 0.1%',
        '参与小程序与 App 内嵌页方案选型，沉淀技术文档 20+ 篇',
        '优化商品详情页渲染性能，用户停留时长提升 15%',
      ],
    },
  ],
  projects: [
    {
      name: '智能客服系统',
      role: '前端负责人',
      startDate: '2022-06',
      endDate: '2023-03',
      description: [
        '使用 React + TypeScript + WebSocket 实现实时对话界面',
        '设计消息渲染引擎，支持文本、卡片、表单等 10+ 消息类型',
      ],
    },
  ],
  skills: [
    'React',
    'TypeScript',
    'Next.js',
    'Tailwind CSS',
    'Node.js',
    'Webpack',
    'Git',
    'Figma',
  ],
  certifications: [
    { name: 'AWS Certified Developer', issuer: 'Amazon', date: '2022-08' },
  ],
  languages: [
    { language: '中文', proficiency: '母语' },
    { language: '英语', proficiency: '流利' },
  ],
}
