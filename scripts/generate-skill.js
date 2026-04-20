#!/usr/bin/env node
/**
 * 从案例生成 OpenClaw Skill (Markdown 格式)
 * 用法：node generate-skill.js <case-file.json>
 */

const fs = require('fs');
const path = require('path');

const caseFile = process.argv[2];

if (!caseFile || !fs.existsSync(caseFile)) {
  console.error('用法：node generate-skill.js <case-file.json>');
  process.exit(1);
}

// 读取案例
const caseData = JSON.parse(fs.readFileSync(caseFile, 'utf8'));

// 如果案例中没有 skills 字段，尝试从描述中提取
if (!caseData.skills || caseData.skills.length === 0) {
  console.log('⚠️  案例缺少 skills 字段，尝试从描述中提取...');
  const extractedSkills = extractSkillsFromText(caseData.problem + ' ' + caseData.workflow.output);
  caseData.skills = extractedSkills.skills;
  caseData.integrations = extractedSkills.integrations;
  console.log(`✓ 提取到技能：${caseData.skills.join(', ') || '无'}`);
  console.log(`✓ 提取到集成：${caseData.integrations.join(', ') || '无'}`);
}

// 技能提取函数
function extractSkillsFromText(text) {
  const skillKeywords = {
    'web_search': ['搜索', '查找', 'search', 'google'],
    'web_fetch': ['爬取', '抓取', 'fetch', 'scrape'],
    'file_ops': ['文件', '保存', '存储', 'file', 'save'],
    'cron': ['定时', '周期', 'schedule', 'cron', '每天'],
    'notion': ['Notion'],
    'api_integration': ['API', '接口'],
    'data_analysis': ['分析', 'analysis', 'data'],
    'alerting': ['警报', 'alert', '通知']
  };
  
  const detectedSkills = [];
  const detectedIntegrations = [];
  
  for (const [skill, keywords] of Object.entries(skillKeywords)) {
    for (const keyword of keywords) {
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        if (!detectedSkills.includes(skill)) {
          detectedSkills.push(skill);
        }
        break;
      }
    }
  }
  
  // 检测集成服务
  if (text.toLowerCase().includes('google')) detectedIntegrations.push('Google API');
  if (text.toLowerCase().includes('notion')) detectedIntegrations.push('Notion CMS');
  if (text.toLowerCase().includes('telegram')) detectedIntegrations.push('Telegram');
  if (text.toLowerCase().includes('discord')) detectedIntegrations.push('Discord');
  
  return {
    skills: detectedSkills,
    integrations: detectedIntegrations
  };
}

// 生成 Skill ID
const skillId = caseData.id.replace('case-', 'skill-');

// 生成一句话用途说明
const usageSummary = generateUsageSummary(caseData);

// 生成 Markdown 格式的 Skill
const markdown = `# ${caseData.title}

> **Skill ID**: \`${skillId}\`  
> **用途**: ${usageSummary}  
> **难度**: ${translateDifficulty(caseData.difficulty)}  
> **分类**: ${caseData.category.join(' / ')}  
> **版本**: 1.0.0

---

## 💡 一句话说明

${usageSummary}

---

## 📋 简介

${caseData.problem}

---

## 🛠️ 所需技能

${(caseData.skills || []).map(skill => `- \`${skill}\``).join('\n') || '暂无'}

---

## 🔗 集成服务

${(caseData.integrations || []).map(service => `- \`${service}\``).join('\n') || '暂无'}

---

## 🔄 工作流程

**触发条件**: ${caseData.workflow.trigger}

### 执行步骤

${(caseData.workflow.steps || []).map((step, i) => `${i + 1}. ${step.replace(/^\\d+\\.\\s*/, '')}`).join('\n')}

### 输出结果

${caseData.workflow.output}

---

## ⚙️ 配置

### 定时调度

\`\`\`cron
${extractSchedule(caseData.workflow.trigger)}
\`\`\`

### 所需工具

${(caseData.skills || []).map(skill => `- \`${skill}\``).join('\n') || '暂无'}

### 环境变量

