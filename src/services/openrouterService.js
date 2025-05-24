import OpenAI from 'openai';

class OpenRouterService {
  constructor(config) {
    this.config = config;
    this.client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: config.apiKey,
      dangerouslyAllowBrowser: true, // 允许在浏览器环境中使用
      defaultHeaders: {
        'HTTP-Referer': config.siteUrl || 'https://localhost:3000', // 可选：网站URL用于在openrouter.ai上排名
        'X-Title': config.siteTitle || 'Multilingual Translator', // 可选：网站标题用于在openrouter.ai上排名
      },
    });
  }

  async callLLM(prompt) {
    try {
      // 对于 Qwen3 模型，添加 /no_think 以禁用推理模式，获得更直接的翻译结果
      const isQwenModel = this.config.model && this.config.model.includes('qwen');
      const enhancedPrompt = isQwenModel ? `${prompt} /no_think` : prompt;
      
      const completion = await this.client.chat.completions.create({
        model: this.config.model || 'qwen/qwen3-32b:free',
        messages: [
          {
            role: 'system',
            content: 'You are a professional multilingual translation assistant. Please always return responses in valid JSON format to ensure they can be correctly parsed by JSON.parse().'
          },
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      if (completion.choices && completion.choices[0]) {
        let content = completion.choices[0].message.content;
        
        // 处理 Qwen3 推理模式的特殊情况
        if (!content && completion.choices[0].message.reasoning) {
          // 如果 content 为空但有 reasoning，尝试从 reasoning 中提取结果
          content = completion.choices[0].message.reasoning;
        }
        
        content = content ? content.trim() : '';
        
        // 尝试清理响应内容，确保是有效的JSON
        const jsonStr = content.replace(/^```json\n?/, '').replace(/\n?```$/, '');
        try {
          const jsonContent = JSON.parse(jsonStr);
          return JSON.stringify(jsonContent);
        } catch (parseError) {
          console.debug('JSON parsing failed:', parseError);
          // 如果不是有效的 JSON，返回基本格式
          return JSON.stringify({ text: content });
        }
      }

      throw new Error('Invalid API response format');
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw new Error(`OpenRouter API request failed: ${error.message}`);
    }
  }

  async testConnection() {
    try {
      const response = await this.callLLM('请用中文回复："连接测试成功"');
      return response.includes('连接测试成功');
    } catch (error) {
      console.error('OpenRouter API connection test failed:', error);
      return false;
    }
  }

  async apitest() {
    try {
      // 对于 Qwen3 模型，添加 /no_think 以获得更直接的响应
      const isQwenModel = this.config.model && this.config.model.includes('qwen');
      const content = isQwenModel 
        ? 'Please say hello in English, Chinese, Japanese, Korean and Russian. Only return the greetings without any explanation. /no_think'
        : 'Please say hello in English, Chinese, Japanese, Korean and Russian. Only return the greetings without any explanation.';
      
      const completion = await this.client.chat.completions.create({
        model: this.config.model || 'qwen/qwen3-32b:free',
        messages: [
          {
            role: 'user',
            content: content
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      let result = completion.choices[0].message.content;
      
      // 处理 Qwen3 推理模式的特殊情况
      if (!result && completion.choices[0].message.reasoning) {
        result = completion.choices[0].message.reasoning;
      }
      
      return result || 'Test response is empty';
    } catch (error) {
      console.error('OpenRouter API test failed:', error);
      throw error;
    }
  }

  // 获取可用模型列表
  async getAvailableModels() {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Failed to get OpenRouter model list:', error);
      return [];
    }
  }

  // 获取推荐的翻译模型
  getRecommendedModels() {
    return [
      'qwen/qwen3-32b:free',
      'openai/gpt-4o',
      'openai/gpt-4-turbo',
      'openai/gpt-3.5-turbo',
      'anthropic/claude-3-sonnet',
      'anthropic/claude-3-haiku',
      'google/gemini-pro',
      'meta-llama/llama-3-70b-instruct',
      'microsoft/wizardlm-2-8x22b',
      'mistralai/mixtral-8x7b-instruct'
    ];
  }
}

export default OpenRouterService; 