import { createContext, useContext, useEffect, useState } from 'react'

export type ViewportMode = 'phone' | 'laptop' | 'auto'

export const TemplateViewportContext = createContext<ViewportMode>('auto')

export function useTemplateViewport(): 'phone' | 'laptop' {
  const mode = useContext(TemplateViewportContext)
  // Always call hooks unconditionally (rules of hooks)
  const [autoVp, setAutoVp] = useState<'phone' | 'laptop'>('laptop')

  useEffect(() => {
    if (mode === 'auto') {
      setAutoVp(window.innerWidth < 768 ? 'phone' : 'laptop')
    }
  }, [mode])

  if (mode !== 'auto') return mode
  return autoVp
}