\`\`\`bash
${(caseData.integrations || []).map(integration => {
  const envVars = getEnvVars(integration);
  return envVars.map(v => `export ${v}="your-key-here"`).join('\n');
}).flat().join('\n') || '# 暂无特殊要求'}
\`\`\`

---

## 📊 效率提升

- **节省时间**: ${caseData.efficiency?.timeSaved || '未知'}
- **自动化程度**: ${translateAutomation(caseData.efficiency?.automationLevel)}
${caseData.efficiency?.metrics ? `\n**指标**:\n${Object.entries(caseData.efficiency.metrics).map(([k, v]) => `- ${k}: ${v}`).join('\n')}` : ''}

---

## 💡 使用示例

### 运行 Skill

\`\`\`bash
openclaw skills run ${skillId}
\`\`\`

### 添加到定时任务

\`\`\`bash
openclaw cron add --name "${caseData.title}" --schedule "${extractSchedule(caseData.workflow.trigger)}" --skill "${skillId}"
\`\`\`

---

## 📎 来源

- **案例来源**: ${caseData.source.platform}
- **原文链接**: ${caseData.source.url}
- **生成时间**: ${new Date().toISOString()}

---

*此 Skill 由 OpenClaw 从真实案例自动生成*
`;

// 输出到 skills 目录
const workspaceDir = '/root/.openclaw/workspace/openclaw-usecases';
const outputDir = path.join(workspaceDir, 'skills');

// 确保目录存在
fs.mkdirSync(outputDir, { recursive: true });

// 生成详细文件名：skill-日期 - 序号 - 分类 - 中文用途描述.md
// 如果 JSON 已经有 filename 字段，直接使用
const date = caseData.id.match(/case-(\d{8})-(\d+)/);
const dateStr = date ? `${date[1].substring(0,4)}-${date[1].substring(4,6)}-${date[1].substring(6,8)}` : new Date().toISOString().split('T')[0];
const seqNum = date ? date[2] : '001';
const category = caseData.category[0] || 'automation';

// 优先使用 JSON 中已存储的中文描述
const chineseDesc = caseData.metadata?.chineseDesc || generateChineseDescription(caseData);
const outputName = `skill-${dateStr}-${seqNum}-${category}-${chineseDesc}.md`;
const outputPath = path.join(outputDir, outputName);

