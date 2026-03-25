import type { ParsedCard } from '../types/character-card'

/**
 * Detect character card version and normalize to { version, data, raw }.
 */
export function detectAndParse(json: Record<string, unknown>): ParsedCard {
  if (json.spec === 'chara_card_v3') {
    return { version: 'v3', data: json.data as ParsedCard['data'], raw: json }
  }
  if (json.spec === 'chara_card_v2') {
    return { version: 'v2', data: json.data as ParsedCard['data'], raw: json }
  }
  // V1: flat object with known fields
  if (typeof json.name === 'string' && ('first_mes' in json || 'description' in json)) {
    return { version: 'v1', data: json as unknown as ParsedCard['data'], raw: json }
  }
  throw new Error('Unrecognized character card format')
}
