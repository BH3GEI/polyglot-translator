export const ptPrompts = {
  basicTranslation: `Por favor, traduza o seguinte texto de {sourceLanguage} para {targetLanguage}. Forneça uma tradução detalhada em formato JSON:

Texto: {text}

Por favor, responda no seguinte formato JSON:
{
  "translations": [
    {
      "text": "Texto traduzido",
      "partOfSpeech": "Classe gramatical (substantivo/verbo/adjetivo/etc.)",
      "meaning": "Significado e contexto",
      "usage": "Notas de uso",
      "examples": [
        {
          "source": "Frase de exemplo no idioma original",
          "target": "Frase de exemplo traduzida",
          "explanation": "Explicação do exemplo"
        }
      ]
    }
  ],
  "synonyms": ["Sinônimo1", "Sinônimo2"],
  "antonyms": ["Antônimo1", "Antônimo2"],
  "etymology": "Etimologia e origem da palavra",
  "culturalNotes": "Notas culturais e contexto"
}`,

  pronunciationAnalysis: `Por favor, analise a pronúncia do seguinte texto em {targetLanguage} e forneça um guia detalhado de pronúncia:

Texto: {text}

Por favor, responda no seguinte formato JSON:
{
  "pronunciation": {
    "ipa": "Símbolos IPA",
    "native": "Pronúncia no idioma de destino",
    "romaji": "Romanização (se aplicável)",
    "englishRomaji": "Romanização em inglês",
    "notes": "Notas de pronúncia e acentuação"
  }
}`,

  grammarAnalysis: `Por favor, analise a gramática do seguinte texto em {targetLanguage}:

Texto: {text}

Por favor, responda no seguinte formato JSON:
{
  "grammar": {
    "structure": "Estrutura gramatical",
    "tense": "Tempo verbal",
    "voice": "Voz ativa/passiva",
    "mood": "Modo",
    "particles": "Partículas e palavras auxiliares",
    "notes": "Notas gramaticais"
  }
}`,

  usageAnalysis: `Por favor, analise o uso do seguinte texto em {targetLanguage}:

Texto: {text}

Por favor, responda no seguinte formato JSON:
{
  "usage": {
    "formality": "Nível de formalidade (formal/informal/neutro)",
    "context": "Contexto de uso",
    "frequency": "Frequência de uso",
    "alternatives": ["Expressões alternativas"],
    "notes": "Notas de uso"
  }
}`
} 