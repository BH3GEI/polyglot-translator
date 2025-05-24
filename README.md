# Multilingual Translator

A Vue 3-based multilingual translation web application that supports translation between 12 languages and integrates multiple AI API providers.

## Features

- **Multi-language Support**: Supports translation between 12 languages including Chinese, English, Japanese, Korean, Russian, French, German, Spanish, Italian, Portuguese, Arabic, and Hindi
- **Multiple AI Providers**: Supports four API providers: OpenAI, Cerebras, Google Gemini, and OpenRouter
- **Detailed Analysis**: Displays detailed pronunciation information (including original pronunciation, romanization, and IPA)
- **Grammar Analysis**: Provides detailed analysis of grammatical structure, tense, voice, etc.
- **Usage Analysis**: Includes formality level, usage scenarios, frequency, and other information
- **Responsive Design**: Supports various devices with a beautiful and modern interface

## Supported Languages

| Language Code | Language Name | Native Name |
|---------------|---------------|-------------|
| zh | Chinese | 中文 |
| en | English | English |
| ja | Japanese | 日本語 |
| ko | Korean | 한국어 |
| ru | Russian | Русский |
| fr | French | Français |
| de | German | Deutsch |
| es | Spanish | Español |
| it | Italian | Italiano |
| pt | Portuguese | Português |
| ar | Arabic | العربية |
| hi | Hindi | हिन्दी |

## Supported API Providers

### 1. OpenAI
- Models: gpt-3.5-turbo, gpt-4, gpt-4-turbo, etc.
- Requires OpenAI API Key

### 2. Cerebras
- Models: qwen-3-32b, llama-4-scout-17b-16e-instruct, etc.
- Requires Cerebras API Key
- Example configuration:
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
- Models: gemini-2.0-flash, gemini-pro, gemini-pro-vision, etc.
- Requires Google AI Studio API Key

### 4. OpenRouter
- Supports multiple models: OpenAI GPT, Anthropic Claude, Google Gemini, Meta Llama, etc.
- Requires OpenRouter API Key
- Example configuration:
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

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Configuration Instructions

1. Click the settings button in the bottom right corner
2. Select API provider (OpenAI/Cerebras/Gemini/OpenRouter)
3. Enter the corresponding API Key and model name
4. For OpenRouter, optionally fill in website URL and title (for ranking)
5. Click "Connection Test" to verify configuration
6. Save configuration

## Tech Stack

- **Frontend Framework**: Vue 3
- **UI Component Library**: Element Plus
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **AI SDKs**:
  - @cerebras/cerebras_cloud_sdk (Cerebras)
  - openai (OpenRouter, OpenAI)
  - Native HTTP requests (Gemini)

## Project Structure

```
src/
├── components/
│   └── TranslatorComponent.vue    # Main translator component
├── config/
│   ├── prompts.js                 # Main configuration file
│   └── prompts/                   # Language-specific prompts
│       ├── zh.js                  # Chinese prompts
│       ├── en.js                  # English prompts
│       ├── ja.js                  # Japanese prompts
│       ├── ko.js                  # Korean prompts
│       ├── ru.js                  # Russian prompts
│       ├── fr.js                  # French prompts
│       ├── de.js                  # German prompts
│       ├── es.js                  # Spanish prompts
│       ├── it.js                  # Italian prompts
│       ├── pt.js                  # Portuguese prompts
│       ├── ar.js                  # Arabic prompts
│       └── hi.js                  # Hindi prompts
├── services/
│   ├── apiService.js              # Main API service
│   ├── cerebrasService.js         # Cerebras API service
│   ├── geminiService.js           # Gemini API service
│   └── openrouterService.js       # OpenRouter API service
├── App.vue                        # Root component
└── main.js                        # Entry file
```

## License

MIT
