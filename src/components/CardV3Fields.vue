<script setup lang="ts">
import CollapsibleSection from './CollapsibleSection.vue'
import TextDisplay from './TextDisplay.vue'
import AssetList from './AssetList.vue'
import type { CharacterCardData } from '../types/character-card'

const props = defineProps<{
  data: CharacterCardData
  renderMode: 'plain' | 'rendered'
}>()

function formatDate(ts: number | undefined): string | null {
  if (!ts) return null
  return new Date(ts * 1000).toLocaleString()
}
</script>

<template>
  <div>
    <CollapsibleSection
      v-if="data.creator_notes_multilingual && Object.keys(data.creator_notes_multilingual).length"
      title="Creator Notes (Multilingual)"
    >
      <div v-for="(text, lang) in data.creator_notes_multilingual" :key="lang" class="lang-entry">
        <div class="lang-code">{{ lang }}</div>
        <TextDisplay :text="text" :render-mode="renderMode" />
      </div>
    </CollapsibleSection>

    <CollapsibleSection
      v-if="data.source?.length"
      title="Source"
    >
      <ul class="source-list">
        <li v-for="(src, i) in data.source" :key="i">
          <a v-if="src.startsWith('http')" :href="src" target="_blank" rel="noopener">{{ src }}</a>
          <span v-else>{{ src }}</span>
        </li>
      </ul>
    </CollapsibleSection>

    <CollapsibleSection
      v-if="data.group_only_greetings?.length"
      title="Group-Only Greetings"
    >
      <CollapsibleSection
        v-for="(greeting, i) in data.group_only_greetings"
        :key="i"
        :title="`Greeting ${i + 1}`"
      >
        <TextDisplay :text="greeting" :render-mode="renderMode" />
      </CollapsibleSection>
    </CollapsibleSection>

    <CollapsibleSection
      v-if="data.assets?.length"
      title="Assets"
    >
      <AssetList :assets="data.assets" />
    </CollapsibleSection>

    <div v-if="data.creation_date || data.modification_date" class="dates">
      <span v-if="data.creation_date" class="date-item">
        <strong>Created:</strong> {{ formatDate(data.creation_date) }}
      </span>
      <span v-if="data.modification_date" class="date-item">
        <strong>Modified:</strong> {{ formatDate(data.modification_date) }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.lang-entry {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.lang-entry:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.lang-code {
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 4px;
}

.source-list {
  margin: 0;
  padding-left: 20px;
}

.source-list a {
  color: var(--color-accent);
  word-break: break-all;
}

.greeting {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.greeting:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.greeting-label {
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--color-muted);
  margin-bottom: 4px;
}

.dates {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 0.85rem;
  margin-top: 8px;
  padding: 10px 14px;
  background: var(--color-surface-raised);
  border-radius: 6px;
}
</style>
