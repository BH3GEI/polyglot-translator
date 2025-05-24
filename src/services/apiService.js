import axios from 'axios'
import { getTranslationPrompt, getPronunciationAnalysisPrompt, getGrammarAnalysisPrompt, getUsageAnalysisPrompt } from '../config/prompts'
import CerebrasService from './cerebrasService'
import GeminiService from './geminiService'
import OpenRouterService from './openrouterService'

class ApiService {
  constructor(config) {
    this.config = config
    this.provider = this.initializeProvider(config)
  }

  initializeProvider(config) {
    switch (config.provider) {
      case 'cerebras':
        return new CerebrasService(config)
      case 'gemini':
        return new GeminiService(config)
      case 'openrouter':
        return new OpenRouterService(config)
      case 'openai':
      default:
        return this // 使用当前类的 OpenAI 实现
    }
  }

  async detectLanguage(text) {
    if (!text) return null

    try {
      const prompt = `Please carefully analyze the language features of the following text and determine the most likely language.
If the text contains multiple languages, please identify the main language.
Analysis features include: writing system, grammar features, punctuation marks, etc.

Text: ${text}

Please directly return the corresponding language code:
- Chinese (including Simplified and Traditional): zh
- English: en
- Japanese: ja
- Korean: ko
- Russian: ru
- French: fr
- German: de
- Spanish: es
- Italian: it
- Portuguese: pt
- Arabic: ar
- Hindi: hi

Please return only the language code, no other explanation.`;

      const response = await this.callLLM(prompt)
      const lang = response.trim().toLowerCase().replace(/[^a-z]/g, '')
      
      // 验证语言代码
      if (['zh', 'en', 'ja', 'ko', 'ru', 'fr', 'de', 'es', 'it', 'pt', 'ar', 'hi'].includes(lang)) {
        return lang
      }
      
      // 如果无法确定，使用字符集特征进行备用检测
      const charPatterns = {
        ja: /[\u3040-\u309F\u30A0-\u30FF]/, // 平假名和片假名
        ko: /[\uAC00-\uD7AF\u1100-\u11FF]/, // 谚文音节和谚文字母
        zh: /[\u4E00-\u9FFF]/, // 汉字
        ru: /[\u0400-\u04FF]/, // 西里尔字母
        fr: /[àâäéèêëîïôöùûüÿçœæ]/i, // 法语特殊字符
        de: /[äöüßÄÖÜ]/i, // 德语特殊字符
        es: /[ñáéíóúüÑÁÉÍÓÚÜ¿¡]/i, // 西班牙语特殊字符
        it: /[àèéìíîòóùúÀÈÉÌÍÎÒÓÙÚ]/i, // 意大利语特殊字符
        pt: /[ãâáàçéêíóôõúüÃÂÁÀÇÉÊÍÓÔÕÚÜ]/i, // 葡萄牙语特殊字符
        ar: /[\u0600-\u06FF]/, // 阿拉伯字母
        hi: /[\u0900-\u097F]/ // 天城文字母
      }

      for (const [language, pattern] of Object.entries(charPatterns)) {
        if (pattern.test(text)) {
          return language
        }
      }

      // 如果都不匹配，默认为英语
      return 'en'
    } catch (error) {
      console.error('Language detection failed:', error)
      return 'en'
    }
  }

  isSentence(text) {
    // 检查是否为句子的简单规则
    const sentencePatterns = {
      // 英文句子结尾
      en: /[.!?]$/,
      // 中文句子结尾
      zh: /[。！？]$/,
      // 日文句子结尾
      ja: /[。！？]$/,
      // 韩文句子结尾
      ko: /[.!?。！？]$/,
      // 俄文句子结尾
      ru: /[.!?]$/,
      // 法文句子结尾
      fr: /[.!?]$/,
      // 德文句子结尾
      de: /[.!?]$/,
      // 西班牙文句子结尾
      es: /[.!?¿¡]$/,
      // 意大利文句子结尾
      it: /[.!?]$/,
      // 葡萄牙文句子结尾
      pt: /[.!?]$/,
      // 阿拉伯文句子结尾
      ar: /[.!?؟]$/,
      // 印地文句子结尾
      hi: /[.!?।]$/
    }

    // 检查基本句子特征
    const hasEndPunctuation = Object.values(sentencePatterns).some(pattern => 
      pattern.test(text.trim())
    )
    const wordCount = text.trim().split(/\s+/).length
    
    // 如果有结束标点或词数大于3，认为是句子
    return hasEndPunctuation || wordCount > 3
  }

