<template>
  <div class="app-container">
    <header>
      <h1>多语言翻译器 / Multilingual Translator / 多言語翻訳 / Многоязычный переводчик</h1>
    </header>
    <main>
      <TranslatorComponent />
    </main>
    <footer>
      <p>© 2024 Multilingual Translator. Powered by AI.</p>
    </footer>
  </div>
</template>

<script setup>
import TranslatorComponent from './components/TranslatorComponent.vue'
</script>

<style>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

main {
  flex: 1;
}

footer {
  text-align: center;
  padding: 1rem 0;
  color: #666;
}

/* Global styles */
body {
  margin: 0;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f7fa;
  color: #2c3e50;
}
</style>
