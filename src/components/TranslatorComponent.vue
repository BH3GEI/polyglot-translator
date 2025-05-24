<template>
  <div class="translator">
    <!-- Input Section -->
    <el-card class="input-card">
      <el-input
        v-model="data.inputText"
        type="textarea"
        :rows="4"
        :placeholder="'Please enter the text to translate'"
        resize="none"
      >
        <template #append>
          <el-button @click="clearInput">
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-input>

      <div class="language-controls">
        <!-- Native Language Selection -->
        <div class="language-selection-row">
          <div class="native-language">
            <label>{{ getInterfaceText('nativeLanguage') }}</label>
            <el-select 
              v-model="data.userNativeLanguage" 
              :placeholder="getInterfaceText('selectNativeLanguage')"
              class="language-select"
              @change="updateUserNativeLanguage"
            >
              <el-option
                v-for="lang in availableLanguages"
                :key="lang.value"
                :label="lang.label"
                :value="lang.value"
              />
            </el-select>
          </div>

          <div class="source-language">
            <label>{{ getInterfaceText('sourceLanguage') }}</label>
            <el-select 
              v-model="data.selectedLanguage" 
              :placeholder="getInterfaceText('selectSourceLanguage')"
              clearable
              class="language-select"
            >
              <el-option
                v-for="lang in availableLanguages"
                :key="lang.value"
                :label="lang.label"
                :value="lang.value"
              />
            </el-select>
          </div>
        </div>

        <!-- Detected Language -->
        <div class="detected-language" v-if="data.detectedLanguage">
          {{ getInterfaceText('detectedLanguage') }}: {{ getLanguageLabel(data.detectedLanguage) }}
          <el-button type="text" @click="useDetectedLanguage">
            {{ getInterfaceText('selectAll') }}
          </el-button>
        </div>

        <!-- Target Language Selection -->
        <div class="target-languages">
          <label>{{ getInterfaceText('targetLanguages') }}</label>
          <el-checkbox-group v-model="data.targetLanguages" class="language-checkbox-group">
            <el-checkbox 
              v-for="lang in availableLanguages" 
              :key="lang.value" 
              :label="lang.value"
              class="language-checkbox"
            >
              {{ lang.label }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <el-button 
        type="primary" 
        @click="translate" 
        :loading="data.translating"
        :disabled="!data.inputText || (!data.selectedLanguage && !data.detectedLanguage) || data.targetLanguages.length === 0"
        class="translate-button"
      >
        Translate
      </el-button>
    </el-card>

    <!-- Translation Progress -->
    <div v-if="data.translating" class="translation-progress">
      <el-progress 
        :percentage="data.translationProgress" 
        :format="progressFormat"
        :stroke-width="15"
        status="success"
      />
    </div>

    <!-- Translation Results -->
    <div v-if="data.showResults" class="results-grid">
      <el-card v-for="result in data.translationResults" :key="result.lang" class="result-card">
        <div class="result-header">
          <h3>{{ getLanguageLabel(result.lang) }}</h3>
          <div class="result-actions">
            <el-button 
              v-if="result.data"
              type="text"
              @click="showRawResponse(result.data)"
            >
              View Analysis
            </el-button>
            <el-tag v-if="result.loading" type="info">
              Translating...
            </el-tag>
            <el-tag v-else-if="result.error" type="danger">{{ result.error }}</el-tag>
          </div>
        </div>

        <template v-if="result.data">
          <!-- Basic Translation -->
          <div v-if="result.data.translations" class="translation-text">
            <div v-for="(translation, index) in result.data.translations" :key="index" class="translation-item">
              <div class="main-translation">
                <h2>{{ translation.text }}</h2>
                <!-- Japanese reading support -->
                <div v-if="result.lang === 'ja'" class="japanese-reading">
                  <div v-if="translation.text.match(/[ぁ-んァ-ン]/)" class="japanese-text">
                    <ruby v-for="(char, idx) in translation.text" :key="idx">
                      {{ char }}
                      <rt v-if="getFuriganaForChar(result.data.pronunciation?.annotations, idx)">
                        {{ getFuriganaForChar(result.data.pronunciation?.annotations, idx) }}
                      </rt>
                    </ruby>
                  </div>
                  <div v-if="result.data.pronunciation?.romaji" class="romaji">
                    {{ result.data.pronunciation.romaji }}
                  </div>
                </div>
              </div>
              <div class="translation-details">
                <div class="part-of-speech"><strong>{{ getInterfaceText('partOfSpeech') }}：</strong>{{ translation.partOfSpeech }}</div>
                <div class="meaning"><strong>{{ getInterfaceText('meaning') }}：</strong>{{ translation.meaning }}</div>
                <div class="usage"><strong>{{ getInterfaceText('usage') }}：</strong>{{ translation.usage }}</div>
                
                <!-- Examples Section -->
                <div v-if="translation.examples && translation.examples.length" class="examples">
                  <strong class="section-title">{{ getInterfaceText('examples') }}：</strong>
                  <div v-for="(example, exIndex) in translation.examples" :key="exIndex" class="example-item">
                    <div class="example-source">
                      <strong>{{ getInterfaceText('original') }}：</strong>
                      <span v-if="result.lang === 'ja'" class="japanese-example">
                        <ruby v-for="(char, idx) in example.source" :key="idx">
                          {{ char }}
                          <rt v-if="getFuriganaForChar(example.annotations, idx)">
                            {{ getFuriganaForChar(example.annotations, idx) }}
                          </rt>
                        </ruby>
                      </span>
                      <span v-else>{{ example.source }}</span>
                    </div>
                    <div class="example-target"><strong>{{ getInterfaceText('translation') }}：</strong>{{ example.target }}</div>
                    <div class="example-explanation"><strong>{{ getInterfaceText('explanation') }}：</strong>{{ example.explanation }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pronunciation Information -->
          <div v-if="result.data.pronunciation" class="pronunciation-info">
            <div class="pronunciation-header">
              <strong class="section-title">{{ getInterfaceText('pronunciationGuide') }}</strong>
            </div>
            <div v-if="result.data.pronunciation.ipa" class="ipa">
              <strong>{{ getInterfaceText('ipaSymbols') }}：</strong>
              <span class="ipa-text">{{ result.data.pronunciation.ipa }}</span>
            </div>
            <div v-if="result.data.pronunciation.native" class="native-pronunciation">
              <strong>{{ getInterfaceText('pronunciation') }}：</strong>
              <span class="pronunciation-text">{{ result.data.pronunciation.native }}</span>
            </div>
            <div v-if="result.data.pronunciation.romaji" class="romaji-pronunciation">
              <strong>{{ getInterfaceText('romajiReading') }}：</strong>
              <span class="romaji-text">{{ result.data.pronunciation.romaji }}</span>
            </div>
            <div v-if="result.data.pronunciation.englishRomaji" class="english-romaji-pronunciation">
              <strong>{{ getInterfaceText('englishRomaji') }}：</strong>
              <span class="english-romaji-text">{{ result.data.pronunciation.englishRomaji }}</span>
            </div>
            <div v-if="result.data.pronunciation.notes" class="pronunciation-notes">
              <strong>{{ getInterfaceText('pronunciationNotes') }}：</strong>
              <span class="notes-text">{{ result.data.pronunciation.notes }}</span>
            </div>
          </div>

          <!-- Synonyms and Antonyms -->
          <div v-if="result.data.synonyms || result.data.antonyms" class="word-relations">
            <div v-if="result.data.synonyms" class="synonyms">
              <strong>{{ getInterfaceText('synonyms') }}：</strong>
              <span class="synonym-list">{{ result.data.synonyms.join('、') }}</span>
            </div>
            <div v-if="result.data.antonyms" class="antonyms">
              <strong>{{ getInterfaceText('antonyms') }}：</strong>
              <span class="antonym-list">{{ result.data.antonyms.join('、') }}</span>
            </div>
          </div>

          <!-- Additional Information -->
          <div v-if="result.data.additional_info" class="additional-info">
            <div v-if="result.data.additional_info.etymology" class="etymology">
              <strong>{{ getInterfaceText('etymology') }}：</strong>
              <span class="etymology-text">{{ result.data.additional_info.etymology }}</span>
            </div>
            <div v-if="result.data.additional_info.register" class="register">
              <strong>{{ getInterfaceText('register') }}：</strong>
              <span class="register-text">{{ result.data.additional_info.register }}</span>
            </div>
            <div v-if="result.data.additional_info.cultural_notes" class="cultural-notes">
              <strong>{{ getInterfaceText('culturalNotes') }}：</strong>
              <span class="cultural-notes-text">{{ result.data.additional_info.cultural_notes }}</span>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="result.data.notes" class="translation-notes">
            <strong>{{ getInterfaceText('notes') }}：</strong>
            <span class="notes-text">{{ result.data.notes }}</span>
          </div>
        </template>
      </el-card>
    </div>

    <!-- AI Response Dialog -->
    <el-dialog
      v-model="data.showRawResponseDialog"
      title="AI Analysis Details"
      width="80%"
      :close-on-click-modal="false"
    >
      <div v-if="data.currentRawResponse" class="raw-response">
        <el-tabs>
          <el-tab-pane v-if="data.currentRawResponse.basic" label="Basic Translation">
            <pre>{{ formatJSON(data.currentRawResponse.basic) }}</pre>
          </el-tab-pane>
          <el-tab-pane v-if="data.currentRawResponse.pronunciation" label="Pronunciation Analysis">
            <pre>{{ formatJSON(data.currentRawResponse.pronunciation) }}</pre>
          </el-tab-pane>
          <el-tab-pane v-if="data.currentRawResponse.grammar" label="Grammar Analysis">
            <pre>{{ formatJSON(data.currentRawResponse.grammar) }}</pre>
          </el-tab-pane>
          <el-tab-pane v-if="data.currentRawResponse.usage" label="Usage Analysis">
            <pre>{{ formatJSON(data.currentRawResponse.usage) }}</pre>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>

    <!-- API Configuration Dialog -->
    <el-dialog
      v-model="data.showApiConfig"
      title="API Configuration"
      width="600px"
      class="modern-dialog"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="API Provider">
          <el-select v-model="data.apiConfig.provider" placeholder="Select API Provider" @change="onProviderChange">
            <el-option label="OpenAI" value="openai" />
            <el-option label="Cerebras" value="cerebras" />
            <el-option label="Google Gemini" value="gemini" />
            <el-option label="OpenRouter" value="openrouter" />
          </el-select>
        </el-form-item>
        <el-form-item label="API Address" v-if="data.apiConfig.provider === 'openai'">
          <el-input v-model="data.apiConfig.apiEndpoint" placeholder="Please enter the API address" />
        </el-form-item>
        <el-form-item label="Model Name">
          <el-select 
            v-if="data.apiConfig.provider === 'openrouter' && data.recommendedModels.length > 0"
            v-model="data.apiConfig.model" 
            :placeholder="getModelPlaceholder()"
            filterable
            allow-create
          >
            <el-option-group label="Recommended Models">
              <el-option
                v-for="model in data.recommendedModels"
                :key="model"
                :label="model"
                :value="model"
              />
            </el-option-group>
          </el-select>
          <el-input 
            v-else
            v-model="data.apiConfig.model" 
            :placeholder="getModelPlaceholder()" 
          />
        </el-form-item>
        <el-form-item label="Site URL" v-if="data.apiConfig.provider === 'openrouter'">
          <el-input v-model="data.apiConfig.siteUrl" placeholder="https://your-site.com (Optional, for OpenRouter ranking)" />
        </el-form-item>
        <el-form-item label="Site Title" v-if="data.apiConfig.provider === 'openrouter'">
          <el-input v-model="data.apiConfig.siteTitle" placeholder="Your Site Name (Optional, for OpenRouter ranking)" />
        </el-form-item>
        <el-form-item label="API Key">
          <el-input v-model="data.apiConfig.apiKey" type="password" placeholder="Please enter the API key (Stored Locally)" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.showApiConfig = false">Cancel</el-button>
          <el-button type="primary" @click="saveApiConfig">Save</el-button>
          <el-button type="info" @click="testConnection" :loading="data.testingApi">Test Connection</el-button>
          <el-button type="success" @click="runApiTest" :loading="data.testingApi">Hello Test</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Settings Button -->
    <el-button
      class="settings-button"
      type="primary"
      circle
      @click="data.showApiConfig = true"
    >
      <el-icon><Setting /></el-icon>
    </el-button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { Delete, Setting } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import ApiService from '@/services/apiService'
import { languageConfig } from '../config/prompts'

const data = reactive({
  // 输入相关
  inputText: '',
  selectedLanguage: '',
  targetLanguages: [],
  detectedLanguage: null,
  userNativeLanguage: localStorage.getItem('userNativeLanguage') || 'en',

  // 翻译状态
  translating: false,
  showResults: false,
  translationResults: {},

  // API 配置
  apiConfig: {
    apiEndpoint: '',
    apiKey: '',
    model: '',
    provider: 'openai',
    siteUrl: '',
    siteTitle: ''
  },
  apiService: null,
  testingApi: false,
  recommendedModels: [],

  // 对话框状态
  showApiConfig: false,
  showRawResponseDialog: false,
  currentRawResponse: null
})

const availableLanguages = [
  { value: 'zh', label: '中文 (Chinese)' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語 (Japanese)' },
  { value: 'ko', label: '한국어 (Korean)' },
  { value: 'ru', label: 'Русский (Russian)' },
  { value: 'fr', label: 'Français (French)' },
  { value: 'de', label: 'Deutsch (German)' },
  { value: 'es', label: 'Español (Spanish)' },
  { value: 'it', label: 'Italiano (Italian)' },
  { value: 'pt', label: 'Português (Portuguese)' },
  { value: 'ar', label: 'العربية (Arabic)' },
  { value: 'hi', label: 'हिन्दी (Hindi)' }
]

const getLanguageLabel = (lang) => {
  const labels = {
    zh: '中文 (Chinese)',
    en: 'English',
    ja: '日本語 (Japanese)',
    ko: '한국어 (Korean)',
    ru: 'Русский (Russian)',
    fr: 'Français (French)',
    de: 'Deutsch (German)',
    es: 'Español (Spanish)',
    it: 'Italiano (Italian)',
    pt: 'Português (Portuguese)',
    ar: 'العربية (Arabic)',
    hi: 'हिन्दी (Hindi)'
  }
  return labels[lang] || lang
}

const showRawResponse = (rawResponses) => {
  data.currentRawResponse = rawResponses
  data.showRawResponseDialog = true
}

const formatJSON = (json) => {
  try {
    if (typeof json === 'string') {
      return JSON.stringify(JSON.parse(json), null, 2)
    }
    return JSON.stringify(json, null, 2)
  } catch {
    return json
  }
}

const progressFormat = (percentage) => {
  if (percentage === 100) return 'Completed'
  return `Translating... ${percentage}%`
}

// 从localStorage载API配置
onMounted(() => {
  const savedNativeLanguage = localStorage.getItem('userNativeLanguage')
  if (savedNativeLanguage) {
    data.userNativeLanguage = savedNativeLanguage
  } else {
    data.userNativeLanguage = 'en'
    localStorage.setItem('userNativeLanguage', 'en')
  }

  const savedConfig = localStorage.getItem('translatorApiConfig')
  if (savedConfig) {
    try {
      data.apiConfig = JSON.parse(savedConfig)
      data.apiService = new ApiService(data.apiConfig)
    } catch (error) {
      console.error('Failed to load API config:', error)
    }
  }
})

const saveApiConfig = () => {
  try {
    // 验证必要的配置
    if (!data.apiConfig.provider) {
      ElMessage.error('Please select an API provider')
      return
    }
    
    if (!data.apiConfig.apiKey) {
      ElMessage.error('Please enter the API key')
      return
    }
    
    if (!data.apiConfig.model) {
      ElMessage.error('Please enter the model name')
      return
    }
    
    // 保存配置到 localStorage
    localStorage.setItem('translatorApiConfig', JSON.stringify(data.apiConfig))
    console.log('Saved configuration:', data.apiConfig)
    
    // 创建新的 ApiService 实例
    data.apiService = new ApiService(data.apiConfig)
    console.log('Created ApiService provider:', data.apiService.config.provider)
    
    // 关闭对话框
    data.showApiConfig = false
    ElMessage.success('Configuration saved')
  } catch (error) {
    console.error('Failed to save configuration:', error)
    ElMessage.error('Failed to save configuration: ' + error.message)
  }
}

// API测试功能
async function runApiTest() {
  if (!data.apiService) {
    ElMessage.error('Please configure the API first')
    return
  }
  
  data.testingApi = true
  try {
    const result = await data.apiService.apitest()
    ElMessage.success('API test succeeded!')
    ElMessage({
      message: result,
      type: 'success',
      duration: 5000
    })
  } catch (error) {
    ElMessage.error('API test failed: ' + error.message)
  } finally {
    data.testingApi = false
  }
}

// 连接测试
async function testConnection() {
  if (!data.apiService) {
    ElMessage.error('Please configure the API first')
    return
  }

  console.log('Testing connection provider:', data.apiService.config.provider)
  console.log('Testing connection configuration:', data.apiService.config)

  data.testingApi = true
  try {
    const result = await data.apiService.testConnection()
    if (result) {
      ElMessage.success('Connection test succeeded!')
    } else {
      ElMessage.warning('Connection test did not return expected results')
    }
  } catch (error) {
    console.error('Connection test failed:', error)
    ElMessage.error('Connection test failed: ' + error.message)
  } finally {
    data.testingApi = false
  }
}

const clearInput = () => {
  data.inputText = ''
  data.showResults = false
  data.translationResults = {}
  data.detectedLanguage = null
}

const useDetectedLanguage = () => {
  if (data.detectedLanguage) {
    data.selectedLanguage = data.detectedLanguage
    // 自动选择除源语言之外的所有目标语言
    data.targetLanguages = availableLanguages
      .map(lang => lang.value)
      .filter(lang => lang !== data.detectedLanguage)
  }
}

const translate = async () => {
  if (!data.inputText) {
    ElMessage.warning('Please enter text to translate')
    return
  }

  if (!data.apiService) {
    ElMessage.warning('Please configure the API first')
    data.showApiConfig = true
    return
  }

  data.translating = true
  data.showResults = true
  
  try {
    // 如果没有选择源语言，先进行语言检测
    const sourceLanguage = data.selectedLanguage || await data.apiService.detectLanguage(data.inputText)
    
    // 使用选中的目标语言
    if (data.targetLanguages.length === 0) {
      ElMessage.warning('Please select target languages')
      return
    }

    data.translationResults = await data.apiService.translateText(
      data.inputText,
      sourceLanguage,
      data.targetLanguages,
      data.userNativeLanguage
    )
  } catch (error) {
    console.error('Translation failed:', error)
    ElMessage.error(error.message || 'Translation failed')
  } finally {
    data.translating = false
  }
}

const getFuriganaForChar = (annotations, index) => {
  if (!annotations) return null
  return annotations.find(a => 
    index >= a.position[0] && index < a.position[1]
  )?.reading || null
}

// 更新用户母语设置
const updateUserNativeLanguage = (lang) => {
  data.userNativeLanguage = lang
  localStorage.setItem('userNativeLanguage', lang)
}

// 界面文本配置
const interfaceText = {
  en: {
    nativeLanguage: 'Native Language',
    sourceLanguage: 'Source Language',
    targetLanguages: 'Target Languages',
    selectNativeLanguage: 'Select your native language',
    selectSourceLanguage: 'Select source language',
    detectedLanguage: 'Detected Language',
    selectAll: 'Select All',
    translate: 'Translate',
    translating: 'Translating...',
    completed: 'Completed',
    partOfSpeech: 'Part of Speech',
    meaning: 'Meaning',
    usage: 'Usage',
    examples: 'Examples',
    original: 'Original',
    translation: 'Translation',
    explanation: 'Explanation',
    pronunciationGuide: 'Pronunciation Guide',
    ipaSymbols: 'IPA Symbols',
    pronunciation: 'Pronunciation',
    romajiReading: 'Romaji Reading',
    pronunciationNotes: 'Pronunciation Notes',
    synonyms: 'Synonyms',
    antonyms: 'Antonyms',
    etymology: 'Etymology',
    register: 'Register',
    culturalNotes: 'Cultural Notes',
    notes: 'Notes',
    viewAiAnalysis: 'View AI Analysis',
    aiAnalysisDetails: 'AI Analysis Details',
    basicTranslation: 'Basic Translation',
    pronunciationAnalysis: 'Pronunciation Analysis',
    grammarAnalysis: 'Grammar Analysis',
    usageAnalysis: 'Usage Analysis',
    englishRomaji: 'English Romaji',
  },
  zh: {
    nativeLanguage: '您的母语',
    sourceLanguage: '源语言',
    targetLanguages: '目标语言',
    selectNativeLanguage: '选择您的母语',
    selectSourceLanguage: '选择源语言',
    detectedLanguage: '检测到语言',
    selectAll: '全部勾选',
    translate: '翻译',
    translating: '翻译中...',
    completed: '完成',
    partOfSpeech: '词性',
    meaning: '释义',
    usage: '用法',
    examples: '例句',
    original: '原文',
    translation: '译文',
    explanation: '说明',
    pronunciationGuide: '发音指南',
    ipaSymbols: 'IPA音标',
    pronunciation: '发音',
    romajiReading: '罗马音',
    pronunciationNotes: '发音要点',
    synonyms: '同义词',
    antonyms: '反义词',
    etymology: '词源',
    register: '使用场合',
    culturalNotes: '文化背景',
    notes: '注释',
    viewAiAnalysis: '查看AI分析',
    aiAnalysisDetails: 'AI分析详情',
    basicTranslation: '基本翻译',
    pronunciationAnalysis: '发音分析',
    grammarAnalysis: '语法分析',
    usageAnalysis: '用法分析',
    englishRomaji: '英式罗马音',
  },
  ja: {
    nativeLanguage: '母語',
    sourceLanguage: '原語',
    targetLanguages: '対象言語',
    selectNativeLanguage: '母語を選択',
    selectSourceLanguage: '原語を選択',
    detectedLanguage: '検出された言語',
    selectAll: '全て選択',
    translate: '翻訳',
    translating: '翻訳中...',
    completed: '完了',
    partOfSpeech: '品詞',
    meaning: '意味',
    usage: '用法',
    examples: '例文',
    original: '原文',
    translation: '訳文',
    explanation: '説明',
    pronunciationGuide: '発音ガイド',
    ipaSymbols: 'IPA発音記号',
    pronunciation: '発音',
    romajiReading: 'ローマ字',
    pronunciationNotes: '発音のポイント',
    synonyms: '同義語',
    antonyms: '対義語',
    etymology: '語源',
    register: '使用場面',
    culturalNotes: '文化的背景',
    notes: '注釈',
    viewAiAnalysis: 'AI分析を見る',
    aiAnalysisDetails: 'AI分析の詳細',
    basicTranslation: '基本翻訳',
    pronunciationAnalysis: '発音分析',
    grammarAnalysis: '文法分析',
    usageAnalysis: '用法分析',
    englishRomaji: '英式ローマ字',
  }
}

// 获取界面文本
const getInterfaceText = (key) => {
  const lang = data.userNativeLanguage || 'en'
  return interfaceText[lang]?.[key] || interfaceText.en[key]
}

const getModelPlaceholder = () => {
  const provider = data.apiConfig.provider
  switch (provider) {
    case 'cerebras':
      return 'e.g., qwen-3-32b, llama-4-scout-17b-16e-instruct'
    case 'gemini':
      return 'e.g., gemini-2.0-flash, gemini-pro, gemini-pro-vision'
    case 'openrouter':
      return 'e.g., qwen/qwen3-32b:free, openai/gpt-4o, anthropic/claude-3-sonnet'
    case 'openai':
    default:
      return 'e.g., gpt-3.5-turbo, gpt-4'
  }
}

const onProviderChange = async () => {
  const provider = data.apiConfig.provider
  switch (provider) {
    case 'cerebras':
      data.apiConfig.apiEndpoint = ''
      data.apiConfig.model = 'qwen-3-32b'
      data.apiConfig.siteUrl = ''
      data.apiConfig.siteTitle = ''
      data.recommendedModels = []
      break
    case 'gemini':
      data.apiConfig.apiEndpoint = ''
      data.apiConfig.model = 'gemini-2.0-flash'
      data.apiConfig.siteUrl = ''
      data.apiConfig.siteTitle = ''
      data.recommendedModels = []
      break
    case 'openrouter':
      data.apiConfig.apiEndpoint = ''
      data.apiConfig.model = 'qwen/qwen3-32b:free'
      data.apiConfig.siteUrl = ''
      data.apiConfig.siteTitle = 'Multilingual Translator'
      // 加载推荐模型
      data.recommendedModels = [
        'qwen/qwen3-32b:free',
        'openai/gpt-4o',
        'openai/gpt-4-turbo',
        'openai/gpt-3.5-turbo',
        'anthropic/claude-3-sonnet',
        'anthropic/claude-3-haiku',
        'google/gemini-pro',
        'meta-llama/llama-3-70b-instruct'
      ]
      break
    case 'openai':
    default:
      data.apiConfig.apiEndpoint = 'https://api.openai.com/v1/chat/completions'
      data.apiConfig.model = 'gpt-3.5-turbo'
      data.apiConfig.siteUrl = ''
      data.apiConfig.siteTitle = ''
      data.recommendedModels = []
      break
  }
  
  // 立即更新 ApiService 实例以反映提供商的变化
  if (data.apiConfig.apiKey) {
    try {
      data.apiService = new ApiService(data.apiConfig)
    } catch (error) {
      console.warn('切换提供商时更新 ApiService 失败:', error)
    }
  }
}
</script>

<style scoped>
.translator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.input-card {
  margin-bottom: 20px;
}

.language-controls {
  margin: 20px 0;
}

.language-selection-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.native-language,
.source-language {
  display: flex;
  align-items: center;
  gap: 10px;
}

.language-select {
  width: 200px;
}

.target-languages {
  margin-top: 20px;
}

.language-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 10px;
}

.language-checkbox {
  margin-right: 0 !important;
}

.detected-language {
  margin: 10px 0;
  color: #666;
  display: flex;
  align-items: center;
  gap: 10px;
}

.translate-button {
  width: 100%;
  margin-top: 20px;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.result-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.result-header h3 {
  margin: 0;
}

.translation-text {
  font-size: 1.1em;
  line-height: 1.6;
  margin-bottom: 15px;
}

.pronunciation-info {
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.word-segments {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
}

.word-segment {
  background-color: white;
  padding: 0.5rem;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.segment-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.word {
  font-size: 1.1em;
  font-weight: bold;
}

.reading, .pinyin, .romaji {
  color: #666;
  font-size: 0.9em;
}

.pitch-accent, .tone, .guide {
  color: #888;
  font-size: 0.8em;
  font-style: italic;
}

.pronunciation-text, .intonation-text, .notes-text {
  color: #444;
  line-height: 1.5;
}

.native-pronunciation, .romanized-pronunciation, .intonation, .pronunciation-notes {
  margin-bottom: 0.5rem;
}

.grammar-analysis,
.usage-info {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.usage-examples ul {
  margin: 5px 0;
  padding-left: 20px;
}

.modern-dialog :deep(.el-dialog) {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modern-dialog :deep(.el-dialog__header) {
  margin: 0;
  padding: 20px;
  background: #f8f9fa;
}

.modern-dialog :deep(.el-dialog__body) {
  padding: 30px 20px;
}

.modern-dialog :deep(.el-dialog__footer) {
  padding: 20px;
  border-top: 1px solid #eee;
}

.settings-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  width: 50px;
  height: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s;
}

.settings-button:hover {
  transform: translateY(-2px);
}

.dialog-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

:deep(.el-input),
:deep(.el-select),
:deep(.el-button) {
  border-radius: 8px;
}

:deep(.el-card) {
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

:deep(.el-card:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.translation-progress {
  margin: 20px 0;
}

.translation-analysis,
.pronunciation-info,
.grammar-analysis,
.usage-info {
  margin-top: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.alternatives-list,
.grammar-patterns {
  margin: 5px 0;
  padding-left: 20px;
}

.word-segment {
  display: inline-flex;
  align-items: center;
  margin-right: 15px;
  margin-bottom: 8px;
  padding: 4px 8px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.word {
  font-weight: bold;
  margin-right: 6px;
}

.reading {
  color: #666;
  font-size: 0.9em;
  margin-right: 6px;
}

.tone {
  color: #409EFF;
  font-size: 0.85em;
}

.grammar-component {
  margin-bottom: 8px;
}

.component-function {
  color: #666;
  font-size: 0.9em;
  margin-left: 20px;
}

.collocation-item,
.example-item {
  margin-bottom: 10px;
  padding: 8px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pattern {
  font-weight: bold;
  color: #409EFF;
}

.example-text {
  font-weight: bold;
}

.example-context,
.example-explanation {
  color: #666;
  font-size: 0.9em;
  margin-top: 4px;
}

h4 {
  margin: 0 0 10px;
  color: #2c3e50;
}

:deep(.el-descriptions) {
  margin-bottom: 10px;
}

:deep(.el-descriptions__label) {
  width: 100px;
  color: #606266;
}

.annotated-text {
  font-size: 1.2em;
  line-height: 2.5;
  margin: 1rem 0;
}

ruby {
  ruby-align: center;
}

rt {
  font-size: 0.6em;
  color: #666;
  font-weight: normal;
  text-align: center;
}

.detailed-explanation {
  margin-top: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.detailed-explanation h5 {
  margin: 1.5rem 0 1rem;
  color: #2c3e50;
  font-size: 1.1em;
}

.word-choice-card {
  margin-bottom: 1rem;
}

.word-header {
  font-size: 1.1em;
  margin-bottom: 0.5rem;
}

.word-explanation {
  color: #666;
  margin-bottom: 0.5rem;
}

.word-alternatives {
  margin: 0.5rem 0;
}

.alternatives-label {
  color: #666;
  margin-bottom: 0.3rem;
}

.alternative-tag {
  margin-right: 0.5rem;
  margin-bottom: 0.3rem;
}

.word-nuance {
  margin-top: 0.5rem;
  font-size: 0.9em;
  color: #666;
}

.nuance-label {
  color: #409EFF;
  margin-bottom: 0.2rem;
}

.point-explanation {
  color: #666;
  margin-bottom: 0.5rem;
}

.point-examples {
  margin-top: 0.5rem;
}

.examples-label {
  color: #409EFF;
  margin-bottom: 0.3rem;
}

.point-examples ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #666;
}

.point-examples li {
  margin-bottom: 0.3rem;
}

:deep(.el-collapse-item__header) {
  font-size: 1em;
  color: #409EFF;
}

:deep(.el-collapse-item__content) {
  padding: 1rem;
  background: #fff;
  border-radius: 4px;
}

.translation-item {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.main-translation {
  margin-bottom: 1rem;
}

.main-translation h2 {
  margin: 0;
  font-size: 1.5em;
  color: #2c3e50;
}

.japanese-reading {
  margin-top: 0.5rem;
  font-size: 1.1em;
  line-height: 1.8;
}

.japanese-text {
  margin-bottom: 0.5rem;
}

.romaji {
  color: #666;
  font-size: 0.9em;
  margin-top: 0.3rem;
}

ruby {
  ruby-align: center;
  margin: 0 1px;
}

rt {
  font-size: 0.7em;
  color: #666;
  line-height: 1.2;
}

.japanese-example {
  display: inline-block;
  line-height: 2;
}

.romaji-pronunciation {
  margin-top: 0.5rem;
}

.romaji-text {
  font-family: 'Noto Sans', sans-serif;
  color: #2c3e50;
}

/* 调整AI分析对话框的样式 */
.el-dialog :deep(.el-dialog__body) {
  max-height: 80vh;
  overflow-y: auto;
}

.el-tabs :deep(.el-tab-pane) {
  padding: 1rem;
  background-color: #fff;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.raw-response pre {
  margin: 0;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 0.9em;
  line-height: 1.5;
  overflow-x: auto;
}

.english-romaji-pronunciation {
  margin-top: 0.5rem;
}

.english-romaji-text {
  font-family: 'Noto Sans', sans-serif;
  color: #2c3e50;
  font-style: italic;
}
</style>