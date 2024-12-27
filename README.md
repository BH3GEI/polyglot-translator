# 多语言翻译器 / Multilingual Translator

一个基于 Vue 3 的多语言翻译网页应用，支持中文、英语、日语和俄语之间的互译。

## 功能特点

- 支持中文、英语、日语、俄语四种语言的互译
- 显示详细的发音信息（包括原文读音、罗马音和国际音标）
- 响应式设计，支持各种设备
- 优雅的用户界面和交互体验

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

## API 配置

在使用此应用之前，您需要配置翻译 API。请按照以下步骤操作：

1. 创建一个 `.env` 文件在项目根目录
2. 添加您的 API 密钥：
```
VITE_API_KEY=your_api_key_here
VITE_API_ENDPOINT=your_api_endpoint_here
```

## 技术栈

- Vue 3
- Element Plus
- Vite
- Axios

## 许可证

MIT
