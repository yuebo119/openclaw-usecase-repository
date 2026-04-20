#!/usr/bin/env node
/**
 * 整理旧案例到新目录结构
 * 用法：node organize-cases.js
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = '/root/.openclaw/workspace/openclaw-usecases';
const OLD_JSON_DIR = path.join(WORKSPACE_DIR, 'cases-json');
const NEW_RAW_DIR = path.join(WORKSPACE_DIR, 'cases-raw');

// 分类映射
const CATEGORY_MAP = {
  'automation': 'automation',
  'email': 'email',
  'api': 'api',
  'code': 'code',
  'data': 'data',
  'file_ops': 'data',
  'web_search': 'data',
  'web_fetch': 'data'
};

function organizeCases() {
  console.log('========================================');
  console.log('📁 开始整理案例到新目录');
  console.log('========================================');
  
  let movedCount = 0;
  let errorCount = 0;
  
  if (!fs.existsSync(OLD_JSON_DIR)) {
    console.log('⚠️  旧目录不存在');
    return;
  }
  
  const dateDirs = fs.readdirSync(OLD_JSON_DIR);
  
  for (const dateDir of dateDirs) {
    const oldDatePath = path.join(OLD_JSON_DIR, dateDir);
    if (!fs.statSync(oldDatePath).isDirectory()) continue;
    
    // 格式化日期目录名
    const newDateDir = dateDir.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    const newDatePath = path.join(NEW_RAW_DIR, newDateDir);
    
    const files = fs.readdirSync(oldDatePath);
    
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      const oldFilePath = path.join(oldDatePath, file);
      
      try {
        const content = fs.readFileSync(oldFilePath, 'utf8');
        const caseData = JSON.parse(content);
        
        // 确定分类
        const category = caseData.category || 
                        CATEGORY_MAP[caseData.skills?.[0]] || 
                        'automation';
        
        // 创建新目录
        const categoryDir = path.join(newDatePath, category);
        fs.mkdirSync(categoryDir, { recursive: true });
        
        // 移动文件
        const newFileName = file.replace('案例 -', `案例-${newDateDir.split('-').join('')}-`);
        const newFilePath = path.join(categoryDir, newFileName);
        
        fs.copyFileSync(oldFilePath, newFilePath);
        console.log(`✓ 已移动：${file} → ${category}/${newFileName}`);
        
        movedCount++;
      } catch (e) {
        console.warn(`⚠️  移动失败：${file} - ${e.message}`);
        errorCount++;
      }
    }
  }
  
  console.log('');
  console.log('========================================');
  console.log(`📊 完成！移动了 ${movedCount} 个案例`);
  if (errorCount > 0) {
    console.log(`⚠️  失败：${errorCount} 个`);
  }
  console.log('========================================');
}

try {
  organizeCases();
} catch (error) {
  console.error(`❌ 错误：${error.message}`);
  process.exit(1);
}
