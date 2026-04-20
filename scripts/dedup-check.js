#!/usr/bin/env node
/**
 * 案例去重检查模块
 * 检测新案例是否与已有案例重复
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = '/root/.openclaw/workspace/openclaw-usecases';
const JSON_DIR = path.join(WORKSPACE_DIR, 'cases-json');

/**
 * 计算两个字符串的相似度 (Levenshtein 距离)
 */
function stringSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  
  const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null)
  );
  
  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }
  
  const distance = track[str2.length][str1.length];
  const maxLength = Math.max(str1.length, str2.length);
  return 1 - (distance / maxLength);
}

/**
 * 检查 URL 是否已存在
 */
function checkUrlDuplicate(newUrl, existingCases) {
  for (const existing of existingCases) {
    if (existing.source && existing.source.url === newUrl) {
      return {
        isDuplicate: true,
        reason: `URL 重复：${newUrl}`,
        existingFile: existing.filename
      };
    }
  }
  return { isDuplicate: false };
}

/**
 * 检查标题相似度
 */
function checkTitleDuplicate(newTitle, existingCases, threshold = 0.85) {
  for (const existing of existingCases) {
    if (!existing.title) continue;
    
    const similarity = stringSimilarity(newTitle.toLowerCase(), existing.title.toLowerCase());
    
    if (similarity > threshold) {
      return {
        isDuplicate: true,
        reason: `标题相似度过高 (${(similarity * 100).toFixed(1)}%): ${existing.title}`,
        existingFile: existing.filename,
        similarity: similarity
      };
    }
  }
  return { isDuplicate: false };
}

/**
 * 检查 7 天内相同分类的相似案例
 */
function checkRecentDuplicate(newCase, existingCases, days = 7) {
  const newDate = new Date(newCase.metadata?.collectedAt || Date.now());
  const thresholdTime = new Date(newDate.getTime() - (days * 24 * 60 * 60 * 1000));
  
  for (const existing of existingCases) {
    if (!existing.metadata?.collectedAt) continue;
    
    const existingDate = new Date(existing.metadata.collectedAt);
    if (existingDate < thresholdTime) continue;
    
    // 检查分类是否相同
    const newCategory = newCase.category?.[0] || 'automation';
    const existingCategory = existing.category?.[0] || 'automation';
    
    if (newCategory !== existingCategory) continue;
    
    // 检查标题相似度
    const similarity = stringSimilarity(
      (newCase.title || '').toLowerCase(),
      (existing.title || '').toLowerCase()
    );
    
    if (similarity > 0.7) {
      return {
        isDuplicate: true,
        reason: `${days}天内相同分类的相似案例 (${(similarity * 100).toFixed(1)}%)`,
        existingFile: existing.filename,
        similarity: similarity
      };
    }
  }
  
  return { isDuplicate: false };
}

/**
 * 加载已有案例
 */
function loadExistingCases() {
  const existingCases = [];
  
  // 遍历所有日期目录
  if (!fs.existsSync(JSON_DIR)) {
    return existingCases;
  }
  
  const dateDirs = fs.readdirSync(JSON_DIR);
  
  for (const dateDir of dateDirs) {
    const datePath = path.join(JSON_DIR, dateDir);
    if (!fs.statSync(datePath).isDirectory()) continue;
    
    const files = fs.readdirSync(datePath);
    
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      const filePath = path.join(datePath, file);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const caseData = JSON.parse(content);
        existingCases.push(caseData);
      } catch (e) {
        console.warn(`⚠️  读取文件失败：${file}`);
      }
    }
  }
  
  return existingCases;
}

/**
 * 主去重检查函数
 */
function dedupCheck(newCase) {
  const existingCases = loadExistingCases();
  
  console.log(`🔍 开始去重检查...`);
  console.log(`   已有案例数：${existingCases.length}`);
  
  // 1. URL 去重
  if (newCase.source?.url) {
    const urlCheck = checkUrlDuplicate(newCase.source.url, existingCases);
    if (urlCheck.isDuplicate) {
      console.log(`❌ ${urlCheck.reason}`);
      return urlCheck;
    }
  }
  
  // 2. 标题相似度去重
  if (newCase.title) {
    const titleCheck = checkTitleDuplicate(newCase.title, existingCases);
    if (titleCheck.isDuplicate) {
      console.log(`❌ ${titleCheck.reason}`);
      return titleCheck;
    }
  }
  
  // 3. 近期相似案例去重
  const recentCheck = checkRecentDuplicate(newCase, existingCases);
  if (recentCheck.isDuplicate) {
    console.log(`❌ ${recentCheck.reason}`);
    return recentCheck;
  }
  
  console.log(`✅ 通过去重检查`);
  return { isDuplicate: false };
}

// CLI 模式
if (require.main === module) {
  const caseFile = process.argv[2];
  
  if (!caseFile) {
    console.error('用法：node dedup-check.js <case-file.json>');
    process.exit(1);
  }
  
  try {
    const newCase = JSON.parse(fs.readFileSync(caseFile, 'utf8'));
    const result = dedupCheck(newCase);
    
    if (result.isDuplicate) {
      console.log('\n⚠️  检测到重复案例，建议跳过或手动处理');
      process.exit(1);
    } else {
      console.log('\n✅ 案例无重复，可以保存');
      process.exit(0);
    }
  } catch (e) {
    console.error(`❌ 错误：${e.message}`);
    process.exit(1);
  }
}

module.exports = {
  dedupCheck,
  stringSimilarity,
  loadExistingCases
};
