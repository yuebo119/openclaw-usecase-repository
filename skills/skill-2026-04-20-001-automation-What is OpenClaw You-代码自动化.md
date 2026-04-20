# What is OpenClaw? Your Open-Source AI Assistant for 2026

> **Skill ID**: `skill-20260420-001`  
> **用途**: 通过定时任务或事件触发，实现自动化任务完成  
> **难度**: 中级 ⭐⭐  
> **分类**: automation / productivity  
> **版本**: 1.0.0

---

## 💡 一句话说明

通过定时任务或事件触发，实现自动化任务完成

---

## 📋 简介

What is OpenClaw

OpenClaw (affectionately called “Molty”) is a viral open-source personal AI agent with 68,000 GitHub stars (and counting), created by PSPDFKit founder Peter Steinberger. It brings together the technology of agents with the data and apps you use on your local machine to serve as a high-powered, high-context AI assistant. It operates a local gateway that connects AI models with your favorite tools, integrating with familiar chat apps to facilitate convenient interactions. Many de...

---

## 🛠️ 所需技能

- `file_ops`

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

- `file_ops`

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
openclaw skills run skill-20260420-001
```

### 添加到定时任务

```bash
openclaw cron add --name "What is OpenClaw? Your Open-Source AI Assistant for 2026" --schedule "0 */6 * * *" --skill "skill-20260420-001"
```

---

## 📎 来源

- **案例来源**: Tavily Search
- **原文链接**: https://www.digitalocean.com/resources/articles/what-is-openclaw
- **生成时间**: 2026-04-20T12:16:38.504Z

---

*此 Skill 由 OpenClaw 从真实案例自动生成*
