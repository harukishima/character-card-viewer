import { ref, computed } from 'vue'

export function useMultiSelect<T extends { id: string }>(getItems: () => T[]) {
  const selected = ref<Set<string>>(new Set())
  const lastClickedId = ref<string | null>(null)

  const count = computed(() => selected.value.size)
  const isActive = computed(() => count.value > 0)

  function isSelected(id: string): boolean {
    return selected.value.has(id)
  }

  function clear() {
    selected.value = new Set()
    lastClickedId.value = null
  }

  function toggle(id: string) {
    const next = new Set(selected.value)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    selected.value = next
    lastClickedId.value = id
  }

  function selectRange(id: string) {
    if (!lastClickedId.value) {
      toggle(id)
      return
    }
    const items = getItems()
    const ids = items.map(i => i.id)
    const fromIdx = ids.indexOf(lastClickedId.value)
    const toIdx = ids.indexOf(id)
    if (fromIdx === -1 || toIdx === -1) return
    const start = Math.min(fromIdx, toIdx)
    const end = Math.max(fromIdx, toIdx)
    const next = new Set(selected.value)
    for (let i = start; i <= end; i++) {
      next.add(ids[i])
    }
    selected.value = next
  }

  function selectAll() {
    selected.value = new Set(getItems().map(i => i.id))
  }

  function selectedIds(): string[] {
    return [...selected.value]
  }

  /** Handle a click with modifier keys. Returns true if selection was handled (don't navigate). */
  function handleClick(id: string, event: MouseEvent): boolean {
    if (event.ctrlKey || event.metaKey) {
      toggle(id)
      return true
    }
    if (event.shiftKey && lastClickedId.value) {
      selectRange(id)
      return true
    }
    if (isActive.value) {
      toggle(id)
      return true
    }
    return false
  }

  return {
    selected,
    count,
    isActive,
    isSelected,
    clear,
    toggle,
    selectRange,
    selectAll,
    selectedIds,
    handleClick,
  }
}
