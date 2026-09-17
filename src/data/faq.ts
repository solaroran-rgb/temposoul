// D9-1
// src/data/faq.ts
export type FaqCategory = 'product' | 'billing' | 'privacy' | 'support';

export interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
}

export const FAQ_DATA: FaqItem[] = [
  {
    id: 'p1',
    category: 'product',
    question: '如何查看我的八字排盘结果？',
    answer:
      '在首页输入您的出生时间（公历或农历），点击“开始排盘”后，系统将自动跳转至结果页，展示您的四柱、大运、流年及十神等详细信息。',
  },
  {
    id: 'p2',
    category: 'product',
    question: '排盘结果支持保存或分享吗？',
    answer:
      '支持。在结果页右上角，您可以点击“收藏”将其保存至个人中心，或点击“分享”生成高清卡片与文本链接，发送给好友。',
  },
  {
    id: 'p3',
    category: 'product',
    question: '真太阳时是什么？需要开启吗？',
    answer:
      '真太阳时是根据您出生地的经度对标准时间进行校正后的时间。为了获得最精准的排盘结果，建议在输入出生信息时选择准确的出生城市，系统会自动计算真太阳时。',
  },
  {
    id: 'b1',
    category: 'billing',
    question: '平台的付费报告包含哪些内容？',
    answer:
      '付费深度报告包含无字数限制的 AI 命盘专属解读、大运/流年专项触发证据分析，以及高清全息主题命盘分享卡片导出功能。',
  },
  {
    id: 'b2',
    category: 'billing',
    question: '如何取消自动续费的 Pro 会员？',
    answer:
      '您可以进入“我的”-“会员权益”页面，点击“管理订阅”，系统将跳转至支付平台（LemonSqueezy）的客户门户，您可在那里随时取消自动续费。',
  },
  {
    id: 'b3',
    category: 'billing',
    question: '每日 3 次免费 AI 解读额度何时重置？',
    answer: '免费额度按自然日计算，将于每日北京时间 00:00 自动重置。',
  },
  {
    id: 'r1',
    category: 'privacy',
    question: '我的出生信息会被泄露吗？',
    answer:
      '我们遵循严格的数据最小化原则。您的出生信息仅用于本地排盘计算与生成报告，绝不与任何第三方共享，也不会用于未经授权的模型训练。',
  },
  {
    id: 'r2',
    category: 'privacy',
    question: '如何申请导出或删除我的个人数据？',
    answer:
      '您可以根据 GDPR/CCPA 等隐私法规行使数据主体访问请求（DSAR）。请前往“合规中心”-“DSAR 申请”页面，通过邮件向我们提交导出或删除请求，我们将在 30 天内处理。',
  },
  {
    id: 'r3',
    category: 'privacy',
    question: '平台会使用 Cookies 吗？',
    answer:
      '我们仅使用维持网站基本运行与提升用户体验所必需的非追踪型 Cookies 及本地存储（LocalStorage），不使用跨站追踪广告 Cookies。',
  },
  {
    id: 's1',
    category: 'support',
    question: '遇到系统 Bug 或显示错误怎么办？',
    answer:
      '请尝试刷新页面或清除浏览器缓存。若问题依然存在，请通过本页底部的“联系支持”表单反馈，附上问题截图与您的设备信息，我们会尽快修复。',
  },
  {
    id: 's2',
    category: 'support',
    question: '如何加入平台的咨询师入驻计划？',
    answer:
      '真人咨询师入驻通道目前正在内测筹备中（P2 阶段）。您可以关注我们的官方公告，或在“联系支持”中留下您的意向与资质简介。',
  },
  {
    id: 's3',
    category: 'support',
    question: '对命理内容有异议或投诉如何处理？',
    answer:
      '我们秉持“理性命理、证据可溯”的原则。若您对某项内容的客观性或合规性有异议，请通过“合规中心”的投诉举报入口提交详细说明，我们的内容审核组会进行人工复核。',
  },
];

export const FAQ_CATEGORIES: { key: FaqCategory; label: string }[] = [
  { key: 'product', label: '产品使用' },
  { key: 'billing', label: '付费订阅' },
  { key: 'privacy', label: '隐私数据' },
  { key: 'support', label: '联系支持' },
];
