export interface CharacterBookEntry {
  keys: string[]
  content: string
  extensions: Record<string, unknown>
  enabled: boolean
  insertion_order: number
  case_sensitive?: boolean
  name?: string
  priority?: number
  id?: number
  comment?: string
  selective?: boolean
  secondary_keys?: string[]
  constant?: boolean
  position?: 'before_char' | 'after_char'
  // V3
  use_regex?: boolean
}

export interface CharacterBook {
  name?: string
  description?: string
  scan_depth?: number
  token_budget?: number
  recursive_scanning?: boolean
  extensions: Record<string, unknown>
  entries: CharacterBookEntry[]
}

export interface AssetObject {
  type: string
  uri: string
  name: string
  ext: string
}

export interface CharacterCardData {
  // V1
  name: string
  description: string
  personality: string
  scenario: string
  first_mes: string
  mes_example: string
  // V2
  creator_notes?: string
  system_prompt?: string
  post_history_instructions?: string
  alternate_greetings?: string[]
  character_book?: CharacterBook
  tags?: string[]
  creator?: string
  character_version?: string
  extensions?: Record<string, unknown>
  // V3
  nickname?: string
  creator_notes_multilingual?: Record<string, string>
  source?: string[]
  assets?: AssetObject[]
  group_only_greetings?: string[]
  creation_date?: number
  modification_date?: number
}

export type CardVersion = 'v1' | 'v2' | 'v3'

export interface ParsedCard {
  version: CardVersion
  data: CharacterCardData
  raw: unknown
}
