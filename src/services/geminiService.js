import axios from 'axios';

class GeminiService {
  constructor(config) {
    this.config = config;
    this.apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${config.model || 'gemini-2.0-flash'}:generateContent`;
  }

  async callLLM(prompt) {
    try {
      const response = await axios.post(
        `${this.apiEndpoint}?key=${this.config.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `You are a professional multilingual translation assistant. Please always return responses in valid JSON format to ensure they can be correctly parsed by JSON.parse().\n\n${prompt}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2000,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.candidates && response.data.candidates[0]) {
        const content = response.data.candidates[0].content.parts[0].text.trim();
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
      console.error('Gemini API error:', error);
      if (error.response) {
        throw new Error(`Gemini API request failed: ${error.response.data.error?.message || JSON.stringify(error.response.data)}`);
      }
      throw new Error(`Gemini API request failed: ${error.message}`);
    }
  }

  async testConnection() {
    try {
      const response = await this.callLLM('请用中文回复："连接测试成功"');
      return response.includes('连接测试成功');
    } catch (error) {
      console.error('Gemini API connection test failed:', error);
      return false;
    }
  }

  async apitest() {
    try {
      const response = await axios.post(
        `${this.apiEndpoint}?key=${this.config.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: "Please say hello in English, Chinese, Japanese, Korean and Russian. Only return the greetings without any explanation."
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 150,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API test failed:', error);
      throw error;
    }
  }
}

export default GeminiService; 