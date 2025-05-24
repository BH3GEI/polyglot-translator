# 多语言翻译器 / Multilingual Translator

一个基于 Vue 3 的多语言翻译网页应用，支持 12 种语言之间的互译，并集成了多个 AI API 提供商。

## 功能特点

- **多语言支持**：支持中文、英语、日语、韩语、俄语、法语、德语、西班牙语、意大利语、葡萄牙语、阿拉伯语、印地语等 12 种语言的互译
- **多 AI 提供商**：支持 OpenAI、Cerebras、Google Gemini、OpenRouter 四种 API 提供商
- **详细分析**：显示详细的发音信息（包括原文读音、罗马音和国际音标）
- **语法分析**：提供语法结构、时态、语态等详细分析
- **用法分析**：包含正式程度、使用场景、频率等信息
- **响应式设计**：支持各种设备，界面美观现代

## 支持的语言

| 语言代码 | 语言名称 | 本地名称 |
|---------|---------|---------|
| zh | 中文 | 中文 |
| en | 英语 | English |
| ja | 日语 | 日本語 |
| ko | 韩语 | 한국어 |
| ru | 俄语 | Русский |
| fr | 法语 | Français |
| de | 德语 | Deutsch |
| es | 西班牙语 | Español |
| it | 意大利语 | Italiano |
| pt | 葡萄牙语 | Português |
| ar | 阿拉伯语 | العربية |
| hi | 印地语 | हिन्दी |

## 支持的 API 提供商

### 1. OpenAI
- 模型：gpt-3.5-turbo, gpt-4, gpt-4-turbo 等
- 需要 OpenAI API Key

### 2. Cerebras
- 模型：qwen-3-32b, llama-4-scout-17b-16e-instruct 等
- 需要 Cerebras API Key
- 示例配置：
```javascript
import Cerebras from '@cerebras/cerebras_cloud_sdk';

const client = new Cerebras({
  apiKey: process.env['CEREBRAS_API_KEY'],
});

const response = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Hello!' }],
  model: 'qwen-3-32b',
});
```

### 3. Google Gemini
- 模型：gemini-2.0-flash, gemini-pro, gemini-pro-vision 等
- 需要 Google AI Studio API Key

### 4. OpenRouter
- 支持多种模型：OpenAI GPT、Anthropic Claude、Google Gemini、Meta Llama 等
- 需要 OpenRouter API Key
- 示例配置：
```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env['OPENROUTER_API_KEY'],
  defaultHeaders: {
    'HTTP-Referer': 'https://your-site.com',
    'X-Title': 'Your Site Name',
  },
});

const completion = await client.chat.completions.create({
  model: 'openai/gpt-4o',
  messages: [{ role: 'user', content: 'Hello!' }],
});
```

## 开发设置

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 构建生产版本：
```bash
npm run build
```

## 配置说明

1. 点击右下角的设置按钮
2. 选择 API 提供商（OpenAI/Cerebras/Gemini/OpenRouter）
3. 输入相应的 API Key 和模型名称
4. 对于 OpenRouter，可选填写网站 URL 和标题（用于排名）
5. 点击"连接测试"验证配置
6. 保存配置

## 技术栈

- **前端框架**：Vue 3
- **UI 组件库**：Element Plus
- **构建工具**：Vite
- **HTTP 客户端**：Axios
- **AI SDK**：
  - @cerebras/cerebras_cloud_sdk (Cerebras)
  - openai (OpenRouter, OpenAI)
  - 原生 HTTP 请求 (Gemini)

## 项目结构

```
src/
├── components/
│   └── TranslatorComponent.vue    # 主翻译组件
├── config/
│   ├── prompts.js                 # 主配置文件
│   └── prompts/                   # 各语言提示词
│       ├── zh.js                  # 中文提示词
│       ├── en.js                  # 英文提示词
│       ├── ja.js                  # 日文提示词
│       ├── ko.js                  # 韩文提示词
│       ├── ru.js                  # 俄文提示词
│       ├── fr.js                  # 法文提示词
│       ├── de.js                  # 德文提示词
│       ├── es.js                  # 西班牙文提示词
│       ├── it.js                  # 意大利文提示词
│       ├── pt.js                  # 葡萄牙文提示词
│       ├── ar.js                  # 阿拉伯文提示词
│       └── hi.js                  # 印地文提示词
├── services/
│   ├── apiService.js              # 主 API 服务
│   ├── cerebrasService.js         # Cerebras API 服务
│   ├── geminiService.js           # Gemini API 服务
│   └── openrouterService.js       # OpenRouter API 服务
├── App.vue                        # 根组件
└── main.js                        # 入口文件
```

## 许可证

MIT
