import { useFocusManager } from "ink"
import ollama from "ollama"
import { useEffect, useState } from "react"

export default function useOllamaDelete() {
  const [isDeleting, setIsDeleting] = useState(false)
  const { disableFocus, enableFocus } = useFocusManager()

  useEffect(() => {
    if (isDeleting) {
      disableFocus()
    } else {
      enableFocus()
    }
  }, [isDeleting])

  const deleteModel = async (model: string) => {
    setIsDeleting(true)
    await ollama.delete({ model })
    setIsDeleting(false)
  }

  return { isDeleting, deleteModel }
}
