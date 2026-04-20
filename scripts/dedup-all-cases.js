#!/usr/bin/env node
/**
 * 批量去重已有案例
 * 使用最新目录结构
 */

const fs = require('fs');
const path = require('path');
const config = require('./config');
const { dedupCheck, loadExistingCases } = require('./dedup-check');

const LOG_FILE = config.LOGS.DEDUP;

function log(message) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}`;
  console.log(logLine);
  fs.appendFileSync(LOG_FILE, logLine + '\n');
}

/**
 * 加载所有案例文件（带路径信息）
 */
function loadAllCaseFiles() {
  const caseFiles = [];
  const rawDir = config.DIRECTORIES.RAW;
  
  if (!fs.existsSync(rawDir)) {
    return caseFiles;
  }
  
  const dateDirs = fs.readdirSync(rawDir);
  
  for (const dateDir of dateDirs) {
    const datePath = path.join(rawDir, dateDir);
    if (!fs.statSync(datePath).isDirectory()) continue;
    
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
          caseFiles.push({
            path: filePath,
            filename: file,
            category: category,
            data: caseData
          });
        } catch (e) {
          log(`⚠️  读取失败：${file} - ${e.message}`);
        }
      }
    }
  }
  
  return caseFiles;
}

/**
 * 删除案例文件（JSON 和对应的 Skill）
 */
function deleteCaseFiles(caseFile) {
  const deleted = [];
  
  // 删除 JSON 文件
  if (fs.existsSync(caseFile.path)) {
    fs.unlinkSync(caseFile.path);
    deleted.push(caseFile.path);
    log(`  🗑️  已删除：${caseFile.filename}`);
  }
  
  // 删除对应的 Skill 文件
  const caseId = caseFile.data.id;
  const seqNum = caseId.split('-').pop();
  const date = caseId.match(/case-(\d{8})/);
  
  if (date && seqNum) {
    const dateStr = `${date[1].substring(0,4)}-${date[1].substring(4,6)}-${date[1].substring(6,8)}`;
    const skillPattern = `技能-${dateStr}-${seqNum}-`;
    
    const skillsDir = config.DIRECTORIES.SKILLS;
    if (fs.existsSync(skillsDir)) {
      // 遍历所有分类目录
      const categories = fs.readdirSync(skillsDir);
      for (const category of categories) {
        const categoryPath = path.join(skillsDir, category);
        if (!fs.statSync(categoryPath).isDirectory()) continue;
        
        const skillFiles = fs.readdirSync(categoryPath);
        for (const skillFile of skillFiles) {
          if (skillFile.includes(skillPattern)) {
            const skillPath = path.join(categoryPath, skillFile);
            fs.unlinkSync(skillPath);
            deleted.push(skillPath);
            log(`  🗑️  已删除 Skill: ${skillFile}`);
          }
        }
      }
    }
  }
  
  return deleted;
}

/**
 * 主去重流程
 */
function dedupAllCases() {
  log('========================================');
  log('🔄 开始批量去重已有案例');
  log('========================================');
  
  const allCaseFiles = loadAllCaseFiles();
  log(`📊 加载到 ${allCaseFiles.length} 个案例文件`);
  
  if (allCaseFiles.length === 0) {
    log('✅ 没有案例需要去重');
    return;
  }
  
  // 按日期排序，保留最新的
  allCaseFiles.sort((a, b) => {
    const dateA = a.data.metadata?.collectedAt || '';
    const dateB = b.data.metadata?.collectedAt || '';
    return dateB.localeCompare(dateA); // 新的在前
  });
  
  const keepCases = [];
  const duplicateCases = [];
  
  log('');
  log('🔍 开始检测重复...');
  
  for (const caseFile of allCaseFiles) {
    // 构建临时案例列表（只包含要保留的）
    const existingCases = keepCases.map(c => c.data);
    
    // 去重检查
    const result = dedupCheck(caseFile.data);
    
    if (result.isDuplicate) {
      duplicateCases.push({
        ...caseFile,
        reason: result.reason
      });
      log(`❌ 重复：${caseFile.filename}`);
      log(`   原因：${result.reason}`);
    } else {
      keepCases.push(caseFile);
      log(`✅ 保留：${caseFile.filename}`);
    }
  }
  
  log('');
  log('========================================');
  log(`📊 统计结果:`);
  log(`   总案例数：${allCaseFiles.length}`);
  log(`   保留：${keepCases.length}`);
  log(`   重复：${duplicateCases.length}`);
  log('========================================');
  
  if (duplicateCases.length > 0) {
    log('');
    log('🗑️  开始删除重复案例...');
    
    let deletedCount = 0;
    for (const dupCase of duplicateCases) {
      const deleted = deleteCaseFiles(dupCase);
      if (deleted.length > 0) {
        deletedCount++;
      }
    }
    
    log('');
    log('========================================');
    log(`✅ 完成！删除了 ${deletedCount} 个重复案例`);
    log('========================================');
  } else {
    log('');
    log('✅ 没有发现重复案例！');
  }
}

// 执行
try {
  dedupAllCases();
} catch (error) {
  log(`❌ 错误：${error.message}`);
  console.error(error);
  process.exit(1);
}
