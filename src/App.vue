<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCardLibrary } from './composables/useCardLibrary'
import { useCardImport } from './composables/useCardImport'
import { useTheme } from './composables/useTheme'
import { useConfirm } from './composables/useConfirm'
import FileUploader from './components/FileUploader.vue'
import CardViewer from './components/CardViewer.vue'
import CardLibrary from './components/CardLibrary.vue'
import DuplicateDialog from './components/DuplicateDialog.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import type { DuplicateAction } from './types/stored-card'

type AppView = 'library' | 'viewer' | 'upload'

// ── Composables ──

const { theme, toggle: toggleTheme } = useTheme()
const { cards, storageError, loaded: libraryLoaded, removeCard, removeCards, renameCard, getCard, downloadCard } = useCardLibrary()
const { loading, error, importStatus, duplicateExisting, pendingCard, hasDuplicateDialog, handleFiles, resolveDuplicate, clearPending, dismissImportStatus } = useCardImport()
const { visible: confirmVisible, options: confirmOptions, handleConfirm, handleCancel } = useConfirm()

// ── View state ──

const currentView = ref<AppView>('library')
const selectedCardId = ref<string | null>(null)
const renderMode = ref<'plain' | 'rendered'>('rendered')
const viewerLoading = ref(false)
const draggingOver = ref(false)

// ── Viewer computed ──

const viewingCard = computed(() => selectedCardId.value ? getCard(selectedCardId.value) ?? null : null)
const viewerParsedCard = computed(() => viewingCard.value?.parsedCard ?? null)
const viewerImageUrl = computed(() => viewingCard.value?.imageData ?? null)
const viewerIsV2OrLater = computed(() => {
  const v = viewerParsedCard.value?.version
  return v === 'v2' || v === 'v3'
})
const viewerIsV3 = computed(() => viewerParsedCard.value?.version === 'v3')

// ── Navigation ──

function goToLibrary() {
  currentView.value = 'library'
  selectedCardId.value = null
  error.value = null
}

function viewCard(id: string) {
  selectedCardId.value = id
  renderMode.value = 'rendered'
  viewerLoading.value = true
  currentView.value = 'viewer'

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      viewerLoading.value = false
    })
  })
}

function showUploader() {
  error.value = null
  currentView.value = 'upload'
}

// ── File import ──

async function onFilesSelected(files: File[]) {
  const result = await handleFiles(files)
  if (result.mode === 'single' && result.cardId) {
    viewCard(result.cardId)
  } else if (result.mode === 'batch') {
    currentView.value = 'library'
  }
}

function onDuplicateAction(action: DuplicateAction) {
  const cardId = resolveDuplicate(action)
  if (cardId) {
    viewCard(cardId)
  } else {
    goToLibrary()
  }
}

function onDuplicateCancel() {
  clearPending()
  goToLibrary()
}

// ── Drag & drop ──

function onDragOver(e: DragEvent) {
  if (currentView.value !== 'library') return
  e.preventDefault()
  draggingOver.value = true
}

function onDragLeave() {
  draggingOver.value = false
}

async function onDrop(e: DragEvent) {
  e.preventDefault()
  draggingOver.value = false
  if (currentView.value !== 'library') return
  const files = Array.from(e.dataTransfer?.files ?? [])
  if (files.length) await onFilesSelected(files)
}
</script>

