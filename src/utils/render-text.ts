import { marked } from 'marked'
import DOMPurify from 'dompurify'

// Configure marked for character card content
marked.setOptions({
  breaks: true,
  gfm: true,
})

/**
 * Render markdown+HTML text to sanitized HTML string.
 */
export function renderText(text: string): string {
  if (!text) return ''
  const html = marked.parse(text, { async: false }) as string
  return DOMPurify.sanitize(html, {
    ADD_TAGS: ['custom-style'],
    ADD_ATTR: ['target'],
  })
}
