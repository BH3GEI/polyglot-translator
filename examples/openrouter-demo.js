// OpenRouter API 使用演示
// 这个文件展示了如何在项目中使用 OpenRouter API

import OpenAI from 'openai';

// 初始化 OpenRouter 客户端
const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env['OPENROUTER_API_KEY'], // 从环境变量获取 API Key
  defaultHeaders: {
    'HTTP-Referer': 'https://your-site.com', // 可选：网站URL用于在openrouter.ai上排名
    'X-Title': 'Multilingual Translator', // 可选：网站标题用于在openrouter.ai上排名
  },
});

// 基本翻译示例
async function basicTranslation() {
  try {
    const completion = await client.chat.completions.create({
      model: 'qwen/qwen3-32b:free',
      messages: [
        {
          role: 'user',
          content: 'Please translate "Hello, how are you?" from English to Chinese. Return the result in JSON format with the structure: {"text": "translated text", "pronunciation": "pinyin"} /no_think'
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    console.log('Basic Translation Result:');
    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.error('Translation error:', error);
  }
}

// 多语言问候示例（使用 Claude）
async function multilingualGreetingWithClaude() {
  try {
    const completion = await client.chat.completions.create({
      model: 'anthropic/claude-3-sonnet',
      messages: [
        {
          role: 'user',
          content: 'Please say hello in English, Chinese, Japanese, Korean, Russian, French, German, Spanish, Italian, Portuguese, Arabic, and Hindi. Format as JSON array.'
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    console.log('Multilingual Greetings (Claude):');
    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.error('Greeting error:', error);
  }
}

// 使用 GPT-4 进行高质量翻译
async function highQualityTranslation() {
  try {
    const completion = await client.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [
        {
          role: 'user',
          content: `Please translate the following English text to Japanese with detailed analysis:
"The cherry blossoms are blooming beautifully in spring."

Please provide:
1. Japanese translation
2. Romanization (romaji)
3. Word-by-word breakdown
4. Cultural context

Format the response as JSON.`
        }
      ],
      temperature: 0.3,
      max_tokens: 800
    });

    console.log('High Quality Translation (GPT-4):');
    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.error('High quality translation error:', error);
  }
}

// 使用 Llama 进行多语言检测
async function languageDetectionWithLlama() {
  const testTexts = [
    "Bonjour, comment allez-vous?",
    "¿Cómo estás?",
    "Wie geht es dir?",
    "Come stai?",
    "Como você está?",
    "مرحبا، كيف حالك؟"
  ];

  for (const text of testTexts) {
    try {
      const completion = await client.chat.completions.create({
        model: 'meta-llama/llama-3-70b-instruct',
        messages: [
          {
            role: 'user',
            content: `Detect the language of this text and return only the language code (zh, en, ja, ko, ru, fr, de, es, it, pt, ar, hi): "${text}"`
          }
        ],
        temperature: 0.1,
        max_tokens: 10
      });

      console.log(`Text: "${text}" -> Language: ${completion.choices[0].message.content.trim()}`);
    } catch (error) {
      console.error('Language detection error:', error);
    }
  }
}

// 获取可用模型列表
async function getAvailableModels() {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env['OPENROUTER_API_KEY']}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Available Models:');
    
    // 显示前10个模型
    const models = data.data.slice(0, 10);
    models.forEach(model => {
      console.log(`- ${model.id}: ${model.name}`);
      console.log(`  Context: ${model.context_length}, Pricing: $${model.pricing.prompt}/$${model.pricing.completion}`);
    });
  } catch (error) {
    console.error('Error fetching models:', error);
  }
}

// 比较不同模型的翻译结果
async function compareModels() {
  const text = "Time flies like an arrow.";
  const models = [
    'qwen/qwen3-32b:free',
    'openai/gpt-3.5-turbo',
    'openai/gpt-4o',
    'anthropic/claude-3-sonnet',
    'google/gemini-pro'
  ];

  console.log(`\nComparing translations for: "${text}"`);
  console.log('=' * 50);

  for (const model of models) {
    try {
      // 为 Qwen 模型添加 /no_think 以获得更直接的响应
      const isQwenModel = model.includes('qwen');
      const promptContent = isQwenModel 
        ? `Translate "${text}" to Chinese and provide pronunciation in pinyin. Return as JSON: {"text": "translation", "pinyin": "pronunciation"} /no_think`
        : `Translate "${text}" to Chinese and provide pronunciation in pinyin. Return as JSON: {"text": "translation", "pinyin": "pronunciation"}`;
      
      const completion = await client.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'user',
            content: promptContent
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      });

      let result = completion.choices[0].message.content;
      
      // 处理 Qwen3 推理模式的特殊情况
      if (!result && completion.choices[0].message.reasoning) {
        result = completion.choices[0].message.reasoning;
      }

      console.log(`\n${model}:`);
      console.log(result || '响应为空');
    } catch (error) {
      console.log(`\n${model}: Error - ${error.message}`);
    }
  }
}

// 运行所有示例
async function runAllExamples() {
  console.log('=== OpenRouter API Demo ===\n');
  
  console.log('1. Basic Translation:');
  await basicTranslation();
  console.log('\n');
  
  console.log('2. Multilingual Greetings with Claude:');
  await multilingualGreetingWithClaude();
  console.log('\n');
  
  console.log('3. High Quality Translation with GPT-4:');
  await highQualityTranslation();
  console.log('\n');
  
  console.log('4. Language Detection with Llama:');
  await languageDetectionWithLlama();
  console.log('\n');
  
  console.log('5. Available Models:');
  await getAvailableModels();
  console.log('\n');
  
  console.log('6. Model Comparison:');
  await compareModels();
  console.log('\n');
  
  console.log('=== Demo Complete ===');
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples().catch(console.error);
}

export {
  basicTranslation,
  multilingualGreetingWithClaude,
  highQualityTranslation,
  languageDetectionWithLlama,
  getAvailableModels,
  compareModels,
  runAllExamples
}; 