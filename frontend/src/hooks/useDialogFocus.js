import { useEffect, useRef } from 'react'

export default function useDialogFocus(open, onClose) {
  const dialogRef = useRef(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return undefined
    const previous = document.activeElement
    const dialog = dialogRef.current
    const focusable = () => [...dialog.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [href], [tabindex]:not([tabindex="-1"])')]
    focusable()[0]?.focus()

    const handleKey = (event) => {
      const dialogs = [...document.querySelectorAll('[role="dialog"], [role="alertdialog"]')]
      if (dialogs.at(-1) !== dialog) return
      if (event.key === 'Escape') onCloseRef.current()
      if (event.key !== 'Tab') return
      const elements = focusable()
      if (!elements.length) return
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }

    document.addEventListener('keydown', handleKey)
    return () => { document.removeEventListener('keydown', handleKey); previous?.focus?.() }
  }, [open])

  return dialogRef
}
