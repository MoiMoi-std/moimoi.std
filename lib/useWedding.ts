import { useCallback, useEffect, useState } from 'react'
import { Wedding, dataService } from './data-service'

export const useWedding = () => {
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchWedding = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await dataService.getWedding()
      setWedding(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    const run = async () => {
      try {
        const data = await dataService.getWedding()
        if (!active) return
        setWedding(data)
      } catch (err) {
        if (!active) return
        setError(err as Error)
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => {
      active = false
    }
  }, [])

  return { wedding, setWedding, loading, error, refetch: fetchWedding }
}
