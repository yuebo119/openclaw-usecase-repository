#!/usr/bin/env node
/**
 * 使用大模型 API 翻译案例内容
 * 提供更准确、更自然的翻译
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 配置（从 openclaw.json 读取或使用默认）
const LLM_CONFIG = {
  provider: 'bailian',  // 通义千问
  baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.DASHSCOPE_API_KEY || 'sk-sp-296e23041e464180a4b26a24ade5c883',
  model: 'qwen3.5-plus',
  maxTokens: 4096
};

const WORKSPACE_DIR = '/root/.openclaw/workspace/openclaw-usecases';
const RAW_DIR = path.join(WORKSPACE_DIR, 'cases-raw');

/**
 * 调用大模型 API 进行翻译
 */
function translateWithLLM(text, context = 'case') {
  return new Promise((resolve, reject) => {
    const systemPrompt = `你是一个专业的技术文档翻译专家，擅长将英文技术内容翻译成自然流畅的中文。
    
翻译要求：
1. 保持技术术语的准确性（如 API、GitHub、OpenClaw 等保留英文）
2. 翻译要自然流畅，符合中文表达习惯
3. 保留原文的结构和格式
4. 不要添加额外内容，只翻译`;

    const userPrompt = `请将以下内容翻译成中文：

${text}

请直接输出翻译结果，不要解释。`;

    const data = JSON.stringify({
      model: LLM_CONFIG.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: LLM_CONFIG.maxTokens,
      temperature: 0.3,
      top_p: 0.8
    });

    const options = {
      hostname: 'dashscope.aliyuncs.com',
      port: 443,
      path: '/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LLM_CONFIG.apiKey}`,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          console.log(`      API 响应状态：${res.statusCode}`);
          const result = JSON.parse(body);
          
          // OpenAI 兼容格式
          if (result.choices && result.choices[0] && result.choices[0].message) {
            const translatedText = result.choices[0].message.content;
            console.log(`      翻译结果：${translatedText.substring(0, 100)}...`);
            resolve(translatedText);
          } else if (result.message) {
            reject(new Error(result.message));
          } else {
            reject(new Error('翻译失败：' + body));
          }
        } catch (e) {
          console.error(`      解析错误：${e.message}`);
          console.error(`      原始响应：${body.substring(0, 500)}`);
          reject(new Error('解析失败：' + e.message));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('请求超时'));
    });
    req.setTimeout(30000);
    req.write(data);
    req.end();
  });
}

/**
 * 翻译案例对象
 */
async function translateCase(caseData) {
  console.log(`  🔄 翻译：${caseData.id}`);
  
  const translatedCase = { ...caseData };
  
  try {
    // 翻译标题
    if (caseData.title) {
      console.log('    - 翻译标题...');
      translatedCase.title = await translateWithLLM(caseData.title, 'title');
      console.log(`    ✓ ${translatedCase.title}`);
    }
    
    // 翻译问题描述
    if (caseData.problem) {
      console.log('    - 翻译问题描述...');
      translatedCase.problem = await translateWithLLM(caseData.problem, 'problem');
      console.log(`    ✓ ${translatedCase.problem.substring(0, 50)}...`);
    }
    
    // 翻译工作流
    if (caseData.workflow) {
      if (caseData.workflow.trigger) {
        console.log('    - 翻译触发条件...');
        translatedCase.workflow.trigger = await translateWithLLM(caseData.workflow.trigger, 'trigger');
      }
      if (caseData.workflow.steps && caseData.workflow.steps.length > 0) {
        console.log('    - 翻译步骤...');
        const stepsText = caseData.workflow.steps.join('\n');
        const translatedSteps = await translateWithLLM(stepsText, 'steps');
        translatedCase.workflow.steps = translatedSteps.split('\n').filter(s => s.trim());
      }
      if (caseData.workflow.output) {
        console.log('    - 翻译输出...');
        translatedCase.workflow.output = await translateWithLLM(caseData.workflow.output, 'output');
      }
    }
    
    // 更新文件名（使用翻译后的标题）
    const date = caseData.id.match(/case-(\d{8})/);
    const dateStr = date ? date[1] : new Date().toISOString().split('T')[0].replace(/-/g, '');
    const seqNum = caseData.id.split('-').pop();
    const category = caseData.category || 'data';
    const shortTitle = translatedCase.title.substring(0, 20).replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');
    const chineseDesc = generateChineseDescription(translatedCase);
    
    translatedCase.filename = `案例-${dateStr}-${seqNum}-${category}-${shortTitle}-${chineseDesc}`;
    translatedCase.metadata.translated = true;
    translatedCase.metadata.translatedAt = new Date().toISOString();
    translatedCase.metadata.translator = 'qwen3.5-plus';
    
    return translatedCase;
  } catch (error) {
    console.error(`    ❌ 翻译失败：${error.message}`);
    // 翻译失败时返回原数据
    return caseData;
  }
}

