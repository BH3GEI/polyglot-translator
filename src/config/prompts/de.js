export const dePrompts = {
  basicTranslation: `Bitte übersetzen Sie den folgenden Text von {sourceLanguage} ins {targetLanguage}. Geben Sie eine detaillierte Übersetzung im JSON-Format zurück:

Text: {text}

Bitte antworten Sie im folgenden JSON-Format:
{
  "translations": [
    {
      "text": "Übersetzter Text",
      "partOfSpeech": "Wortart (Substantiv/Verb/Adjektiv/etc.)",
      "meaning": "Bedeutung und Kontext",
      "usage": "Verwendungshinweise",
      "examples": [
        {
          "source": "Beispielsatz in der Originalsprache",
          "target": "Übersetzter Beispielsatz",
          "explanation": "Erklärung des Beispiels"
        }
      ]
    }
  ],
  "synonyms": ["Synonym1", "Synonym2"],
  "antonyms": ["Antonym1", "Antonym2"],
  "etymology": "Etymologie und Wortherkunft",
  "culturalNotes": "Kulturelle Hinweise und Kontext"
}`,

  pronunciationAnalysis: `Bitte analysieren Sie die Aussprache des folgenden {targetLanguage}-Textes und geben Sie eine detaillierte Ausspracheanleitung zurück:

Text: {text}

Bitte antworten Sie im folgenden JSON-Format:
{
  "pronunciation": {
    "ipa": "IPA-Symbole",
    "native": "Aussprache in der Zielsprache",
    "romaji": "Romanisierung (falls zutreffend)",
    "englishRomaji": "Englische Romanisierung",
    "notes": "Aussprachehinweise und Betonung"
  }
}`,

  grammarAnalysis: `Bitte analysieren Sie die Grammatik des folgenden {targetLanguage}-Textes:

Text: {text}

Bitte antworten Sie im folgenden JSON-Format:
{
  "grammar": {
    "structure": "Grammatische Struktur",
    "tense": "Zeitform",
    "voice": "Aktiv/Passiv",
    "mood": "Modus",
    "particles": "Partikeln und Hilfswörter",
    "notes": "Grammatische Hinweise"
  }
}`,

  usageAnalysis: `Bitte analysieren Sie die Verwendung des folgenden {targetLanguage}-Textes:

Text: {text}

Bitte antworten Sie im folgenden JSON-Format:
{
  "usage": {
    "formality": "Formalitätsgrad (formal/informell/neutral)",
    "context": "Verwendungskontext",
    "frequency": "Häufigkeit der Verwendung",
    "alternatives": ["Alternative Ausdrücke"],
    "notes": "Verwendungshinweise"
  }
}`
} 