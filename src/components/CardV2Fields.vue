<script setup lang="ts">
import CollapsibleSection from './CollapsibleSection.vue'
import TextDisplay from './TextDisplay.vue'
import type { CharacterCardData } from '../types/character-card'

const props = defineProps<{
  data: CharacterCardData
  renderMode: 'plain' | 'rendered'
}>()

function hasExtensions(ext: unknown): boolean {
  return !!ext && typeof ext === 'object' && Object.keys(ext as object).length > 0
}
</script>

<template>
  <div>
    <CollapsibleSection
      v-if="data.creator_notes !== undefined"
      title="Creator Notes"
      :empty="!data.creator_notes"
    >
      <TextDisplay :text="data.creator_notes || ''" :render-mode="renderMode" />
    </CollapsibleSection>

    <CollapsibleSection
      v-if="data.system_prompt !== undefined"
      title="System Prompt"
      :empty="!data.system_prompt"
    >
      <TextDisplay :text="data.system_prompt || ''" :mono="true" :render-mode="renderMode" />
    </CollapsibleSection>

    <CollapsibleSection
      v-if="data.post_history_instructions !== undefined"
      title="Post History Instructions"
      :empty="!data.post_history_instructions"
    >
      <TextDisplay :text="data.post_history_instructions || ''" :mono="true" :render-mode="renderMode" />
    </CollapsibleSection>

    <CollapsibleSection
      v-if="data.alternate_greetings?.length"
      title="Alternate Greetings"
    >
      <CollapsibleSection
        v-for="(greeting, i) in data.alternate_greetings"
        :key="i"
        :title="`Greeting ${i + 1}`"
      >
        <TextDisplay :text="greeting" :render-mode="renderMode" />
      </CollapsibleSection>
    </CollapsibleSection>

    <CollapsibleSection
      v-if="hasExtensions(data.extensions)"
      title="Extensions"
    >
      <pre class="mono-block">{{ JSON.stringify(data.extensions, null, 2) }}</pre>
    </CollapsibleSection>
  </div>
</template>

<style scoped>
.mono-block {
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  margin: 0;
  line-height: 1.5;
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
</style>