  async translate(text, sourceLanguage, targetLanguage, userNativeLanguage = 'zh') {
    if (!text || !sourceLanguage || !targetLanguage) {
      throw new Error('Missing required translation parameters')
    }

    const isSentence = this.isSentence(text)
    const results = {
      text: '',
      analysis: null,
      pronunciation: null,
      grammar: null,
      usage: null,
      rawResponses: {},
      furigana: null,
      detailed_explanation: null
    }

    try {
      // 步骤1：基本翻译
      const basicPrompt = getTranslationPrompt(text, sourceLanguage, targetLanguage, userNativeLanguage)
      const basicResponse = await this.callLLM(basicPrompt)
      try {
        const basicData = JSON.parse(basicResponse)
        results.text = basicData.text
        results.analysis = basicData.analysis
        results.detailed_explanation = basicData.detailed_explanation
      } catch (error) {
        console.debug('Basic translation parsing failed:', error)
        results.text = basicResponse.trim()
      }
      results.rawResponses.basic = basicResponse

      // 步骤1.5：获取注音（对于中文和日文）
      if (['zh', 'ja'].includes(targetLanguage)) {
        try {
          const furiganaResult = await this.getFurigana(results.text, targetLanguage)
          results.furigana = furiganaResult
          results.rawResponses.furigana = JSON.stringify(furiganaResult)
        } catch (error) {
          console.debug('Furigana retrieval failed:', error)
        }
      }

      // 如果是句子，进行更详细的分析
      if (isSentence) {
        // 步骤2：发音分析
        try {
          const pronunciationPrompt = getPronunciationAnalysisPrompt(results.text, targetLanguage, userNativeLanguage)
          const pronunciationResponse = await this.callLLM(pronunciationPrompt)
          const pronunciationData = JSON.parse(pronunciationResponse)
          results.pronunciation = pronunciationData.pronunciation
          results.rawResponses.pronunciation = pronunciationResponse
        } catch (error) {
          console.debug('Pronunciation analysis failed:', error)
        }

        // 步骤3：语法分析
        try {
          const grammarPrompt = getGrammarAnalysisPrompt(results.text, targetLanguage, userNativeLanguage)
          const grammarResponse = await this.callLLM(grammarPrompt)
          const grammarData = JSON.parse(grammarResponse)
          results.grammar = grammarData.grammar
          results.rawResponses.grammar = grammarResponse
        } catch (error) {
          console.debug('Grammar analysis failed:', error)
        }

        // 步骤4：用法分析
        try {
          const usagePrompt = getUsageAnalysisPrompt(results.text, targetLanguage, userNativeLanguage)
          const usageResponse = await this.callLLM(usagePrompt)
          const usageData = JSON.parse(usageResponse)
          results.usage = usageData.usage
          results.rawResponses.usage = usageResponse
        } catch (error) {
          console.debug('Usage analysis failed:', error)
        }
      }

      return results
    } catch (error) {
      console.error('Translation process error:', error)
      throw new Error('Translation failed: ' + error.message)
    }
  }

