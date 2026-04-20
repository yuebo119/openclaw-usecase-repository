#!/usr/bin/env node
/**
 * 从原始案例生成 Skills（支持分类目录）
 * 用法：node gen-skills.js
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = '/root/.openclaw/workspace/openclaw-usecases';
const RAW_DIR = path.join(WORKSPACE_DIR, 'cases-raw');
const SKILLS_DIR = path.join(WORKSPACE_DIR, 'skills');

// 分类中文映射
const CATEGORY_CN = {
  'automation': '自动化',
  'email': '邮件',
  'api': 'API',
  'code': '代码',
  'data': '数据'
};

// 翻译标题
function translateTitle(title) {
  if (!title) return '未命名';
  
  const translationMap = {
    'OpenClaw': 'OpenClaw',
    'Tutorial': '教程',
    'Guide': '指南',
    'Complete': '完整',
    'Full': '完整',
    'Use Cases': '用例',
    'What is': '什么是',
    'Automation': '自动化',
    'Email': '邮件',
    'API': 'API',
    'Code': '代码',
    'Data': '数据'
  };
  
  let translated = title;
  const sortedKeys = Object.keys(translationMap).sort((a, b) => b.length - a.length);
  
  for (const key of sortedKeys) {
    const value = translationMap[key];
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    translated = translated.replace(regex, value);
  }
  
  translated = translated
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')
    .substring(0, 20)
    .trim();
  
  return translated || '自动化案例';
}

// 从标题提取简洁描述
function extractShortTitle(caseData) {
  return translateTitle(caseData.title);
}

// 生成中文描述
function generateChineseDescription(caseData) {
  const title = caseData.title || '';
  const problem = caseData.problem || '';
  const fullText = (title + ' ' + problem).toLowerCase();
  
  const keywordMap = {
    '代码自动化': ['代码', 'code', 'commit'],
    '邮件自动化': ['gmail', 'email', '邮件'],
    'API 集成': ['api', '接口'],
    '数据收集': ['收集', '采集', 'extract'],
    '定时任务': ['cron', '定时', 'schedule'],
    '自动化工作流': ['自动化', 'workflow']
  };
  
  for (const [desc, keywords] of Object.entries(keywordMap)) {
    for (const keyword of keywords) {
      if (fullText.includes(keyword)) {
        return desc;
      }
    }
  }
  
  return '自动化案例';
}

// 处理单个案例
function processCase(caseData, category) {
  const date = caseData.id.match(/case-(\d{8})/);
  const dateStr = date ? `${date[1].substring(0,4)}-${date[1].substring(4,6)}-${date[1].substring(6,8)}` : new Date().toISOString().split('T')[0];
  const seqNum = caseData.id.split('-').pop();
  
  const chineseDesc = caseData.metadata?.chineseDesc || generateChineseDescription(caseData);
  const shortTitle = extractShortTitle(caseData);
  const chineseCategory = CATEGORY_CN[category] || category;
  
  // 生成 Skill 文件名
  const outputName = `技能-${dateStr}-${seqNum}-${chineseCategory}-${shortTitle}-${chineseDesc}.md`;
  
  // 生成 Markdown 内容
  const markdown = `# ${caseData.title || '自动化案例'}

> **Skill ID**: \`${caseData.id}\`  
> **用途**: ${caseData.workflow?.output || '自动化任务'}  
> **难度**: 中级 ⭐⭐  
> **分类**: ${caseData.categoryTags?.join(' / ') || 'automation'}  
> **版本**: 1.0.0

---

## 📋 简介

${caseData.problem || '自动化需求描述'}

---

## 🛠️ 所需技能

${(caseData.skills || []).map(skill => `- \`${skill}\``).join('\n') || '暂无'}

---

## 🔗 集成服务

${(caseData.integrations || []).map(service => `- \`${service}\``).join('\n') || '暂无'}

---

## 🔄 工作流程

**触发条件**: ${caseData.workflow?.trigger || '定时任务或事件触发'}

### 执行步骤

${(caseData.workflow?.steps || []).map((step, i) => `${i + 1}. ${step}`).join('\n')}

### 输出结果

${caseData.workflow?.output || '自动化任务完成'}

---

## ⚙️ 配置

### 定时调度

\`\`\`cron
0 */6 * * *
\`\`\`

### 所需工具

${(caseData.skills || []).map(skill => `- \`${skill}\``).join('\n') || '暂无'}

---

## 📊 效率提升

- **节省时间**: ${caseData.efficiency?.timeSaved || '自动化节省时间'}
- **自动化程度**: ${caseData.efficiency?.automationLevel === 'full-auto' ? '全自动 🤖🤖' : '半自动 🤖'}

---

## 💡 使用示例

### 运行 Skill

\`\`\`bash
openclaw skills run ${caseData.id}
\`\`\`

---

## 📎 来源

- **案例来源**: ${caseData.source?.platform || 'Tavily 搜索'}
- **原文链接**: ${caseData.source?.url || '无'}
- **生成时间**: ${new Date().toISOString()}

---

*此 Skill 由 OpenClaw 从真实案例自动生成*
`;
  
  // 保存到分类目录
  const categorySkillsDir = path.join(SKILLS_DIR, category);
  fs.mkdirSync(categorySkillsDir, { recursive: true });
  
  const outputPath = path.join(categorySkillsDir, outputName);
  fs.writeFileSync(outputPath, markdown, 'utf8');
  
  return {
    filename: outputName,
    path: outputPath
  };
}

// 主流程
function generateAllSkills() {
  console.log('========================================');
  console.log('🔧 开始生成 Skills');
  console.log('========================================');
  
  const categoryStats = {};
  let totalSkills = 0;
  
  // 遍历所有日期目录
  if (!fs.existsSync(RAW_DIR)) {
    console.log('⚠️  原始案例目录不存在');
    return;
  }
  
  const dateDirs = fs.readdirSync(RAW_DIR);
  
  for (const dateDir of dateDirs) {
    const datePath = path.join(RAW_DIR, dateDir);
    if (!fs.statSync(datePath).isDirectory()) continue;
    
    // 遍历分类目录
    const categories = fs.readdirSync(datePath);
    
    for (const category of categories) {
      const categoryPath = path.join(datePath, category);
      if (!fs.statSync(categoryPath).isDirectory()) continue;
      
      const files = fs.readdirSync(categoryPath);
      
      for (const file of files) {
        if (!file.endsWith('.json')) continue;
        
        const filePath = path.join(categoryPath, file);
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const caseData = JSON.parse(content);
          
          const result = processCase(caseData, category);
          console.log(`✅ Skill 已生成：${category}/${result.filename}`);
          
          categoryStats[category] = (categoryStats[category] || 0) + 1;
          totalSkills++;
        } catch (e) {
          console.warn(`⚠️  处理失败：${file} - ${e.message}`);
        }
      }
    }
  }
  
  console.log('');
  console.log('========================================');
  console.log(`📊 完成！共生成 ${totalSkills} 个 Skills`);
  console.log('分类统计:');
  for (const [cat, count] of Object.entries(categoryStats)) {
    console.log(`  ${CATEGORY_CN[cat] || cat}: ${count}个`);
  }
  console.log('========================================');
}

// 执行
try {
  generateAllSkills();
} catch (error) {
  console.error(`❌ 错误：${error.message}`);
  process.exit(1);
}
