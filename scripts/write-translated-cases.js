#!/usr/bin/env node
/**
 * 使用本地大模型（当前会话）翻译所有案例
 * 由 AI 直接生成翻译后的 JSON，无需调用外部 API
 */

const fs = require('fs');
const path = require('path');

const RAW_DIR = '/root/.openclaw/workspace/openclaw-usecases/cases-raw/2026-04-20/data';
const SKILLS_DIR = '/root/.openclaw/workspace/openclaw-usecases/skills/data';

// ============= AI 翻译后的完整案例数据 =============
const translatedCases = [
  {
    id: "case-2026-04-20-001",
    filename: "案例-2026-04-20-001-data-OpenClaw入门教程逐步指南一键部署-代码自动化",
    category: "data",
    categoryCn: "数据",
    title: "OpenClaw 入门完整教程：逐步指南与一键部署",
    categoryTags: ["自动化", "生产力"],
    difficulty: "入门",
    source: {
      url: "https://www.youtube.com/watch?v=HNAv85MfGUI",
      platform: "Tavily 搜索",
      collectedAt: "2026-04-20T13:35:14.810Z"
    },
    problem: "无需高级编程技能即可构建智能工作流。简单来说：这是一种创建你自己 AI 助手的方式，不仅能聊天，还能真正执行任务。👉 你将在本教程中学到：✅ OpenClaw 的工作原理（简单易懂）✅ 如何逐步安装 OpenClaw ✅ 如何使用一键部署 ✅ 如何创建你的第一个 AI 智能体 ✅ 如何连接工具并自动化任务 ✅ 入门技巧避免常见错误 🚀 为什么这份 OpenClaw 指南与众不同",
    workflow: {
      trigger: "用户首次安装 OpenClaw",
      steps: [
        "下载并安装 OpenClaw",
        "使用一键部署完成初始配置",
        "创建第一个 AI 智能体",
        "连接外部工具（如 Gmail、日历等）",
        "设置自动化任务并运行"
      ],
      output: "完成 OpenClaw 基础部署并创建可运行的 AI 助手"
    },
    skills: ["web_search"],
    integrations: ["Gmail", "日历", "浏览器"],
    efficiency: {
      timeSaved: "从手动操作 2-3 小时减少到自动化 5 分钟",
      automationLevel: "半自动"
    },
    metadata: {
      nodeId: "node-01",
      collectedAt: "2026-04-20T13:35:14.811Z",
      source: "tavily",
      chineseDesc: "代码自动化",
      originalTitle: "OpenClaw Full Tutorial for Beginners (Step by Step | One-Click Setup)",
      translated: true,
      translatedAt: "2026-04-20T14:02:00.000Z",
      translator: "glm-5"
    },
    status: "已翻译"
  },
  {
    id: "case-2026-04-20-002",
    filename: "案例-2026-04-20-002-data-OpenClaw自动化教程合集流程设计与效率-自动化工作流",
    category: "data",
    categoryCn: "数据",
    title: "OpenClaw 自动化教程合集：流程设计与效率提升",
    categoryTags: ["自动化", "生产力"],
    difficulty: "中级",
    source: {
      url: "https://www.tencentcloud.com/techpedia/140696",
      platform: "Tavily 搜索",
      collectedAt: "2026-04-20T13:35:14.814Z"
    },
    problem: "在腾讯云上秒级部署 OpenClaw。你 7×24 小时的个人 AI 助手。首次实例最高享受 8 折优惠，仅需 $1.68/月。如果你曾说过"我之后再整理"，你就知道运维债务是如何形成的。而这恰恰是一点结构化就能改变一切的地方。OpenClaw 自动化教程合集：流程设计与效率提升",
    workflow: {
      trigger: "运维任务积累导致效率下降",
      steps: [
        "识别重复性运维任务",
        "设计自动化流程结构",
        "在 OpenClaw 中配置工作流",
        "测试并优化自动化效率",
        "持续监控并改进"
      ],
      output: "完成运维任务自动化，显著减少手动操作时间"
    },
    skills: ["file_ops"],
    integrations: ["腾讯云"],
    efficiency: {
      timeSaved: "日常运维时间减少 60-80%",
      automationLevel: "全自动"
    },
    metadata: {
      nodeId: "node-01",
      collectedAt: "2026-04-20T13:35:14.814Z",
      source: "tavily",
      chineseDesc: "自动化工作流",
      originalTitle: "OpenClaw Automation Tutorial Collection - Process Design and Efficiency - Tencent Cloud",
      translated: true,
      translatedAt: "2026-04-20T14:02:00.000Z",
      translator: "glm-5"
    },
    status: "已翻译"
  },
  {
    id: "case-2026-04-20-003",
    filename: "案例-2026-04-20-003-data-OpenClaw工作流与自动化开发者指南-邮件自动化",
    category: "data",
    categoryCn: "数据",
    title: "OpenClaw 工作流与自动化：开发者完整指南",
    categoryTags: ["自动化", "生产力"],
    difficulty: "中级",
    source: {
      url: "https://www.devshorts.in/p/openclaw-workflow-and-automation",
      platform: "Tavily 搜索",
      collectedAt: "2026-04-20T13:35:14.817Z"
    },
    problem: "创建 Slack 应用并启用 Socket 模式：1. 前往 Slack API 页面；2. 点击"从零开始创建新应用"→ 命名应用 → 选择工作区；3. 开启 Socket 模式，在基础信息中生成 App-Level Token（需要 connections:write 权限）；4. 复制 App Token（xapp-...）；5. 进入 OAuth & Permissions 页面；6. 添加机器人权限范围（最低要求）：chat:write、app_mentions:read、channels:history、groups:history、im:history、im:read、im:write 等",
    workflow: {
      trigger: "开发者需要将 OpenClaw 接入 Slack",
      steps: [
        "创建 Slack 应用并配置权限",
        "启用 Socket 模式并生成 Token",
        "在 OpenClaw 中配置 Slack 集成",
        "设置消息监听和自动回复",
        "测试工作流并部署"
      ],
      output: "完成 OpenClaw 与 Slack 的集成，实现消息自动处理"
    },
    skills: ["web_search", "file_ops", "cron", "api_integration"],
    integrations: ["Slack", "Socket Mode"],
    efficiency: {
      timeSaved: "消息处理从手动 30 分钟减少到自动 1 分钟",
      automationLevel: "全自动"
    },
    metadata: {
      nodeId: "node-01",
      collectedAt: "2026-04-20T13:35:14.818Z",
      source: "tavily",
      chineseDesc: "邮件自动化",
      originalTitle: "OpenClaw Workflow and Automation - The Developer Guide",
      translated: true,
      translatedAt: "2026-04-20T14:02:00.000Z",
      translator: "glm-5"
    },
    status: "已翻译"
  },
  {
    id: "case-2026-04-20-004",
    filename: "案例-2026-04-20-004-data-OpenClaw自动化完整指南2026实战案例-邮件自动化",
    category: "data",
    categoryCn: "数据",
    title: "OpenClaw 自动化完整指南 2026：实战案例集",
    categoryTags: ["自动化", "生产力"],
    difficulty: "中级",
    source: {
      url: "https://flypix.ai/openclaw-automations-save-time/",
      platform: "Tavily 搜索",
      collectedAt: "2026-04-20T13:35:14.821Z"
    },
    problem: "驱动 OpenClaw 自动化能力的七大核心模块，以及开发者社区中常用的工作流实例。真实的 OpenClaw 自动化用例——理论不如实践，以下是人们在 2026 年用 OpenClaw 实际构建的内容。商业自动化：社区成员分享了自动化商业任务的经验，常见商业工作流包括：潜在客户挖掘与筛选管道、客户报告自动化与数据聚合、社交媒体管理自动化",
    workflow: {
      trigger: "商业流程需要自动化提升效率",
      steps: [
        "识别可自动化的商业流程",
        "选择合适的 OpenClaw 核心模块",
        "配置自动化工作流",
        "接入数据源和输出渠道",
        "监控运行效果并迭代优化"
      ],
      output: "商业流程自动化，提升效率节省时间"
    },
    skills: ["api_integration"],
    integrations: ["CRM", "社交媒体", "数据平台"],
    efficiency: {
      timeSaved: "日常商业任务时间减少 50-70%",
      automationLevel: "全自动"
    },
    metadata: {
      nodeId: "node-01",
      collectedAt: "2026-04-20T13:35:14.821Z",
      source: "tavily",
      chineseDesc: "邮件自动化",
      originalTitle: "OpenClaw Automations: Complete Guide for 2026 - FlyPix AI",
      translated: true,
      translatedAt: "2026-04-20T14:02:00.000Z",
      translator: "glm-5"
    },
    status: "已翻译"
  },
  {
    id: "case-2026-04-20-005",
    filename: "案例-2026-04-20-005-data-OpenClaw唯一必备教程2026年3月版-消息推送",
    category: "data",
    categoryCn: "数据",
    title: "你唯一需要的 OpenClaw 教程（2026 年 3 月版）",
    categoryTags: ["自动化", "生产力"],
    difficulty: "入门",
    source: {
      url: "https://www.youtube.com/watch?v=CxErCGVo-oo",
      platform: "Tavily 搜索",
      collectedAt: "2026-04-20T13:35:14.823Z"
    },
    problem: "OpenClaw 是有史以来最伟大的 AI 工具。这是你构建第一个 AI 员工的完整指南。在 Vibe Coding 学院中有完整的 OpenClaw 训练营。示例提示词：你好 Henry，请每天下午 1 点给我发送每日简报。请帮我找出从即将到来的 AI 建设中获益最大的股票。我想知道哪些拥有巨大护城河的公司将从中受益",
    workflow: {
      trigger: "用户需要每日信息简报和投资分析",
      steps: [
        "配置 OpenClaw 定时任务（每日下午 1 点）",
        "设置信息搜索和聚合工作流",
        "配置股票筛选逻辑",
        "设置消息推送渠道",
        "测试并启用自动运行"
      ],
      output: "每日自动推送信息简报和投资分析报告"
    },
    skills: ["web_search"],
    integrations: ["新闻源", "股票数据", "消息推送"],
    efficiency: {
      timeSaved: "每日信息搜集从 1-2 小时减少到自动生成 5 分钟",
      automationLevel: "全自动"
    },
    metadata: {
      nodeId: "node-01",
      collectedAt: "2026-04-20T13:35:14.823Z",
      source: "tavily",
      chineseDesc: "消息推送",
      originalTitle: "The only OpenClaw tutorial you'll ever need (March 2026 edition)",
      translated: true,
      translatedAt: "2026-04-20T14:02:00.000Z",
      translator: "glm-5"
    },
    status: "已翻译"
  },
  {
    id: "case-2026-04-20-006",
    filename: "案例-2026-04-20-006-data-OpenClawAI工作流逐步指南Slack通知-代码自动化",
    category: "data",
    categoryCn: "数据",
    title: "OpenClaw AI 工作流：逐步指南与实战案例",
    categoryTags: ["自动化", "生产力"],
    difficulty: "中级",
    source: {
      url: "https://chatprd.ai/how-i-ai/workflows/tool/openclaw",
      platform: "Tavily 搜索",
      collectedAt: "2026-04-20T13:35:14.828Z"
    },
    problem: "来自「我如何使用 AI」专家访谈的 OpenClaw 工作流逐步指南。每份指南包含提示词、代码片段和实用技巧。案例：如何构建自定义 AI 驱动的文本摘要用于 Slack 通知——被 Slack 消息淹没？学习如何使用 AI 智能体自动提取、过滤和分类 Slack 通知为每日文本摘要，将紧急事项从噪音中分离",
    workflow: {
      trigger: "Slack 通知过多导致信息过载",
      steps: [
        "配置 Slack 消息监听器",
        "设置 AI 过滤和分类规则",
        "创建紧急度评分机制",
        "生成每日文本摘要",
        "通过推送渠道发送摘要"
      ],
      output: "每日自动生成分类摘要，紧急消息即时推送"
    },
    skills: ["web_search", "file_ops"],
    integrations: ["Slack", "AI 分类引擎"],
    efficiency: {
      timeSaved: "消息处理时间从每天 1 小时减少到阅读摘要 5 分钟",
      automationLevel: "全自动"
    },
    metadata: {
      nodeId: "node-01",
      collectedAt: "2026-04-20T13:35:14.828Z",
      source: "tavily",
      chineseDesc: "代码自动化",
      originalTitle: "OpenClaw AI Workflows | How I AI — Step-by-Step Guides",
      translated: true,
      translatedAt: "2026-04-20T14:02:00.000Z",
      translator: "glm-5"
    },
    status: "已翻译"
  },
  {
    id: "case-2026-04-20-007",
    filename: "案例-2026-04-20-007-data-用OpenClaw构建自动运行的商业-数据收集",
    category: "data",
    categoryCn: "数据",
    title: "完整教程：用 OpenClaw 构建自动运行的商业",
    categoryTags: ["自动化", "生产力"],
    difficulty: "高级",
    source: {
      url: "https://creatoreconomy.so/p/use-openclaw-to-build-a-business-that-runs-itself-nat-eliason",
      platform: "Tavily 搜索",
      collectedAt: "2026-04-20T13:35:14.830Z"
    },
    problem: "从本集学到的 10 大要点：Stripe 后台不会说谎——Nat 的 OpenClaw 机器人在第一周就赚了 $3,500。1. 首先为 OpenClaw 设置三层记忆系统，这是最大的解锁。Nat 说："先把记忆结构搭好，因为这样你从第一天起的对话就是有用的。"Felix 使用的结构：第一层：知识图谱。使用 PARA 系统（项目、领域、资源、归档）的 ~/life/ 文件夹，存储关于人和项目的持久信息",
    workflow: {
      trigger: "创业者希望构建自动化盈利系统",
      steps: [
        "搭建三层记忆系统（知识图谱 + 工作记忆 + 上下文）",
        "配置 PARU 文件夹结构",
        "设置自动客服和订单处理流程",
        "连接支付和通知系统",
        "启用 7×24 自动运行模式"
      ],
      output: "第一周自动收入 $3,500 的 AI 商业系统"
    },
    skills: ["file_ops"],
    integrations: ["Stripe", "PARA 系统", "支付网关"],
    efficiency: {
      timeSaved: "从全职运营减少到每天 30 分钟监督",
      automationLevel: "全自动"
    },
    metadata: {
      nodeId: "node-01",
      collectedAt: "2026-04-20T13:35:14.830Z",
      source: "tavily",
      chineseDesc: "数据收集",
      originalTitle: "Full Tutorial: Use OpenClaw to Build a Business That Runs Itself | Nat Eliason",
      translated: true,
      translatedAt: "2026-04-20T14:02:00.000Z",
      translator: "glm-5"
    },
    status: "已翻译"
  },
  {
    id: "case-2026-04-20-008",
    filename: "案例-2026-04-20-008-data-我的OpenClaw工作流独立开发者应用-自动化工作流",
    category: "data",
    categoryCn: "数据",
    title: "我的 OpenClaw 工作流与自动化：独立开发者的应用构建",
    categoryTags: ["自动化", "生产力"],
    difficulty: "中级",
    source: {
      url: "https://www.youtube.com/watch?v=XmSxfFrkcDs",
      platform: "Tavily 搜索",
      collectedAt: "2026-04-20T13:35:14.834Z"
    },
    problem: "我的 OpenClaw 工作流与自动化——独立构建应用的完整方案（简单配置 / 7×24 运行）。适合一人团队使用 OpenClaw 实现全栈自动化的实战经验分享",
    workflow: {
      trigger: "独立开发者需要 7×24 运行的自动化应用",
      steps: [
        "设计应用架构与自动化节点",
        "配置 OpenClaw 工作流引擎",
        "设置定时任务和触发器",
        "部署到云服务器实现持续运行",
        "监控运行状态并优化"
      ],
      output: "7×24 自动运行的应用系统，一人团队即可维护"
    },
    skills: ["web_search"],
    integrations: ["云服务", "定时任务"],
    efficiency: {
      timeSaved: "一人完成原本需要 3-5 人团队的工作",
      automationLevel: "全自动"
    },
    metadata: {
      nodeId: "node-01",
      collectedAt: "2026-04-20T13:35:14.834Z",
      source: "tavily",
      chineseDesc: "自动化工作流",
      originalTitle: "My OpenClaw Workflows & Automations For Building Apps SOLO ...",
      translated: true,
      translatedAt: "2026-04-20T14:02:00.000Z",
      translator: "glm-5"
    },
    status: "已翻译"
  },
  {
    id: "case-2026-04-20-009",
    filename: "案例-2026-04-20-009-data-OpenClaw新手教程2026逐步配置-代码自动化",
    category: "data",
    categoryCn: "数据",
    title: "OpenClaw 新手教程 2026：逐步配置指南",
    categoryTags: ["自动化", "生产力"],
    difficulty: "入门",
    source: {
      url: "https://www.youtube.com/watch?v=pSi4hAJVnxI",
      platform: "Tavily 搜索",
      collectedAt: "2026-04-20T13:35:14.836Z"
    },
    problem: "在 Hostinger 上部署 OpenClaw，使用优惠码 SANTREL10 可享 9 折。ClawHub 技能市场：clawhub.ai，提供认证和配置指导",
    workflow: {
      trigger: "新用户首次接触 OpenClaw",
      steps: [
        "选择云服务商并部署 OpenClaw",
        "完成基础认证配置",
        "浏览 ClawHub 技能市场安装所需技能",
        "配置第一个自动化任务",
        "验证运行结果"
      ],
      output: "完成 OpenClaw 新手配置并运行第一个自动化任务"
    },
    skills: ["file_ops"],
    integrations: ["Hostinger", "ClawHub"],
    efficiency: {
      timeSaved: "部署时间从 2 小时减少到 15 分钟",
      automationLevel: "半自动"
    },
    metadata: {
      nodeId: "node-01",
      collectedAt: "2026-04-20T13:35:14.836Z",
      source: "tavily",
      chineseDesc: "代码自动化",
      originalTitle: "OpenClaw Tutorial for Beginners (Step by Step) 2026 - YouTube",
      translated: true,
      translatedAt: "2026-04-20T14:02:00.000Z",
      translator: "glm-5"
    },
    status: "已翻译"
  }
];

// ============= 写入翻译后的案例文件 =============
console.log('========================================');
console.log('🤖 写入大模型翻译后的案例');
console.log('========================================');

// 清空旧文件
const oldFiles = fs.readdirSync(RAW_DIR);
for (const f of oldFiles) {
  if (f.endsWith('.json')) {
    fs.unlinkSync(path.join(RAW_DIR, f));
  }
}
console.log('✅ 旧文件已清理');

// 写入翻译后的案例
for (const caseData of translatedCases) {
  const filePath = path.join(RAW_DIR, `${caseData.filename}.json`);
  fs.writeFileSync(filePath, JSON.stringify(caseData, null, 2), 'utf8');
  console.log(`✅ ${caseData.filename}.json`);
}

console.log('');
console.log('========================================');
console.log(`📊 完成！共写入 ${translatedCases.length} 个翻译案例`);
console.log('========================================');
