import { zhPrompts } from './prompts/zh';
import { jaPrompts } from './prompts/ja';
import { enPrompts } from './prompts/en';
import { koPrompts } from './prompts/ko';
import { ruPrompts } from './prompts/ru';
import { frPrompts } from './prompts/fr';
import { dePrompts } from './prompts/de';
import { esPrompts } from './prompts/es';
import { itPrompts } from './prompts/it';
import { ptPrompts } from './prompts/pt';
import { arPrompts } from './prompts/ar';
import { hiPrompts } from './prompts/hi';

// 语言配置
export const languageConfig = {
  zh: {
    nativeName: '中文',
    prompts: zhPrompts
  },
  ja: {
    nativeName: '日本語',
    prompts: jaPrompts
  },
  en: {
    nativeName: 'English',
    prompts: enPrompts
  },
  ko: {
    nativeName: '한국어',
    prompts: koPrompts
  },
  ru: {
    nativeName: 'Русский',
    prompts: ruPrompts
  },
  fr: {
    nativeName: 'Français',
    prompts: frPrompts
  },
  de: {
    nativeName: 'Deutsch',
    prompts: dePrompts
  },
  es: {
    nativeName: 'Español',
    prompts: esPrompts
  },
  it: {
    nativeName: 'Italiano',
    prompts: itPrompts
  },
  pt: {
    nativeName: 'Português',
    prompts: ptPrompts
  },
  ar: {
    nativeName: 'العربية',
    prompts: arPrompts
  },
  hi: {
    nativeName: 'हिन्दी',
    prompts: hiPrompts
  }
};

// 获取用户界面语言的prompts
export function getPromptsForLanguage(language) {
  return languageConfig[language]?.prompts;
}

// 获取翻译提示
export function getTranslationPrompt(text, sourceLanguage, targetLanguage, userNativeLanguage = 'zh') {
  const prompts = {
    zh: zhPrompts,
    ja: jaPrompts,
    en: enPrompts,
    ko: koPrompts,
    ru: ruPrompts,
    fr: frPrompts,
    de: dePrompts,
    es: esPrompts,
    it: itPrompts,
    pt: ptPrompts,
    ar: arPrompts,
    hi: hiPrompts
  }

  const prompt = prompts[userNativeLanguage]?.basicTranslation || prompts.zh.basicTranslation
  return prompt
    .replace('{sourceLanguage}', sourceLanguage)
    .replace('{targetLanguage}', targetLanguage)
    .replace('{text}', text)
}

// 获取发音分析提示
export function getPronunciationAnalysisPrompt(text, targetLanguage, userNativeLanguage = 'zh') {
  const prompts = {
    zh: zhPrompts,
    ja: jaPrompts,
    en: enPrompts,
    ko: koPrompts,
    ru: ruPrompts,
    fr: frPrompts,
    de: dePrompts,
    es: esPrompts,
    it: itPrompts,
    pt: ptPrompts,
    ar: arPrompts,
    hi: hiPrompts
  }

  const prompt = prompts[userNativeLanguage]?.pronunciationAnalysis || prompts.zh.pronunciationAnalysis
  return prompt
    .replace('{targetLanguage}', targetLanguage)
    .replace('{text}', text)
}

// 获取语法分析提示
export function getGrammarAnalysisPrompt(text, targetLanguage, userNativeLanguage = 'zh') {
  const prompts = {
    zh: zhPrompts,
    ja: jaPrompts,
    en: enPrompts,
    ko: koPrompts,
    ru: ruPrompts,
    fr: frPrompts,
    de: dePrompts,
    es: esPrompts,
    it: itPrompts,
    pt: ptPrompts,
    ar: arPrompts,
    hi: hiPrompts
  }

  const prompt = prompts[userNativeLanguage]?.grammarAnalysis || prompts.zh.grammarAnalysis
  return prompt
    .replace('{targetLanguage}', targetLanguage)
    .replace('{text}', text)
}

// 获取用法分析提示
export function getUsageAnalysisPrompt(text, targetLanguage, userNativeLanguage = 'zh') {
  const prompts = {
    zh: zhPrompts,
    ja: jaPrompts,
    en: enPrompts,
    ko: koPrompts,
    ru: ruPrompts,
    fr: frPrompts,
    de: dePrompts,
    es: esPrompts,
    it: itPrompts,
    pt: ptPrompts,
    ar: arPrompts,
    hi: hiPrompts
  }

  const prompt = prompts[userNativeLanguage]?.usageAnalysis || prompts.zh.usageAnalysis
  return prompt
    .replace('{targetLanguage}', targetLanguage)
    .replace('{text}', text)
} 