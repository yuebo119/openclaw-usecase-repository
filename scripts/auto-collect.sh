#!/bin/bash
# OpenClaw 案例自动收集脚本（带 Skills 提取）
NODE_ID=${1:-node-01}
WORKSPACE_DIR="/root/.openclaw/workspace/openclaw-usecases"
JSON_DIR="$WORKSPACE_DIR/cases-json"
DATE=$(date +%Y%m%d)

mkdir -p "$JSON_DIR/$DATE"

# 创建示例案例（包含完整的 skills 信息）
cat > "$JSON_DIR/$DATE/case-$DATE-001.json" << EOF
{
  "id": "case-$DATE-001",
  "title": "自动化案例-$DATE",
  "category": ["automation"],
  "difficulty": "beginner",
  "source": {
    "url": "https://example.com",
    "platform": "Auto"
  },
  "problem": "自动化需求",
  "workflow": {
    "trigger": "定时任务",
    "steps": ["执行"],
    "output": "结果"
  },
  "skills": ["web_search", "file_ops", "cron"],
  "integrations": ["GitHub API"],
  "efficiency": {
    "timeSaved": "每天 1 小时",
    "automationLevel": "full-auto"
  },
  "metadata": {
    "nodeId": "$NODE_ID",
    "collectedAt": "$(date -Iseconds)"
  },
  "status": "inbox"
}
EOF

echo "✓ 案例已创建：$JSON_DIR/$DATE/case-$DATE-001.json"
echo "✓ 包含 Skills: web_search, file_ops, cron"
