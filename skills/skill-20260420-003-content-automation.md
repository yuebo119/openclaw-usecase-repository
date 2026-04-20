# 内容机构自动化工作流

> **Skill ID**: `skill-20260420-003`  
> **用途**: 通过定时任务自动监控竞争对手博客，生成 SEO 优化文章，节省 4-6 小时/篇  
> **难度**: 中级 ⭐⭐  
> **分类**: marketing / content-creation / automation  
> **版本**: 1.0.0

---

## 💡 一句话说明

通过定时任务自动监控竞争对手博客，生成 SEO 优化文章，节省 4-6 小时/篇

---

## 📋 简介

内容机构需要持续监控竞争对手博客、识别内容缺口、生成大纲、撰写文章、进行 SEO 检查，并将成品排队待审。手动流程耗时且容易遗漏重要信息。

---

## 🛠️ 所需技能

- `web_search`
- `web_fetch`
- `file_ops`
- `cron`
- `notion`

---

## 🔗 集成服务

- `RSS Feeds`
- `Google Search API`
- `Notion CMS`
- `SEO Tools`

---

## 🔄 工作流程

**触发条件**: 定时任务 (Cron Job)

### 执行步骤

1. 1. 监控竞争对手博客 (RSS/网站爬虫)
2. 2. 识别内容缺口 (关键词分析)
3. 3. 生成文章大纲 (AI 生成)
4. 4. 撰写完整文章 (AI 写作)
5. 5. 运行 SEO 检查 (关键词密度、元数据)
6. 6. 将成品加入审核队列 (CMS/Notion)

### 输出结果

完整的 SEO 优化文章，等待人工审核发布

---

## ⚙️ 配置

### 定时调度

```cron
0 */6 * * *
```

### 所需工具

- `web_search`
- `web_fetch`
- `file_ops`
- `cron`
- `notion`

### 环境变量

```bash

export GOOGLE_SEARCH_API_KEY="your-key-here"
export NOTION_API_KEY="your-key-here"
export SEO_API_KEY="your-key-here"
```

---

## 📊 效率提升

- **节省时间**: 每篇文章节省 4-6 小时
- **自动化程度**: 半自动 🤖

**指标**:
- articlesPerWeek: 10-15 篇
- humanReviewTime: 30 分钟/篇

---

## 💡 使用示例

### 运行 Skill

```bash
openclaw skills run skill-20260420-003
```

### 添加到定时任务

```bash
openclaw cron add --name "内容机构自动化工作流" --schedule "0 */6 * * *" --skill "skill-20260420-003"
```

---

## 📎 来源

- **案例来源**: TLDL
- **原文链接**: https://www.tldl.io/blog/openclaw-use-cases-2026
- **生成时间**: 2026-04-20T11:52:42.087Z

---

*此 Skill 由 OpenClaw 从真实案例自动生成*
