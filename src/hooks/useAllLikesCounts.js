import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

/**
 * 모든 맛집의 좋아요 수를 { [placeId]: count } 형태로 반환합니다.
 * place_likes 테이블 변경 시 실시간 갱신됩니다.
 */
export function useAllLikesCounts() {
  const [counts, setCounts] = useState({})

  const fetchCounts = useCallback(async () => {
    const { data } = await supabase.from('place_likes').select('place_id')
    if (!data) return
    const map = {}
    data.forEach(({ place_id }) => {
      map[place_id] = (map[place_id] ?? 0) + 1
    })
    setCounts(map)
  }, [])

  useEffect(() => {
    fetchCounts()

    const channel = supabase
      .channel('all-likes-counts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'place_likes' }, fetchCounts)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [fetchCounts])

  return counts
}
