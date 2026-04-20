#!/usr/bin/env node
/**
 * 从网页内容或案例描述中提取 Skills
 * 用法：node extract-skills.js <url-or-text>
 */

const fs = require('fs');
const path = require('path');

// OpenClaw 技能库
const SKILL_LIBRARY = {
  // 数据收集
  'web_search': ['搜索', '查找', 'search', 'google', 'bing'],
  'web_fetch': ['爬取', '抓取', 'fetch', 'scrape', 'crawl'],
  'rss_reader': ['RSS', '订阅', 'feed', '聚合'],
  'api_client': ['API', '接口', 'REST', 'GraphQL'],
  
  // 文件操作
  'file_ops': ['文件', '保存', '读取', '存储', 'file', 'save'],
  'json_parser': ['JSON', '解析', 'parse'],
  'csv_processor': ['CSV', '表格', 'spreadsheet'],
  
  // 自动化
  'cron': ['定时', '周期', 'schedule', 'cron', '每天', '每小时'],
  'workflow': ['流程', '工作流', 'workflow', '自动化'],
  'scheduler': ['调度', '计划', 'schedule'],
  
  // 通知
  'email': ['邮件', 'email', 'smtp'],
  'telegram': ['Telegram', '电报'],
  'discord': ['Discord'],
  'slack': ['Slack'],
  'wechat': ['微信', 'WeChat'],
  'qqbot': ['QQ', 'QQ Bot'],
  
  // 开发工具
  'git': ['Git', '版本控制', 'commit', 'push'],
  'code_executor': ['执行', '运行', 'execute', 'run', 'code'],
  'docker': ['Docker', '容器', 'container'],
  
  // AI/ML
  'llm_client': ['AI', 'LLM', '模型', 'GPT', 'Claude'],
  'image_generator': ['图片', '图像', 'image', '生成'],
  'voice_synthesis': ['语音', 'voice', 'TTS'],
  
  // 第三方集成
  'notion': ['Notion', '笔记'],
  'github': ['GitHub', '仓库', 'repo'],
  'jira': ['Jira', '任务管理'],
  'airtable': ['Airtable', '数据库']
};

const input = process.argv[2];

if (!input) {
  console.error('用法：node extract-skills.js <URL 或文本>');
  process.exit(1);
}

// 提取文本内容
let text = input;
if (input.startsWith('http')) {
  console.log(`⚠️  URL 输入暂不支持，请提供文本内容`);
  process.exit(1);
}

// 分析文本，匹配技能
const detectedSkills = [];
const detectedIntegrations = [];

for (const [skill, keywords] of Object.entries(SKILL_LIBRARY)) {
  for (const keyword of keywords) {
    if (text.toLowerCase().includes(keyword.toLowerCase())) {
      if (!detectedSkills.includes(skill)) {
        detectedSkills.push(skill);
      }
      break;
    }
  }
}

// 检测常见的集成服务
const integrationPatterns = [
  { name: 'Google Search API', patterns: ['google search', 'google api'] },
  { name: 'GitHub API', patterns: ['github', 'git'] },
  { name: 'Notion API', patterns: ['notion'] },
  { name: 'Telegram Bot', patterns: ['telegram'] },
  { name: 'Discord Bot', patterns: ['discord'] },
  { name: 'Slack API', patterns: ['slack'] },
  { name: 'Email (SMTP)', patterns: ['email', '邮件', 'smtp'] },
  { name: 'RSS Feed', patterns: ['rss', '订阅'] }
];

for (const integration of integrationPatterns) {
  for (const pattern of integration.patterns) {
    if (text.toLowerCase().includes(pattern.toLowerCase())) {
      if (!detectedIntegrations.includes(integration.name)) {
        detectedIntegrations.push(integration.name);
      }
      break;
    }
  }
}

// 输出结果
console.log('=== 检测到的技能 ===');
if (detectedSkills.length > 0) {
  detectedSkills.forEach(skill => console.log(`  ✓ ${skill}`));
} else {
  console.log('  暂无匹配技能');
}

console.log('\n=== 检测到的集成服务 ===');
if (detectedIntegrations.length > 0) {
  detectedIntegrations.forEach(integration => console.log(`  ✓ ${integration}`));
} else {
  console.log('  暂无匹配集成');
}

// 输出为 JSON 格式（方便脚本使用）
const result = {
  skills: detectedSkills,
  integrations: detectedIntegrations,
  confidence: detectedSkills.length > 0 ? 'high' : 'low'
};

console.log('\n=== JSON 格式 ===');
console.log(JSON.stringify(result, null, 2));
