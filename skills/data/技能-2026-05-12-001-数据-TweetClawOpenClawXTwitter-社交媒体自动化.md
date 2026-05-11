# TweetClaw OpenClaw X/Twitter 自动化

> **Skill ID**: `case-2026-05-12-001`<br>
> **用途**: 搜索 tweets、发布 tweets、回复、上传媒体、导出 followers 和监控关键词<br>
> **难度**: 中级 ⭐⭐<br>
> **分类**: automation / social-media / api<br>
> **版本**: 1.0.0

---

## 📋 简介

TweetClaw 是面向 OpenClaw 的 X/Twitter 自动化插件。它通过 `@xquik/tweetclaw` npm 包和 Xquik endpoints，为 agent 提供结构化工具来 search tweets、search tweet replies、post tweets、post tweet replies、upload media、download media、export followers、lookup users、monitor tweets、send direct messages 和运行 giveaway draws。

这个 use case 适合需要长期监控品牌关键词、整理 tweet replies、把 followers 导出到 CRM、批量准备 social reports，或让 OpenClaw agent 在审核后发布 tweets 和 replies 的运营团队。

---

## 🛠️ 所需技能

- `api_integration`
- `web_search`
- `data_analysis`

---

## 🔗 集成服务

- TweetClaw
- Xquik
- X/Twitter
- ClawHub
- npm

---

## 🔄 工作流程

**触发条件**: 需要监控关键词、发布内容或导出 X/Twitter 数据

### 执行步骤

1. 在 OpenClaw 中安装 TweetClaw 插件或 npm 包
2. 配置 Xquik API key
3. 调用 TweetClaw 工具搜索 tweets、读取 replies 或导出 followers
4. 按需要发布 tweet、回复、上传媒体或发送 direct message
5. 把结果写入报告、CRM、Slack、Notion 或后续 OpenClaw 工作流

### 输出结果

完成可审计的 X/Twitter 搜索、发布、回复、媒体和监控自动化。

---

## ⚙️ 配置

### 安装路径

```bash
npm install @xquik/tweetclaw
```

### 所需工具

- `api_integration`
- `web_search`
- `data_analysis`

---

## 📊 效率提升

- **节省时间**: 减少手写 X/Twitter API 集成和人工监控时间
- **自动化程度**: 半自动 🤖

---

## 💡 使用示例

### 运行 Skill

```bash
openclaw skills run case-2026-05-12-001
```

---

## 📎 来源

- **案例来源**: GitHub
- **原文链接**: https://github.com/Xquik-dev/tweetclaw
- **npm 包**: https://www.npmjs.com/package/@xquik/tweetclaw
- **ClawHub**: https://clawhub.ai/kriptoburak/xquik-tweetclaw
- **生成时间**: 2026-05-11T23:34:07Z

---

*此 Skill 由 OpenClaw 从真实案例整理*
