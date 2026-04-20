#!/bin/bash
# OpenClaw 案例收集脚本（使用 Tavily API）
# 用法：./collect-tavily.sh [搜索关键词]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="/var/log/openclaw-collect.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 默认搜索词
SEARCH_QUERY="${1:-OpenClaw AI agent automation use cases}"

log "========================================"
log "🔍 开始收集 OpenClaw 案例"
log "搜索词：$SEARCH_QUERY"
log "========================================"

# 运行 Node.js 脚本
node "$SCRIPT_DIR/collect-with-tavily.js" "$SEARCH_QUERY" 2>&1 | tee -a "$LOG_FILE"

EXIT_CODE=${PIPESTATUS[0]}

log "========================================"
if [ $EXIT_CODE -eq 0 ]; then
  log "✅ 收集完成"
else
  log "❌ 收集失败，退出码：$EXIT_CODE"
fi
log "========================================"

exit $EXIT_CODE
