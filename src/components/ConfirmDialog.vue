<script setup lang="ts">
defineProps<{
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}>()

const emit = defineEmits<{
  confirm: []
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

      <h3 class="dialog-title">{{ title }}</h3>
      <p class="dialog-message">{{ message }}</p>

      <div class="dialog-actions">
        <button
          class="action-btn action-confirm"
          :class="{ 'action-danger': danger }"
          @click="emit('confirm')"
        >{{ confirmLabel ?? 'Confirm' }}</button>
        <button class="action-btn action-cancel" @click="emit('cancel')">{{ cancelLabel ?? 'Cancel' }}</button>
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
  max-width: 400px;
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
  margin: 0 0 20px;
  font-size: 0.9rem;
  color: var(--color-muted);
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
}

.action-confirm {
  background: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}

.action-confirm:hover {
  opacity: 0.9;
}

.action-danger {
  background: var(--color-error-text);
  border-color: var(--color-error-text);
}

.action-cancel {
  background: var(--color-surface-raised);
  color: inherit;
}

.action-cancel:hover {
  background: var(--color-border);
}
</style>
