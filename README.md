# OpenClaw Use Case Repository

> 🤖 多节点协同采集的 OpenClaw 真实应用案例库

## 简介

集中化的 OpenClaw 真实应用案例库，由多个 OpenClaw 节点协同采集、整理和维护。

## 目录结构

```
├── nodes/      # 各节点原始采集数据
├── merged/     # 合并去重后的案例
├── tutorials/  # 详细教程
├── scripts/    # 工具脚本
└── schema/     # JSON Schema 定义
```

## 节点分配

| 节点 | 来源 | 时间 |
|------|------|------|
| node-01 | GitHub/GitLab | 14:00 |
| node-02 | Reddit/HN | 14:30 |
| node-03 | Medium/Blogs | 15:00 |
| node-04 | YouTube/Twitter | 15:30 |
| node-05 | 中文社区 | 16:00 |

## 快速开始

```bash
# 采集案例
./scripts/collect-usecases.sh node-01

# 验证
./scripts/validate-schema.sh
./scripts/dedup-check.sh

# 提交
git add nodes/node-01/
git commit -m "feat(node-01): add use cases"
git push
```

## 文档

- 完整规范：查看仓库 Wiki
- 多节点方案：MULTI-NODE-PLAN.md

## 许可证

MIT License
