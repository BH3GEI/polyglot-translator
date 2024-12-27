export const prompts = {
  // 基本翻译提示
  basicTranslation: {
    zh: `请将以下{text}翻译成中文，只返回翻译结果：`,
    en: `Please translate the following{text} to English, return only the translation：`,
    ja: `以下の{text}を日本語に翻訳してください。翻訳結果のみを返してください：`,
    ko: `다음 텍스트를 한국어로 번역해 주세요. 번역 결과만 반환하세요：`,
    ru: `Переведите следующий{text} на русский язык, верните только перевод：`
  },

  // 发音分析提示
  pronunciationAnalysis: {
    zh: `请分析以下中文文本的发音，返回拼音（包含声调）。使用JSON格式返回：
{text}
返回格式示例：
{
  "pronunciation": {
    "pinyin": "你好",
    "segmented": [
      {"word": "你", "pinyin": "nǐ"},
      {"word": "好", "pinyin": "hǎo"}
    ]
  }
}`,
    ja: `以下の日本語テキストの読み方を分析し、かな（ひらがな）とローマ字で返してください。JSONフォーマットで返してください：
{text}
返回格式示例：
{
  "pronunciation": {
    "kana": "こんにちは",
    "romaji": "konnichiwa",
    "segmented": [
      {"word": "今日", "reading": "きょう"},
      {"word": "は", "reading": "は"}
    ]
  }
}`,
    ko: `다음 한국어 텍스트의 발음을 분석하여 로마자로 반환하세요. JSON 형식으로 반환하세요：
{text}
返回格式示例：
{
  "pronunciation": {
    "romanized": "annyeonghaseyo",
    "segmented": [
      {"word": "안녕", "reading": "annyeong"},
      {"word": "하세요", "reading": "haseyo"}
    ]
  }
}`,
    ru: `Проанализируйте произношение следующего русского текста и верните транскрипцию. Верните в формате JSON：
{text}
返回格式示例：
{
  "pronunciation": {
    "ipa": "[prʲɪvʲˈet]",
    "romanized": "privet"
  }
}`
  },

  // 语法分析提示
  grammarAnalysis: {
    zh: `请分析以下中文句子的语法结构，返回JSON格式：
{text}
返回格式示例：
{
  "grammar": {
    "structure": "主谓宾结构",
    "tense": "现在时",
    "mood": "陈述语气",
    "notes": "使用了'把'字句"
  }
}`,
    ja: `以下の日本語の文の文法を分析し、JSONフォーマットで返してください：
{text}
返回格式示例：
{
  "grammar": {
    "structure": "SOV構文",
    "tense": "現在形",
    "politeness": "です・ます体",
    "notes": "助詞「は」を使用"
  }
}`,
    ko: `다음 한국어 문장의 문법을 분석하여 JSON 형식으로 반환하세요：
{text}
返回格式示例：
{
  "grammar": {
    "structure": "SOV 구조",
    "tense": "현재",
    "honorific": "존댓말",
    "notes": "조사 '이/가' 사용"
  }
}`,
    ru: `Проанализируйте грамматику следующего русского предложения и верните в формате JSON：
{text}
返回格式示例：
{
  "grammar": {
    "structure": "SVO структура",
    "tense": "настоящее время",
    "aspect": "совершенный вид",
    "notes": "использован творительный падеж"
  }
}`
  },

  // 用法分析提示
  usageAnalysis: {
    zh: `请分析以下中文词语/句子的用法，返回JSON格式：
{text}
返回格式示例：
{
  "usage": {
    "register": "正式/口语/书面语",
    "context": "使用场景说明",
    "examples": [
      "示例1",
      "示例2"
    ],
    "notes": "其他使用说明"
  }
}`,
    ja: `以下の日本語の言葉・文章の使い方を分析し、JSONフォーマットで返してください：
{text}
返回格式示例：
{
  "usage": {
    "register": "丁寧語/普通語/書き言葉",
    "context": "使用シーン",
    "examples": [
      "例文1",
      "例文2"
    ],
    "notes": "その他の注意点"
  }
}`,
    ko: `다음 한국어 단어/문장의 용법을 분석하여 JSON 형식으로 반환하세요：
{text}
返回格式示例：
{
  "usage": {
    "register": "존댓말/반말/문어체",
    "context": "사용 상황",
    "examples": [
      "예문1",
      "예문2"
    ],
    "notes": "기타 사용 설명"
  }
}`,
    ru: `Проанализируйте использование следующего русского слова/предложения и верните в формате JSON：
{text}
返回格式示例：
{
  "usage": {
    "register": "формальный/разговорный/письменный",
    "context": "ситуация использования",
    "examples": [
      "пример1",
      "пример2"
    ],
    "notes": "дополнительные примечания"
  }
}`
  },

  // 用于结果分析的提示
  resultAnalysis: `请分析以下翻译输出，提取关键信息并以JSON格式返回：

{text}

请确保返回的JSON包含以下字段（如果信息存在）：
{
  "text": "翻译文本",
  "pronunciation": {
    "native": "原文发音",
    "romanized": "罗马字/拼音",
    "segmented": [
      {
        "word": "单词",
        "reading": "读音"
      }
    ]
  },
  "grammar": {
    "structure": "句子结构",
    "tense": "时态",
    "mood": "语气",
    "notes": "其他语法说明"
  },
  "usage": {
    "register": "使用场合",
    "examples": ["示例1", "示例2"],
    "notes": "使用说明"
  }
}`
}

