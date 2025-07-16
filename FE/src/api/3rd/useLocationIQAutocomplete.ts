import { useEffect, useState } from "react"

export type LocationIQOption = {
  place_id: string
  display_name: string
}

export default function useLocationIQAutocomplete(query: string) {
  const [options, setOptions] = useState<LocationIQOption[]>([])
  
  useEffect(() => {
    const fetchData = async () => {
      if (!query || query.trim().length < 3) {
        setOptions([])
        return
      }
      try {
        const key = process.env.REACT_APP_LOCATIONIQ_KEY
        const res = await fetch(
          `https://api.locationiq.com/v1/autocomplete?key=${key}&q=${encodeURIComponent(query)}&countrycodes=vn`
        )
        const data = await res.json()
        if (Array.isArray(data)) {
          setOptions(data as LocationIQOption[])
        } else {
          setOptions([])
        }
      } catch (e) {
        setOptions([])
      }
    }
    fetchData()
  }, [query])

  return options
}
