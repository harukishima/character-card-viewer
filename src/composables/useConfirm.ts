import { ref, readonly } from 'vue'

export interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}

const visible = ref(false)
const options = ref<ConfirmOptions>({
  title: '',
  message: '',
})

let resolveFn: ((value: boolean) => void) | null = null

function showConfirm(opts: ConfirmOptions): Promise<boolean> {
  options.value = opts
  visible.value = true
  return new Promise<boolean>((resolve) => {
    resolveFn = resolve
  })
}

function handleConfirm() {
  visible.value = false
  resolveFn?.(true)
  resolveFn = null
}

function handleCancel() {
  visible.value = false
  resolveFn?.(false)
  resolveFn = null
}

export function useConfirm() {
  return {
    visible: readonly(visible),
    options: readonly(options),
    confirm: showConfirm,
    handleConfirm,
    handleCancel,
  }
}
