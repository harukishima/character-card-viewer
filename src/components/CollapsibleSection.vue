<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  defaultOpen?: boolean
  empty?: boolean
}>(), {
  defaultOpen: false,
  empty: false
})
</script>

<template>
  <details class="collapsible" :open="defaultOpen || undefined">
    <summary class="collapsible-summary">
      {{ title }}
      <span v-if="empty" class="empty-badge">empty</span>
    </summary>
    <div class="collapsible-content">
      <slot />
    </div>
  </details>
</template>

<style scoped>
.collapsible {
  border: 1px solid var(--color-border);
  border-radius: 6px;
  margin-bottom: 8px;
}

.collapsible-summary {
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  user-select: none;
  background: var(--color-surface-raised);
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.collapsible[open] > .collapsible-summary {
  border-bottom: 1px solid var(--color-border);
  border-radius: 6px 6px 0 0;
}

.collapsible-content {
  padding: 12px 14px;
}

.empty-badge {
  font-size: 0.7rem;
  font-weight: 400;
  color: var(--color-muted);
  background: var(--color-surface);
  padding: 1px 6px;
  border-radius: 4px;
}
</style>
