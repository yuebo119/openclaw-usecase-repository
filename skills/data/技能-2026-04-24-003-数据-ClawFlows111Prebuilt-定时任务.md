# ClawFlows111PrebuiltAIWorkflow

> **Skill ID**: `case-2026-04-23-003`  
> **用途**: 自动化任务完成  
> **难度**: 中级 ⭐⭐  
> **分类**: automation / productivity  
> **版本**: 1.0.0

---

## 📋 简介

`# Illustrative output — requires OpenClaw 安装 # Enable the morning-briefing 工作流 $ OpenClaw flows enable morning-briefing Enabled: morning-briefing Trigger: 定时的 (daily at 07:00) Skills: weather-fetch, calendar-today, news-headlines, 任务-list Output: console + markdown file # Verify it appears in active 工作流 $ OpenClaw flows active Active 工作流 (1 of 111) 1. morning-briefing [定时的: daily 07:00] Status: READY # Trigger it 手动地 to test right now $ OpenClaw

---

## 🛠️ 所需技能

- `web_fetch`
- `file_ops`
- `cron`

---

## 🔗 集成服务

暂无

---

## 🔄 工作流程

**触发条件**: 定时任务或事件触发

### 执行步骤

1. 触发条件满足
2. 执行自动化流程
3. 输出结果

### 输出结果

自动化任务完成

---

## ⚙️ 配置

### 定时调度

```cron
0 */6 * * *
```

### 所需工具

- `web_fetch`
- `file_ops`
- `cron`

---

## 📊 效率提升

- **节省时间**: 自动化节省时间
- **自动化程度**: 半自动 🤖

---

## 💡 使用示例

### 运行 Skill

```bash
openclaw skills run case-2026-04-23-003
```

---

## 📎 来源

- **案例来源**: Tavily 搜索
- **原文链接**: https://www.sitepoint.com/clawflows-prebuilt-ai-workflows-openclaw/
- **生成时间**: 2026-04-24T02:01:41.263Z

---

*此 Skill 由 OpenClaw 从真实案例自动生成*