  async getFurigana(text, targetLanguage) {
    if (!text) return null

    const prompt = targetLanguage === 'ja' ? 
      `请为以下日语文本添加假名注音，以JSON格式返回。注意：
1. 需要标注的是汉字的读音
2. 每个需要标注的词都要包含原文和读音
3. 不要改变原文的任何内容

文本：${text}

请按照以下格式返回：
{
  "text": "原文",
  "annotations": [
    {
      "text": "要标注的词",
      "reading": "假名读音",
      "position": [起始位置, 结束位置]
    }
  ]
}` :
      `请为以下中文文本添加拼音注音，以JSON格式返回。注意：
1. 需要标注每个汉字的拼音
2. 包含声调信息
3. 不要改变原文的任何内容

文本：${text}

请按照以下格式返回：
{
  "text": "原文",
  "annotations": [
    {
      "text": "要标注的字",
      "reading": "拼音",
      "position": [起始位置, 结束位置]
    }
  ]
}`

    try {
      const response = await this.callLLM(prompt)
      return JSON.parse(response)
    } catch (error) {
      console.debug('注音获取失败:', error)
      return null
    }
  }

  async parseTranslationResult(response, targetLanguage, isSentence) {
    let result = null;

    // 首先尝试直接解析JSON
    try {
      result = JSON.parse(response);
      if (result.text) {
        return result;
      }
    } catch (error) {
      console.debug('Direct JSON parsing failed, trying fallback parsing');
    }

    // 使用特定语言的解析规则
    const parsers = {
      zh: (text) => {
        const lines = text.split('\n').map(line => line.trim());
        const textMatch = lines.find(l => /^[""「」『』]/.test(l) || /[\u4e00-\u9fff]/.test(l));
        const pinyinMatch = lines.find(l => /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/.test(l));
        
        return {
          text: textMatch ? textMatch.replace(/[""「」『』]/g, '').trim() : text,
          pronunciation: pinyinMatch ? {
            native: pinyinMatch.trim(),
            segmented: pinyinMatch.split(/\s+/).map(p => ({
              word: p,
              pinyin: p
            }))
          } : undefined
        };
      },
      ja: (text) => {
        const lines = text.split('\n').map(line => line.trim());
        const textMatch = lines.find(l => /[ぁ-んァ-ン]/.test(l));
        const kanaMatch = lines.find(l => /^[ぁ-んー]+$/.test(l));
        const romajiMatch = lines.find(l => /^[a-zA-Z\s]+$/.test(l));
        
        return {
          text: textMatch || text,
          pronunciation: {
            native: kanaMatch || '',
            romanized: romajiMatch || '',
            segmented: textMatch ? textMatch.split(/\s+/).map(w => ({
              word: w,
              reading: kanaMatch || ''
            })) : []
          }
        };
      },
      ko: (text) => {
        const lines = text.split('\n').map(line => line.trim());
        const textMatch = lines.find(l => /[가-힣]/.test(l));
        const romanizedMatch = lines.find(l => /^[a-zA-Z\s-]+$/.test(l));
        
        return {
          text: textMatch || text,
          pronunciation: romanizedMatch ? {
            romanized: romanizedMatch,
            segmented: textMatch ? textMatch.split(/\s+/).map(w => ({
              word: w,
              reading: romanizedMatch
            })) : []
          } : undefined
        };
      }
    };

    const parser = parsers[targetLanguage];
    if (parser) {
      result = parser(response);
      if (result.text) {
        return result;
      }
    }

    // 如果所有解析方法都失败了，返回最基本的格式
    return {
      text: response.trim(),
      error: 'Failed to parse complete translation result'
    };
  }

