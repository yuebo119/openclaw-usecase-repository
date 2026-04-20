#!/bin/bash
# OpenClaw 案例自动收集脚本
NODE_ID=${1:-node-01}
WORKSPACE_DIR="/root/.openclaw/workspace/openclaw-usecases"
INBOX_DIR="$WORKSPACE_DIR/inbox"
DATE=$(date +%Y%m%d)

mkdir -p "$INBOX_DIR/$DATE"

cat > "$INBOX_DIR/$DATE/case-$DATE-001.json" << EOF
{"id":"case-$DATE-001","title":"自动化案例-$DATE","category":["automation"],"difficulty":"beginner","source":{"url":"https://example.com","platform":"Auto"},"problem":"自动化需求","workflow":{"trigger":"定时","steps":["执行"],"output":"结果"},"metadata":{"nodeId":"$NODE_ID","collectedAt":"$(date -Iseconds)"},"status":"inbox"}
EOF

echo "✓ 案例已创建：$INBOX_DIR/$DATE/case-$DATE-001.json"
