#!/bin/bash
# OpenClaw 案例库 Git 自动同步脚本
# 使用环境变量 GITHUB_TOKEN 进行认证

set -e

WORKSPACE_DIR="/root/.openclaw/workspace/openclaw-usecases"
LOG_FILE="/var/log/openclaw-usecase-sync.log"
GITHUB_USER="yuebo119"
GITHUB_REPO="openclaw-usecase-repository"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "========================================"
log "Git 同步任务启动"
log "========================================"

cd "$WORKSPACE_DIR"

# 配置 Git
git config --global user.name "OpenClaw UseCase Bot"
git config --global user.email "usecases@openclaw@example.com"

# 检查变更
if git status --porcelain | grep -q .; then
    log "检测到变更"
    
    # 拉取最新
    log "拉取最新代码..."
    git pull origin main || true
    
    # 添加变更
    log "添加文件..."
    git add -A
    
    # 提交
    COMMIT_MSG="feat(auto): sync cases $(date +%Y-%m-%d)"
    log "创建提交：$COMMIT_MSG"
    git commit -m "$COMMIT_MSG" || {
        log "没有需要提交的文件"
        exit 0
    }
    
    # 推送（使用环境变量中的 Token）
    log "推送到 GitHub..."
    if [ -n "$GITHUB_TOKEN" ]; then
        git push "https://$GITHUB_USER:${GITHUB_TOKEN}@github.com/$GITHUB_USER/$GITHUB_REPO.git" main
        log "✓ 同步成功"
    else
        log "⚠ GITHUB_TOKEN 未设置，使用 SSH 或本地 Git 推送"
        git push origin main || log "推送失败，请配置 GITHUB_TOKEN"
    fi
else
    log "✓ 没有变更，跳过同步"
fi

log "========================================"
log "同步完成"
log "========================================"
