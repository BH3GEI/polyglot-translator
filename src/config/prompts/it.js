export const itPrompts = {
  basicTranslation: `Per favore, traduci il seguente testo da {sourceLanguage} a {targetLanguage}. Fornisci una traduzione dettagliata in formato JSON:

Testo: {text}

Per favore, rispondi nel seguente formato JSON:
{
  "translations": [
    {
      "text": "Testo tradotto",
      "partOfSpeech": "Parte del discorso (sostantivo/verbo/aggettivo/ecc.)",
      "meaning": "Significato e contesto",
      "usage": "Note d'uso",
      "examples": [
        {
          "source": "Frase di esempio nella lingua originale",
          "target": "Frase di esempio tradotta",
          "explanation": "Spiegazione dell'esempio"
        }
      ]
    }
  ],
  "synonyms": ["Sinonimo1", "Sinonimo2"],
  "antonyms": ["Antonimo1", "Antonimo2"],
  "etymology": "Etimologia e origine della parola",
  "culturalNotes": "Note culturali e contesto"
}`,

  pronunciationAnalysis: `Per favore, analizza la pronuncia del seguente testo in {targetLanguage} e fornisci una guida dettagliata alla pronuncia:

Testo: {text}

Per favore, rispondi nel seguente formato JSON:
{
  "pronunciation": {
    "ipa": "Simboli IPA",
    "native": "Pronuncia nella lingua di destinazione",
    "romaji": "Romanizzazione (se applicabile)",
    "englishRomaji": "Romanizzazione inglese",
    "notes": "Note sulla pronuncia e accento"
  }
}`,

  grammarAnalysis: `Per favore, analizza la grammatica del seguente testo in {targetLanguage}:

Testo: {text}

Per favore, rispondi nel seguente formato JSON:
{
  "grammar": {
    "structure": "Struttura grammaticale",
    "tense": "Tempo verbale",
    "voice": "Voce attiva/passiva",
    "mood": "Modo",
    "particles": "Particelle e parole ausiliarie",
    "notes": "Note grammaticali"
  }
}`,

  usageAnalysis: `Per favore, analizza l'uso del seguente testo in {targetLanguage}:

Testo: {text}

Per favore, rispondi nel seguente formato JSON:
{
  "usage": {
    "formality": "Livello di formalità (formale/informale/neutrale)",
    "context": "Contesto d'uso",
    "frequency": "Frequenza d'uso",
    "alternatives": ["Espressioni alternative"],
    "notes": "Note d'uso"
  }
}`
} 