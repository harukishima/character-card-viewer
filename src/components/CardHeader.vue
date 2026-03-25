<script setup lang="ts">
import type { CharacterCardData, CardVersion } from '../types/character-card'

defineProps<{
  data: CharacterCardData
  version: CardVersion
  imageUrl: string | null
}>()
</script>

<template>
  <div class="card-header">
    <img v-if="imageUrl" :src="imageUrl" alt="Character avatar" class="avatar" />
    <div class="header-info">
      <div class="name-row">
        <h2 class="name">{{ data.name || '(unnamed)' }}</h2>
        <span class="version-badge">{{ version.toUpperCase() }}</span>
      </div>
      <p v-if="data.nickname" class="nickname">aka "{{ data.nickname }}"</p>
      <div class="meta">
        <span v-if="data.creator" class="meta-item">
          <strong>Creator:</strong> {{ data.creator }}
        </span>
        <span v-if="data.character_version" class="meta-item">
          <strong>Version:</strong> {{ data.character_version }}
        </span>
      </div>
      <div v-if="data.tags?.length" class="tags">
        <span v-for="tag in data.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-bottom: 20px;
}

.avatar {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid var(--color-border);
  flex-shrink: 0;
}

.header-info {
  flex: 1;
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.name {
  margin: 0;
  font-size: 1.5rem;
}

.version-badge {
  font-size: 0.7rem;
  font-weight: 700;
  background: var(--color-accent);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.nickname {
  margin: 4px 0 0;
  color: var(--color-muted);
  font-style: italic;
}

.meta {
  margin-top: 8px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 0.85rem;
}

.tags {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 0.75rem;
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border);
  padding: 2px 8px;
  border-radius: 12px;
}
</style>
