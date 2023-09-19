'use client'
import { useEffect, useState } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api } from '@/lib/axios'

type Prompt = {
  id: string
  title: string
  template: string
}

type Props = {
  onPromptSelected: (template: string) => void
}

export function PromptSelect({ onPromptSelected }: Props) {
  const [prompts, setPrompts] = useState<Prompt[] | null>(null)

  useEffect(() => {
    api.get('/prompts').then((response) => setPrompts(response.data.prompts))
  }, [])

  function handlePromptSelected(promptId: string) {
    const selectedPrompt = prompts?.find((prompt) => prompt.id === promptId)

    if (!selectedPrompt) return

    onPromptSelected(selectedPrompt.template)
  }

  return (
    <Select onValueChange={handlePromptSelected}>
      <SelectTrigger>
        <SelectValue placeholder="Select a prompt..." />
      </SelectTrigger>

      <SelectContent>
        {prompts?.map((prompt) => (
          <SelectItem key={prompt.id} value={prompt.id}>
            {prompt.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
