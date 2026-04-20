#!/usr/bin/env node
/**
 * 使用 Tavily API 搜索并收集 OpenClaw 案例（全中文翻译版）
 * 用法：node collect-with-tavily.js [search-query]
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { translateTitle, translateProblem, translateSteps } = require('./translate-content');
const { dedupCheck } = require('./dedup-check');

// Tavily API 配置
const TAVILY_API_KEY = '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';
const WORKSPACE_DIR = '/root/.openclaw/workspace/openclaw-usecases';
const RAW_DIR = path.join(WORKSPACE_DIR, 'cases-raw');

// 分类映射
const CATEGORY_MAP = {
  'automation': 'automation',
  'email': 'email',
  'api': 'api',
  'code': 'code',
  'data': 'data'
};

// 中文分类名
const CATEGORY_CN = {
  'automation': '自动化',
  'email': '邮件',
  'api': 'API',
  'code': '代码',
  'data': '数据'
};

// 搜索查询
const searchQuery = process.argv[2] || 'OpenClaw use cases automation workflow';

console.log('🔍 使用 Tavily 搜索案例...');
console.log(`查询：${searchQuery}`);
console.log('');

// Tavily 搜索函数
function tavilySearch(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      query: query,
      search_depth: 'advanced',
      include_answer: true,
      max_results: 10
    });

    const options = {
      hostname: 'api.tavily.com',
      port: 443,
      path: '/search',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': `Bearer ${TAVILY_API_KEY}`
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error(`解析失败：${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// 从内容中提取技能并确定分类
function extractSkillsAndCategory(text) {
  const skillKeywords = {
    'web_search': ['搜索', 'search'],
    'web_fetch': ['爬取', 'fetch', 'scrape'],
    'file_ops': ['文件', 'file', 'save'],
    'cron': ['定时', 'schedule', 'cron'],
    'api_integration': ['API', '接口'],
    'data_analysis': ['分析', 'analysis']
  };
  
  const detectedSkills = [];
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
  
  const primarySkill = detectedSkills[0] || 'web_search';
  const category = CATEGORY_MAP[primarySkill] || 'data';
  
  return {
    skills: detectedSkills.length > 0 ? detectedSkills : ['web_search'],
    category: category
  };
}

// 生成中文描述
function generateChineseFilename(title, content) {
  const fullText = (title + ' ' + content).toLowerCase();
  
  const keywordMap = {
    '数据收集': ['收集', '采集', 'extract'],
    '邮件自动化': ['gmail', 'email', '邮件'],
    '定时任务': ['cron', '定时', 'schedule'],
    'API 集成': ['api', '接口'],
    '代码自动化': ['代码', 'code', 'commit'],
    '报告生成': ['报告', 'report', 'summary'],
    '消息推送': ['telegram', 'discord', 'whatsapp'],
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

// 从搜索结果生成案例（全中文翻译）
function generateCaseFromResult(result, index) {
  const date = new Date().toISOString().split('T')[0];
  const caseId = `case-${date}-${String(index + 1).padStart(3, '0')}`;
  
  // 翻译标题为中文
  const chineseTitle = translateTitle(result.title);
  
  // 提取技能和分类
  const { skills, category } = extractSkillsAndCategory(result.content + result.title);
  const categoryCn = CATEGORY_CN[category] || category;
  
  // 生成中文描述用于文件名
  const chineseDesc = generateChineseFilename(result.title, result.content);
  
  // 文件名格式：案例 - 日期 - 序号 - 分类 - 标题关键词 - 描述
  const chineseFilename = `案例-${date}-${String(index + 1).padStart(3, '0')}-${category}-${chineseTitle}-${chineseDesc}`;
  
  // 彻底翻译问题描述
  const chineseProblem = translateProblem(result.content.substring(0, 500)) || '自动化需求描述';
  
  return {
    id: caseId,
    filename: chineseFilename,
    category: category,
    categoryCn: categoryCn,
    // 全部使用中文
    title: chineseTitle,
    categoryTags: ['automation', 'productivity'],
    difficulty: 'intermediate',
    source: {
      url: result.url,
      platform: 'Tavily 搜索',
      collectedAt: new Date().toISOString()
    },
    // 彻底翻译问题描述
    problem: chineseProblem,
    workflow: {
      trigger: '定时任务或事件触发',
      // 翻译步骤
      steps: translateSteps([
        '触发条件满足',
        '执行自动化流程',
        '输出结果'
      ]),
      output: '自动化任务完成'
    },
    skills: skills,
    integrations: [],
    efficiency: {
      timeSaved: '自动化节省时间',
      automationLevel: 'semi-auto'
    },
    metadata: {
      nodeId: 'node-01',
      collectedAt: new Date().toISOString(),
      source: 'tavily',
      chineseDesc: chineseDesc,
      originalTitle: result.title
    },
    status: 'raw'
  };
}

// 主流程
(async () => {
  try {
    console.log('📡 调用 Tavily API...');
    const searchResult = await tavilySearch(searchQuery);
    
    console.log(`✅ 搜索到 ${searchResult.results?.length || 0} 个结果`);
    console.log('');
    
    // 确保目录存在
    const dateDir = path.join(RAW_DIR, new Date().toISOString().split('T')[0]);
    fs.mkdirSync(dateDir, { recursive: true });
    
    // 生成案例文件（带重复检查和分类）
    let caseCount = 0;
    let duplicateCount = 0;
    const categoryStats = {};
    
    for (const result of searchResult.results || []) {
      const caseData = generateCaseFromResult(result, caseCount);
      
      // 去重检查
      const dedupResult = dedupCheck(caseData);
      if (dedupResult.isDuplicate) {
        console.log(`⚠️  跳过重复案例：${caseData.filename}`);
        console.log(`   原因：${dedupResult.reason}`);
        duplicateCount++;
        continue;
      }
      
      // 创建分类目录
      const categoryDir = path.join(dateDir, caseData.category);
      fs.mkdirSync(categoryDir, { recursive: true });
      
      // 保存 JSON 文件
      const caseFile = path.join(categoryDir, `${caseData.filename}.json`);
      fs.writeFileSync(caseFile, JSON.stringify(caseData, null, 2), 'utf8');
      console.log(`✓ 案例已保存：${caseData.category}/${caseData.filename}.json`);
      
      // 统计
      categoryStats[caseData.category] = (categoryStats[caseData.category] || 0) + 1;
      caseCount++;
    }
    
    console.log('');
    console.log('========================================');
    console.log(`📊 统计：新增 ${caseCount} 个，跳过 ${duplicateCount} 个重复`);
    console.log('========================================');
    console.log('分类统计:');
    for (const [cat, count] of Object.entries(categoryStats)) {
      console.log(`  ${CATEGORY_CN[cat] || cat}: ${count}个`);
    }
    console.log('========================================');
    
    // 生成 Skills
    console.log('');
    console.log('🔧 生成 Skills...');
    const { execSync } = require('child_process');
    try {
      execSync(`${WORKSPACE_DIR}/scripts/gen-skills.js`, { stdio: 'inherit' });
    } catch (e) {
      console.log('⚠️  Skills 生成失败，可以手动运行：node scripts/gen-skills.js');
    }
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
})();
