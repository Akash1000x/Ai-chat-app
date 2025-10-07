import React from "react"
import { toast } from "sonner"

export const useClipboard = () => {
  const [copied, setCopied] = React.useState<boolean>(false)

  const handleCopy = React.useCallback((message: string) => {
    if (copied) return
    setCopied(true)
    navigator.clipboard.writeText(message)
    toast("Copied to Clipboard")
    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }, [])

  return { handleCopy, copied }
}