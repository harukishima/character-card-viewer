<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import type { StoredCard } from '../types/stored-card'
import { useConfirm } from '../composables/useConfirm'
import { useMultiSelect } from '../composables/useMultiSelect'
import CardTile from './CardTile.vue'

const props = defineProps<{
  cards: StoredCard[]
}>()

const emit = defineEmits<{
  'view-card': [id: string]
  'remove-card': [id: string]
  'remove-cards': [ids: string[]]
  'rename-card': [id: string, newName: string]
  'download-card': [id: string]
  'add-card': []
}>()

const { confirm: showConfirm } = useConfirm()
const selection = useMultiSelect(() => props.cards)

function handleTileClick(card: StoredCard, event: MouseEvent) {
  if (!selection.handleClick(card.id, event)) {
    emit('view-card', card.id)
  }
}

async function confirmRemove(card: StoredCard) {
  const ok = await showConfirm({
    title: 'Delete Card',
    message: `Remove "${card.name}" from your library?`,
    confirmLabel: 'Delete',
    danger: true,
  })
  if (ok) emit('remove-card', card.id)
}

async function confirmDeleteSelected() {
  const count = selection.count.value
  if (count === 0) return
  const ok = await showConfirm({
    title: 'Delete Cards',
    message: `Delete ${count} card${count > 1 ? 's' : ''} from your library?`,
    confirmLabel: `Delete ${count}`,
    danger: true,
  })
  if (ok) {
    emit('remove-cards', selection.selectedIds())
    selection.clear()
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && selection.isActive.value) {
    selection.clear()
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'a' && props.cards.length > 0) {
    e.preventDefault()
    selection.selectAll()
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="library">
    <div class="library-header">
      <div class="library-title-row">
        <h2 class="library-title">Card Library</h2>
        <span class="card-count" v-if="cards.length">{{ cards.length }}</span>
      </div>
      <button class="add-btn" @click="emit('add-card')">+ Add Card</button>
    </div>

    <!-- Selection toolbar -->
    <div v-if="selection.isActive.value" class="selection-bar">
      <span class="selection-count">{{ selection.count.value }} selected</span>
      <div class="selection-actions">
        <button class="sel-btn" @click="selection.selectAll()">Select All</button>
        <button class="sel-btn sel-btn-danger" @click="confirmDeleteSelected">Delete Selected</button>
        <button class="sel-btn" @click="selection.clear()">Cancel</button>
      </div>
    </div>

    <div v-if="cards.length === 0" class="empty-state">
      <p class="empty-icon">&#128450;</p>
      <p class="empty-text">No cards saved yet</p>
      <p class="empty-hint">Upload your first character card to get started</p>
      <button class="add-btn" @click="emit('add-card')">Upload Card</button>
    </div>

    <div v-else class="card-grid">
      <CardTile
        v-for="card in cards"
        :key="card.id"
        :card="card"
        :selected="selection.isSelected(card.id)"
        :selection-mode="selection.isActive.value"
        @click="handleTileClick(card, $event)"
        @view="emit('view-card', card.id)"
        @download="emit('download-card', card.id)"
        @rename="emit('rename-card', card.id, $event)"
        @delete="confirmRemove(card)"
      />
    </div>

    <p v-if="cards.length > 0 && !selection.isActive.value" class="select-hint">
      Ctrl+Click to select multiple cards
    </p>
  </div>
</template>

<style scoped>
.library {
  width: 100%;
}

.library-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.library-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.library-title {
  margin: 0;
  font-size: 1.1rem;
}

.card-count {
  background: var(--color-accent);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

.add-btn {
  background: var(--color-accent);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
}

.add-btn:hover {
  opacity: 0.9;
}

.selection-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  margin-bottom: 16px;
  background: var(--color-surface-raised);
  border: 1px solid var(--color-accent);
  border-radius: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

.selection-count {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-accent);
}

.selection-actions {
  display: flex;
  gap: 6px;
}

.sel-btn {
  padding: 5px 12px;
  font-size: 0.78rem;
  border: 1px solid var(--color-border);
  border-radius: 5px;
  background: var(--color-surface);
  color: inherit;
  cursor: pointer;
}

.sel-btn:hover {
  background: var(--color-border);
}

.sel-btn-danger {
  background: var(--color-error-bg);
  color: var(--color-error-text);
  border-color: var(--color-error-border);
}

.sel-btn-danger:hover {
  opacity: 0.9;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--color-muted);
}

.empty-icon {
  font-size: 2.5rem;
  margin: 0 0 8px;
}

.empty-text {
  font-size: 1rem;
  margin: 0 0 4px;
  color: var(--color-text);
  font-weight: 500;
}

.empty-hint {
  font-size: 0.85rem;
  margin: 0 0 20px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.select-hint {
  text-align: center;
  font-size: 0.72rem;
  color: var(--color-muted);
  margin: 16px 0 0;
  opacity: 0.6;
}
</style>
