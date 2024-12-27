export const zhPrompts = {
  basicTranslation: `请将以下{sourceLanguage}文本翻译成{targetLanguage}，并用中文提供解释：
{text}

请以以下JSON格式返回，翻译使用目标语言，解释使用中文：
{
  "translations": [
    {
      "text": "翻译结果（使用目标语言）",
      "partOfSpeech": "词性",
      "meaning": "含义解释",
      "usage": "用法说明",
      "examples": [
        {
          "source": "原文例句",
          "target": "翻译后的例句",
          "explanation": "例句说明",
          "annotations": [
            {
              "position": [0, 1],
              "reading": "此字的读音"
            }
          ]
        }
      ],
      "level": "使用级别（如：初级/中级/高级）",
      "style": "语言风格（如：正式/非正式/书面/口语）",
      "domain": "使用领域（如：日常/商务/学术/文学）"
    }
  ],
  "pronunciation": {
    "ipa": "国际音标",
    "native": "标准发音标记",
    "romaji": "日语罗马音（针对日语文本）",
    "englishRomaji": "英式罗马音（针对日语文本）",
    "notes": "发音注意事项",
    "annotations": [
      {
        "position": [0, 1],
        "reading": "此字的读音"
      }
    ]
  },
  "variants": [
    {
      "text": "变体形式（变位/时态/语气等）",
      "explanation": "变体说明"
    }
  ],
  "synonyms": ["同义词1", "同义词2"],
  "antonyms": ["反义词1", "反义词2"],
  "collocations": [
    {
      "pattern": "常见搭配",
      "explanation": "搭配说明",
      "example": "搭配示例"
    }
  ],
  "etymology": {
    "origin": "词源",
    "development": "意义演变",
    "cognates": ["相关词"]
  },
  "cultural_notes": "文化背景",
  "notes": "其他重要说明"
}`,
  
  pronunciationAnalysis: `请分析以下{targetLanguage}文本的发音，用中文解释：
{text}

请按照以下JSON格式返回，发音示例使用目标语言，解释使用中文：
{
  "pronunciation": {
    "native": "原文发音（使用目标语言）",
    "segmented": [
      {
        "word": "单词（使用目标语言）",
        "reading": "发音/音标",
        "explanation": "用中文解释发音要点",
        "similar_sounds": ["相似发音的词（使用目标语言）"]
      }
    ],
    "intonation": "用中文解释语调特点",
    "notes": "用中文说明发音要点"
  }
}`,

  grammarAnalysis: `请分析以下{targetLanguage}句子的语法结构，用中文解释：
{text}

请按照以下JSON格式返回，例句使用目标语言，解释使用中文：
{
  "grammar": {
    "structure": "用中文说明句子结构",
    "components": [
      {
        "part": "语法成分（使用目标语言）",
        "function": "用中文解释语法功能",
        "explanation": "用中文详细说明",
        "examples": ["类似用法示例（使用目标语言）"]
      }
    ],
    "notes": "用中文说明语法要点"
  }
}`,

  usageAnalysis: `请分析以下{targetLanguage}词语/句子的用法，用中文解释：
{text}

请按照以下JSON格式返回，例句和用法示例使用目标语言，解释使用中文：
{
  "usage": {
    "register": "用中文说明使用场合（正式/非正式/书面/口语等）",
    "context": "用中文说明使用场景",
    "examples": [
      {
        "example": "用法示例（使用目标语言）",
        "explanation": "用中文解释",
        "context": "用中文说明适用场景"
      }
    ],
    "collocations": ["常见搭配（使用目标语言）"],
    "notes": "用中文说明其他使用要点"
  }
}`
}; 