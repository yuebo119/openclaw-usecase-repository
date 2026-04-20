#!/usr/bin/env node
/**
 * JSON 案例转 Markdown 脚本
 * 用法：node json-to-markdown.js [case-file.json]
 */

const fs = require('fs');
const path = require('path');

const caseFile = process.argv[2];

if (!caseFile || !fs.existsSync(caseFile)) {
  console.error('用法：node json-to-markdown.js <case-file.json>');
  process.exit(1);
}

// 读取案例
const caseData = JSON.parse(fs.readFileSync(caseFile, 'utf8'));

// 生成 Markdown
const markdown = `# ${caseData.title}

> **难度**: ${translateDifficulty(caseData.difficulty)}  
> **分类**: ${caseData.category.join(' / ')}  
> **状态**: ${translateStatus(caseData.status)}

---

## 📋 问题描述

${caseData.problem}

---

## 🔄 工作流程

**触发条件**: ${caseData.workflow.trigger}

### 执行步骤

${caseData.workflow.steps ? caseData.workflow.steps.map((step, i) => `${i + 1}. ${step.replace(/^\d+\.\s*/, '')}`).join('\n') : '暂无'}

### 输出结果

${caseData.workflow.output}

---

## 🛠️ 使用技能

${caseData.skills ? caseData.skills.map(skill => `- ${skill}`).join('\n') : '暂无'}

---

## 🔗 集成服务

${caseData.integrations ? caseData.integrations.map(service => `- ${service}`).join('\n') : '暂无'}

---

## 📊 效率提升

- **节省时间**: ${caseData.efficiency.timeSaved}
- **自动化程度**: ${translateAutomation(caseData.efficiency.automationLevel)}
${caseData.efficiency.metrics ? `\n**指标**:\n${Object.entries(caseData.efficiency.metrics).map(([k, v]) => `- ${k}: ${v}`).join('\n')}` : ''}

---

## ⚙️ 搭建指南

### 前置条件

${caseData.setup && caseData.setup.prerequisites ? caseData.setup.prerequisites.map(req => `- [ ] ${req}`).join('\n') : '暂无特殊要求'}

### 预计时间

${caseData.setup.estimatedTime}

### 成本估算

${caseData.setup.costEstimate || '免费'}

---

## 📎 来源信息

- **来源平台**: ${caseData.source.platform}
- **原文链接**: ${caseData.source.url}
- **收集时间**: ${formatDate(caseData.metadata.collectedAt)}
- **节点 ID**: ${caseData.metadata.nodeId}

---

*此案例由 OpenClaw 自动收集并整理*
`;

// 输出 Markdown 文件到独立目录
const inputDir = path.dirname(caseFile);
const parentDir = path.dirname(inputDir);
const outputDir = path.join(parentDir, 'cases-markdown');
const outputName = path.basename(caseFile, '.json') + '.md';
const outputPath = path.join(outputDir, outputName);

fs.writeFileSync(outputPath, markdown, 'utf8');

console.log(`✅ Markdown 已生成：${outputPath}`);

// 辅助函数
function translateDifficulty(level) {
  const map = {
    'beginner': '初级 ⭐',
    'intermediate': '中级 ⭐⭐',
    'advanced': '高级 ⭐⭐⭐'
  };
  return map[level] || level;
}

function translateStatus(status) {
  const map = {
    'inbox': '待审核 📥',
    'validated': '已验证 ✅',
    'merged': '已合并 🔀',
    'tutorial-ready': '可生成教程 📚'
  };
  return map[status] || status;
}

function translateAutomation(level) {
  const map = {
    'manual': '手动',
    'semi-auto': '半自动 🤖',
    'full-auto': '全自动 🤖🤖'
  };
  return map[level] || level;
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
}
