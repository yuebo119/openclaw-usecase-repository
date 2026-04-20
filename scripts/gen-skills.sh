#!/bin/bash
# 为所有案例生成 Skills

cd /root/.openclaw/workspace/openclaw-usecases

echo "=== 为案例生成 Skills ==="

for file in cases-json/*/*.json; do
  [ -f "$file" ] || continue
  echo "生成：$(basename "$file")"
  node scripts/generate-skill.js "$file"
done

echo ""
echo "=== 生成的 Skill 文件 ==="
ls -la skills/
