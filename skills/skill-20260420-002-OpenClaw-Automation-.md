# OpenClaw Automation Tools - Process Design and Execution Tools - Tencent Cloud

> **Skill ID**: `skill-20260420-002`  
> **用途**: 通过定时任务或事件触发，实现自动化任务完成  
> **难度**: 中级 ⭐⭐  
> **分类**: automation / productivity  
> **版本**: 1.0.0

---

## 💡 一句话说明

通过定时任务或事件触发，实现自动化任务完成

---

## 📋 简介

```
workflow: customer_onboardingtriggers: -event: new_signupsteps: -name: validate_emailtype: ruleaction: check_email_deliverabilityon_fail: send_verification_email -name: classify_customertype: aiprompt:"Based on this signup data, classify the customer as: enterprise, smb, or individual" -name: route_to_teamtype: switchinput:classify_customer.outputcases:enterprise: assign_to_enterprise_salessmb: assign_to_smb_teamindividual: send_self_serve_onboarding
```

Notice how rule-based steps (email v...

---

## 🛠️ 所需技能

- `file_ops`
- `cron`
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

- `file_ops`
- `cron`
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
openclaw skills run skill-20260420-002
```

### 添加到定时任务

```bash
openclaw cron add --name "OpenClaw Automation Tools - Process Design and Execution Tools - Tencent Cloud" --schedule "0 */6 * * *" --skill "skill-20260420-002"
```

---

## 📎 来源

- **案例来源**: Tavily Search
- **原文链接**: https://www.tencentcloud.com/techpedia/140762
- **生成时间**: 2026-04-20T11:53:54.984Z

---

*此 Skill 由 OpenClaw 从真实案例自动生成*
