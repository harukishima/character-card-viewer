<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  'file-selected': [file: File]
}>()
const fileInput = ref<HTMLInputElement | null>(null)
const dragging = ref(false)

function onDrop(e: DragEvent) {
  dragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) emit('file-selected', file)
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('file-selected', file)
    target.value = ''
  }
}

function openPicker() {
  fileInput.value?.click()
}
</script>

<template>
  <div
    class="uploader"
    :class="{ dragging }"
    @click="openPicker"
    @dragover.prevent="dragging = true"
    @dragleave="dragging = false"
    @drop.prevent="onDrop"
  >
    <input
      ref="fileInput"
      type="file"
      accept=".png,.apng,.json"
      class="hidden"
      @change="onFileChange"
    />
    <div class="uploader-content">
      <div class="uploader-icon">&#128196;</div>
      <p class="uploader-text">Drop a character card here or click to browse</p>
      <p class="uploader-hint">Supports PNG, APNG, and JSON files</p>
    </div>
  </div>
</template>

<style scoped>
.uploader {
  border: 2px dashed var(--color-border);
  border-radius: 12px;
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.uploader:hover,
.uploader.dragging {
  border-color: var(--color-accent);
  background: var(--color-surface-raised);
}

.hidden {
  display: none;
}

.uploader-icon {
  font-size: 2.5rem;
  margin-bottom: 8px;
}

.uploader-text {
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 4px;
}

.uploader-hint {
  font-size: 0.8rem;
  color: var(--color-muted);
  margin: 0;
}
</style>
