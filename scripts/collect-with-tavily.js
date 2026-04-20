#!/usr/bin/env node
/**
 * 使用 Tavily API 搜索并收集 OpenClaw 案例
 * 用法：node collect-with-tavily.js [search-query]
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Tavily API 配置
const TAVILY_API_KEY = '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';
const WORKSPACE_DIR = '/root/.openclaw/workspace/openclaw-usecases';
const JSON_DIR = path.join(WORKSPACE_DIR, 'cases-json');

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
      max_results: 10,
      include_domains: [],
      exclude_domains: []
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
          const result = JSON.parse(body);
          resolve(result);
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

// 从搜索结果生成案例
function generateCaseFromResult(result, index) {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const caseId = `case-${date}-${String(index + 1).padStart(3, '0')}`;
  
  // 从内容中提取技能
  const extractedSkills = extractSkills(result.content + result.title);
  
  return {
    id: caseId,
    title: result.title,
    category: ['automation', 'productivity'],
    difficulty: 'intermediate',
    source: {
      url: result.url,
      platform: 'Tavily Search',
      collectedAt: new Date().toISOString()
    },
    problem: result.content.substring(0, 500) + '...',
    workflow: {
      trigger: '定时任务或事件触发',
      steps: [
        '触发条件满足',
        '执行自动化流程',
        '输出结果'
      ],
      output: '自动化任务完成'
    },
    skills: extractedSkills.skills,
    integrations: extractedSkills.integrations,
    efficiency: {
      timeSaved: '自动化节省时间',
      automationLevel: 'semi-auto'
    },
    metadata: {
      nodeId: 'node-01',
      collectedAt: new Date().toISOString(),
      source: 'tavily'
    },
    status: 'inbox'
  };
}

// 提取技能
function extractSkills(text) {
  const skillKeywords = {
    'web_search': ['搜索', 'search'],
    'web_fetch': ['爬取', 'fetch', 'scrape'],
    'file_ops': ['文件', 'file', 'save'],
    'cron': ['定时', 'schedule', 'cron'],
    'api_integration': ['API', '接口'],
    'data_analysis': ['分析', 'analysis']
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
  
  return {
    skills: detectedSkills.length > 0 ? detectedSkills : ['web_search'],
    integrations: detectedIntegrations
  };
}

// 主流程
(async () => {
  try {
    // 搜索
    console.log('📡 调用 Tavily API...');
    const searchResult = await tavilySearch(searchQuery);
    
    console.log(`✅ 搜索到 ${searchResult.results?.length || 0} 个结果`);
    console.log('');
    
    // 确保目录存在
    const dateDir = path.join(JSON_DIR, new Date().toISOString().split('T')[0].replace(/-/g, ''));
    fs.mkdirSync(dateDir, { recursive: true });
    
    // 生成案例文件
    let caseCount = 0;
    for (const result of searchResult.results || []) {
      const caseData = generateCaseFromResult(result, caseCount);
      const caseFile = path.join(dateDir, `${caseData.id}.json`);
      
      fs.writeFileSync(caseFile, JSON.stringify(caseData, null, 2), 'utf8');
      console.log(`✓ 案例已保存：${caseFile}`);
      caseCount++;
    }
    
    console.log('');
    console.log('========================================');
    console.log(`✅ 完成！共收集 ${caseCount} 个案例`);
    console.log('========================================');
    
    // 生成 Skills
    console.log('');
    console.log('🔧 生成 Skills...');
    const { execSync } = require('child_process');
    try {
      execSync(`${WORKSPACE_DIR}/scripts/gen-skills.sh`, { stdio: 'inherit' });
    } catch (e) {
      console.log('⚠️  Skills 生成失败，可以手动运行：./scripts/gen-skills.sh');
    }
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
})();
