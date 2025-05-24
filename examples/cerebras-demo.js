// Cerebras API 使用演示
// 这个文件展示了如何在项目中使用 Cerebras API

import Cerebras from '@cerebras/cerebras_cloud_sdk';

// 初始化 Cerebras 客户端
const client = new Cerebras({
  apiKey: process.env['CEREBRAS_API_KEY'], // 从环境变量获取 API Key
});

// 基本翻译示例
async function basicTranslation() {
  try {
    const response = await client.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: 'Please translate "Hello, how are you?" from English to Chinese. Return the result in JSON format with the structure: {"text": "translated text", "pronunciation": "pinyin"}'
        }
      ],
      model: 'qwen-3-32b',
      temperature: 0.3,
      max_tokens: 500
    });

    console.log('Basic Translation Result:');
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error('Translation error:', error);
  }
}

// 多语言问候示例
async function multilingualGreeting() {
  try {
    const response = await client.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: 'Please say hello in English, Chinese, Japanese, Korean, Russian, French, German, Spanish, Italian, Portuguese, Arabic, and Hindi. Format as JSON array.'
        }
      ],
      model: 'qwen-3-32b',
      temperature: 0.7,
      max_tokens: 300
    });

    console.log('Multilingual Greetings:');
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error('Greeting error:', error);
  }
}

// 语言检测示例
async function languageDetection() {
  const testTexts = [
    "こんにちは、元気ですか？",
    "Bonjour, comment allez-vous?",
    "Hola, ¿cómo estás?",
    "Привет, как дела?",
    "你好，你好吗？",
    "مرحبا، كيف حالك؟"
  ];

  for (const text of testTexts) {
    try {
      const response = await client.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: `Detect the language of this text and return only the language code (zh, en, ja, ko, ru, fr, de, es, it, pt, ar, hi): "${text}"`
          }
        ],
        model: 'qwen-3-32b',
        temperature: 0.1,
        max_tokens: 10
      });

      console.log(`Text: "${text}" -> Language: ${response.choices[0].message.content.trim()}`);
    } catch (error) {
      console.error('Language detection error:', error);
    }
  }
}

// 详细翻译分析示例
async function detailedTranslationAnalysis() {
  const text = "I love learning new languages.";
  
  try {
    const response = await client.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Please translate "${text}" from English to Japanese and provide detailed analysis in JSON format:
{
  "translations": [
    {
      "text": "translated text",
      "partOfSpeech": "grammatical analysis",
      "meaning": "detailed meaning",
      "usage": "usage notes",
      "examples": [
        {
          "source": "example in English",
          "target": "example in Japanese",
          "explanation": "explanation"
        }
      ]
    }
  ],
  "pronunciation": {
    "ipa": "IPA symbols",
    "romaji": "romanization",
    "notes": "pronunciation notes"
  },
  "grammar": {
    "structure": "grammatical structure",
    "particles": "particle usage",
    "notes": "grammar notes"
  }
}`
        }
      ],
      model: 'qwen-3-32b',
      temperature: 0.3,
      max_tokens: 1000
    });

    console.log('Detailed Translation Analysis:');
    console.log(JSON.stringify(JSON.parse(response.choices[0].message.content), null, 2));
  } catch (error) {
    console.error('Detailed analysis error:', error);
  }
}

// 运行所有示例
async function runAllExamples() {
  console.log('=== Cerebras API Demo ===\n');
  
  console.log('1. Basic Translation:');
  await basicTranslation();
  console.log('\n');
  
  console.log('2. Multilingual Greetings:');
  await multilingualGreeting();
  console.log('\n');
  
  console.log('3. Language Detection:');
  await languageDetection();
  console.log('\n');
  
  console.log('4. Detailed Translation Analysis:');
  await detailedTranslationAnalysis();
  console.log('\n');
  
  console.log('=== Demo Complete ===');
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples().catch(console.error);
}

export {
  basicTranslation,
  multilingualGreeting,
  languageDetection,
  detailedTranslationAnalysis,
  runAllExamples
}; 