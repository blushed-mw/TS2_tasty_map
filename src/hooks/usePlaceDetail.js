import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

export function usePlaceDetail(placeId) {
  const [likes, setLikes] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchDetail = useCallback(async () => {
    if (!placeId) return
    setLoading(true)
    const [{ data: likesData }, { data: commentsData }] = await Promise.all([
      supabase.from('place_likes').select('*').eq('place_id', placeId).order('created_at'),
      supabase.from('place_comments').select('*').eq('place_id', placeId).order('created_at'),
    ])
    setLikes(likesData ?? [])
    setComments(commentsData ?? [])
    setLoading(false)
  }, [placeId])

  useEffect(() => {
    fetchDetail()
    if (!placeId) return

    const channel = supabase
      .channel(`place-detail-${placeId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'place_likes' }, fetchDetail)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'place_comments' }, fetchDetail)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [placeId, fetchDetail])

  const toggleLike = async (memberName) => {
    const existing = likes.find((l) => l.member_name === memberName)
    if (existing) {
      // 즉시 제거
      setLikes((prev) => prev.filter((l) => l.id !== existing.id))
      const { error } = await supabase.from('place_likes').delete().eq('id', existing.id)
      if (error) {
        setLikes((prev) => [...prev, existing])
        throw error
      }
    } else {
      // 즉시 추가 (임시 id)
      const temp = { id: `temp-${Date.now()}`, place_id: placeId, member_name: memberName, created_at: new Date().toISOString() }
      setLikes((prev) => [...prev, temp])
      const { data, error } = await supabase
        .from('place_likes')
        .insert({ place_id: placeId, member_name: memberName })
        .select()
        .single()
      if (error) {
        setLikes((prev) => prev.filter((l) => l.id !== temp.id))
        throw error
      }
      // 임시 id를 실제 DB id로 교체
      setLikes((prev) => prev.map((l) => (l.id === temp.id ? data : l)))
    }
  }

  const addComment = async (memberName, content) => {
    const temp = {
      id: `temp-${Date.now()}`,
      place_id: placeId,
      member_name: memberName,
      content: content.trim(),
      created_at: new Date().toISOString(),
    }
    // 즉시 추가
    setComments((prev) => [...prev, temp])
    const { data, error } = await supabase
      .from('place_comments')
      .insert({ place_id: placeId, member_name: memberName, content: content.trim() })
      .select()
      .single()
    if (error) {
      setComments((prev) => prev.filter((c) => c.id !== temp.id))
      throw error
    }
    // 임시 id를 실제 DB id로 교체
    setComments((prev) => prev.map((c) => (c.id === temp.id ? data : c)))
  }

  const deleteComment = async (commentId) => {
    const backup = comments.find((c) => c.id === commentId)
    // 즉시 제거
    setComments((prev) => prev.filter((c) => c.id !== commentId))
    const { error } = await supabase.from('place_comments').delete().eq('id', commentId)
    if (error) {
      if (backup) setComments((prev) => [...prev, backup].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)))
      throw error
    }
  }

  return { likes, comments, loading, toggleLike, addComment, deleteComment }
}