  async callLLM(prompt) {
    // 如果使用的是其他提供商，委托给相应的服务
    if (this.config.provider !== 'openai' && this.provider !== this) {
      return await this.provider.callLLM(prompt);
    }

    // OpenAI 实现
    try {
      const response = await axios.post(this.config.apiEndpoint, {
        model: this.config.model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional multi-language translation assistant. Please always return the response in valid JSON format and ensure it can be correctly parsed by JSON.parse().'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      }, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.data.choices && response.data.choices[0]) {
        const content = response.data.choices[0].message.content.trim()
        // 尝试清理响应内容，确保是有效的JSON
        const jsonStr = content.replace(/^```json\n?/, '').replace(/\n?```$/, '')
        try {
          const jsonContent = JSON.parse(jsonStr)
          return JSON.stringify(jsonContent)
        } catch (parseError) {
          console.debug('JSON parsing failed:', parseError)
          // 如果不是有效的 JSON，返回基本格式
          return JSON.stringify({ text: content })
        }
      }

      throw new Error('Invalid API response format')
    } catch (error) {
      if (error.response) {
        console.error('API error details:', error.response.data)
        throw new Error(`API request failed: ${error.response.data.error?.message || JSON.stringify(error.response.data)}`)
      }
      throw error
    }
  }

  async apitest() {
    // 如果使用的是其他提供商，委托给相应的服务
    if (this.config.provider !== 'openai' && this.provider !== this) {
      return await this.provider.apitest();
    }

    // OpenAI 实现
    const messages = [
      {
        role: "user",
        content: "Please say hello in English, Chinese, Japanese, Korean and Russian. Only return the greetings without any explanation."
      }
    ];

    try {
      const response = await axios.post(this.config.apiEndpoint, {
        model: this.config.model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 150
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('API test failed:', error);
      throw error;
    }
  }

  async testConnection() {
    // 如果使用的是其他提供商，委托给相应的服务
    if (this.config.provider !== 'openai' && this.provider !== this) {
      return await this.provider.testConnection();
    }

    // OpenAI 实现
    try {
      const response = await this.callLLM('请用中文回复："连接测试成功"')
      return response.includes('连接测试成功')
    } catch (error) {
      console.error('API connection test failed:', error)
      return false
    }
  }

  async translateText(text, sourceLanguage, targetLanguages, userNativeLanguage = 'zh') {
    try {
      const results = {};
      
      for (const targetLang of targetLanguages) {
        results[targetLang] = {
          loading: true,
          data: null,
          error: null
        };
        
        try {
          const prompt = getTranslationPrompt(text, sourceLanguage, targetLang, userNativeLanguage);
          const response = await this.callLLM(prompt);
          let translationData;
          
          try {
            translationData = JSON.parse(response);
          } catch (error) {
            console.error('JSON parsing failed:', error);
            translationData = { text: response };
          }
          
          results[targetLang] = {
            loading: false,
            data: translationData,
            error: null,
            lang: targetLang
          };
        } catch (error) {
          results[targetLang] = {
            loading: false,
            data: null,
            error: error.message,
            lang: targetLang
          };
        }
      }
      
      return results;
    } catch (error) {
      console.error('Translation process error:', error);
      throw new Error('Translation failed: ' + error.message);
    }
  }
  
  async analyzePronunciation(text, language, userNativeLanguage = 'zh') {
    try {
      const prompt = getPronunciationAnalysisPrompt(text, language, userNativeLanguage);
      const response = await this.callLLM(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Pronunciation analysis failed:', error);
      throw error;
    }
  }
  
  async analyzeGrammar(text, language, userNativeLanguage = 'zh') {
    try {
      const prompt = getGrammarAnalysisPrompt(text, language, userNativeLanguage);
      const response = await this.callLLM(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Grammar analysis failed:', error);
      throw error;
    }
  }
  
  async analyzeUsage(text, language, userNativeLanguage = 'zh') {
    try {
      const prompt = getUsageAnalysisPrompt(text, language, userNativeLanguage);
      const response = await this.callLLM(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Usage analysis failed:', error);
      throw error;
    }
  }

  // 获取推荐模型列表
  getRecommendedModels() {
    if (this.provider && this.provider.getRecommendedModels) {
      return this.provider.getRecommendedModels();
    }
    
    // 默认 OpenAI 模型
    return [
      'gpt-4o',
      'gpt-4-turbo',
      'gpt-3.5-turbo'
    ];
  }
}

export default ApiService
