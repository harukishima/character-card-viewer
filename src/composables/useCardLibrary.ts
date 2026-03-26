import { ref, shallowRef, triggerRef } from 'vue'
import type { CardVersion, ParsedCard } from '../types/character-card'
import type { StoredCard } from '../types/stored-card'

const DB_NAME = 'ccv-db'
const DB_VERSION = 1
const STORE_NAME = 'cards'
const OLD_STORAGE_KEY = 'ccv-cards'

// ── IndexedDB helpers ──

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function txStore(db: IDBDatabase, mode: IDBTransactionMode): IDBObjectStore {
  return db.transaction(STORE_NAME, mode).objectStore(STORE_NAME)
}

function reqToPromise<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function txToPromise(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// ── Rebuild raw field for the card viewer ──

function rebuildRaw(parsed: ParsedCard): unknown {
  if (parsed.version === 'v1') return parsed.data
  return {
    spec: parsed.version === 'v3' ? 'chara_card_v3' : 'chara_card_v2',
    spec_version: parsed.version === 'v3' ? '3.0' : '2.0',
    data: parsed.data,
  }
}

function ensureRaw(card: StoredCard): StoredCard {
  if (!card.parsedCard.raw) {
    card.parsedCard = { ...card.parsedCard, raw: rebuildRaw(card.parsedCard) }
  }
  return card
}

// ── Migrate from localStorage (one-time) ──

async function migrateFromLocalStorage(db: IDBDatabase): Promise<StoredCard[]> {
  const raw = localStorage.getItem(OLD_STORAGE_KEY)
  if (!raw) return []
  try {
    const oldCards = JSON.parse(raw) as StoredCard[]
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    for (const card of oldCards) {
      // Old cards won't have originalFile
      if (!card.originalFile) card.originalFile = null
      if (!card.originalFileName) card.originalFileName = null
      store.put(card)
    }
    await txToPromise(tx)
    localStorage.removeItem(OLD_STORAGE_KEY)
    return oldCards.map(ensureRaw)
  } catch {
    return []
  }
}

// ── Module-level shared state ──

const cards = shallowRef<StoredCard[]>([])
const storageError = ref<string | null>(null)
let dbReady: Promise<IDBDatabase> | null = null
const loaded = ref(false)

function getDB(): Promise<IDBDatabase> {
  if (!dbReady) {
    dbReady = openDB()
  }
  return dbReady
}

async function loadAllCards(): Promise<StoredCard[]> {
  const db = await getDB()
  const all = await reqToPromise(txStore(db, 'readonly').getAll()) as StoredCard[]
  if (all.length === 0) {
    // Try migrating from localStorage
    const migrated = await migrateFromLocalStorage(db)
    if (migrated.length > 0) return migrated
  }
  return all.map(ensureRaw)
}

// Initialize on module load
loadAllCards().then(all => {
  cards.value = all
  loaded.value = true
}).catch(() => {
  loaded.value = true
})

async function persistCard(card: StoredCard): Promise<void> {
  try {
    const db = await getDB()
    const store = txStore(db, 'readwrite')
    // Strip raw field to save space; convert File to Blob for IndexedDB cloning
    const toStore = {
      ...card,
      parsedCard: { version: card.parsedCard.version, data: card.parsedCard.data },
      originalFile: card.originalFile instanceof File
        ? new Blob([card.originalFile], { type: card.originalFile.type })
        : card.originalFile,
    }
    await reqToPromise(store.put(toStore))
    storageError.value = null
  } catch (e) {
    storageError.value = 'Failed to save card: ' + (e instanceof Error ? e.message : String(e))
  }
}

async function deleteFromDB(id: string): Promise<void> {
  try {
    const db = await getDB()
    await reqToPromise(txStore(db, 'readwrite').delete(id))
    storageError.value = null
  } catch (e) {
    storageError.value = 'Failed to delete card: ' + (e instanceof Error ? e.message : String(e))
  }
}

// ── Public composable ──

export function useCardLibrary() {
  function findDuplicate(name: string, version: CardVersion): StoredCard | null {
    const normalized = name.trim().toLowerCase()
    return cards.value.find(
      c => c.name.trim().toLowerCase() === normalized && c.version === version
    ) ?? null
  }

  function addCard(parsedCard: ParsedCard, imageData: string | null, originalFile: File | null): StoredCard {
    const now = Date.now()
    const stored: StoredCard = {
      id: crypto.randomUUID(),
      name: parsedCard.data.name,
      version: parsedCard.version,
      parsedCard,
      imageData,
      originalFile: originalFile,
      originalFileName: originalFile?.name ?? null,
      createdAt: now,
      updatedAt: now,
    }
    cards.value = [...cards.value, stored]
    persistCard(stored)
    return stored
  }

  function removeCard(id: string) {
    cards.value = cards.value.filter(c => c.id !== id)
    deleteFromDB(id)
  }

  function removeCards(ids: string[]) {
    const idSet = new Set(ids)
    cards.value = cards.value.filter(c => !idSet.has(c.id))
    for (const id of ids) {
      deleteFromDB(id)
    }
  }

  function renameCard(id: string, newName: string) {
    const card = cards.value.find(c => c.id === id)
    if (!card) return
    card.name = newName
    card.parsedCard.data.name = newName
    card.updatedAt = Date.now()
    triggerRef(cards)
    persistCard(card)
  }

  function replaceCard(existingId: string, parsedCard: ParsedCard, imageData: string | null, originalFile: File | null) {
    const idx = cards.value.findIndex(c => c.id === existingId)
    if (idx === -1) return
    const updated: StoredCard = {
      ...cards.value[idx],
      name: parsedCard.data.name,
      version: parsedCard.version,
      parsedCard,
      imageData,
      originalFile,
      originalFileName: originalFile?.name ?? null,
      updatedAt: Date.now(),
    }
    const next = [...cards.value]
    next[idx] = updated
    cards.value = next
    persistCard(updated)
  }

  function getCard(id: string): StoredCard | undefined {
    return cards.value.find(c => c.id === id)
  }

  function generateUniqueName(baseName: string, version: CardVersion): string {
    let counter = 2
    let candidate = `${baseName} (${counter})`
    while (findDuplicate(candidate, version)) {
      counter++
      candidate = `${baseName} (${counter})`
    }
    return candidate
  }

  function downloadCard(id: string) {
    const card = cards.value.find(c => c.id === id)
    if (!card) return

    let blob: Blob
    let fileName: string

    if (card.originalFile) {
      blob = card.originalFile
      fileName = card.originalFileName ?? `${card.name}.png`
    } else {
      // Fallback: export card data as JSON
      const raw = card.parsedCard.raw ?? rebuildRaw(card.parsedCard)
      blob = new Blob([JSON.stringify(raw, null, 2)], { type: 'application/json' })
      fileName = `${card.name}.json`
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    cards,
    storageError,
    loaded,
    findDuplicate,
    addCard,
    removeCard,
    removeCards,
    renameCard,
    replaceCard,
    getCard,
    generateUniqueName,
    downloadCard,
  }
}
