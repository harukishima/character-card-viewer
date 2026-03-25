# Character Card Viewer

A web app for viewing character card files used by AI chat frontends (SillyTavern, RisuAI, etc.). Upload a character card and inspect all of its properties in a clean, readable interface.

## Features

- **Upload PNG or JSON** character cards via drag-and-drop or file picker
- **Supports V1, V2, and V3** character card specifications
- **Renders HTML & Markdown** in text fields with a toggle to switch to plain text view
- **Lorebook viewer** with collapsible entries showing keys, content, metadata
- **Dark/Light theme** with toggle (defaults to dark, persists to localStorage)
- **PWA support** — installable as a standalone app, works offline
- **Zero backend** — all parsing happens client-side in the browser

## Supported Formats

| Format | Spec | How it's stored |
|--------|------|----------------|
| PNG/APNG | V1/V2 | Base64 JSON in `chara` tEXt chunk |
| PNG/APNG | V3 | Base64 JSON in `ccv3` tEXt chunk |
| JSON | V1 | Flat object with `name`, `first_mes`, etc. |
| JSON | V2 | `{ spec: "chara_card_v2", data: { ... } }` |
| JSON | V3 | `{ spec: "chara_card_v3", data: { ... } }` |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (or Node.js 18+)

### Install & Run

```bash
bun install
bun run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
bun run build
bun run preview
```

### Type Check

```bash
bun run type-check
```

## Tech Stack

- **Vue 3** (Composition API, `<script setup>`)
- **Vite** — build tool
- **TypeScript** — full type coverage
- **marked** — Markdown rendering
- **DOMPurify** — HTML sanitization
- **vite-plugin-pwa** — service worker & web app manifest

## License

MIT
