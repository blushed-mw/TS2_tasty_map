import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

export function usePlaces() {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPlaces = useCallback(async () => {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setPlaces(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPlaces()

    // Realtime 구독: INSERT / UPDATE / DELETE 발생 시 즉시 반영
    const channel = supabase
      .channel('places-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'places' }, fetchPlaces)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [fetchPlaces])

  const addPlace = async (placeData) => {
    const { data, error } = await supabase.from('places').insert([placeData]).select().single()
    if (error) throw error
    setPlaces((prev) => [data, ...prev])
  }

  const deletePlace = async (id) => {
    const { error } = await supabase.from('places').delete().eq('id', id)
    if (error) throw error
    setPlaces((prev) => prev.filter((p) => p.id !== id))
  }

  return { places, loading, addPlace, deletePlace, refetch: fetchPlaces }
}
