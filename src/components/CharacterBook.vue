<script setup lang="ts">
import CollapsibleSection from './CollapsibleSection.vue'
import BookEntry from './BookEntry.vue'
import type { CharacterBook as CharacterBookType } from '../types/character-card'

defineProps<{
  book: CharacterBookType
  renderMode: 'plain' | 'rendered'
}>()
</script>

<template>
  <CollapsibleSection title="Character Book (Lorebook)">
    <div class="book-meta">
      <span v-if="book.name"><strong>Name:</strong> {{ book.name }}</span>
      <span v-if="book.description"><strong>Description:</strong> {{ book.description }}</span>
      <span v-if="book.scan_depth != null"><strong>Scan Depth:</strong> {{ book.scan_depth }}</span>
      <span v-if="book.token_budget != null"><strong>Token Budget:</strong> {{ book.token_budget }}</span>
      <span v-if="book.recursive_scanning != null"><strong>Recursive:</strong> {{ book.recursive_scanning }}</span>
    </div>

    <div v-if="book.entries?.length" class="entries-header">
      {{ book.entries.length }} {{ book.entries.length === 1 ? 'entry' : 'entries' }}
    </div>

    <BookEntry
      v-for="(entry, i) in book.entries"
      :key="entry.id ?? i"
      :entry="entry"
      :index="i"
      :render-mode="renderMode"
    />

    <div v-if="!book.entries?.length" class="no-entries">No entries</div>
  </CollapsibleSection>
</template>

<style scoped>
.book-meta {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  font-size: 0.85rem;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.entries-header {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-muted);
  margin-bottom: 8px;
}

.no-entries {
  color: var(--color-muted);
  font-style: italic;
  font-size: 0.85rem;
}
</style>
