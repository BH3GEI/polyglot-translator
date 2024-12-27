export const ruPrompts = {
  basicTranslation: `Пожалуйста, переведите следующий текст с {sourceLanguage} на {targetLanguage} и предоставьте объяснения на русском языке:
{text}

Пожалуйста, верните в следующем формате JSON, с переводами на целевом языке и объяснениями на русском:
{
  "translations": [
    {
      "text": "Результат перевода (на целевом языке)",
      "partOfSpeech": "Часть речи",
      "meaning": "Объяснение значения",
      "usage": "Объяснение использования",
      "examples": [
        {
          "source": "Исходный пример",
          "target": "Переведенный пример",
          "explanation": "Объяснение примера"
        }
      ],
      "level": "Уровень использования (например: начальный/средний/продвинутый)",
      "style": "Языковой стиль (например: формальный/неформальный/письменный/разговорный)",
      "domain": "Область использования (например: повседневная/деловая/академическая/литературная)"
    }
  ],
  "pronunciation": {
    "ipa": "Символы международной фонетической транскрипции",
    "native": "Стандартное произношение на целевом языке",
    "notes": "Примечания по произношению"
  },
  "variants": [
    {
      "text": "Вариант формы (спряжение/время/наклонение и т.д.)",
      "explanation": "Объяснение варианта"
    }
  ],
  "synonyms": ["Синоним 1", "Синоним 2"],
  "antonyms": ["Антоним 1", "Антоним 2"],
  "collocations": [
    {
      "pattern": "Распространенное словосочетание",
      "explanation": "Объяснение словосочетания",
      "example": "Пример словосочетания"
    }
  ],
  "etymology": {
    "origin": "Происхождение слова",
    "development": "Эволюция значени��",
    "cognates": ["Родственные слова"]
  },
  "cultural_notes": "Культурный контекст",
  "notes": "Дополнительные важные примечания"
}`,

  pronunciationAnalysis: `Пожалуйста, проанализируйте произношение следующего текста на {targetLanguage} на русском языке:
{text}

Пожалуйста, верните в следующем формате JSON, с примерами произношения на целевом языке и объяснениями на русском:
{
  "pronunciation": {
    "native": "Оригинальное произношение (на целевом языке)",
    "segmented": [
      {
        "word": "Слово (на целевом языке)",
        "reading": "Произношение/фонетические символы",
        "explanation": "Ключевые моменты произношения",
        "similar_sounds": ["Слова с похожим произношением (на целевом языке)"]
      }
    ],
    "intonation": "Объяснение характеристик интонации",
    "notes": "Примечания по произношению"
  }
}`,

  grammarAnalysis: `Пожалуйста, проанализируйте грамматическую структуру следующего предложения на {targetLanguage} на русском языке:
{text}

Пожалуйста, верните в следующем формате JSON, с примерами на целевом языке и объяснениями на русском:
{
  "grammar": {
    "structure": "Объяснение структуры предложения",
    "components": [
      {
        "part": "Грамматический компонент (на целевом языке)",
        "function": "Объяснение грамматической функции",
        "explanation": "Подробное объяснение",
        "examples": ["Примеры похожего использования (на целевом языке)"]
      }
    ],
    "notes": "Ключевые моменты грамматики"
  }
}`,

  usageAnalysis: `Пожалуйста, проанализируйте использование следующего слова/предложения на {targetLanguage} на русском языке:
{text}

Пожалуйста, верните в следующем формате JSON, с примерами на целевом языке и объяснениями на русском:
{
  "usage": {
    "register": "Контекст использования (формальный/неформальный/письменный/разговорный и т.д.)",
    "context": "Объяснение ситуации использования",
    "examples": [
      {
        "example": "Пример использования (на целевом языке)",
        "explanation": "Объяснение на русском",
        "context": "Объяснение подходящего контекста"
      }
    ],
    "collocations": ["Распространенные словосочетания (на целевом языке)"],
    "notes": "Другие примечания по использованию"
  }
}`
}; 