export function getTranslationPrompt(text, sourceLanguage, targetLanguage) {
  return `请将以下${sourceLanguage}文本翻译成${targetLanguage}并进行分析：
${text}

请严格按照以下JSON格式返回结果：
{
  "text": "翻译结果",
  "analysis": {
    "meaning": "词义/句意解释",
    "context": "使用场景",
    "alternatives": ["其他可能的翻译1", "其他可能的翻译2"],
    "notes": "翻译说明"
  }
}`
}

export function getPronunciationAnalysisPrompt(text, sourceLanguage, targetLanguage) {
  const templates = {
    zh: {
      format: `{
  "pronunciation": {
    "native": "拼音（包含声调）",
    "segmented": [
      {
        "word": "单字",
        "pinyin": "拼音",
        "tone": "声调说明"
      }
    ],
    "intonation": "语调说明",
    "stress": "重音位置",
    "notes": "发音要点说明"
  }
}`
    },
    ja: {
      format: `{
  "pronunciation": {
    "native": "假名读音",
    "romanized": "罗马字",
    "segmented": [
      {
        "word": "单词",
        "reading": "假名读音",
        "pitch_accent": "声调高低"
      }
    ],
    "intonation": "语调说明",
    "notes": "发音要点说明"
  }
}`
    },
    ko: {
      format: `{
  "pronunciation": {
    "romanized": "罗马字",
    "segmented": [
      {
        "word": "单词",
        "reading": "罗马字读音",
        "pronunciation_guide": "发音指导"
      }
    ],
    "intonation": "语调说明",
    "notes": "发音要点说明"
  }
}`
    },
    ru: {
      format: `{
  "pronunciation": {
    "ipa": "国际音标",
    "romanized": "罗马字",
    "stress_pattern": "重音模式",
    "syllable_breakdown": "音节分解",
    "notes": "发音要点说明"
  }
}`
    }
  }

  return `请详细分析以下${targetLanguage}文本的发音：
${text}

请提供完整的发音分析，包括：
1. 单词/字符的读音
2. 声调/重音位置
3. 语调说明
4. 发音要点和技巧

请严格按照以下JSON格式返回结果：
${templates[targetLanguage]?.format || templates.en?.format}`
}

export function getGrammarAnalysisPrompt(text, sourceLanguage, targetLanguage) {
  return `请详细分析以下${targetLanguage}文本的语法结构：
${text}

请提供完整的语法分析，包括：
1. 句子结构
2. 时态和语气
3. 语法特点
4. 特殊语法规则说明

请严格按照以下JSON格式返回结果：
{
  "grammar": {
    "structure": "句子结构说明",
    "tense": "时态说明",
    "mood": "语气说明",
    "components": [
      {
        "type": "主语/谓语/宾语等",
        "content": "内容",
        "function": "语法功能说明"
      }
    ],
    "patterns": ["使用的语法模式1", "使用的语法模式2"],
    "notes": "其他语法说明"
  }
}`
}

export function getUsageAnalysisPrompt(text, sourceLanguage, targetLanguage) {
  return `请详细分析以下${targetLanguage}文本的用法：
${text}

请提供完整的用法分析，包括：
1. 使用场合和语体风格
2. 常见搭配和表达方式
3. 使用注意事项
4. 实际应用示例

请严格按照以下JSON格式返回结果：
{
  "usage": {
    "register": "使用场合（正式/非正式/书面/口语等）",
    "style": "语体风格说明",
    "context": "使用场景说明",
    "collocations": [
      {
        "pattern": "常见搭配",
        "example": "示例"
      }
    ],
    "examples": [
      {
        "text": "示例文本",
        "context": "使用场景",
        "explanation": "说明"
      }
    ],
    "cultural_notes": "文化背景说明",
    "notes": "其他使用说明"
  }
}`
}

export function getLanguageAnalysisPrompt(text) {
  return `请判断以下文本最可能的语言：
${text}

请直接返回对应的语言代码：
- 中文：zh
- 英语：en
- 日语：ja
- 韩语：ko
- 俄语：ru`
}
