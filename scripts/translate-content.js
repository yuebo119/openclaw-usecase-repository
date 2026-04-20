#!/usr/bin/env node
/**
 * 内容翻译模块 - 将英文内容翻译成中文
 */

// 完整的中英文映射表
const translationMap = {
  // OpenClaw 相关
  'OpenClaw': 'OpenClaw',
  'ClawHub': 'ClawHub',
  'Workflow': '工作流',
  'Workflows': '工作流',
  'Automation': '自动化',
  'Automations': '自动化',
  'Use Cases': '用例',
  'Use Case': '用例',
  'Tutorial': '教程',
  'Guide': '指南',
  'Complete': '完整',
  'Full': '完整',
  'Best Practices': '最佳实践',
  'What is': '什么是',
  'What Is': '什么是',
  'The': '',
  'A': '',
  'An': '',
  'for': '',
  'and': '',
  'with': '',
  'to': '',
  'of': '',
  'in': '',
  'on': '',
  'from': '',
  
  // 功能相关
  'Email': '邮件',
  'Gmail': 'Gmail',
  'Digest': '摘要',
  'Report': '报告',
  'Reports': '报告',
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
  
  // 技术相关
  'GitHub': 'GitHub',
  'Trending': '热门',
  'Repository': '仓库',
  'Project': '项目',
  'Open Source': '开源',
  'Business': '商业',
  'Startup': '创业',
  'Team': '团队',
  'Product': '产品',
  'Tool': '工具',
  'Platform': '平台',
  'Service': '服务',
  'System': '系统',
  'Framework': '框架',
  'Template': '模板',
  'Example': '示例',
  'Beginner': '入门',
  'Advanced': '高级',
  'Professional': '专业',
  'Enterprise': '企业',
  
  // 动作相关
  'Create': '创建',
  'Build': '构建',
  'Make': '制作',
  'Send': '发送',
  'Get': '获取',
  'Receive': '接收',
  'Process': '处理',
  'Analyze': '分析',
  'Track': '跟踪',
  'Manage': '管理',
  'Organize': '整理',
  'Generate': '生成',
  'Extract': '提取',
  'Save': '保存',
  'Store': '存储',
  'Share': '分享',
  'Connect': '连接',
  'Sync': '同步',
  'Update': '更新',
  'Delete': '删除',
  'Search': '搜索',
  'Find': '查找',
  'Read': '读取',
  'Write': '写入',
  
  // 描述性词汇
  'Easy': '简单',
  'Simple': '简单',
  'Fast': '快速',
  'Quick': '快速',
  'Smart': '智能',
  'Auto': '自动',
  'Automatic': '自动',
  'Manual': '手动',
  'Free': '免费',
  'Paid': '付费',
  'New': '新',
  'Latest': '最新',
  'Old': '旧',
  'Popular': '流行',
  'Top': '顶级',
  'Better': '更好',
  'Best': '最佳',
  'Good': '好',
  'Great': '优秀',
  'Amazing': '惊人',
  'Powerful': '强大',
  'Useful': '有用',
  'Helpful': '有帮助',
  'Important': '重要',
  'Critical': '关键',
  'Essential': '必备',
  'Necessary': '必要',
  'Required': '必需',
  'Optional': '可选',
  'Available': '可用',
  'Ready': '就绪',
  'Active': '活跃',
  'Live': '实时',
  'Real-time': '实时',
  'Online': '在线',
  'Offline': '离线',
  'Cloud': '云端',
  'Local': '本地',
  'Remote': '远程',
  'Secure': '安全',
  'Private': '私有',
  'Public': '公开',
  'Open': '开放',
  'Closed': '封闭'
};

// 翻译标题
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

// 翻译问题描述
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
    'workflow': '工作流'
  };
  
  for (const [en, zh] of Object.entries(commonMap)) {
    translated = translated.replace(new RegExp(en, 'gi'), zh);
  }
  
  return translated.substring(0, 500);
}

// 翻译工作流步骤
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
  translateSteps
};
