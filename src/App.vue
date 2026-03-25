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
        <a
          href="https://github.com/harukishima/character-card-viewer"
          target="_blank"
          rel="noopener"
          class="github-link"
          title="View on GitHub"
        >
          <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
        </a>
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

.github-link {
  color: var(--color-muted);
  display: flex;
  align-items: center;
  transition: color 0.15s;
}

.github-link:hover {
  color: var(--color-text);
}
</style>
