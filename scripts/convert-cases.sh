#!/bin/bash
# 批量转换 JSON 案例为 Markdown

WORKSPACE_DIR="/root/.openclaw/workspace/openclaw-usecases"
JSON_DIR="$WORKSPACE_DIR/cases-json"
MD_DIR="$WORKSPACE_DIR/cases-markdown"

echo "=== 转换 JSON 案例为 Markdown ==="
echo "JSON 目录：$JSON_DIR"
echo "Markdown 目录：$MD_DIR"
echo ""

# 确保 Markdown 目录存在
mkdir -p "$MD_DIR"

# 按日期目录遍历
for date_dir in "$JSON_DIR"/*/; do
  [ -d "$date_dir" ] || continue
  date_name=$(basename "$date_dir")
  echo "处理日期：$date_name"
  
  for file in "$date_dir"*.json; do
    [ -f "$file" ] || continue
    echo "  转换：$(basename $file)"
    node "$WORKSPACE_DIR/scripts/json-to-markdown.js" "$file"
  done
done

echo ""
echo "=== 生成的 Markdown 文件 ==="
ls -la "$MD_DIR"/*.md 2>/dev/null || echo "暂无 Markdown 文件"
