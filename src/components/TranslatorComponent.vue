<template>
  <div class="translator">
    <!-- 输入部分 -->
    <el-card class="input-card">
      <el-input
        v-model="inputText"
        type="textarea"
        :rows="4"
        :placeholder="'请输入要翻译的文本'"
        resize="none"
      >
        <template #append>
          <el-button @click="clearInput">
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-input>

      <div class="language-controls">
        <div class="detected-language" v-if="detectedLanguage">
          检测到语言: {{ getLanguageLabel(detectedLanguage) }}
          <el-button type="text" @click="useDetectedLanguage">
            全部勾选
          </el-button>
        </div>
        <el-select 
          v-model="selectedLanguage" 
          placeholder="选择源语言"
          clearable
        >
          <el-option
            v-for="lang in availableLanguages"
            :key="lang.value"
            :label="lang.label"
            :value="lang.value"
          />
        </el-select>

        <div class="target-languages">
          <el-checkbox-group v-model="targetLanguages">
            <el-checkbox v-for="lang in availableLanguages" 
                        :key="lang.value" 
                        :label="lang.value"
                        :disabled="lang.value === selectedLanguage"
            >
              {{ lang.label }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <el-button 
        type="primary" 
        @click="translate" 
        :loading="translating"
        :disabled="!inputText || (!selectedLanguage && !detectedLanguage) || targetLanguages.length === 0"
        class="translate-button"
      >
        翻译
      </el-button>
    </el-card>

    <!-- 翻译进度 -->
    <div v-if="translating" class="translation-progress">
      <el-progress 
        :percentage="translationProgress" 
        :format="progressFormat"
        :stroke-width="15"
        status="success"
      />
    </div>

    <!-- 翻译结果 -->
    <div v-if="showResults" class="results-grid">
      <el-card v-for="result in translationResults" :key="result.lang" class="result-card">
        <div class="result-header">
          <h3>{{ getLanguageLabel(result.lang) }}</h3>
          <div class="result-actions">
            <el-button 
              v-if="result.data?.rawResponses"
              type="text"
              @click="showRawResponse(result.data.rawResponses)"
            >
              查看AI分析
            </el-button>
            <el-tag v-if="result.loading" type="info">翻译中...</el-tag>
            <el-tag v-else-if="result.error" type="danger">{{ result.error }}</el-tag>
          </div>
        </div>

        <template v-if="result.data">
          <!-- 基本翻译 -->
          <div class="translation-text">{{ result.data.text }}</div>

          <!-- 翻译分析 -->
          <div v-if="result.data.analysis" class="translation-analysis">
            <h4>翻译分析</h4>
            <el-descriptions :column="1" border>
              <el-descriptions-item v-if="result.data.analysis.meaning" label="词义/句意">
                {{ result.data.analysis.meaning }}
              </el-descriptions-item>
              <el-descriptions-item v-if="result.data.analysis.context" label="使用场景">
                {{ result.data.analysis.context }}
              </el-descriptions-item>
              <el-descriptions-item v-if="result.data.analysis.alternatives?.length" label="其他可能的翻译">
                <ul class="alternatives-list">
                  <li v-for="(alt, index) in result.data.analysis.alternatives" 
                      :key="index">{{ alt }}</li>
                </ul>
              </el-descriptions-item>
              <el-descriptions-item v-if="result.data.analysis.notes" label="翻译说明">
                {{ result.data.analysis.notes }}
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 发音信息 -->
          <div v-if="result.data.pronunciation" class="pronunciation-info">
            <h4>发音信息</h4>
            <div v-if="result.data.pronunciation.native" class="native-pronunciation">
              <strong>原文读音：</strong>{{ result.data.pronunciation.native }}
            </div>
            <div v-if="result.data.pronunciation.romanized" class="romanized-pronunciation">
              <strong>罗马字/拼音：</strong>{{ result.data.pronunciation.romanized }}
            </div>
            <div v-if="result.data.pronunciation.ipa" class="ipa-pronunciation">
              <strong>国际音标：</strong>{{ result.data.pronunciation.ipa }}
            </div>
            <div v-if="result.data.pronunciation.intonation" class="intonation">
              <strong>语调说明：</strong>{{ result.data.pronunciation.intonation }}
            </div>
            <div v-if="result.data.pronunciation.stress || result.data.pronunciation.stress_pattern" class="stress">
              <strong>重音位置：</strong>{{ result.data.pronunciation.stress || result.data.pronunciation.stress_pattern }}
            </div>
            <div v-if="result.data.pronunciation.segmented" class="segmented-pronunciation">
              <strong>分词发音：</strong>
              <div v-for="(segment, index) in result.data.pronunciation.segmented" 
                   :key="index" 
                   class="word-segment"
              >
                <div class="word">{{ segment.word }}</div>
                <div class="reading">{{ segment.reading || segment.pinyin }}</div>
                <div v-if="segment.tone || segment.pitch_accent" class="tone">
                  {{ segment.tone || segment.pitch_accent }}
                </div>
              </div>
            </div>
            <div v-if="result.data.pronunciation.notes" class="pronunciation-notes">
              <strong>发音要点：</strong>{{ result.data.pronunciation.notes }}
            </div>
          </div>

          <!-- 语法分析 -->
          <div v-if="result.data.grammar" class="grammar-analysis">
            <h4>语法分析</h4>
            <el-descriptions :column="1" border>
              <el-descriptions-item v-if="result.data.grammar.structure" label="句子结构">
                {{ result.data.grammar.structure }}
              </el-descriptions-item>
              <el-descriptions-item v-if="result.data.grammar.tense" label="时态">
                {{ result.data.grammar.tense }}
              </el-descriptions-item>
              <el-descriptions-item v-if="result.data.grammar.mood" label="语气">
                {{ result.data.grammar.mood }}
              </el-descriptions-item>
              <el-descriptions-item v-if="result.data.grammar.components?.length" label="句子成分">
                <div v-for="(comp, index) in result.data.grammar.components" 
                     :key="index" 
                     class="grammar-component">
                  <strong>{{ comp.type }}：</strong>
                  {{ comp.content }}
                  <div class="component-function">{{ comp.function }}</div>
                </div>
              </el-descriptions-item>
              <el-descriptions-item v-if="result.data.grammar.patterns?.length" label="语法模式">
                <ul class="grammar-patterns">
                  <li v-for="(pattern, index) in result.data.grammar.patterns" 
                      :key="index">{{ pattern }}</li>
                </ul>
              </el-descriptions-item>
              <el-descriptions-item v-if="result.data.grammar.notes" label="其他说明">
                {{ result.data.grammar.notes }}
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 用法说明 -->
          <div v-if="result.data.usage" class="usage-info">
            <h4>用法说明</h4>
            <el-descriptions :column="1" border>
              <el-descriptions-item v-if="result.data.usage.register" label="使用场合">
                {{ result.data.usage.register }}
              </el-descriptions-item>
              <el-descriptions-item v-if="result.data.usage.style" label="语体风格">
                {{ result.data.usage.style }}
              </el-descriptions-item>
              <el-descriptions-item v-if="result.data.usage.context" label="使用场景">
                {{ result.data.usage.context }}
              </el-descriptions-item>
              <el-descriptions-item v-if="result.data.usage.collocations?.length" label="常见搭配">
                <div v-for="(colloc, index) in result.data.usage.collocations" 
                     :key="index" 
                     class="collocation-item">
                  <div class="pattern">{{ colloc.pattern }}</div>
                  <div class="example">示例：{{ colloc.example }}</div>
                </div>
              </el-descriptions-item>
              <el-descriptions-item v-if="result.data.usage.examples?.length" label="使用示例">
                <div v-for="(example, index) in result.data.usage.examples" 
                     :key="index" 
                     class="example-item">
                  <div class="example-text">{{ example.text }}</div>
                  <div class="example-context">场景：{{ example.context }}</div>
                  <div class="example-explanation">说明：{{ example.explanation }}</div>
                </div>
              </el-descriptions-item>
              <el-descriptions-item v-if="result.data.usage.cultural_notes" label="文化背景">
                {{ result.data.usage.cultural_notes }}
              </el-descriptions-item>
              <el-descriptions-item v-if="result.data.usage.notes" label="其他说明">
                {{ result.data.usage.notes }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </template>
      </el-card>
    </div>

    <!-- AI响应对话框 -->
    <el-dialog
      v-model="showRawResponseDialog"
      title="AI分析详情"
      width="80%"
      :close-on-click-modal="false"
    >
      <div v-if="currentRawResponse" class="raw-response">
        <el-tabs>
          <el-tab-pane v-if="currentRawResponse.basic" label="基本翻译">
            <pre>{{ formatJSON(currentRawResponse.basic) }}</pre>
          </el-tab-pane>
          <el-tab-pane v-if="currentRawResponse.pronunciation" label="发音分析">
            <pre>{{ formatJSON(currentRawResponse.pronunciation) }}</pre>
          </el-tab-pane>
          <el-tab-pane v-if="currentRawResponse.grammar" label="语法分析">
            <pre>{{ formatJSON(currentRawResponse.grammar) }}</pre>
          </el-tab-pane>
          <el-tab-pane v-if="currentRawResponse.usage" label="用法分析">
            <pre>{{ formatJSON(currentRawResponse.usage) }}</pre>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>

    <!-- API配置对话框 -->
    <el-dialog
      v-model="showApiConfig"
      title="API配置"
      width="500px"
      class="modern-dialog"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="API地址">
          <el-input v-model="apiConfig.apiEndpoint" placeholder="请输入API地址" />
        </el-form-item>
        <el-form-item label="模型名称">
          <el-input v-model="apiConfig.model" placeholder="请输入模型名称" />
        </el-form-item>
        <el-form-item label="API密钥">
          <el-input v-model="apiConfig.apiKey" type="password" placeholder="请输入API密钥" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showApiConfig = false">取消</el-button>
          <el-button type="primary" @click="saveApiConfig">保存</el-button>
          <el-button type="info" @click="testConnection" :loading="testingApi">连接测试</el-button>
          <el-button type="success" @click="runApiTest" :loading="testingApi">Hello测试</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 设置按钮 -->
    <el-button
      class="settings-button"
      type="primary"
      circle
      @click="showApiConfig = true"
    >
      <el-icon><Setting /></el-icon>
    </el-button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Delete, Setting } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import ApiService from '@/services/apiService'

const inputText = ref('')
const selectedLanguage = ref('')
const targetLanguages = ref([])
const detectedLanguage = ref(null)
const translating = ref(false)
const showResults = ref(false)
const translationResults = ref([])
const translationProgress = ref(0)
const showRawResponseDialog = ref(false)
const currentRawResponse = ref(null)

// API配置相关
const showApiConfig = ref(false)
const apiConfig = ref({
  apiKey: '',
  apiEndpoint: '',
  model: ''
})
const apiService = ref(null)
const testingApi = ref(false)
const testResult = ref(null)

const availableLanguages = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: '英语' },
  { value: 'ja', label: '日语' },
  { value: 'ko', label: '韩语' },
  { value: 'ru', label: '俄语' }
]

