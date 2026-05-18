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
      const { error } = await supabase.from('place_likes').delete().eq('id', existing.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('place_likes').insert({ place_id: placeId, member_name: memberName })
      if (error) throw error
    }
  }

  const addComment = async (memberName, content) => {
    const { error } = await supabase.from('place_comments').insert({
      place_id: placeId,
      member_name: memberName,
      content: content.trim(),
    })
    if (error) throw error
  }

  const deleteComment = async (commentId) => {
    const { error } = await supabase.from('place_comments').delete().eq('id', commentId)
    if (error) throw error
  }

  return { likes, comments, loading, toggleLike, addComment, deleteComment }
}
