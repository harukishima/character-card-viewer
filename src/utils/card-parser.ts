import { extractTextChunks, decodeBase64Utf8 } from './png-parser'
import { detectAndParse } from './version-detector'
import type { ParsedCard } from '../types/character-card'

/**
 * Parse a character card from a File object.
 * Supports PNG/APNG (with embedded card data) and JSON files.
 */
export async function parseCardFile(file: File): Promise<ParsedCard> {
  const name = file.name.toLowerCase()

  if (name.endsWith('.json')) {
    const text = await file.text()
    return detectAndParse(JSON.parse(text))
  }

  if (name.endsWith('.png') || name.endsWith('.apng')) {
    const buffer = await file.arrayBuffer()
    const chunks = extractTextChunks(buffer)

    // V3 uses 'ccv3' chunk, prefer it over 'chara'
    if (chunks.ccv3) {
      const json = JSON.parse(decodeBase64Utf8(chunks.ccv3))
      return detectAndParse(json)
    }
    if (chunks.chara) {
      const json = JSON.parse(decodeBase64Utf8(chunks.chara))
      return detectAndParse(json)
    }

    throw new Error('No character card data found in this PNG file')
  }

  throw new Error(`Unsupported file type: ${file.name}`)
}
