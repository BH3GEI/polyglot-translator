import Cerebras from '@cerebras/cerebras_cloud_sdk';

class CerebrasService {
  constructor(config) {
    this.config = config;
    this.client = new Cerebras({
      apiKey: config.apiKey
    });
  }

  async callLLM(prompt) {
    try {
      const response = await this.client.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a professional multilingual translation assistant. Please always return responses in valid JSON format to ensure they can be correctly parsed by JSON.parse().'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: this.config.model || 'qwen-3-32b',
        temperature: 0.3,
        max_tokens: 2000
      });

      if (response.choices && response.choices[0]) {
        const content = response.choices[0].message.content.trim();
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
      console.error('Cerebras API error:', error);
      throw new Error(`Cerebras API request failed: ${error.message}`);
    }
  }

  async testConnection() {
    try {
      const response = await this.callLLM('请用中文回复："连接测试成功"');
      return response.includes('连接测试成功');
    } catch (error) {
      console.error('Cerebras API connection test failed:', error);
      return false;
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
      const response = await this.client.chat.completions.create({
        messages: messages,
        model: this.config.model || 'qwen-3-32b',
        temperature: 0.7,
        max_tokens: 150
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Cerebras API test failed:', error);
      throw error;
    }
  }
}

export default CerebrasService; 