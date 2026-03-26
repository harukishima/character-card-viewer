import { ref } from 'vue'
import { parseCardFile } from '../utils/card-parser'
import { createThumbnail } from '../utils/file-utils'
import { useCardLibrary } from './useCardLibrary'
import type { ParsedCard } from '../types/character-card'
import type { StoredCard, DuplicateAction } from '../types/stored-card'

const SUPPORTED_EXTENSIONS = ['.png', '.apng', '.json']

function isSupported(name: string): boolean {
  const lower = name.toLowerCase()
  return SUPPORTED_EXTENSIONS.some(ext => lower.endsWith(ext))
}

function isImage(name: string): boolean {
  const lower = name.toLowerCase()
  return lower.endsWith('.png') || lower.endsWith('.apng')
}

export function useCardImport() {
  const { findDuplicate, addCard, replaceCard, generateUniqueName } = useCardLibrary()

  const loading = ref(false)
  const error = ref<string | null>(null)
  const importStatus = ref<string | null>(null)

  // Duplicate handling state
  const duplicateExisting = ref<StoredCard | null>(null)
  const pendingCard = ref<ParsedCard | null>(null)
  const pendingImageData = ref<string | null>(null)
  const pendingFile = ref<File | null>(null)

  const hasDuplicateDialog = ref(false)

  function clearPending() {
    duplicateExisting.value = null
    pendingCard.value = null
    pendingImageData.value = null
    pendingFile.value = null
    hasDuplicateDialog.value = false
  }

  async function parseAndThumbnail(file: File): Promise<{ parsed: ParsedCard; imageData: string | null }> {
    const parsed = await parseCardFile(file)
    let imageData: string | null = null
    if (isImage(file.name)) {
      imageData = await createThumbnail(file)
    }
    return { parsed, imageData }
  }

  /** Import a single file. Returns the stored card ID, or null if duplicate dialog was shown. */
  async function importSingleFile(file: File): Promise<string | null> {
    loading.value = true
    error.value = null

    try {
      const { parsed, imageData } = await parseAndThumbnail(file)

      const existing = findDuplicate(parsed.data.name, parsed.version)
      if (existing) {
        duplicateExisting.value = existing
        pendingCard.value = parsed
        pendingImageData.value = imageData
        pendingFile.value = file
        hasDuplicateDialog.value = true
        loading.value = false
        return null
      }

      const stored = addCard(parsed, imageData, file)
      loading.value = false
      return stored.id
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
      loading.value = false
      return null
    }
  }

  /** Import multiple files in batch. Skips duplicates silently. */
  async function importBatch(files: File[]): Promise<void> {
    loading.value = true
    importStatus.value = null
    error.value = null
    let imported = 0
    let skipped = 0
    let failed = 0

    for (const file of files) {
      try {
        const { parsed, imageData } = await parseAndThumbnail(file)

        if (findDuplicate(parsed.data.name, parsed.version)) {
          skipped++
          continue
        }

        addCard(parsed, imageData, file)
        imported++
      } catch {
        failed++
      }
    }

    loading.value = false

    const parts: string[] = []
    if (imported > 0) parts.push(`${imported} imported`)
    if (skipped > 0) parts.push(`${skipped} skipped (duplicate)`)
    if (failed > 0) parts.push(`${failed} failed`)
    importStatus.value = parts.join(', ')

    setTimeout(() => {
      if (importStatus.value) importStatus.value = null
    }, 5000)
  }

  /** Handle files from uploader or drop. Single file gets duplicate dialog, multiple get batch import. */
  async function handleFiles(files: File[]): Promise<{ mode: 'single'; cardId: string | null } | { mode: 'batch' }> {
    const valid = files.filter(f => isSupported(f.name))
    if (valid.length === 0) return { mode: 'batch' }

    if (valid.length === 1) {
      const cardId = await importSingleFile(valid[0])
      return { mode: 'single', cardId }
    }

    await importBatch(valid)
    return { mode: 'batch' }
  }

  /** Handle duplicate dialog action. Returns the card ID to view, or null. */
  function resolveDuplicate(action: DuplicateAction): string | null {
    if (!pendingCard.value || !duplicateExisting.value) {
      clearPending()
      return null
    }

    let cardId: string | null = null

    if (action === 'replace') {
      replaceCard(duplicateExisting.value.id, pendingCard.value, pendingImageData.value, pendingFile.value)
      cardId = duplicateExisting.value.id
    } else if (action === 'rename') {
      const newName = generateUniqueName(pendingCard.value.data.name, pendingCard.value.version)
      pendingCard.value.data.name = newName
      const stored = addCard(pendingCard.value, pendingImageData.value, pendingFile.value)
      cardId = stored.id
    }

    clearPending()
    return cardId
  }

  function dismissImportStatus() {
    importStatus.value = null
  }

  return {
    loading,
    error,
    importStatus,
    duplicateExisting,
    pendingCard,
    hasDuplicateDialog,
    handleFiles,
    resolveDuplicate,
    clearPending,
    dismissImportStatus,
  }
}