<template>
  <div
    class="app"
    @dragover="onDragOver"
    @dragleave.self="onDragLeave"
    @drop="onDrop"
  >
    <!-- Drop overlay -->
    <div v-if="draggingOver" class="drop-overlay">
      <div class="drop-message">Drop character cards here to import</div>
    </div>

    <header class="app-header">
      <h1 class="app-title">Character Card Viewer</h1>
      <div class="header-actions">
        <template v-if="currentView === 'viewer' && viewerParsedCard">
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
          <button class="reset-btn" @click="downloadCard(selectedCardId!)">Download</button>
          <button class="reset-btn" @click="goToLibrary">Back to Library</button>
        </template>
        <template v-if="currentView === 'upload'">
          <button class="reset-btn" @click="goToLibrary">Back to Library</button>
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
      <!-- Storage error banner -->
      <div v-if="storageError" class="storage-warning">
        <p>{{ storageError }}</p>
        <button class="dismiss-btn" @click="storageError = null">&times;</button>
      </div>

      <!-- Loading state -->
      <div v-if="!libraryLoaded || (loading && currentView === 'library')" class="loading">
        <div class="spinner"></div>
        <p>{{ !libraryLoaded ? 'Loading library...' : 'Importing cards...' }}</p>
      </div>

      <!-- Import status -->
      <div v-if="importStatus" class="import-status">
        <p>{{ importStatus }}</p>
        <button class="dismiss-btn" @click="dismissImportStatus">&times;</button>
      </div>

      <!-- Library view -->
      <CardLibrary
        v-if="libraryLoaded && !loading && currentView === 'library'"
        :cards="cards"
        @view-card="viewCard"
        @remove-card="removeCard"
        @remove-cards="removeCards"
        @rename-card="renameCard"
        @download-card="downloadCard"
        @add-card="showUploader"
      />

      <!-- Upload view -->
      <template v-if="currentView === 'upload'">
        <FileUploader v-if="!loading" @files-selected="onFilesSelected" />

        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>Loading card...</p>
        </div>

        <div v-if="error" class="error">
          <p>{{ error }}</p>
          <button class="reset-btn" @click="error = null">Try Again</button>
        </div>
      </template>

      <!-- Card viewer -->
      <template v-if="currentView === 'viewer'">
        <div v-if="viewerLoading" class="loading">
          <div class="spinner"></div>
          <p>Loading card...</p>
        </div>
        <CardViewer
          v-else-if="viewerParsedCard"
          :card="viewerParsedCard"
          :image-url="viewerImageUrl"
          :is-v2-or-later="viewerIsV2OrLater"
          :is-v3="viewerIsV3"
          :render-mode="renderMode"
        />
      </template>
    </main>

    <!-- Duplicate dialog -->
    <DuplicateDialog
      v-if="hasDuplicateDialog && duplicateExisting"
      :existing-card="duplicateExisting"
      :incoming-name="pendingCard?.data.name ?? ''"
      @action="onDuplicateAction"
      @cancel="onDuplicateCancel"
    />

    <!-- Confirm dialog -->
    <ConfirmDialog
      v-if="confirmVisible"
      :title="confirmOptions.title"
      :message="confirmOptions.message"
      :confirm-label="confirmOptions.confirmLabel"
      :cancel-label="confirmOptions.cancelLabel"
      :danger="confirmOptions.danger"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  padding: 24px;
  position: relative;
}

.drop-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  pointer-events: none;
}

.drop-message {
  padding: 24px 48px;
  background: var(--color-surface);
  border: 2px dashed var(--color-accent);
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-accent);
}

.import-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  margin-bottom: 16px;
  background: var(--color-surface-raised);
  border: 1px solid var(--color-accent);
  border-radius: 8px;
  font-size: 0.85rem;
  color: var(--color-accent);
}

.import-status p {
  margin: 0;
}

.app-header {
  max-width: 800px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
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
  gap: 8px;
  flex-wrap: wrap;
}

@media (max-width: 600px) {
  .app-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    justify-content: flex-start;
  }

  .render-toggle {
    flex-shrink: 0;
  }
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

.storage-warning {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  margin-bottom: 16px;
  background: var(--color-error-bg);
  border: 1px solid var(--color-error-border);
  border-radius: 8px;
  color: var(--color-error-text);
  font-size: 0.85rem;
}

.storage-warning p {
  margin: 0;
}

.dismiss-btn {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  opacity: 0.7;
}

.dismiss-btn:hover {
  opacity: 1;
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
