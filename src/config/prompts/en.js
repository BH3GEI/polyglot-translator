export const enPrompts = {
  basicTranslation: `Please translate the following {sourceLanguage} text into {targetLanguage} and provide explanations in English:
{text}

Please return in the following JSON format, with translations in the target language and explanations in English:
{
  "translations": [
    {
      "text": "Translation result (in target language)",
      "partOfSpeech": "Part of speech",
      "meaning": "Meaning explanation",
      "usage": "Usage explanation",
      "examples": [
        {
          "source": "Original example",
          "target": "Translated example",
          "explanation": "Example explanation",
          "annotations": [
            {
              "position": [0, 1],
              "reading": "Reading for this character"
            }
          ]
        }
      ],
      "level": "Usage level (e.g., beginner/intermediate/advanced)",
      "style": "Language style (e.g., formal/informal/written/spoken)",
      "domain": "Usage domain (e.g., daily/business/academic/literary)"
    }
  ],
  "pronunciation": {
    "ipa": "IPA phonetic symbols",
    "native": "Native pronunciation notation",
    "romaji": "Japanese romaji reading (for Japanese text)",
    "englishRomaji": "English-style romaji reading (for Japanese text)",
    "notes": "Pronunciation notes",
    "annotations": [
      {
        "position": [0, 1],
        "reading": "Reading for this character"
      }
    ]
  },
  "variants": [
    {
      "text": "Variant form (conjugation/tense/mood etc.)",
      "explanation": "Variant explanation"
    }
  ],
  "synonyms": ["Synonym 1", "Synonym 2"],
  "antonyms": ["Antonym 1", "Antonym 2"],
  "collocations": [
    {
      "pattern": "Common collocation",
      "explanation": "Collocation explanation",
      "example": "Collocation example"
    }
  ],
  "etymology": {
    "origin": "Word origin",
    "development": "Meaning evolution",
    "cognates": ["Related words"]
  },
  "cultural_notes": "Cultural background",
  "notes": "Additional important notes"
}`,

  pronunciationAnalysis: `Please analyze the pronunciation of the following {targetLanguage} text in English:
{text}

Please return in the following JSON format, with pronunciation examples in the target language and explanations in English:
{
  "pronunciation": {
    "native": "Original pronunciation (in target language)",
    "segmented": [
      {
        "word": "Word (in target language)",
        "reading": "Pronunciation/phonetic symbols",
        "explanation": "Pronunciation key points in English",
        "similar_sounds": ["Words with similar pronunciation (in target language)"]
      }
    ],
    "intonation": "Intonation characteristics explanation",
    "notes": "Pronunciation notes"
  }
}`,

  grammarAnalysis: `Please analyze the grammar structure of the following {targetLanguage} sentence in English:
{text}

Please return in the following JSON format, with examples in the target language and explanations in English:
{
  "grammar": {
    "structure": "Sentence structure explanation",
    "components": [
      {
        "part": "Grammatical component (in target language)",
        "function": "Grammatical function explanation",
        "explanation": "Detailed explanation",
        "examples": ["Similar usage examples (in target language)"]
      }
    ],
    "notes": "Grammar key points"
  }
}`,

  usageAnalysis: `Please analyze the usage of the following {targetLanguage} word/sentence in English:
{text}

Please return in the following JSON format, with examples in the target language and explanations in English:
{
  "usage": {
    "register": "Usage context (formal/informal/written/spoken etc.)",
    "context": "Usage situation explanation",
    "examples": [
      {
        "example": "Usage example (in target language)",
        "explanation": "English explanation",
        "context": "Appropriate context explanation"
      }
    ],
    "collocations": ["Common collocations (in target language)"],
    "notes": "Other usage notes"
  }
}`
}; 