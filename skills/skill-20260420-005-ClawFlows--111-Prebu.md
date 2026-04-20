# ClawFlows: 111 Prebuilt AI Workflows for Your OpenClaw Agent

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

### Smart Home Automation Workflows (Category 2)

Consider a typical arrival home: you unlock the door and want the lights on, the thermostat adjusted, and music playing. The Arrival Routine workflow handles this by detecting phone geofence entry and triggering all three actions. The Departure Routine reverses the process, locking doors, arming security, and switching to an energy-saving HVAC mode.

Energy Optimization runs on an hourly schedule, analyzing current utility rates and solar panel o...

---

## 🛠️ 所需技能

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

- `file_ops`
- `cron`

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
openclaw cron add --name "ClawFlows: 111 Prebuilt AI Workflows for Your OpenClaw Agent" --schedule "0 */6 * * *" --skill "skill-20260420-005"
```

---

## 📎 来源

- **案例来源**: Tavily Search
- **原文链接**: https://www.sitepoint.com/clawflows-prebuilt-ai-workflows-openclaw/
- **生成时间**: 2026-04-20T11:53:55.214Z

---

*此 Skill 由 OpenClaw 从真实案例自动生成*
