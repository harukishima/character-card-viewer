<script setup lang="ts">
import { computed } from 'vue'
import { renderText } from '../utils/render-text'

const props = defineProps<{
  text: string
  mono?: boolean
  renderMode: 'plain' | 'rendered'
}>()

const renderedHtml = computed(() => renderText(props.text))
</script>

<template>
  <div v-if="!text" class="muted">(empty)</div>
  <template v-else>
    <div
      v-if="renderMode === 'rendered'"
      class="rendered-content"
      v-html="renderedHtml"
    />
    <pre v-else-if="mono" class="mono-block">{{ text }}</pre>
    <div v-else class="text-block">{{ text }}</div>
  </template>
</template>

<style scoped>
.text-block {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.6;
}

.mono-block {
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  margin: 0;
  line-height: 1.5;
}

.muted {
  color: var(--color-muted);
  font-style: italic;
}

.rendered-content {
  line-height: 1.6;
  word-break: break-word;
}

.rendered-content :deep(h1),
.rendered-content :deep(h2),
.rendered-content :deep(h3),
.rendered-content :deep(h4) {
  margin: 0.8em 0 0.4em;
  line-height: 1.3;
}

.rendered-content :deep(h1) { font-size: 1.3em; }
.rendered-content :deep(h2) { font-size: 1.15em; }
.rendered-content :deep(h3) { font-size: 1.05em; }

.rendered-content :deep(p) {
  margin: 0.4em 0;
}

.rendered-content :deep(ul),
.rendered-content :deep(ol) {
  margin: 0.4em 0;
  padding-left: 1.5em;
}

.rendered-content :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.85em;
  background: var(--color-surface-raised);
  padding: 1px 4px;
  border-radius: 3px;
}

.rendered-content :deep(pre) {
  background: var(--color-surface-raised);
  padding: 10px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 0.5em 0;
}

.rendered-content :deep(pre code) {
  background: none;
  padding: 0;
}

.rendered-content :deep(blockquote) {
  margin: 0.5em 0;
  padding: 4px 12px;
  border-left: 3px solid var(--color-border);
  color: var(--color-muted);
}

.rendered-content :deep(table) {
  border-collapse: collapse;
  margin: 0.5em 0;
  font-size: 0.9em;
}

.rendered-content :deep(th),
.rendered-content :deep(td) {
  border: 1px solid var(--color-border);
  padding: 4px 8px;
  text-align: left;
}

.rendered-content :deep(th) {
  background: var(--color-surface-raised);
  font-weight: 600;
}

.rendered-content :deep(a) {
  color: var(--color-accent);
}

.rendered-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 0.8em 0;
}

.rendered-content :deep(img) {
  max-width: 100%;
  border-radius: 4px;
}
</style>
