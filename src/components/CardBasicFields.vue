<script setup lang="ts">
import CollapsibleSection from './CollapsibleSection.vue'
import TextDisplay from './TextDisplay.vue'
import type { CharacterCardData } from '../types/character-card'

const props = defineProps<{
  data: CharacterCardData
  renderMode: 'plain' | 'rendered'
}>()

const fields: { key: keyof CharacterCardData; label: string; mono?: boolean }[] = [
  { key: 'description', label: 'Description' },
  { key: 'personality', label: 'Personality' },
  { key: 'scenario', label: 'Scenario' },
  { key: 'first_mes', label: 'First Message' },
  { key: 'mes_example', label: 'Example Messages', mono: true }
]
</script>

<template>
  <div>
    <template v-for="field in fields" :key="field.key">
      <CollapsibleSection
        v-if="data[field.key] !== undefined"
        :title="field.label"
        :default-open="field.key === 'description'"
        :empty="!data[field.key]"
      >
        <TextDisplay
          :text="String(data[field.key] || '')"
          :mono="field.mono"
          :render-mode="renderMode"
        />
      </CollapsibleSection>
    </template>
  </div>
</template>
