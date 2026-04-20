#!/bin/bash
# 从案例生成 Skills
# 用法：./gen-skills.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="/var/log/openclaw-collect.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "========================================"
log "🔧 开始生成 Skills"
log "========================================"

# 运行 Node.js 脚本
node "$SCRIPT_DIR/gen-skills.js" 2>&1 | tee -a "$LOG_FILE"

EXIT_CODE=${PIPESTATUS[0]}

log "========================================"
if [ $EXIT_CODE -eq 0 ]; then
  log "✅ Skills 生成完成"
else
  log "❌ Skills 生成失败，退出码：$EXIT_CODE"
fi
log "========================================"

exit $EXIT_CODE
