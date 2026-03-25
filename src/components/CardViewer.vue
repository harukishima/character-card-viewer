<script setup lang="ts">
import CardHeader from './CardHeader.vue'
import CardBasicFields from './CardBasicFields.vue'
import CardV2Fields from './CardV2Fields.vue'
import CardV3Fields from './CardV3Fields.vue'
import CharacterBook from './CharacterBook.vue'
import CollapsibleSection from './CollapsibleSection.vue'
import type { ParsedCard } from '../types/character-card'

defineProps<{
  card: ParsedCard
  imageUrl: string | null
  isV2OrLater: boolean
  isV3: boolean
  renderMode: 'plain' | 'rendered'
}>()
</script>

<template>
  <div class="card-viewer">
    <CardHeader :data="card.data" :version="card.version" :image-url="imageUrl" />

    <h3 class="section-title">Basic Fields</h3>
    <CardBasicFields :data="card.data" :render-mode="renderMode" />

    <template v-if="isV2OrLater">
      <h3 class="section-title">V2 Fields</h3>
      <CardV2Fields :data="card.data" :render-mode="renderMode" />
    </template>

    <template v-if="isV3">
      <h3 class="section-title">V3 Fields</h3>
      <CardV3Fields :data="card.data" :render-mode="renderMode" />
    </template>

    <template v-if="card.data.character_book">
      <h3 class="section-title">Lorebook</h3>
      <CharacterBook :book="card.data.character_book" :render-mode="renderMode" />
    </template>

    <h3 class="section-title">Raw JSON</h3>
    <CollapsibleSection title="Full Card Data">
      <pre class="raw-json">{{ JSON.stringify(card.raw, null, 2) }}</pre>
    </CollapsibleSection>
  </div>
</template>

<style scoped>
.card-viewer {
  max-width: 800px;
  margin: 0 auto;
}

.section-title {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-muted);
  margin: 24px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--color-border);
}

.raw-json {
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  margin: 0;
  max-height: 500px;
  overflow-y: auto;
  line-height: 1.4;
}
</style>
