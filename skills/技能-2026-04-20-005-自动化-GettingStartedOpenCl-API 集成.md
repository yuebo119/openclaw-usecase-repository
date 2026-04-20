# GettingStartedOpenClawDocs

> **Skill ID**: `skill-20260420-005`  
> **用途**: 通过定时任务或事件触发，实现自动化任务完成  
> **难度**: 中级 ⭐⭐  
> **分类**: automation / productivity  
> **版本**: 1.0.0

---

## 💡 一句话说明

通过定时任务或事件触发，实现自动化任务完成

---

## 📋 简介

The wizard walks you through choosing a model provider, setting an API key, and configuring the Gateway. It takes about 2 minutes.See Onboarding (CLI) for the full reference.

3

Verify the Gateway is running

```
openclaw gateway status openclaw  gateway  status
```

You should see the Gateway listening on port 18789.

4

Open the dashboard

```
openclaw dashboard openclaw  dashboard
```

This opens the Control UI in your browser. If it loads, everything is working.

5

Send your first message


---

## 🛠️ 所需技能

- `api_integration`

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

- `api_integration`

### 环境变量

```bash
# 暂无特殊要求
```

---

## 📊 效率提升

- **节省时间**: 自动化节省时间
- **自动化程度**: 半自动 🤖


---

## 💡 使用示例

### 运行 Skill

```bash
openclaw skills run skill-20260420-005
```

### 添加到定时任务

```bash
openclaw cron add --name "GettingStartedOpenClawDocs" --schedule "0 */6 * * *" --skill "skill-20260420-005"
```

---

## 📎 来源

- **案例来源**: Tavily 搜索
- **原文链接**: https://docs.openclaw.ai/start/getting-started
- **生成时间**: 2026-04-20T12:45:36.701Z

---

*此 Skill 由 OpenClaw 从真实案例自动生成*
