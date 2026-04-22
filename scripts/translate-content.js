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
 * 翻译问题描述 - 增强版
 */
function translateProblem(problem) {
  if (!problem) return '';
  
  let translated = problem;
  
  // 扩展的翻译映射表（按长度排序）
  const problemMap = {
    'step-by-step': '逐步',
    'Step-by-Step': '逐步',
    'hands-on': '实战',
    'Hands-on': '实战',
    'real-world': '真实',
    'Real-world': '真实',
    'end-to-end': '端到端',
    'End-to-End': '端到端',
    'no-code': '无代码',
    'low-code': '低代码',
    'need to': '需要',
    'want to': '想要',
    'have to': '必须',
    'able to': '能够',
    'help you': '帮助你',
    'helps you': '帮助你',
    'allows you': '让你可以',
    'enables you': '使你能够',
    'make it easy': '轻松',
    'easy way': '简单方法',
    'simple way': '简单方法',
    'quick way': '快速方法',
    'best way': '最佳方式',
    'save time': '节省时间',
    'time-consuming': '耗时的',
    'automate': '自动化',
    'automation': '自动化',
    'manual': '手动',
    'manually': '手动地',
    'process': '流程',
    'processing': '处理',
    'workflow': '工作流',
    'workflows': '工作流',
    'OpenClaw': 'OpenClaw',
    'task': '任务',
    'tasks': '任务',
    'email': '邮件',
    'emails': '邮件',
    'data': '数据',
    'collect': '收集',
    'collection': '收集',
    'search': '搜索',
    'searching': '搜索',
    'API': 'API',
    'APIs': 'API',
    'integration': '集成',
    'integrations': '集成',
    'connect': '连接',
    'connection': '连接',
    'build': '构建',
    'building': '构建',
    'create': '创建',
    'creating': '创建',
    'setup': '设置',
    'set up': '设置',
    'install': '安装',
    'installation': '安装',
    'deploy': '部署',
    'deployment': '部署',
    'configure': '配置',
    'configuration': '配置',
    'manage': '管理',
    'management': '管理',
    'monitor': '监控',
    'monitoring': '监控',
    'track': '追踪',
    'tracking': '追踪',
    'analyze': '分析',
    'analysis': '分析',
    'generate': '生成',
    'generation': '生成',
    'report': '报告',
    'reports': '报告',
    'notification': '通知',
    'notifications': '通知',
    'alert': '提醒',
    'alerts': '提醒',
    'schedule': '定时',
    'scheduled': '定时的',
    'recurring': '周期性的',
    'automatic': '自动的',
    'automatically': '自动地',
    'seamless': '无缝',
    'efficient': '高效',
    'productivity': '生产力',
    'efficiency': '效率',
    'beginner': '初学者',
    'advanced': '高级',
    'professional': '专业',
    'enterprise': '企业',
    'business': '商业',
    'personal': '个人',
    'team': '团队',
    'collaboration': '协作',
    'streamline': '简化',
    'optimize': '优化',
    'improve': '改进',
    'enhance': '增强',
    'boost': '提升',
    'increase': '增加',
    'reduce': '减少',
    'eliminate': '消除',
    'avoid': '避免',
    'prevent': '防止',
    'solve': '解决',
    'solution': '解决方案',
    'problem': '问题',
    'challenge': '挑战',
    'issue': '问题',
    'complex': '复杂',
    'complicated': '复杂',
    'simple': '简单',
    'simplicity': '简洁',
    'powerful': '强大',
    'flexible': '灵活',
    'reliable': '可靠',
    'secure': '安全',
    'fast': '快速',
    'quick': '快速',
    'instant': '即时',
    'real-time': '实时',
    'custom': '自定义',
    'customizable': '可定制',
    'intuitive': '直观',
    'user-friendly': '用户友好',
    'easy to use': '易于使用',
    'easy to set up': '易于设置',
    'get started': '开始使用',
    'getting started': '入门',
    'learn how to': '学习如何',
    'discover how to': '发现如何',
    'find out how to': '了解如何',
    'whether you': '无论你',
    'even if you': '即使你',
    'no experience': '无需经验',
    'no coding': '无需编码',
    'no technical': '无需技术',
    'with this': '通过这个',
    'using this': '使用这个',
    'in this': '在这个',
    'for your': '为你的',
    'to your': '到你的',
    'from your': '从你的',
    'about': '关于',
    'what': '什么',
    'when': '何时',
    'where': '哪里',
    'why': '为什么',
    'how': '如何'
  };
  
  // 按长度排序，优先替换长短语
  const sortedKeys = Object.keys(problemMap).sort((a, b) => b.length - a.length);
  
  for (const key of sortedKeys) {
    const value = problemMap[key];
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    translated = translated.replace(regex, value);
  }
  
  // 清理多余的空格和标点
  translated = translated
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?;:])/g, '$1')
    .trim();
  
  return translated.substring(0, 1000);
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
