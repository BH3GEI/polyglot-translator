import axios from 'axios'
import { prompts, getTranslationPrompt, getPronunciationAnalysisPrompt, getGrammarAnalysisPrompt, getUsageAnalysisPrompt } from '@/config/prompts'

class ApiService {
  constructor(config) {
    this.config = config
  }

  async detectLanguage(text) {
    if (!text) return null

    try {
      const response = await this.callLLM(`分析以下文本的语言，只返回语言代码（zh/en/ja/ko/ru）：\n${text}`)
      const lang = response.trim().toLowerCase()
      if (['zh', 'en', 'ja', 'ko', 'ru'].includes(lang)) {
        return lang
      }
      return 'en'
    } catch (error) {
      console.error('语言检测失败:', error)
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
      ru: /[.!?]$/
    }

    // 检查基本句子特征
    const hasEndPunctuation = Object.values(sentencePatterns).some(pattern => 
      pattern.test(text.trim())
    )
    const wordCount = text.trim().split(/\s+/).length
    
    // 如果有结束标点或词数大于3，认为是句子
    return hasEndPunctuation || wordCount > 3
  }

  async translate(text, sourceLanguage, targetLanguage) {
    if (!text || !sourceLanguage || !targetLanguage) {
      throw new Error('缺少必要的翻译参数')
    }

    const isSentence = this.isSentence(text)
    const results = {
      text: '',
      analysis: null,
      pronunciation: null,
      grammar: null,
      usage: null,
      rawResponses: {}
    }

    try {
      // 步骤1：基本翻译
      const basicPrompt = getTranslationPrompt(text, sourceLanguage, targetLanguage)
      const basicResponse = await this.callLLM(basicPrompt)
      try {
        const basicData = JSON.parse(basicResponse)
        results.text = basicData.text
        results.analysis = basicData.analysis
      } catch (error) {
        console.debug('基本翻译解析失败:', error)
        results.text = basicResponse.trim()
      }
      results.rawResponses.basic = basicResponse

      // 如果是句子，进行更详细的分析
      if (isSentence) {
        // 步骤2：发音分析
        try {
          const pronunciationPrompt = getPronunciationAnalysisPrompt(results.text, sourceLanguage, targetLanguage)
          const pronunciationResponse = await this.callLLM(pronunciationPrompt)
          const pronunciationData = JSON.parse(pronunciationResponse)
          results.pronunciation = pronunciationData.pronunciation
          results.rawResponses.pronunciation = pronunciationResponse
        } catch (error) {
          console.debug('发音分析失败:', error)
        }

        // 步骤3：语法分析
        try {
          const grammarPrompt = getGrammarAnalysisPrompt(results.text, sourceLanguage, targetLanguage)
          const grammarResponse = await this.callLLM(grammarPrompt)
          const grammarData = JSON.parse(grammarResponse)
          results.grammar = grammarData.grammar
          results.rawResponses.grammar = grammarResponse
        } catch (error) {
          console.debug('语法分析失败:', error)
        }

        // 步骤4：用法分析
        try {
          const usagePrompt = getUsageAnalysisPrompt(results.text, sourceLanguage, targetLanguage)
          const usageResponse = await this.callLLM(usagePrompt)
          const usageData = JSON.parse(usageResponse)
          results.usage = usageData.usage
          results.rawResponses.usage = usageResponse
        } catch (error) {
          console.debug('用法分析失败:', error)
        }
      }

      return results
    } catch (error) {
      console.error('翻译过程出错:', error)
      throw new Error('翻译失败: ' + error.message)
    }
  }

  async parseTranslationResult(response, targetLanguage, isSentence) {
    let result = null

    // 首先尝试直接解析JSON
    try {
      result = JSON.parse(response)
      if (result.text) {
        return result
      }
    } catch (error) {
      console.debug('Direct JSON parsing failed, trying AI analysis')
    }

    // 如果直接解析失败，使用AI分析
    try {
      const analysisPrompt = prompts.resultAnalysis + response
      const analysisResponse = await this.callLLM(analysisPrompt)
      result = JSON.parse(analysisResponse)
      
      if (result.text) {
        return result
      }
    } catch (error) {
      console.debug('AI analysis failed, trying fallback parsing')
    }

    // 使用特定语言的解析规则
    const parsers = {
      zh: (text) => {
        const lines = text.split('\n').map(line => line.trim())
        const textMatch = lines.find(l => /^[""「」『』]/.test(l) || /[\u4e00-\u9fff]/.test(l))
        const pinyinMatch = lines.find(l => /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/.test(l))
        
        return {
          text: textMatch ? textMatch.replace(/[""「」『』]/g, '').trim() : text,
          pronunciation: pinyinMatch ? {
            native: pinyinMatch.trim(),
            segmented: pinyinMatch.split(/\s+/).map(p => ({
              word: p,
              pinyin: p
            }))
          } : undefined
        }
      },
      ja: (text) => {
        const lines = text.split('\n').map(line => line.trim())
        const textMatch = lines.find(l => /[ぁ-んァ-ン]/.test(l))
        const kanaMatch = lines.find(l => /^[ぁ-んー]+$/.test(l))
        const romajiMatch = lines.find(l => /^[a-zA-Z\s]+$/.test(l))
        
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
        }
      },
      ko: (text) => {
        const lines = text.split('\n').map(line => line.trim())
        const textMatch = lines.find(l => /[가-힣]/.test(l))
        const romanizedMatch = lines.find(l => /^[a-zA-Z\s-]+$/.test(l))
        
        return {
          text: textMatch || text,
          pronunciation: romanizedMatch ? {
            romanized: romanizedMatch,
            segmented: textMatch ? textMatch.split(/\s+/).map(w => ({
              word: w,
              reading: romanizedMatch
            })) : []
          } : undefined
        }
      }
    }

    const parser = parsers[targetLanguage]
    if (parser) {
      result = parser(response)
      if (result.text) {
        return result
      }
    }

    // 如果所有解析方法都失败了，返回最基本的格式
    return {
      text: response.trim(),
      error: 'Failed to parse complete translation result'
    }
  }

  async callLLM(prompt) {
    try {
      const response = await axios.post(this.config.apiEndpoint, {
        model: this.config.model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的多语言翻译助手。请始终以有效的JSON格式返回响应，确保响应可以被JSON.parse()正确解析。'
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
          console.debug('JSON解析失败:', parseError)
          // 如果不是有效的 JSON，返回基本格式
          return JSON.stringify({ text: content })
        }
      }

      throw new Error('API返回格式错误')
    } catch (error) {
      if (error.response) {
        console.error('API错误详情:', error.response.data)
        throw new Error(`API请求失败: ${error.response.data.error?.message || JSON.stringify(error.response.data)}`)
      }
      throw error
    }
  }

  async apitest() {
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
      console.error('API测试失败:', error);
      throw error;
    }
  }

  async testConnection() {
    try {
      const response = await this.callLLM('请用中文回复："连接测试成功"')
      return response.includes('连接测试成功')
    } catch (error) {
      console.error('API连接���试失败:', error)
      return false
    }
  }
}

export default ApiService
