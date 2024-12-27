export const koPrompts = {
  basicTranslation: `다음 {sourceLanguage} 텍스트를 {targetLanguage}로 번역하고 한국어로 설명해 주세요:
{text}

번역 내용은 목표 언어로, 설명은 한국어로 다음 JSON 형식으로 반환해 주세요:
{
  "translations": [
    {
      "text": "번역 결과(목표 언어로)",
      "partOfSpeech": "품사",
      "meaning": "의미 설명",
      "usage": "사용법 설명",
      "examples": [
        {
          "source": "원문 예문",
          "target": "번역된 예문",
          "explanation": "예문 설명"
        }
      ],
      "level": "사용 수준(예: 초급/중급/고급)",
      "style": "언어 스타일(예: 격식/비격식/문어/구어)",
      "domain": "사용 영역(예: 일상/비즈니스/학술/문학 등)"
    }
  ],
  "pronunciation": {
    "ipa": "국제음성기호",
    "native": "목표 언어의 표준 발음 표기",
    "notes": "발음 요점"
  },
  "variants": [
    {
      "text": "변형 형태(활용/시제/어기 등)",
      "explanation": "변형 설명"
    }
  ],
  "synonyms": ["유의어1", "유의어2"],
  "antonyms": ["반의어1", "반의어2"],
  "collocations": [
    {
      "pattern": "자주 쓰이는 결합",
      "explanation": "결합 설명",
      "example": "결합 예시"
    }
  ],
  "etymology": {
    "origin": "어원",
    "development": "의미 변천",
    "cognates": ["관련어"]
  },
  "cultural_notes": "문화적 배경",
  "notes": "기타 중요 사항"
}`,

  pronunciationAnalysis: `다음 {targetLanguage} 텍스트의 발음을 한국어로 분석해 주세요:
{text}

발음 예시는 목표 언어로, 설명은 한국어로 다음 JSON 형식으로 반환해 주세요:
{
  "pronunciation": {
    "native": "원문 발음(목표 언어로)",
    "segmented": [
      {
        "word": "단어(목표 언어로)",
        "reading": "발음/음성 기호",
        "explanation": "발음 요점 설명",
        "similar_sounds": ["비슷한 발음의 단어(목표 언어로)"]
      }
    ],
    "intonation": "억양 특징 설명",
    "notes": "발음 요점"
  }
}`,

  grammarAnalysis: `다음 {targetLanguage} 문장의 문법을 한국어로 분석해 주세요:
{text}

예문은 목표 언어로, 설명은 한국어로 다음 JSON 형식으�� 반환해 주세요:
{
  "grammar": {
    "structure": "문장 구조 설명",
    "components": [
      {
        "part": "문법 요소(목표 언어로)",
        "function": "문법적 기능 설명",
        "explanation": "자세한 설명",
        "examples": ["유사 용법 예시(목표 언어로)"]
      }
    ],
    "notes": "문법 요점"
  }
}`,

  usageAnalysis: `다음 {targetLanguage} 단어/문장의 사용법을 한국어로 분석해 주세요:
{text}

예문과 용법 예시는 목표 언어로, 설명은 한국어로 다음 JSON 형식으로 반환해 주세요:
{
  "usage": {
    "register": "사용 상황(격식/비격식/문어/구어 등)",
    "context": "사용 상황 설명",
    "examples": [
      {
        "example": "용법 예시(목표 언어로)",
        "explanation": "한국어 설명",
        "context": "적절한 상황 설명"
      }
    ],
    "collocations": ["자주 쓰이는 결합(목표 언어로)"],
    "notes": "기타 사용 요점"
  }
}`
}; 