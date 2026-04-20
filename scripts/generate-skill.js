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

// 生成详细文件名：skill-日期 - 序号 - 用途描述.md
const shortDesc = generateShortDescription(caseData.title, caseData.problem);
const outputName = `${skillId}-${shortDesc}.md`;
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
