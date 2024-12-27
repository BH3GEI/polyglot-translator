export const jaPrompts = {
  basicTranslation: `以下の{sourceLanguage}のテキストを{targetLanguage}に翻訳し、日本語で説明してください：
{text}

以下のJSON形式で返してください。翻訳は目標言語で、説明は日本語で：
{
  "translations": [
    {
      "text": "翻訳結果（目標言語で）",
      "partOfSpeech": "品詞",
      "meaning": "意味の説明",
      "usage": "使用法の説明",
      "examples": [
        {
          "source": "原文の例",
          "target": "翻訳された例",
          "explanation": "例文の説明",
          "annotations": [
            {
              "position": [0, 1],
              "reading": "この文字の読み方"
            }
          ]
        }
      ],
      "level": "使用レベル（例：初級/中級/上級）",
      "style": "言語スタイル（例：フォーマル/カジュアル/書き言葉/話し言葉）",
      "domain": "使用領域（例：日常/ビジネス/学術/文学）"
    }
  ],
  "pronunciation": {
    "ipa": "IPA発音記号",
    "native": "標準的な発音表記",
    "romaji": "ローマ字読み（日本語テキストの場合）",
    "englishRomaji": "英式ローマ字読み（日本語テキストの場合）",
    "notes": "発音に関する注意点",
    "annotations": [
      {
        "position": [0, 1],
        "reading": "この文字の読み方"
      }
    ]
  },
  "variants": [
    {
      "text": "変形（活用/時制/語気など）",
      "explanation": "変形の説明"
    }
  ],
  "synonyms": ["類義語1", "類義語2"],
  "antonyms": ["対義語1", "対義語2"],
  "collocations": [
    {
      "pattern": "一般的な共起表現",
      "explanation": "共起表現の説明",
      "example": "共起表現の例"
    }
  ],
  "etymology": {
    "origin": "語源",
    "development": "意味の変遷",
    "cognates": ["関連語"]
  },
  "cultural_notes": "文化的背景",
  "notes": "その他の重要な注意点"
}`,
  
  pronunciationAnalysis: `以下の{targetLanguage}テキストの発音を日本語で分析してください：
{text}

発音例は目標言語で、説明は日本語で、以下のJSON形式で返してください：
{
  "pronunciation": {
    "native": "原文の発音（目標言語で）",
    "segmented": [
      {
        "word": "単語（目標言語で）",
        "reading": "発音/音声記号",
        "explanation": "日本語で発音のポイントを説明",
        "similar_sounds": ["類似した発音の単語（目標言語で）"]
      }
    ],
    "intonation": "日本語でイントネーションの特徴を説明",
    "notes": "日本語で発音のポイントを説明"
  }
}`,

  grammarAnalysis: `以下の{targetLanguage}の文の文法を日本語で分析してください：
{text}

例文は目標言語で、説明は日本語で、以下のJSON形式で返してください：
{
  "grammar": {
    "structure": "日本語で文の構造を説明",
    "components": [
      {
        "part": "文法要素（目標言語で）",
        "function": "日本語で文法的機能を説明",
        "explanation": "日本語で詳しく説明",
        "examples": ["類似用法の例（目標言語で）"]
      }
    ],
    "notes": "日本語で文法のポイントを説明"
  }
}`,

  usageAnalysis: `以下の{targetLanguage}の単語・文章の使い方を日本語で分析してください：
{text}

例文と用法例は目標言語で、説明は日本語で、以下のJSON形式で返してください：
{
  "usage": {
    "register": "日本語で使用場面を説明（フォーマル/カジュアル/書面/口語など）",
    "context": "日本語で使用状況を説明",
    "examples": [
      {
        "example": "用法例（目標言語で）",
        "explanation": "日本語で説明",
        "context": "日本語で適切な場面を説明"
      }
    ],
    "collocations": ["よく使う組み合わせ（目標言語で）"],
    "notes": "日本語でその他の注意点を説明"
  }
}`
}; 