#!/usr/bin/env node
/**
 * 从案例生成 OpenClaw Skill 配置
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

// 生成 Skill ID（从案例 ID 派生）
const skillId = caseData.id.replace('case-', 'skill-');

// 生成 Skill 配置
const skillConfig = {
  "name": caseData.title,
  "version": "1.0.0",
  "description": caseData.problem,
  "author": caseData.metadata.nodeId,
  "tags": caseData.category,
  "difficulty": caseData.difficulty,
  "skills": caseData.skills || [],
  "integrations": caseData.integrations || [],
  "workflow": {
    "trigger": caseData.workflow.trigger,
    "steps": caseData.workflow.steps || [],
    "output": caseData.workflow.output
  },
  "config": {
    "schedule": extractSchedule(caseData.workflow.trigger),
    "tools": extractTools(caseData.skills),
    "env": generateEnvVars(caseData.integrations)
  },
  "examples": {
    "usage": `openclaw skills run ${skillId}`,
    "input": "触发条件示例",
    "output": caseData.workflow.output
  },
  "metadata": {
    "sourceCase": path.basename(caseFile),
    "sourceUrl": caseData.source.url,
    "generatedAt": new Date().toISOString(),
    "efficiency": caseData.efficiency
  }
};

// 输出 Skill 文件到独立的 skills 目录
const workspaceDir = '/root/.openclaw/workspace/openclaw-usecases';
const outputDir = path.join(workspaceDir, 'skills');

// 确保目录存在
fs.mkdirSync(outputDir, { recursive: true });

const outputName = `${skillId}.json`;
const outputPath = path.join(outputDir, outputName);

fs.writeFileSync(outputPath, JSON.stringify(skillConfig, null, 2), 'utf8');

console.log(`✅ Skill 已生成：${outputPath}`);
console.log(`   Skill ID: ${skillId}`);
console.log(`   使用技能：${skillConfig.skills.join(', ') || '无'}`);
console.log(`   集成服务：${skillConfig.integrations.join(', ') || '无'}`);

// 辅助函数
function extractSchedule(trigger) {
  // 从触发条件中提取 cron 表达式或调度信息
  if (trigger.includes('每天')) return '0 * * * *';
  if (trigger.includes('每小时')) return '0 * * * *';
  if (trigger.includes('定时任务')) return '0 */6 * * *';
  return '* * * * *'; // 默认
}

function extractTools(skills) {
  // 将技能映射到 OpenClaw 工具
  const toolMap = {
    'web_search': 'tavily',
    'web_fetch': 'http-client',
    'file_ops': 'filesystem',
    'cron': 'scheduler',
    'notion': 'notion-api',
    'api_integration': 'http-client',
    'data_analysis': 'python-runner',
    'alerting': 'notification'
  };
  
  return (skills || []).map(skill => toolMap[skill] || skill);
}

function generateEnvVars(integrations) {
  // 生成需要的环境变量
  const envMap = {
    'Google Search API': 'GOOGLE_SEARCH_API_KEY',
    'Notion CMS': 'NOTION_API_KEY',
    'Binance API': 'BINANCE_API_KEY,BINANCE_API_SECRET',
    'Telegram': 'TELEGRAM_BOT_TOKEN',
    'Discord': 'DISCORD_BOT_TOKEN',
    'SEO Tools': 'SEO_API_KEY'
  };
  
  const envVars = [];
  (integrations || []).forEach(integration => {
    if (envMap[integration]) {
      envVars.push(...envMap[integration].split(','));
    }
  });
  
  return envVars.length > 0 ? envVars : ['暂无特殊要求'];
}
