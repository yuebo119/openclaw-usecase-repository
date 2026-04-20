#!/bin/bash
# 批量转换 JSON 案例为 Markdown

cd /root/.openclaw/workspace/openclaw-usecases

echo "=== 转换 JSON 案例为 Markdown ==="

for file in inbox/20260420/*.json; do
  echo "处理：$file"
  node scripts/json-to-markdown.js "$file"
done

echo ""
echo "=== 生成的 Markdown 文件 ==="
ls -la inbox/20260420/*.md