const getLanguageLabel = (lang) => {
  const labels = {
    zh: '中文',
    en: '英语',
    ja: '日语',
    ko: '韩语',
    ru: '俄语'
  }
  return labels[lang] || lang
}

const showRawResponse = (rawResponses) => {
  currentRawResponse.value = rawResponses
  showRawResponseDialog.value = true
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
  if (percentage === 100) return '完成'
  return `翻译中 ${percentage}%`
}

// 从localStorage加载API配置
onMounted(() => {
  const savedConfig = localStorage.getItem('translatorApiConfig')
  if (savedConfig) {
    try {
      apiConfig.value = JSON.parse(savedConfig)
      apiService.value = new ApiService(apiConfig.value)
    } catch (error) {
      console.error('加载API配置失败:', error)
    }
  }
})

const saveApiConfig = () => {
  localStorage.setItem('translatorApiConfig', JSON.stringify(apiConfig.value))
  apiService.value = new ApiService(apiConfig.value)
  showApiConfig.value = false
  ElMessage.success('配置已保存')
}

// API测试功能
async function runApiTest() {
  if (!apiService.value) {
    ElMessage.error('请先配置API')
    return
  }
  
  testingApi.value = true
  try {
    const result = await apiService.value.apitest()
    ElMessage.success('API测试成功！')
    ElMessage({
      message: result,
      type: 'success',
      duration: 5000
    })
  } catch (error) {
    ElMessage.error('API测试失败：' + error.message)
  } finally {
    testingApi.value = false
  }
}

