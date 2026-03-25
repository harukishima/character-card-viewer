<script setup lang="ts">
import { ref } from 'vue'
import { useCardLoader } from './composables/useCardLoader'
import { useTheme } from './composables/useTheme'
import FileUploader from './components/FileUploader.vue'
import CardViewer from './components/CardViewer.vue'

const { card, imageUrl, error, loading, loadFile, reset, isV2OrLater, isV3 } = useCardLoader()
const renderMode = ref<'plain' | 'rendered'>('rendered')
const { theme, toggle: toggleTheme } = useTheme()
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1 class="app-title">Character Card Viewer</h1>
      <div class="header-actions">
        <template v-if="card">
          <div class="render-toggle">
            <button
              class="toggle-btn"
              :class="{ active: renderMode === 'rendered' }"
              @click="renderMode = 'rendered'"
            >Rendered</button>
            <button
              class="toggle-btn"
              :class="{ active: renderMode === 'plain' }"
              @click="renderMode = 'plain'"
            >Plain Text</button>
          </div>
          <button class="reset-btn" @click="reset">Load Another</button>
        </template>
        <button class="theme-btn" @click="toggleTheme" :title="`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`">
          {{ theme === 'dark' ? '&#9788;' : '&#9790;' }}
        </button>
      </div>
    </header>

    <main class="app-main">
      <FileUploader v-if="!card && !loading" @file-selected="loadFile" />

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading card...</p>
      </div>

      <div v-if="error" class="error">
        <p>{{ error }}</p>
        <button class="reset-btn" @click="reset">Try Again</button>
      </div>

      <CardViewer
        v-if="card"
        :card="card"
        :image-url="imageUrl"
        :is-v2-or-later="isV2OrLater"
        :is-v3="isV3"
        :render-mode="renderMode"
      />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  padding: 24px;
}

.app-header {
  max-width: 800px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-title {
  font-size: 1.3rem;
  margin: 0;
}

.app-main {
  max-width: 800px;
  margin: 0 auto;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.render-toggle {
  display: flex;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  overflow: hidden;
}

.toggle-btn {
  background: var(--color-surface);
  border: none;
  padding: 5px 12px;
  cursor: pointer;
  font-size: 0.8rem;
  color: var(--color-muted);
  transition: background 0.15s, color 0.15s;
}

.toggle-btn:not(:last-child) {
  border-right: 1px solid var(--color-border);
}

.toggle-btn.active {
  background: var(--color-accent);
  color: white;
}

.reset-btn {
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border);
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  color: inherit;
}

.reset-btn:hover {
  background: var(--color-border);
}

.loading {
  text-align: center;
  padding: 48px;
  color: var(--color-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading p {
  margin: 0;
  font-size: 0.9rem;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 24px;
  background: var(--color-error-bg);
  border: 1px solid var(--color-error-border);
  border-radius: 8px;
  color: var(--color-error-text);
}

.theme-btn {
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border);
  width: 34px;
  height: 34px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1rem;
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-btn:hover {
  background: var(--color-border);
}
</style>
