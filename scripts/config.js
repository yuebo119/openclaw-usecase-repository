#!/usr/bin/env node
/**
 * 统一配置文件
 * 所有脚本使用此配置
 */

const path = require('path');

// 工作区根目录
const WORKSPACE_DIR = '/root/.openclaw/workspace/openclaw-usecases';

// 目录结构
const DIRECTORIES = {
  // 原始采集案例（按日期 + 分类）
  RAW: path.join(WORKSPACE_DIR, 'cases-raw'),
  
  // 已处理案例（按分类）
  PROCESSED: path.join(WORKSPACE_DIR, 'cases-processed'),
  
  // 技能文件（按分类）
  SKILLS: path.join(WORKSPACE_DIR, 'skills'),
  
  // 教程（按难度）
  TUTORIALS: path.join(WORKSPACE_DIR, 'tutorials'),
  
  // 文档
  DOCS: path.join(WORKSPACE_DIR, 'docs'),
  
  // 脚本
  SCRIPTS: path.join(WORKSPACE_DIR, 'scripts')
};

// 分类配置
const CATEGORIES = {
  AUTOMATION: 'automation',  // 自动化
  EMAIL: 'email',           // 邮件
  API: 'api',               // API 集成
  CODE: 'code',             // 代码
  DATA: 'data'              // 数据
};

// 分类中文映射
const CATEGORY_CN = {
  'automation': '自动化',
  'email': '邮件',
  'api': 'API',
  'code': '代码',
  'data': '数据'
};

// 技能到分类的映射
const SKILL_TO_CATEGORY = {
  'cron': 'automation',
  'web_search': 'data',
  'web_fetch': 'data',
  'file_ops': 'data',
  'api_integration': 'api',
  'data_analysis': 'data',
  'email': 'email',
  'code': 'code'
};

// Tavily API 配置
const TAVILY = {
  API_KEY: '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',
  ENDPOINT: 'https://api.tavily.com/search'
};

// 日志文件
const LOGS = {
  DEDUP: '/var/log/openclaw-dedup.log',
  COLLECT: '/var/log/openclaw-collect.log',
  SYNC: '/var/log/openclaw-sync.log'
};

// 文件命名格式
const FILENAMING = {
  // 案例文件：案例 -YYYY-MM-DD-序号 - 分类 - 标题 - 描述.json
  CASE: '案例-{date}-{seq}-{category}-{title}-{desc}.json',
  
  // Skill 文件：技能 -YYYY-MM-DD-序号 - 分类 - 标题 - 描述.md
  SKILL: '技能-{date}-{seq}-{category}-{title}-{desc}.md',
  
  // 日期格式
  DATE_FORMAT: 'YYYY-MM-DD',
  DATE_ID_FORMAT: 'YYYYMMDD'
};

// 去重配置
const DEDUP = {
  // 标题相似度阈值（> 85% 视为重复）
  TITLE_SIMILARITY_THRESHOLD: 0.85,
  
  // 近期相似检查天数（7 天内）
  RECENT_DAYS: 7,
  
  // 近期相似度阈值（> 70% 视为重复）
  RECENT_SIMILARITY_THRESHOLD: 0.70
};

// 翻译配置
const TRANSLATION = {
  // 标题最大长度
  MAX_TITLE_LENGTH: 30,
  
  // 描述最大长度
  MAX_DESC_LENGTH: 20
};

module.exports = {
  WORKSPACE_DIR,
  DIRECTORIES,
  CATEGORIES,
  CATEGORY_CN,
  SKILL_TO_CATEGORY,
  TAVILY,
  LOGS,
  FILENAMING,
  DEDUP,
  TRANSLATION
};
