export const arPrompts = {
  basicTranslation: `يرجى ترجمة النص التالي من {sourceLanguage} إلى {targetLanguage}. قدم ترجمة مفصلة بتنسيق JSON:

النص: {text}

يرجى الرد بالتنسيق التالي JSON:
{
  "translations": [
    {
      "text": "النص المترجم",
      "partOfSpeech": "نوع الكلمة (اسم/فعل/صفة/إلخ)",
      "meaning": "المعنى والسياق",
      "usage": "ملاحظات الاستخدام",
      "examples": [
        {
          "source": "جملة مثال باللغة الأصلية",
          "target": "جملة مثال مترجمة",
          "explanation": "شرح المثال"
        }
      ]
    }
  ],
  "synonyms": ["مرادف1", "مرادف2"],
  "antonyms": ["ضد1", "ضد2"],
  "etymology": "أصل الكلمة وتاريخها",
  "culturalNotes": "ملاحظات ثقافية وسياق"
}`,

  pronunciationAnalysis: `يرجى تحليل نطق النص التالي بـ{targetLanguage} وتقديم دليل نطق مفصل:

النص: {text}

يرجى الرد بالتنسيق التالي JSON:
{
  "pronunciation": {
    "ipa": "رموز IPA",
    "native": "النطق باللغة المستهدفة",
    "romaji": "الكتابة بالأحرف اللاتينية (إن أمكن)",
    "englishRomaji": "الكتابة بالأحرف اللاتينية الإنجليزية",
    "notes": "ملاحظات النطق والتشديد"
  }
}`,

  grammarAnalysis: `يرجى تحليل قواعد النحو للنص التالي بـ{targetLanguage}:

النص: {text}

يرجى الرد بالتنسيق التالي JSON:
{
  "grammar": {
    "structure": "البنية النحوية",
    "tense": "الزمن",
    "voice": "المبني للمعلوم/المجهول",
    "mood": "الحالة",
    "particles": "الجسيمات والكلمات المساعدة",
    "notes": "ملاحظات نحوية"
  }
}`,

  usageAnalysis: `يرجى تحليل استخدام النص التالي بـ{targetLanguage}:

النص: {text}

يرجى الرد بالتنسيق التالي JSON:
{
  "usage": {
    "formality": "مستوى الرسمية (رسمي/غير رسمي/محايد)",
    "context": "سياق الاستخدام",
    "frequency": "تكرار الاستخدام",
    "alternatives": ["تعبيرات بديلة"],
    "notes": "ملاحظات الاستخدام"
  }
}`
} 