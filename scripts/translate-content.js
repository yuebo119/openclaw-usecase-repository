#!/usr/bin/env node
/**
 * 内容翻译模块 - 将英文内容彻底翻译成中文
 */

// 核心翻译映射表
const translationMap = {
  'OpenClaw': 'OpenClaw',
  'Tutorial': '教程',
  'Guide': '指南',
  'Complete': '完整',
  'Full': '完整',
  'Ultimate': '终极',
  'Definitive': '权威',
  'Use Cases': '用例',
  'Use Case': '用例',
  'Automation': '自动化',
  'Workflow': '工作流',
  'Browser': '浏览器',
  'Tools': '工具',
  'Developers': '开发者',
  'Managers': '管理者',
  'Project': '项目',
  'Content': '内容',
  'Marketing': '营销',
  'Business': '商业',
  'Enterprise': '企业',
  'Startup': '创业',
  'Team': '团队',
  'Product': '产品',
  'Platform': '平台',
  'Service': '服务',
  'System': '系统',
  'Framework': '框架',
  'Template': '模板',
  'Example': '示例',
  'Examples': '示例',
  'Beginner': '入门',
  'Advanced': '高级',
  'Professional': '专业',
  'Top': '顶级',
  'Best': '最佳',
  '2026': '2026',
  'How to': '如何',
  'How We': '我们如何',
  'Getting Started': '入门指南',
  'Step by Step': '逐步',
  'Self-Hosted': '自托管',
  'Open Source': '开源',
  'Acquisition': '获取',
  'Acquire': '获取',
  'Email': '邮件',
  'Gmail': 'Gmail',
  'Digest': '摘要',
  'Report': '报告',
  'Daily': '每日',
  'Personal': '个人',
  'AI': 'AI',
  'Assistant': '助手',
  'Agent': '智能体',
  'API': 'API',
  'Integration': '集成',
  'Code': '代码',
  'Data': '数据',
  'Collection': '收集',
  'Monitoring': '监控',
  'Dashboard': '仪表盘',
  'Message': '消息',
  'Push': '推送',
  'Notification': '通知',
  'Schedule': '定时',
  'Task': '任务',
  'File': '文件',
  'Ops': '运维',
  'Dev': '开发',
  'What is': '什么是',
  'What Is': '什么是',
  'for': '',
  'and': '',
  'with': '',
  'to': '',
  'of': '',
  'in': '',
  'on': '',
  'from': '',
  'by': '',
  'as': '',
  'or': '',
  'The': '',
  'A': '',
  'An': ''
};

/**
 * 翻译标题
 */
function translateTitle(title) {
  if (!title) return '未命名';
  
  // 如果已经是中文，直接返回
  if (/^[\u4e00-\u9fa5]+$/.test(title.replace(/[^\u4e00-\u9fa5]/g, ''))) {
    return title.substring(0, 30).trim();
  }
  
  let translated = title;
  
  // 按长度排序，优先替换长短语
  const sortedKeys = Object.keys(translationMap).sort((a, b) => b.length - a.length);
  
  for (const key of sortedKeys) {
    const value = translationMap[key];
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    translated = translated.replace(regex, value);
  }
  
  // 清理多余字符
  translated = translated
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')
    .substring(0, 30)
    .trim();
  
  return translated || '自动化案例';
}

/**
 * 翻译问题描述
 */
function translateProblem(problem) {
  if (!problem) return '';
  
  // 简单替换常见词汇
  let translated = problem;
  
  const commonMap = {
    'need to': '需要',
    'want to': '想要',
    'help': '帮助',
    'save time': '节省时间',
    'automate': '自动化',
    'manual': '手动',
    'process': '流程',
    'workflow': '工作流',
    'OpenClaw': 'OpenClaw',
    'automation': '自动化',
    'task': '任务',
    'email': '邮件',
    'data': '数据',
    'collect': '收集',
    'search': '搜索',
    'API': 'API'
  };
  
  for (const [en, zh] of Object.entries(commonMap)) {
    translated = translated.replace(new RegExp(en, 'gi'), zh);
  }
  
  return translated.substring(0, 500);
}

/**
 * 翻译工作流步骤
 */
function translateSteps(steps) {
  if (!steps || !Array.isArray(steps)) return [];
  
  return steps.map(step => {
    let translated = step;
    
    const stepMap = {
      'Check': '检查',
      'Send': '发送',
      'Get': '获取',
      'Process': '处理',
      'Save': '保存',
      'if': '如果',
      'then': '那么',
      'else': '否则'
    };
    
    for (const [en, zh] of Object.entries(stepMap)) {
      translated = translated.replace(new RegExp(`\\b${en}\\b`, 'gi'), zh);
    }
    
    return translated;
  });
}

module.exports = {
  translateTitle,
  translateProblem,
  translateSteps,
  translationMap
};