// 连接测试
async function testConnection() {
  if (!apiService.value) {
    ElMessage.error('请先配置API')
    return
  }

  testingApi.value = true
  try {
    await apiService.value.callLLM('test')
    ElMessage.success('连接测试成功！')
  } catch (error) {
    ElMessage.error('连接测试失败：' + error.message)
  } finally {
    testingApi.value = false
  }
}

const clearInput = () => {
  inputText.value = ''
  showResults.value = false
  translationResults.value = []
  detectedLanguage.value = null
}

const useDetectedLanguage = () => {
  if (detectedLanguage.value) {
    selectedLanguage.value = detectedLanguage.value
    // 自动选择除了源语言之外的所有目标语言
    targetLanguages.value = availableLanguages
      .map(lang => lang.value)
      .filter(lang => lang !== detectedLanguage.value)
  }
}

const translate = async () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入要翻译的文本')
    return
  }

  if (!apiConfig.value.apiKey) {
    ElMessage.warning('请先配置API密钥')
    showApiConfig.value = true
    return
  }

  translating.value = true
  translationProgress.value = 0
  showResults.value = true

  try {
    // 如果没有选择源语言，先进行语言检测
    if (!selectedLanguage.value) {
      detectedLanguage.value = await apiService.value.detectLanguage(inputText.value)
      selectedLanguage.value = detectedLanguage.value
    }

    // 准备翻译结果数组
    translationResults.value = targetLanguages.value.map(lang => ({
      lang,
      loading: true,
      data: null,
      error: null
    }))

    const progressIncrement = 100 / targetLanguages.value.length
    const translations = targetLanguages.value.map(async (targetLang, index) => {
      try {
        const result = await apiService.value.translate(
          inputText.value,
          selectedLanguage.value,
          targetLang
        )
        
        translationResults.value[index] = {
          lang: targetLang,
          loading: false,
          data: result,
          error: null
        }
      } catch (error) {
        translationResults.value[index] = {
          lang: targetLang,
          loading: false,
          data: null,
          error: error.message
        }
      } finally {
        translationProgress.value = Math.min(
          100,
          translationProgress.value + progressIncrement
        )
      }
    })

    await Promise.all(translations)
  } catch (error) {
    ElMessage.error('翻译过程出错: ' + error.message)
  } finally {
    translating.value = false
    translationProgress.value = 100
  }
}
</script>

<style scoped>
.translator {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.input-card {
  margin-bottom: 20px;
}

.language-controls {
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.target-languages {
  flex-grow: 1;
}

.translate-button {
  margin-top: 15px;
  width: 100%;
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
  margin: 10px 0;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
}

.word-segment {
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 5px;
}

.word {
  font-weight: bold;
}

.reading {
  font-size: 0.9em;
  color: #666;
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
</style>