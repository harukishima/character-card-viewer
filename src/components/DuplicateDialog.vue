<script setup lang="ts">
import type { StoredCard } from '../types/stored-card'
import type { DuplicateAction } from '../types/stored-card'

defineProps<{
  existingCard: StoredCard
  incomingName: string
}>()

const emit = defineEmits<{
  action: [action: DuplicateAction]
  cancel: []
}>()

function onOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) emit('cancel')
}
</script>

<template>
  <div class="overlay" @click="onOverlayClick" @keydown.esc="emit('cancel')">
    <div class="dialog" role="dialog" aria-modal="true">
      <button class="close-btn" @click="emit('cancel')" title="Close">&times;</button>

      <h3 class="dialog-title">Duplicate Card Detected</h3>
      <p class="dialog-message">
        A card named <strong>"{{ incomingName }}"</strong> already exists in your library.
      </p>

      <div class="existing-preview">
        <img
          v-if="existingCard.imageData"
          :src="existingCard.imageData"
          alt=""
          class="preview-avatar"
        />
        <div v-else class="preview-placeholder">?</div>
        <div class="preview-info">
          <span class="preview-name">{{ existingCard.name }}</span>
          <span class="preview-meta">{{ existingCard.version.toUpperCase() }} &middot; saved {{ new Date(existingCard.createdAt).toLocaleDateString() }}</span>
        </div>
      </div>

      <div class="dialog-actions">
        <button class="action-btn action-replace" @click="emit('action', 'replace')">Replace</button>
        <button class="action-btn action-keep" @click="emit('action', 'rename')">Keep Both</button>
        <button class="action-btn action-skip" @click="emit('action', 'skip')">Skip</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.dialog {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  max-width: 440px;
  width: 90%;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 1.4rem;
  color: var(--color-muted);
  cursor: pointer;
  line-height: 1;
  padding: 4px 8px;
}

.close-btn:hover {
  color: var(--color-text);
}

.dialog-title {
  margin: 0 0 8px;
  font-size: 1.1rem;
}

.dialog-message {
  margin: 0 0 16px;
  font-size: 0.9rem;
  color: var(--color-muted);
}

.existing-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  margin-bottom: 20px;
}

.preview-avatar {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
}

.preview-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  background: var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--color-muted);
}

.preview-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.preview-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.preview-meta {
  font-size: 0.75rem;
  color: var(--color-muted);
}

.dialog-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
}

.action-replace {
  background: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}

.action-replace:hover {
  opacity: 0.9;
}

.action-keep {
  background: var(--color-surface-raised);
  color: inherit;
}

.action-keep:hover {
  background: var(--color-border);
}

.action-skip {
  background: transparent;
  color: var(--color-muted);
}

.action-skip:hover {
  background: var(--color-surface-raised);
  color: var(--color-text);
}
</style>
