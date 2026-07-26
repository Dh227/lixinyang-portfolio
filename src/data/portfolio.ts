export type SectionId = 'home' | 'profile' | 'projects' | 'strengths' | 'contact'

export interface NavItem {
  id: SectionId
  label: string
}

export interface Experience {
  company: string
  role: string
  period: string
  summary: string
}

export interface Stat {
  value: string
  label: string
}

export interface FeaturedProject {
  title: string
  categoryLabel: string
  description: string
  image: string
  imageAlt: string
  repositoryUrl: string
  language: string
  highlights: string[]
  tags: string[]
}

export interface Repository {
  name: string
  displayName: string
  description: string
  url: string
  language: string
  type: string
}

export interface Strength {
  title: string
  summary: string
  detail: string
}

export interface GalleryImage {
  src: string
  alt: string
}

export interface PortfolioData {
  profile: {
    name: string
    direction: string
    statement: string
    introduction: string[]
    email: string
    githubHandle: string
    githubUrl: string
  }
  navigation: NavItem[]
  stats: Stat[]
  galleryImages: GalleryImage[]
  experiences: Experience[]
  featuredProjects: FeaturedProject[]
  repositories: Repository[]
  strengths: Strength[]
  updatedAt: string
}

export const portfolioData: PortfolioData = {
  profile: {
    name: '李鑫洋',
    direction: '2027 校招 · 售前 / 解决方案工程师',
    statement: '把技术讲清楚，\n把方案做落地。',
    introduction: [
      '我是一名物联网工程本科生，也是一名持续构建产品的实践者。我的项目从医疗设备售前、智慧水务交付延伸到 macOS 工具、求职工作台与智能旅行产品。',
      '我擅长从真实业务场景里找到结构：拆解需求、梳理流程、组织信息，再用原型、数据或代码把想法推进到可以验证的状态。',
    ],
    email: 'mynameisxinyangli@163.com',
    githubHandle: 'Dh227',
    githubUrl: 'https://github.com/Dh227',
  },
  navigation: [
    { id: 'home', label: '首页' },
    { id: 'profile', label: '个人经历' },
    { id: 'projects', label: '精选项目' },
    { id: 'strengths', label: '个人优势' },
    { id: 'contact', label: '联系我' },
  ],
  stats: [
    { value: '07', label: '个公开作品' },
    { value: '03', label: '段实习与实践经历' },
    { value: '02', label: '个核心行业场景' },
    { value: '2027', label: '校招求职年份' },
  ],
  galleryImages: [
    {
      src: '/profile/lifestyle-transformers.jpg',
      alt: '李鑫洋在变形金刚主题场景前合影',
    },
    {
      src: '/profile/lifestyle-lakeside.jpg',
      alt: '李鑫洋在湖边休息，手持饮品',
    },
    {
      src: '/profile/lifestyle-stone.jpg',
      alt: '李鑫洋身穿黑色外套，靠在石墙旁手持饮品',
    },
  ],
  experiences: [
    {
      company: '上海威派格智慧水务股份有限公司',
      role: '项目助理实习生（软件方向）',
      period: '2026.07 — 至今',
      summary:
        '围绕智慧水务综合调度平台，完成站点与 IoT 设备配置、状态核查、监测量定位和历史报警分析。',
    },
    {
      company: '江苏鱼跃医疗设备股份有限公司',
      role: '销售运营与招投标支持实习生',
      period: '2024.09 — 2025.02',
      summary:
        '建立 30+ 家竞品参数对标表，整理 15 套方案 PPT / SOP，并通过台账跟进 20+ 订单节点与异常事项。',
    },
    {
      company: '人本健身',
      role: '客户转化支持实习生',
      period: '2025.03 — 2025.06',
      summary:
        '梳理 200+ 份客户咨询记录并进行画像分层，复盘客户抗拒点，支持转化与沉睡客户唤醒。',
    },
  ],
  featuredProjects: [
    {
      title: '医疗设备售前支持与销售运营管理原型',
      categoryLabel: '业务原型',
      description:
        '从客户需求、样机库存、参数对标到交付异常，把医疗设备销售支持中的多角色协作整理为可演示的端到端业务原型。',
      image: '/projects/medical-cover.svg',
      imageAlt: '医疗设备售前支持与销售运营原型界面概念图',
      repositoryUrl: 'https://github.com/Dh227/medical-sales-support-ops',
      language: 'Java',
      highlights: ['四类业务角色', '六类核心信息', '端到端演示主线'],
      tags: ['需求拆解', '业务建模', 'JeecgBoot', '售前方案'],
    },
    {
      title: '智能旅行规划工作台',
      categoryLabel: '产品工作台',
      description:
        '面向中国大陆出行场景，将自然语言需求转化为包含路线、天气、地图、预算和行程生命周期的可执行计划。',
      image: '/projects/travel-workbench.png',
      imageAlt: '智能旅行规划工作台实际界面截图',
      repositoryUrl: 'https://github.com/Dh227/travel-workbench',
      language: 'JavaScript',
      highlights: ['50+ 人次测试', '两轮功能迭代', '路线与预算约束'],
      tags: ['产品策划', '地图与路线', '用户测试', '本地优先'],
    },
    {
      title: '简历多智能体工作室',
      categoryLabel: '桌面智能工具',
      description:
        '面向 macOS 单用户求职者，将岗位解析、简历优化、安全投递与面试训练组织为一套可控的多智能体桌面工作流。',
      image: '/projects/resume-studio-cover.svg',
      imageAlt: '简历多智能体工作室界面概念图',
      repositoryUrl: 'https://github.com/Dh227/resume-multi-agent-studio',
      language: 'TypeScript',
      highlights: ['多智能体协作', '本地单用户', '人工确认投递'],
      tags: ['AI Agent', '求职工作流', '隐私优先', 'TypeScript'],
    },
  ],
  repositories: [
    {
      name: 'medical-sales-support-ops',
      displayName: '医疗设备售前运营原型',
      description: '医疗设备售前支持与销售运营管理原型。',
      url: 'https://github.com/Dh227/medical-sales-support-ops',
      language: 'Java',
      type: '业务原型',
    },
    {
      name: 'travel-workbench',
      displayName: '智能旅行规划工作台',
      description: '面向中国大陆出行场景的行程规划与执行工作台。',
      url: 'https://github.com/Dh227/travel-workbench',
      language: 'JavaScript',
      type: '产品工作台',
    },
    {
      name: 'resume-multi-agent-studio',
      displayName: '简历多智能体工作室',
      description: '多智能体简历优化、安全投递与面试训练桌面工具。',
      url: 'https://github.com/Dh227/resume-multi-agent-studio',
      language: 'TypeScript',
      type: '桌面 AI',
    },
    {
      name: 'clipboard-history',
      displayName: '剪贴板历史工具',
      description: 'macOS 菜单栏历史粘贴板工具，支持搜索、置顶和到期清理。',
      url: 'https://github.com/Dh227/clipboard-history',
      language: 'Swift',
      type: 'macOS 工具',
    },
    {
      name: 'live-caption-overlay',
      displayName: '实时字幕悬浮工具',
      description: 'macOS 实时中文字幕透明悬浮工具。',
      url: 'https://github.com/Dh227/live-caption-overlay',
      language: 'Swift',
      type: 'macOS 工具',
    },
    {
      name: 'jian-tian-job-form-extension',
      displayName: '网申表单辅助扩展',
      description: '本地优先的网申资料预览、脱敏与辅助填写扩展。',
      url: 'https://github.com/Dh227/jian-tian-job-form-extension',
      language: 'JavaScript',
      type: '浏览器扩展',
    },
    {
      name: '-Web-',
      displayName: '早期网页实践归档',
      description: '早期 Web 项目归档，保留个人开发路径。',
      url: 'https://github.com/Dh227/-Web-',
      language: 'HTML',
      type: '早期实践',
    },
  ],
  strengths: [
    {
      title: '技术业务转译',
      summary: '不只理解参数，也能说明参数与客户场景的关系。',
      detail:
        '把设备、数据与系统信息整理成客户能理解、团队能执行的方案材料和演示路径。',
    },
    {
      title: '需求与流程建模',
      summary: '从模糊问题中建立角色、流程、字段与边界。',
      detail:
        '在动手实现前先确认事实与约束，减少方案表达和后续协作中的信息损耗。',
    },
    {
      title: '原型与产品验证',
      summary: '让想法尽快进入可以看、可以讲、可以测试的状态。',
      detail:
        '通过低代码原型、前端产品和本地工具验证业务路径，并根据实际反馈继续迭代。',
    },
    {
      title: '本地与隐私意识',
      summary: '在便利性之外，保留用户对数据和关键操作的控制。',
      detail:
        '作品优先采用本地存储、显式状态和人工确认，避免在求职与个人数据场景中越权自动化。',
    },
  ],
  updatedAt: '2026.07',
}
