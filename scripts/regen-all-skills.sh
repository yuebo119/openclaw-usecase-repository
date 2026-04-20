#!/bin/bash
# 重新生成所有 Skills

cd /root/.openclaw/workspace/openclaw-usecases

echo "=== 清理旧文件 ==="
rm -f skills/*.md

echo ""
echo "=== 重新生成所有 Skills ==="

for file in cases-json/*/case-*.json; do
  [ -f "$file" ] || continue
  echo "处理：$(basename $file)"
  node scripts/generate-skill.js "$file"
done

echo ""
echo "=== 生成的 Skill 文件 ==="
ls -la skills/
