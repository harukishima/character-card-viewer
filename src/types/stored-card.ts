import type { CardVersion, ParsedCard } from './character-card'

export interface StoredCard {
  id: string
  name: string
  version: CardVersion
  parsedCard: ParsedCard
  imageData: string | null
  /** Original file stored as a Blob for download */
  originalFile: Blob | null
  originalFileName: string | null
  createdAt: number
  updatedAt: number
}

export type DuplicateAction = 'replace' | 'skip' | 'rename'