// 生成一句话用途描述
function generateShortDescription(title, problem) {
  // 从标题或问题中提取关键词
  const keywords = {
    '内容机构': 'content-automation',
    '自动化工作流': 'workflow-auto',
    '投资者': 'investor-dashboard',
    '仪表盘': 'dashboard-monitor',
    'GitHub': 'github-trending',
    '自动化': 'automation',
    '监控': 'monitoring',
    '报告': 'reporting',
    '收集': 'collection'
  };
  
  const text = (title + ' ' + problem).toLowerCase();
  
  for (const [key, value] of Object.entries(keywords)) {
    if (text.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  // 默认使用标题前 20 个字符
  return title.substring(0, 20).replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-');
}

fs.writeFileSync(outputPath, markdown, 'utf8');

console.log(`✅ Skill 已生成：${outputPath}`);
console.log(`   Skill ID: ${skillId}`);
console.log(`   使用技能：${(caseData.skills || []).join(', ') || '无'}`);
console.log(`   集成服务：${(caseData.integrations || []).join(', ') || '无'}`);

// 辅助函数
function translateDifficulty(level) {
  const map = {
    'beginner': '初级 ⭐',
    'intermediate': '中级 ⭐⭐',
    'advanced': '高级 ⭐⭐⭐'
  };
  return map[level] || level;
}

function translateAutomation(level) {
  const map = {
    'manual': '手动',
    'semi-auto': '半自动 🤖',
    'full-auto': '全自动 🤖🤖'
  };
  return map[level] || level;
}

function extractSchedule(trigger) {
  if (trigger.includes('每天')) return '0 8 * * *';
  if (trigger.includes('每小时')) return '0 * * * *';
  if (trigger.includes('定时任务') || trigger.includes('Cron')) return '0 */6 * * *';
  return '* * * * *';
}

function getEnvVars(integration) {
  const envMap = {
    'Google Search API': ['GOOGLE_SEARCH_API_KEY'],
    'Notion CMS': ['NOTION_API_KEY'],
    'Binance API': ['BINANCE_API_KEY', 'BINANCE_API_SECRET'],
    'Stock APIs': ['STOCK_API_KEY'],
    'Telegram': ['TELEGRAM_BOT_TOKEN'],
    'Discord': ['DISCORD_BOT_TOKEN'],
    'SEO Tools': ['SEO_API_KEY'],
    'RSS Feeds': [],
    'Grafana/Dashboard': []
  };
  return envMap[integration] || ['TODO'];
}

// 生成中文描述（用于文件名）- 贴合案例实际内容
function generateChineseDescription(caseData) {
  const title = caseData.title || '';
  const problem = caseData.problem || '';
  const workflow = caseData.workflow || {};
  const steps = workflow.steps || [];
  const output = workflow.output || '';
  
  // 组合文本用于匹配
  const fullText = (title + ' ' + problem + ' ' + output + ' ' + steps.join(' ')).toLowerCase();
  
  // 详细关键词映射表（按优先级排序）
  const keywordMap = {
    // 内容创作类
    '内容创作自动化': ['内容机构', '监控竞争对手', '生成 seo', '撰写文章'],
    '竞品监控': ['竞争对手', '竞品分析', '市场监控'],
    'SEO 内容生成': ['seo 优化', '关键词密度', '元数据'],
    '自动写作': ['撰写', '生成文章', '生成大纲'],
    
    // 金融投资类
    '投资监控': ['投资者', '投资组合', '投资跟踪'],
    '价格监控': ['价格异常', '价格波动', '价格跟踪'],
    '加密货币监控': ['binance', 'crypto', '加密货币'],
    '实时警报': ['警报', '报警', '通知', 'alert'],
    '每日报告': ['每日报告', '日报', 'daily report'],
    
    // 开发工具类
    'GitHub 监控': ['github', 'trending', '热门项目', '仓库'],
    '代码自动化': ['代码', 'code', 'commit', 'push'],
    'API 集成': ['api', '接口', 'integration'],
    
    // 数据监控类
    '数据仪表盘': ['仪表盘', 'dashboard', '可视化', 'grafana'],
    '数据分析': ['数据分析', 'analysis', 'metrics'],
    '数据收集': ['收集', '采集', 'extract', 'scrape'],
    
    // 通讯通知类
    '邮件自动化': ['email', '邮件', 'gmail', 'smtp'],
    '消息推送': ['telegram', 'discord', 'slack', '微信', 'qq'],
    'whatsapp 推送': ['whatsapp'],
    
    // 定时任务类
    '定时任务': ['定时', 'cron', 'schedule', '周期'],
    '自动报告': ['报告', 'report', '汇总', 'summary'],
    '自动摘要': ['摘要', 'digest', '总结', 'summarize'],
    
    // 文件处理类
    '文件处理': ['文件', '保存', '存储', 'file', 'save'],
    '文档管理': ['文档', 'notion', '笔记', 'doc'],
    
    // 通用自动化
    '自动化工作流': ['自动化', 'workflow', '自动'],
    'OpenClaw 应用': ['openclaw']
  };
  
  // 查找匹配的关键词（返回第一个匹配的）
  for (const [desc, keywords] of Object.entries(keywordMap)) {
    for (const keyword of keywords) {
      if (fullText.includes(keyword.toLowerCase())) {
        return desc;
      }
    }
  }
  
  // 如果标题包含具体信息，从标题提取
  if (title.length > 0) {
    // 提取英文标题中的关键词
    const enTitle = title.replace(/[^a-zA-Z\s]/g, '');
    if (enTitle.length > 0 && enTitle.length < 50) {
      return enTitle.substring(0, 30).trim();
    }
    // 否则使用中文字符
    const zhTitle = title.replace(/[^\u4e00-\u9fa5]/g, '');
    if (zhTitle.length > 0) {
      return zhTitle.substring(0, 15);
    }
  }
  
  return '自动化案例';
}

// 生成一句话用途说明
function generateUsageSummary(caseData) {
  const workflow = caseData.workflow || {};
  const trigger = workflow.trigger || '触发';
  const output = workflow.output || '输出结果';
  
  // 从工作流生成用途说明
  const summaries = {
    '内容机构': '通过定时任务自动监控竞争对手博客，生成 SEO 优化文章，节省 4-6 小时/篇',
    '投资者': '自动跟踪投资组合表现，检测价格异常波动，生成每日报告并发送警报',
    'GitHub': '定时收集 GitHub Trending 项目，分析技术趋势，推送热门项目报告',
    '自动化': '自动化执行重复性任务，减少人工干预，提高工作效率'
  };
  
  const title = caseData.title;
  for (const [key, summary] of Object.entries(summaries)) {
    if (title.includes(key)) {
      return summary;
    }
  }
  
  // 默认格式：通过 [触发条件]，实现 [输出结果]
  return `通过${trigger.replace(/\(.*\)/, '')}，实现${output}`;
}
