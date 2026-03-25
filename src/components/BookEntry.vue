<script setup lang="ts">
import TextDisplay from './TextDisplay.vue'
import type { CharacterBookEntry } from '../types/character-card'

defineProps<{
  entry: CharacterBookEntry
  index: number
  renderMode: 'plain' | 'rendered'
}>()
</script>

<template>
  <details class="entry">
    <summary class="entry-summary">
      <span class="entry-indicator" :class="entry.enabled ? 'on' : 'off'"></span>
      <span class="entry-name">{{ entry.name || `Entry ${index}` }}</span>
      <span v-if="entry.constant" class="constant-badge">constant</span>
      <span class="entry-keys">
        <span v-for="key in entry.keys" :key="key" class="key-pill">{{ key }}</span>
      </span>
    </summary>
    <div class="entry-body">
      <div class="entry-meta">
        <span><strong>Enabled:</strong> {{ entry.enabled }}</span>
        <span><strong>Insertion Order:</strong> {{ entry.insertion_order }}</span>
        <span v-if="entry.priority != null"><strong>Priority:</strong> {{ entry.priority }}</span>
        <span v-if="entry.position"><strong>Position:</strong> {{ entry.position }}</span>
        <span v-if="entry.case_sensitive != null"><strong>Case Sensitive:</strong> {{ entry.case_sensitive }}</span>
        <span v-if="entry.selective"><strong>Selective:</strong> {{ entry.selective }}</span>
        <span v-if="entry.use_regex != null"><strong>Use Regex:</strong> {{ entry.use_regex }}</span>
      </div>

      <div v-if="entry.selective && entry.secondary_keys?.length" class="secondary-keys">
        <strong>Secondary Keys:</strong>
        <span v-for="key in entry.secondary_keys" :key="key" class="key-pill">{{ key }}</span>
      </div>

      <div v-if="entry.comment" class="entry-comment">
        <strong>Comment:</strong> {{ entry.comment }}
      </div>

      <div class="content-label">Content:</div>
      <div class="entry-content">
        <TextDisplay :text="entry.content" :mono="renderMode === 'plain'" :render-mode="renderMode" />
      </div>
    </div>
  </details>
</template>

<style scoped>
.entry {
  border: 1px solid var(--color-border);
  border-radius: 6px;
  margin-bottom: 6px;
}

.entry-summary {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  flex-wrap: wrap;
}

.entry-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.entry-indicator.on {
  background: #22c55e;
}

.entry-indicator.off {
  background: #ef4444;
}

.entry-name {
  font-weight: 600;
}

.constant-badge {
  font-size: 0.65rem;
  background: var(--color-accent);
  color: white;
  padding: 1px 5px;
  border-radius: 3px;
}

.entry-keys {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.key-pill {
  font-size: 0.7rem;
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border);
  padding: 1px 6px;
  border-radius: 10px;
  font-family: var(--font-mono);
}

.entry-body {
  padding: 10px 12px;
  border-top: 1px solid var(--color-border);
}

.entry-meta {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  font-size: 0.8rem;
  margin-bottom: 8px;
}

.secondary-keys {
  font-size: 0.8rem;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.entry-comment {
  font-size: 0.8rem;
  margin-bottom: 8px;
  color: var(--color-muted);
}

.content-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-muted);
  margin-bottom: 4px;
}

.entry-content {
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
  background: var(--color-surface);
  padding: 8px;
  border-radius: 4px;
  line-height: 1.5;
}
</style>
