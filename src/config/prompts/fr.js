export const frPrompts = {
  basicTranslation: `Veuillez traduire le texte suivant de {sourceLanguage} en {targetLanguage} et fournir des explications en français :
{text}

Veuillez retourner au format JSON suivant, avec les traductions dans la langue cible et les explications en français :
{
  "translations": [
    {
      "text": "Résultat de la traduction (dans la langue cible)",
      "partOfSpeech": "Partie du discours",
      "meaning": "Explication du sens",
      "usage": "Explication de l'utilisation",
      "examples": [
        {
          "source": "Exemple original",
          "target": "Exemple traduit",
          "explanation": "Explication de l'exemple"
        }
      ],
      "level": "Niveau d'utilisation (ex : débutant/intermédiaire/avancé)",
      "style": "Style de langage (ex : formel/informel/écrit/oral)",
      "domain": "Domaine d'utilisation (ex : quotidien/professionnel/académique/littéraire)"
    }
  ],
  "pronunciation": {
    "ipa": "Symboles phonétiques internationaux",
    "native": "Prononciation standard dans la langue cible",
    "notes": "Notes de prononciation"
  },
  "variants": [
    {
      "text": "Forme variante (conjugaison/temps/mode etc.)",
      "explanation": "Explication de la variante"
    }
  ],
  "synonyms": ["Synonyme 1", "Synonyme 2"],
  "antonyms": ["Antonyme 1", "Antonyme 2"],
  "collocations": [
    {
      "pattern": "Collocation courante",
      "explanation": "Explication de la collocation",
      "example": "Exemple de collocation"
    }
  ],
  "etymology": {
    "origin": "Origine du mot",
    "development": "Évolution du sens",
    "cognates": ["Mots apparentés"]
  },
  "cultural_notes": "Contexte culturel",
  "notes": "Notes importantes supplémentaires"
}`,

  pronunciationAnalysis: `Veuillez analyser la prononciation du texte suivant en {targetLanguage} en français :
{text}

Veuillez retourner au format JSON suivant, avec les exemples de prononciation dans la langue cible et les explications en français :
{
  "pronunciation": {
    "native": "Prononciation originale (dans la langue cible)",
    "segmented": [
      {
        "word": "Mot (dans la langue cible)",
        "reading": "Prononciation/symboles phonétiques",
        "explanation": "Points clés de prononciation",
        "similar_sounds": ["Mots à prononciation similaire (dans la langue cible)"]
      }
    ],
    "intonation": "Explication des caractéristiques d'intonation",
    "notes": "Notes de prononciation"
  }
}`,

  grammarAnalysis: `Veuillez analyser la structure grammaticale de la phrase suivante en {targetLanguage} en français :
{text}

Veuillez retourner au format JSON suivant, avec les exemples dans la langue cible et les explications en français :
{
  "grammar": {
    "structure": "Explication de la structure de la phrase",
    "components": [
      {
        "part": "Composant grammatical (dans la langue cible)",
        "function": "Explication de la fonction grammaticale",
        "explanation": "Explication détaillée",
        "examples": ["Exemples d'usage similaire (dans la langue cible)"]
      }
    ],
    "notes": "Points clés de grammaire"
  }
}`,

  usageAnalysis: `Veuillez analyser l'utilisation du mot/de la phrase suivant(e) en {targetLanguage} en français :
{text}

Veuillez retourner au format JSON suivant, avec les exemples dans la langue cible et les explications en français :
{
  "usage": {
    "register": "Contexte d'utilisation (formel/informel/écrit/oral etc.)",
    "context": "Explication de la situation d'utilisation",
    "examples": [
      {
        "example": "Exemple d'utilisation (dans la langue cible)",
        "explanation": "Explication en français",
        "context": "Explication du contexte approprié"
      }
    ],
    "collocations": ["Collocations courantes (dans la langue cible)"],
    "notes": "Autres notes d'utilisation"
  }
}`
}; 