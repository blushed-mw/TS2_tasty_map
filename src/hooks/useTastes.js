import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useTastes() {
  const [tastes, setTastes] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTastes = useCallback(async () => {
    const { data, error } = await supabase
      .from('member_tastes')
      .select('*')
      .order('member_name', { ascending: true })
    if (!error) setTastes(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTastes()

    const channel = supabase
      .channel('tastes-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'member_tastes' },
        fetchTastes,
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [fetchTastes])

  // 이름이 같으면 UPDATE, 없으면 INSERT (UPSERT)
  const upsertTaste = async (tasteData) => {
    const { error } = await supabase
      .from('member_tastes')
      .upsert([tasteData], { onConflict: 'member_name' })
    if (error) throw error
    await fetchTastes()
  }

  return { tastes, loading, upsertTaste, refetch: fetchTastes }
}
