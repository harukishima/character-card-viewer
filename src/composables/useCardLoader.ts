import { ref, computed } from 'vue'
import { parseCardFile } from '../utils/card-parser'
import type { ParsedCard } from '../types/character-card'

export function useCardLoader() {
  const card = ref<ParsedCard | null>(null)
  const imageUrl = ref<string | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  async function loadFile(file: File) {
    error.value = null
    card.value = null
    loading.value = true

    // Revoke previous object URL
    if (imageUrl.value) {
      URL.revokeObjectURL(imageUrl.value)
      imageUrl.value = null
    }

    // Generate image preview if PNG
    const name = file.name.toLowerCase()
    if (name.endsWith('.png') || name.endsWith('.apng')) {
      imageUrl.value = URL.createObjectURL(file)
    }

    try {
      card.value = await parseCardFile(file)
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
      imageUrl.value = null
    } finally {
      loading.value = false
    }
  }

  function reset() {
    card.value = null
    error.value = null
    if (imageUrl.value) {
      URL.revokeObjectURL(imageUrl.value)
      imageUrl.value = null
    }
  }

  const isV1 = computed(() => card.value?.version === 'v1')
  const isV2OrLater = computed(() => card.value?.version === 'v2' || card.value?.version === 'v3')
  const isV3 = computed(() => card.value?.version === 'v3')

  return { card, imageUrl, error, loading, loadFile, reset, isV1, isV2OrLater, isV3 }
}
