# OpenClaw 案例库目录结构

## 新的目录设计

```
openclaw-usecase-repository/
│
├── cases-raw/                    # 原始采集案例（按日期）
│   ├── 2026-04-20/
│   │   ├── automation/          # 自动化类
│   │   ├── email/               # 邮件自动化
│   │   ├── api/                 # API 集成
│   │   ├── code/                # 代码自动化
│   │   └── data/                # 数据收集
│   └── 2026-04-21/
│
├── cases-processed/              # 已处理案例（按分类）
│   ├── automation/              # 自动化类
│   ├── email/                   # 邮件自动化
│   ├── api/                     # API 集成
│   ├── code/                    # 代码自动化
│   └── data/                    # 数据收集
│
├── skills/                       # 生成的技能文件
│   ├── automation/
│   ├── email/
│   ├── api/
│   ├── code/
│   └── data/
│
├── tutorials/                    # 详细教程
│   ├── beginner/                # 初级教程
│   ├── intermediate/            # 中级教程
│   └── advanced/                # 高级教程
│
├── scripts/                      # 工具脚本
│   ├── collect-with-tavily.js   # Tavily 采集
│   ├── translate-content.js     # 内容翻译
│   ├── dedup-check.js           # 去重检查
│   ├── dedup-all-cases.js       # 批量去重
│   └── organize-cases.js        # 整理分类
│
└── docs/                         # 文档
    ├── STRUCTURE.md             # 目录结构说明
    └── README.md                # 使用说明
```

## 分类说明

| 分类 | 目录 | 说明 | 示例 |
|------|------|------|------|
| **automation** | 自动化 | 通用自动化工作流 | 定时任务、工作流 |
| **email** | 邮件 | 邮件相关自动化 | Gmail 摘要、邮件推送 |
| **api** | API | API 集成 | API 调用、数据同步 |
| **code** | 代码 | 代码相关 | 代码生成、Git 自动化 |
| **data** | 数据 | 数据处理 | 数据收集、数据分析 |

## 文件命名规范

### JSON 案例文件
```
案例 -YYYY-MM-DD-序号 - 分类 - 标题关键词 - 描述.json
例：案例 -2026-04-20-001-自动化-OpenClaw完整教程 - 代码自动化.json
```

### Markdown Skill 文件
```
技能 -YYYY-MM-DD-序号 - 分类 - 标题关键词 - 描述.md
例：技能 -2026-04-20-001-自动化-OpenClaw完整教程 - 代码自动化.md
```

## 工作流程

```
1. Tavily 采集 → cases-raw/日期/分类/
                    ↓
2. 去重检查 → 跳过重复案例
                    ↓
3. 翻译处理 → 中文标题 + 描述
                    ↓
4. 生成 Skill → skills/分类/
                    ↓
5. 整理归档 → cases-processed/分类/
```
