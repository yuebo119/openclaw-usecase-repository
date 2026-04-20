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

// 生成 Skill ID
const skillId = caseData.id.replace('case-', 'skill-');

// 生成 Markdown 格式的 Skill
const markdown = `# ${caseData.title}

> **Skill ID**: \`${skillId}\`  
> **难度**: ${translateDifficulty(caseData.difficulty)}  
> **分类**: ${caseData.category.join(' / ')}  
> **版本**: 1.0.0

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

const outputName = `${skillId}.md`;
const outputPath = path.join(outputDir, outputName);

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
