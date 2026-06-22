import type { Resume, TemplateStyle } from '@/types/resume'

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

function createResume(overrides: Partial<Resume> & { basicInfo: Resume['basicInfo'] }): Resume {
  return {
    ...defaultResume,
    ...overrides,
    basicInfo: {
      ...defaultResume.basicInfo,
      ...overrides.basicInfo,
    },
  }
}

export const templateDemoResumes: Record<TemplateStyle, Resume> = {
  minimalist: createResume({
    basicInfo: {
      name: '陈 予',
      title: '战略咨询顾问',
      email: 'chenyu@example.com',
      phone: '136-0000-1208',
      location: '上海',
      website: '',
      github: '',
      linkedin: 'linkedin.com/in/chenyu',
    },
    summary: '4 年战略咨询与行业研究经验，服务消费、制造与企业服务客户，擅长市场进入、增长诊断和经营模型搭建。',
    experience: [
      {
        company: '某管理咨询公司',
        position: '咨询顾问',
        startDate: '2021-07',
        endDate: '至今',
        location: '上海',
        description: [
          '参与 12+ 个战略与组织优化项目，覆盖消费品、先进制造与 SaaS 行业',
          '搭建市场规模测算与竞争格局模型，为客户年度增长规划提供决策依据',
          '组织高管访谈与一线调研，沉淀 30+ 页董事会汇报材料',
        ],
      },
    ],
    projects: [
      {
        name: '新消费品牌增长诊断',
        role: '项目核心成员',
        startDate: '2023-02',
        endDate: '2023-05',
        description: ['拆解渠道效率与产品组合，识别 3 个高优先级增长机会'],
      },
    ],
    skills: ['行业研究', '财务建模', '访谈调研', 'PowerPoint', 'Excel', '增长策略'],
  }),
  tech: defaultResume,
  elegant: createResume({
    basicInfo: {
      name: '周 雨',
      title: '品牌内容策划',
      email: 'zhouyu@example.com',
      phone: '135-0000-2210',
      location: '杭州',
      website: 'zhouyu.work',
      github: '',
      linkedin: '',
    },
    summary: '6 年品牌内容与整合营销经验，长期服务生活方式与消费品牌，擅长品牌叙事、内容栏目和活动传播。',
    experience: [
      {
        company: '某生活方式品牌',
        position: '品牌内容经理',
        startDate: '2020-05',
        endDate: '至今',
        location: '杭州',
        description: [
          '负责年度品牌内容策略，打造 4 个长期内容栏目，累计曝光 1800 万+',
          '统筹新品上市传播，联动小红书、公众号和线下活动完成整合触达',
          '搭建品牌语气与视觉规范，提升跨团队内容产出一致性',
        ],
      },
    ],
    projects: [
      {
        name: '城市生活节品牌项目',
        role: '内容负责人',
        startDate: '2023-09',
        endDate: '2023-11',
        description: ['策划主题叙事与达人内容矩阵，活动期新增会员 4.6 万'],
      },
    ],
    skills: ['品牌策略', '内容策划', '活动传播', '小红书运营', '文案写作', '项目统筹'],
  }),
  business: createResume({
    basicInfo: {
      name: '王 磊',
      title: '企业客户销售经理',
      email: 'wanglei@example.com',
      phone: '139-0000-8080',
      location: '深圳',
      website: '',
      github: '',
      linkedin: 'linkedin.com/in/wanglei',
    },
    summary: '7 年 B2B 软件销售经验，覆盖制造、零售与金融客户，擅长复杂商机推进、关键人管理和解决方案销售。',
    experience: [
      {
        company: '某企业服务软件公司',
        position: '大客户销售经理',
        startDate: '2019-04',
        endDate: '至今',
        location: '深圳',
        description: [
          '负责华南区域重点客户，年度回款连续 3 年超过目标 120%',
          '推进 6 个百万级复杂商机，协调售前、交付和生态伙伴完成落地',
          '沉淀行业解决方案话术，提升团队新客户转化效率',
        ],
      },
    ],
    projects: [
      {
        name: '大型零售集团 CRM 项目',
        role: '商务负责人',
        startDate: '2022-03',
        endDate: '2022-09',
        description: ['主导商机策略与高层沟通，实现 380 万年度合同签约'],
      },
    ],
    skills: ['大客户销售', '商务谈判', 'CRM', '解决方案销售', '渠道协同', '销售预测'],
  }),
  creative: createResume({
    basicInfo: {
      name: '林 可',
      title: 'UI/UX 设计师',
      email: 'linke@example.com',
      phone: '137-0000-3306',
      location: '广州',
      website: 'linke.design',
      github: '',
      linkedin: '',
    },
    summary: '5 年产品设计经验，关注 B 端复杂流程与移动端体验，擅长从调研、原型到设计系统的完整交付。',
    experience: [
      {
        company: '某协同办公产品',
        position: '高级 UI/UX 设计师',
        startDate: '2020-08',
        endDate: '至今',
        location: '广州',
        description: [
          '负责审批、权限和报表模块体验重构，核心流程完成率提升 23%',
          '搭建组件规范与设计资产库，覆盖 80+ 业务页面',
          '组织可用性测试，推动 15 项体验问题进入迭代计划',
        ],
      },
    ],
    projects: [
      {
        name: '企业工作台改版',
        role: '主设计师',
        startDate: '2023-01',
        endDate: '2023-04',
        description: ['重构信息架构与导航体验，新用户任务完成时长降低 31%'],
      },
    ],
    skills: ['Figma', '交互设计', '设计系统', '用户研究', '原型设计', '可用性测试'],
  }),
  academic: createResume({
    basicInfo: {
      name: '赵 明',
      title: '生物医学研究员',
      email: 'zhaoming@example.com',
      phone: '138-0000-0916',
      location: '南京',
      website: 'scholar.example.com/zhaoming',
      github: '',
      linkedin: '',
    },
    summary: '博士后研究员，研究方向为肿瘤免疫与单细胞组学，具备多组学数据分析和科研项目管理经验。',
    experience: [
      {
        company: '某重点实验室',
        position: '博士后研究员',
        startDate: '2021-09',
        endDate: '至今',
        location: '南京',
        description: [
          '主持省部级科研项目 1 项，参与国家自然科学基金项目 2 项',
          '建立单细胞测序分析流程，支撑 4 个课题组数据分析需求',
          '以第一作者发表 SCI 论文 3 篇，累计影响因子 28+',
        ],
      },
    ],
    projects: [
      {
        name: '肿瘤微环境免疫图谱研究',
        role: '课题负责人',
        startDate: '2022-01',
        endDate: '至今',
        description: ['整合单细胞转录组与空间转录组数据，识别关键免疫细胞亚群'],
      },
    ],
    skills: ['单细胞组学', 'R/Python', '科研写作', '项目申报', '流式分析', '统计建模'],
  }),
  cobalt: createResume({
    basicInfo: {
      name: '李 娜',
      title: '运营项目经理',
      email: 'lina@example.com',
      phone: '136-0000-6633',
      location: '成都',
      website: '',
      github: '',
      linkedin: 'linkedin.com/in/lina',
    },
    summary: '6 年互联网运营与项目管理经验，擅长跨部门推进、流程优化和经营数据分析，曾负责千万级用户活动落地。',
    experience: [
      {
        company: '某本地生活平台',
        position: '运营项目经理',
        startDate: '2020-06',
        endDate: '至今',
        location: '成都',
        description: [
          '统筹商家增长项目，推动月活商家数提升 32%',
          '建立活动复盘与数据看板机制，将跨部门沟通周期缩短 40%',
          '负责 20+ 城市运营节奏管理，保障重点活动准时上线',
        ],
      },
    ],
    projects: [
      {
        name: '城市商家增长专项',
        role: '项目负责人',
        startDate: '2023-03',
        endDate: '2023-08',
        description: ['设计分层运营策略，重点城市订单转化率提升 18%'],
      },
    ],
    skills: ['项目管理', '数据分析', '活动运营', 'SQL', '跨部门协作', '流程优化'],
  }),
  corporate: createResume({
    basicInfo: {
      name: '刘 洋',
      title: '国企综合管理岗',
      email: 'liuyang@example.com',
      phone: '138-0000-5678',
      location: '北京',
      website: '',
      github: '',
      linkedin: '',
    },
    summary: '具备行政综合、党建宣传与经营协调经验，熟悉国企公文流转、会议组织和跨部门协同工作。',
    experience: [
      {
        company: '某大型能源集团',
        position: '综合管理专员',
        startDate: '2019-07',
        endDate: '至今',
        location: '北京',
        description: [
          '负责部门年度重点工作台账管理，跟进 60+ 项任务节点闭环',
          '承办党委会、经营分析会等重要会议，完成纪要与督办事项跟踪',
          '参与制度修订与流程优化，提升公文审批效率和资料归档规范性',
        ],
      },
    ],
    projects: [
      {
        name: '年度重点任务督办机制建设',
        role: '执行统筹',
        startDate: '2022-02',
        endDate: '2022-12',
        description: ['建立任务分解、进度跟踪与月度通报机制，提升事项闭环率'],
      },
    ],
    skills: ['公文写作', '会议组织', '党建宣传', '督办管理', 'Excel', '制度流程'],
  }),
  compact: createResume({
    basicInfo: {
      name: '孙 亮',
      title: '应届数据分析师',
      email: 'sunliang@example.com',
      phone: '137-0000-4412',
      location: '武汉',
      website: '',
      github: 'github.com/sunliang',
      linkedin: '',
    },
    summary: '统计学硕士，应届求职数据分析岗位，熟悉 SQL、Python 与可视化分析，有用户增长和经营分析实习经验。',
    experience: [
      {
        company: '某电商公司',
        position: '数据分析实习生',
        startDate: '2023-07',
        endDate: '2023-12',
        location: '杭州',
        description: [
          '搭建用户分层看板，支持运营团队识别高价值用户群体',
          '使用 SQL 提取交易与行为数据，完成 8 份专题分析报告',
          '参与 A/B 测试结果分析，为活动页面优化提供数据依据',
        ],
      },
    ],
    projects: [
      {
        name: '校园二手交易数据分析',
        role: '项目负责人',
        startDate: '2023-03',
        endDate: '2023-05',
        description: ['清洗 10 万+ 条交易数据，构建价格预测与品类趋势分析模型'],
      },
    ],
    skills: ['SQL', 'Python', 'Tableau', '统计分析', 'A/B Test', 'Excel', 'Pandas'],
  }),
  finance: createResume({
    basicInfo: {
      name: '陈 静',
      title: '投资分析师',
      email: 'chenjing@example.com',
      phone: '139-0000-8852',
      location: '上海',
      website: '',
      github: '',
      linkedin: 'linkedin.com/in/chenjing',
    },
    summary: 'CFA 持证人，5 年买方投研经验，覆盖消费与科技板块，具备财务建模、行业深度研究与投资建议输出能力。',
    experience: [
      {
        company: '某公募基金管理公司',
        position: '投资分析师',
        startDate: '2021-06',
        endDate: '至今',
        location: '上海',
        description: [
          '覆盖 A 股消费板块 30+ 家上市公司，撰写深度研究报告 40+ 篇，推荐标的超额收益平均 +12%',
          '搭建 DCF 与可比公司估值模型，季度盈利预测偏差率控制在 3% 以内',
          '参与 3 只行业主题基金的研究支持，管理规模合计超 80 亿元',
        ],
      },
      {
        company: '某券商研究所',
        position: '研究助理',
        startDate: '2019-07',
        endDate: '2021-05',
        location: '北京',
        description: [
          '协助首席分析师完成行业周报与专题报告，覆盖消费电子与半导体赛道',
          '维护行业数据库与估值表，支持路演材料准备与客户专题交流',
        ],
      },
    ],
    education: [
      { school: '复旦大学', degree: '硕士', field: '金融学', startDate: '2017-09', endDate: '2019-06' },
      { school: '上海财经大学', degree: '本科', field: '会计学', startDate: '2013-09', endDate: '2017-06' },
    ],
    skills: ['财务建模', 'DCF', '行业研究', 'Bloomberg', 'Wind', 'Python', 'CFA'],
    certifications: [{ name: 'CFA', issuer: 'CFA Institute', date: '2021' }],
  }),
  warm: createResume({
    basicInfo: {
      name: '王 梅',
      title: 'HR 经理',
      email: 'wangmei@example.com',
      phone: '137-0000-3619',
      location: '杭州',
      website: '',
      github: '',
      linkedin: '',
    },
    summary: '8 年人力资源从业经验，专注招聘与员工关系，主导过从 50 人到 300 人的团队扩张，擅长企业文化落地与人才梯队建设。',
    experience: [
      {
        company: '某互联网教育公司',
        position: 'HR 经理',
        startDate: '2020-04',
        endDate: '至今',
        location: '杭州',
        description: [
          '统筹年度招聘计划，年入职 120+ 人，关键岗位填充周期从 45 天压缩至 28 天',
          '搭建职级体系与薪酬带宽，完成全员薪酬套改，员工满意度提升 22%',
          '设计新员工融入计划与导师制，6 个月留存率从 78% 提升至 92%',
        ],
      },
      {
        company: '某连锁零售企业',
        position: 'HR 主管',
        startDate: '2016-09',
        endDate: '2020-03',
        location: '南京',
        description: [
          '管理 3 人招聘团队，覆盖门店与总部职能岗，年交付 200+ offer',
          '组织季度员工满意度调研与改善行动，年度离职率从 28% 降至 18%',
        ],
      },
    ],
    education: [
      { school: '南京大学', degree: '本科', field: '人力资源管理', startDate: '2012-09', endDate: '2016-06' },
    ],
    skills: ['人才招聘', '薪酬设计', '员工关系', '组织发展', '培训体系', '数据分析'],
  }),
  editorial: createResume({
    basicInfo: {
      name: '林 悦',
      title: '品牌内容策划',
      email: 'linyue@example.com',
      phone: '186-0000-7734',
      location: '北京',
      website: 'linyue.portfoliobox.net',
      github: '',
      linkedin: 'linkedin.com/in/linyue',
    },
    summary: '品牌内容策略专家，7 年内容策划与品牌传播经验。擅长从 0 到 1 搭建品牌内容体系，曾策划 3 次全网曝光过亿的品牌战役。',
    experience: [
      {
        company: '某新消费品牌',
        position: '品牌内容总监',
        startDate: '2021-10',
        endDate: '至今',
        location: '北京',
        description: [
          '搭建品牌内容矩阵，覆盖公众号、小红书、B 站等 6 个渠道，全网粉丝从 5 万增长至 80 万',
          '策划「城市探索计划」品牌战役，全网曝光 1.2 亿，UGC 参与 12 万人次，直接带动 GMV 增长 35%',
          '建立品牌 Tone of Voice 指南与内容 SOP，管理 4 人内容团队与 8 家外部供应商',
        ],
      },
      {
        company: '某 4A 广告公司',
        position: '高级文案策划',
        startDate: '2017-06',
        endDate: '2021-09',
        location: '上海',
        description: [
          '服务快消、汽车与科技行业客户，主导品牌定位、TVC 脚本与整合营销方案',
          '为某国际汽车品牌撰写年度品牌主张，全渠道投放后品牌认知度提升 18%',
        ],
      },
    ],
    education: [
      { school: '中国传媒大学', degree: '硕士', field: '广告学', startDate: '2015-09', endDate: '2017-06' },
      { school: '武汉大学', degree: '本科', field: '新闻学', startDate: '2011-09', endDate: '2015-06' },
    ],
    skills: ['品牌策略', '内容策划', 'Campaign', '文案创作', '社交媒体', '视频脚本'],
  }),
  aurora: createResume({
    basicInfo: {
      name: '周 锐',
      title: '产品增长经理',
      email: 'zhourui@example.com',
      phone: '185-0000-4491',
      location: '深圳',
      website: 'zhourui.dev',
      github: 'github.com/zhourui',
      linkedin: 'linkedin.com/in/zhourui',
    },
    summary: '5 年互联网产品与增长经验，擅长数据驱动增长策略。曾主导 2 款 0-1 产品从种子期到 PMF，累计带来 300 万+ 用户增长。',
    experience: [
      {
        company: '某 SaaS 创业公司',
        position: '产品增长经理',
        startDate: '2022-03',
        endDate: '至今',
        location: '深圳',
        description: [
          '搭建增长实验体系，季度执行 20+ A/B 测试，核心转化率从 4.2% 提升至 8.7%',
          '设计病毒式邀请机制，上线 3 个月带来 15 万新增用户，获客成本降低 60%',
          '推动产品埋点与数据看板建设，实现从经验驱动到数据驱动的团队转型',
        ],
      },
      {
        company: '某中型互联网公司',
        position: '产品经理',
        startDate: '2019-06',
        endDate: '2022-02',
        location: '广州',
        description: [
          '负责 B 端 SaaS 产品 0-1 搭建，6 个月内完成 MVP 到付费版本的 4 次迭代',
          '管理 5 人产品小组，输出 PRD 80+ 份，推动产品 NPS 从 32 升至 58',
        ],
      },
    ],
    education: [
      { school: '中山大学', degree: '硕士', field: '工商管理', startDate: '2017-09', endDate: '2019-06' },
      { school: '华南理工大学', degree: '本科', field: '计算机科学', startDate: '2013-09', endDate: '2017-06' },
    ],
    skills: ['A/B 测试', '用户增长', '数据分析', 'SQL', 'Figma', 'Notion', 'Amplitude'],
  }),
  portfolio: createResume({
    basicInfo: {
      name: '赵 然',
      title: '产品设计师',
      email: 'zhaoran@example.com',
      phone: '177-0000-6628',
      location: '杭州',
      website: 'zhaoran.design',
      github: 'github.com/zhaoran',
      linkedin: '',
    },
    summary: '6 年产品设计经验，专注 B 端与消费级产品的设计系统搭建。曾主导 3 套设计语言落地，作品入选 Dribbble 年度推荐。',
    experience: [
      {
        company: '某电商平台',
        position: '高级产品设计师',
        startDate: '2021-03',
        endDate: '至今',
        location: '杭州',
        description: [
          '主导设计系统 2.0 重构，建立 60+ 组件库与设计 Token 体系，开发效率提升 40%',
          '负责核心交易链路改版，转化漏斗优化后下单转化率提升 18%，GMV 贡献 +25%',
          '推动设计评审流程与 Figma 插件体系，设计交付周期从 5 天缩短至 2 天',
        ],
      },
      {
        company: '某设计咨询公司',
        position: 'UI/UX 设计师',
        startDate: '2018-05',
        endDate: '2021-02',
        location: '上海',
        description: [
          '服务金融、教育、医疗行业客户，主导 10+ 产品的体验设计从调研到交付',
          '为某银行 App 完成适老化改造，通过 WCAG 2.1 AA 级认证，老年用户留存提升 35%',
        ],
      },
    ],
    education: [
      { school: '中国美术学院', degree: '硕士', field: '设计学', startDate: '2015-09', endDate: '2018-06' },
      { school: '江南大学', degree: '本科', field: '工业设计', startDate: '2011-09', endDate: '2015-06' },
    ],
    skills: ['Figma', 'Design System', '用户研究', '原型设计', 'WCAG', 'Framer', 'Illustrator'],
  }),
  noir: createResume({
    basicInfo: {
      name: '沈 墨',
      title: '私人银行顾问',
      email: 'shenmo@example.com',
      phone: '138-0000-9901',
      location: '上海',
      website: '',
      github: '',
      linkedin: 'linkedin.com/in/shenmo',
    },
    summary: '10 年私人银行与财富管理经验，CFA + CFP 双持证。管理客户资产规模超 20 亿元，专注高净值客户资产配置与家族传承规划。',
    experience: [
      {
        company: '某国际私人银行',
        position: '高级私人银行顾问',
        startDate: '2019-01',
        endDate: '至今',
        location: '上海',
        description: [
          '服务 40+ 超高净值客户（户均 AUM 5,000 万+），年度资产管理规模增长 35%',
          '设计跨境资产配置与家族信托方案，协助 12 组家族完成财富传承架构搭建',
          '主导另类投资产品引入（PE/VC/对冲基金），相关配置占比从 8% 提升至 22%',
        ],
      },
      {
        company: '某股份制银行私人银行部',
        position: '私人银行客户经理',
        startDate: '2016-06',
        endDate: '2018-12',
        location: '北京',
        description: [
          '拓展并维护高净值客户 60+ 户，AUM 净增 8 亿元，年度中收达成率 130%',
          '协同投行、信托、保险团队为客户提供综合金融解决方案',
        ],
      },
    ],
    education: [
      { school: '北京大学', degree: '硕士', field: '金融学', startDate: '2014-09', endDate: '2016-06' },
      { school: '中国人民大学', degree: '本科', field: '经济学', startDate: '2010-09', endDate: '2014-06' },
    ],
    skills: ['资产配置', '家族信托', '跨境投资', 'PE/VC', '税务筹划', 'CFA', 'CFP'],
    certifications: [
      { name: 'CFA', issuer: 'CFA Institute', date: '2018' },
      { name: 'CFP', issuer: 'FPSB', date: '2019' },
    ],
  }),
}

export function getTemplateDemoResume(style: TemplateStyle): Resume {
  return templateDemoResumes[style] || defaultResume
}
