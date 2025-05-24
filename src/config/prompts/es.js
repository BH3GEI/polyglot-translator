export const esPrompts = {
  basicTranslation: `Por favor, traduce el siguiente texto de {sourceLanguage} a {targetLanguage}. Proporciona una traducción detallada en formato JSON:

Texto: {text}

Por favor, responde en el siguiente formato JSON:
{
  "translations": [
    {
      "text": "Texto traducido",
      "partOfSpeech": "Parte del discurso (sustantivo/verbo/adjetivo/etc.)",
      "meaning": "Significado y contexto",
      "usage": "Notas de uso",
      "examples": [
        {
          "source": "Oración de ejemplo en el idioma original",
          "target": "Oración de ejemplo traducida",
          "explanation": "Explicación del ejemplo"
        }
      ]
    }
  ],
  "synonyms": ["Sinónimo1", "Sinónimo2"],
  "antonyms": ["Antónimo1", "Antónimo2"],
  "etymology": "Etimología y origen de la palabra",
  "culturalNotes": "Notas culturales y contexto"
}`,

  pronunciationAnalysis: `Por favor, analiza la pronunciación del siguiente texto en {targetLanguage} y proporciona una guía de pronunciación detallada:

Texto: {text}

Por favor, responde en el siguiente formato JSON:
{
  "pronunciation": {
    "ipa": "Símbolos IPA",
    "native": "Pronunciación en el idioma objetivo",
    "romaji": "Romanización (si aplica)",
    "englishRomaji": "Romanización en inglés",
    "notes": "Notas de pronunciación y acentuación"
  }
}`,

  grammarAnalysis: `Por favor, analiza la gramática del siguiente texto en {targetLanguage}:

Texto: {text}

Por favor, responde en el siguiente formato JSON:
{
  "grammar": {
    "structure": "Estructura gramatical",
    "tense": "Tiempo verbal",
    "voice": "Voz activa/pasiva",
    "mood": "Modo",
    "particles": "Partículas y palabras auxiliares",
    "notes": "Notas gramaticales"
  }
}`,

  usageAnalysis: `Por favor, analiza el uso del siguiente texto en {targetLanguage}:

Texto: {text}

Por favor, responde en el siguiente formato JSON:
{
  "usage": {
    "formality": "Nivel de formalidad (formal/informal/neutral)",
    "context": "Contexto de uso",
    "frequency": "Frecuencia de uso",
    "alternatives": ["Expresiones alternativas"],
    "notes": "Notas de uso"
  }
}`
} 