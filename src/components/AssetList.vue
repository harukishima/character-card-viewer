<script setup lang="ts">
import type { AssetObject } from '../types/character-card'

defineProps<{
  assets: AssetObject[]
}>()

function truncateUri(uri: string): string {
  if (!uri) return ''
  if (uri.length > 60) return uri.slice(0, 57) + '...'
  return uri
}

function isLink(uri: string): boolean {
  return uri?.startsWith('http://') || uri?.startsWith('https://')
}
</script>

<template>
  <div class="asset-table-wrap">
    <table class="asset-table">
      <thead>
        <tr>
          <th>Type</th>
          <th>Name</th>
          <th>URI</th>
          <th>Ext</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(asset, i) in assets" :key="i">
          <td><span class="type-badge">{{ asset.type }}</span></td>
          <td>{{ asset.name }}</td>
          <td class="uri-cell">
            <a v-if="isLink(asset.uri)" :href="asset.uri" target="_blank" rel="noopener">
              {{ truncateUri(asset.uri) }}
            </a>
            <span v-else>{{ truncateUri(asset.uri) }}</span>
          </td>
          <td>{{ asset.ext }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.asset-table-wrap {
  overflow-x: auto;
}

.asset-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.asset-table th,
.asset-table td {
  text-align: left;
  padding: 6px 10px;
  border-bottom: 1px solid var(--color-border);
}

.asset-table th {
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-muted);
}

.type-badge {
  font-size: 0.75rem;
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border);
  padding: 1px 6px;
  border-radius: 4px;
}

.uri-cell {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  word-break: break-all;
}

.uri-cell a {
  color: var(--color-accent);
}
</style>