/**
 * 生成中文描述
 */
function generateChineseDescription(caseData) {
  const text = (caseData.title + ' ' + caseData.problem).toLowerCase();
  
  const keywordMap = {
    '数据收集': ['收集', '采集', 'extract', 'search'],
    '邮件自动化': ['gmail', 'email', '邮件'],
    '定时任务': ['cron', '定时', 'schedule'],
    'API 集成': ['api', '接口'],
    '代码自动化': ['代码', 'code', 'commit', 'git'],
    '报告生成': ['报告', 'report', 'summary'],
    '消息推送': ['telegram', 'discord', 'whatsapp'],
    '自动化工作流': ['自动化', 'workflow']
  };
  
  for (const [desc, keywords] of Object.entries(keywordMap)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        return desc;
      }
    }
  }
  
  return '自动化案例';
}

/**
 * 加载并翻译所有案例
 */
async function translateAllCases() {
  console.log('========================================');
  console.log('🤖 使用大模型翻译案例内容');
  console.log('========================================');
  
  const dateDirs = fs.readdirSync(RAW_DIR);
  let totalCases = 0;
  let translatedCases = 0;
  
  for (const dateDir of dateDirs) {
    const datePath = path.join(RAW_DIR, dateDir);
    if (!fs.statSync(datePath).isDirectory()) continue;
    
    const categories = fs.readdirSync(datePath);
    
    for (const category of categories) {
      const categoryPath = path.join(datePath, category);
      if (!fs.statSync(categoryPath).isDirectory()) continue;
      
      const files = fs.readdirSync(categoryPath);
      
      for (const file of files) {
        if (!file.endsWith('.json')) continue;
        
        const filePath = path.join(categoryPath, file);
        totalCases++;
        
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const caseData = JSON.parse(content);
          
          // 如果已经翻译过，跳过
          if (caseData.metadata?.translated) {
            console.log(`⏭️  已翻译：${file}`);
            continue;
          }
          
          // 翻译案例
          const translatedCase = await translateCase(caseData);
          
          // 如果文件名改变，移动文件
          if (translatedCase.filename !== caseData.filename) {
            const oldPath = filePath;
            const newPath = path.join(categoryPath, `${translatedCase.filename}.json`);
            
            fs.writeFileSync(newPath, JSON.stringify(translatedCase, null, 2), 'utf8');
            if (oldPath !== newPath) {
              fs.unlinkSync(oldPath);
            }
            
            console.log(`  ✅ 已翻译并保存：${translatedCase.filename}.json`);
          } else {
            fs.writeFileSync(filePath, JSON.stringify(translatedCase, null, 2), 'utf8');
            console.log(`  ✅ 已更新：${file}`);
          }
          
          translatedCases++;
          
          // 避免 API 限流，等待一下
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`❌ 处理失败：${file} - ${error.message}`);
        }
      }
    }
  }
  
  console.log('');
  console.log('========================================');
  console.log(`📊 翻译完成！`);
  console.log(`   总案例数：${totalCases}`);
  console.log(`   已翻译：${translatedCases}`);
  console.log('========================================');
}

// 主流程
(async () => {
  try {
    await translateAllCases();
  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
})();
