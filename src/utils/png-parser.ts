const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10]

export type TextChunks = Record<string, string>

/**
 * Extract tEXt chunks from a PNG ArrayBuffer.
 * Returns an object keyed by chunk keyword (e.g. { ccv3: '...', chara: '...' }).
 */
export function extractTextChunks(buffer: ArrayBuffer): TextChunks {
  const view = new DataView(buffer)
  const bytes = new Uint8Array(buffer)

  // Verify PNG signature
  for (let i = 0; i < 8; i++) {
    if (bytes[i] !== PNG_SIGNATURE[i]) {
      throw new Error('Not a valid PNG file')
    }
  }

  const decoder = new TextDecoder('latin1')
  const result: TextChunks = {}
  let offset = 8

  while (offset < buffer.byteLength) {
    const length = view.getUint32(offset)
    const typeBytes = bytes.slice(offset + 4, offset + 8)
    const type = decoder.decode(typeBytes)

    if (type === 'tEXt') {
      const dataStart = offset + 8
      const dataBytes = bytes.slice(dataStart, dataStart + length)

      // Find null terminator separating keyword from value
      let nullPos = 0
      while (nullPos < dataBytes.length && dataBytes[nullPos] !== 0) {
        nullPos++
      }

      const keyword = decoder.decode(dataBytes.slice(0, nullPos))
      const value = decoder.decode(dataBytes.slice(nullPos + 1))

      // Keep the longest value for duplicate keywords — some PNGs have
      // multiple 'chara' chunks where only the first carries full data.
      if (!(keyword in result) || value.length > result[keyword].length) {
        result[keyword] = value
      }
    }

    // Move to next chunk: 4 (length) + 4 (type) + data + 4 (CRC)
    offset += 12 + length

    // Stop after IEND
    if (type === 'IEND') break
  }

  return result
}

/**
 * Decode a base64 string that contains UTF-8 encoded text.
 */
export function decodeBase64Utf8(base64: string): string {
  const binaryStr = atob(base64)
  const bytes = Uint8Array.from(binaryStr, c => c.charCodeAt(0))
  return new TextDecoder('utf-8').decode(bytes)
}
