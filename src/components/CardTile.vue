<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { StoredCard } from '../types/stored-card'

const props = defineProps<{
  card: StoredCard
  selected: boolean
  selectionMode: boolean
}>()

const emit = defineEmits<{
  view: []
  download: []
  rename: [newName: string]
  delete: []
}>()

const editing = ref(false)
const editName = ref('')
const editInput = ref<HTMLInputElement | null>(null)

function startRename() {
  editing.value = true
  editName.value = props.card.name
  nextTick(() => {
    editInput.value?.focus()
    editInput.value?.select()
  })
}

function confirmRename() {
  const trimmed = editName.value.trim()
  if (trimmed) {
    emit('rename', trimmed)
  }
  editing.value = false
}

function cancelRename() {
  editing.value = false
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString()
}
</script>

<template>
  <div class="card-tile" :class="{ 'tile-selected': selected }">
    <div class="tile-check" v-if="selectionMode">
      <span class="check-icon">{{ selected ? '&#10003;' : '' }}</span>
    </div>

    <div class="tile-top">
      <img v-if="card.imageData" :src="card.imageData" alt="" class="tile-avatar" />
      <div v-else class="tile-placeholder">?</div>
    </div>

    <div class="tile-info">
      <template v-if="editing">
        <input
          ref="editInput"
          v-model="editName"
          class="rename-input"
          @keydown.enter="confirmRename"
          @keydown.esc="cancelRename"
          @blur="confirmRename"
          @click.stop
        />
      </template>
      <template v-else>
        <span class="tile-name" :title="card.name">{{ card.name }}</span>
      </template>
      <div class="tile-meta">
        <span class="version-badge">{{ card.version.toUpperCase() }}</span>
        <span class="tile-date">{{ formatDate(card.createdAt) }}</span>
      </div>
    </div>

    <div class="tile-actions" v-if="!selectionMode" @click.stop>
      <button class="tile-btn" title="View" @click="emit('view')">View</button>
      <button class="tile-btn" title="Download" @click="emit('download')">Save</button>
      <button class="tile-btn" title="Rename" @click="startRename">Rename</button>
      <button class="tile-btn tile-btn-danger" title="Delete" @click="emit('delete')">Delete</button>
    </div>
  </div>
</template>

<style scoped>
.card-tile {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: default;
  transition: border-color 0.15s;
}

.tile-selected {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 1px var(--color-accent);
}

.tile-check {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  font-size: 0.8rem;
  font-weight: 700;
}

.tile-selected .tile-check {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: white;
}

.tile-top {
  cursor: pointer;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--color-surface-raised);
}

.tile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.tile-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--color-muted);
}

.tile-info {
  padding: 10px 12px 4px;
}

.tile-name {
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rename-input {
  width: 100%;
  padding: 4px 6px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid var(--color-accent);
  border-radius: 4px;
  background: var(--color-bg);
  color: var(--color-text);
  outline: none;
  box-sizing: border-box;
}

.tile-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.version-badge {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border);
  color: var(--color-muted);
}

.tile-date {
  font-size: 0.7rem;
  color: var(--color-muted);
}

.tile-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 8px 12px 10px;
  gap: 4px;
  margin-top: auto;
}

.tile-btn {
  padding: 5px 4px;
  font-size: 0.72rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface-raised);
  color: inherit;
  cursor: pointer;
}

.tile-btn:hover {
  background: var(--color-border);
}

.tile-btn-danger {
  color: var(--color-error-text);
}

.tile-btn-danger:hover {
  background: var(--color-error-bg);
  border-color: var(--color-error-border);
}
</style>
