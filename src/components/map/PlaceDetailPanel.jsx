import { useState, useRef } from 'react'
import { getCharacter } from '../../constants/characters'
import { walkingTimeFromTower } from '../../utils/distance'
import { SKT_TOWER } from '../../constants/locations'
import { usePlaceDetail } from '../../hooks/usePlaceDetail'

export default function PlaceDetailPanel({ place, currentUser, onClose }) {
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const commentsEndRef = useRef(null)

  const { likes, comments, toggleLike, addComment, deleteComment } = usePlaceDetail(place?.id)

  if (!place) return null

  const char = getCharacter(place.character_id)
  const walkText = walkingTimeFromTower(place.latitude, place.longitude, SKT_TOWER)
  const kakaoUrl = `https://map.kakao.com/link/to/${encodeURIComponent(place.place_name)},${place.latitude},${place.longitude}/from/${encodeURIComponent('SKT타워')},${SKT_TOWER.lat},${SKT_TOWER.lng}`
  const myLike = likes.find((l) => l.member_name === currentUser)

  const handleToggleLike = async () => {
    if (!currentUser) return
    try {
      await toggleLike(currentUser)
    } catch {
      alert('오류가 발생했어요 😢')
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim() || !currentUser || submitting) return
    setSubmitting(true)
    try {
      await addComment(currentUser, commentText)
      setCommentText('')
      setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch {
      alert('댓글 저장 중 오류가 발생했어요 😢')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl z-20 flex flex-col border-l border-pink-100">
      {/* 헤더 */}
      <div className="flex items-start gap-3 p-4 border-b border-pink-50 shrink-0">
        <span
          className="w-11 h-11 rounded-full flex items-center justify-center text-2xl shrink-0"
          style={{ backgroundColor: char.color }}
        >
          {char.emoji}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 text-sm leading-snug">{place.place_name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{place.pinned_by} 추천</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-gray-500 text-xl leading-none shrink-0 pt-0.5"
        >
          ×
        </button>
      </div>

      {/* 스크롤 본문 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {/* 태그 */}
        {place.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {place.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-pink-50 text-pink-400 rounded-full text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 한줄평 */}
        {place.review && (
          <p className="text-xs text-gray-600 bg-pink-50 rounded-xl px-3 py-2 leading-relaxed">
            💬 {place.review}
          </p>
        )}

        {/* 도보 시간 + 길찾기 */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-pink-500 font-medium">🚶 {walkText}</p>
          <a
            href={kakaoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-yellow-300 hover:bg-yellow-400 text-yellow-900 font-semibold rounded-xl px-3 py-1.5 transition-colors"
          >
            길찾기 →
          </a>
        </div>

        <div className="border-t border-pink-50" />

        {/* 좋아요 */}
        <div className="space-y-1.5">
          <button
            onClick={handleToggleLike}
            disabled={!currentUser}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              myLike
                ? 'bg-pink-400 text-white shadow-sm'
                : 'bg-pink-50 text-pink-400 hover:bg-pink-100'
            } ${!currentUser ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            {myLike ? '❤️' : '🤍'} 좋아요 {likes.length}
          </button>
          {likes.length > 0 && (
            <p className="text-xs text-gray-400 pl-1">
              {likes.map((l) => l.member_name).join(' · ')}
            </p>
          )}
          {!currentUser && (
            <p className="text-xs text-gray-400 pl-1">상단에서 이름을 선택하면 좋아요를 누를 수 있어요</p>
          )}
        </div>

        <div className="border-t border-pink-50" />

        {/* 댓글 */}
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">댓글 {comments.length}</p>
          {comments.length === 0 ? (
            <p className="text-xs text-gray-300 text-center py-4">아직 댓글이 없어요 🌸</p>
          ) : (
            <ul className="space-y-3">
              {comments.map((c) => (
                <li key={c.id} className="flex items-start gap-2 group">
                  <span className="text-xs font-semibold text-pink-400 shrink-0 mt-0.5 w-14 truncate">
                    {c.member_name}
                  </span>
                  <p className="text-xs text-gray-600 flex-1 leading-relaxed break-words">{c.content}</p>
                  {c.member_name === currentUser && (
                    <button
                      onClick={() => deleteComment(c.id)}
                      className="text-gray-200 hover:text-red-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5"
                      title="삭제"
                    >
                      ✕
                    </button>
                  )}
                </li>
              ))}
              <div ref={commentsEndRef} />
            </ul>
          )}
        </div>
      </div>

      {/* 댓글 입력 (하단 고정) */}
      <div className="p-3 border-t border-pink-50 bg-white shrink-0">
        {currentUser ? (
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-pink-200"
              placeholder={`${currentUser}(으)로 댓글 달기...`}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              maxLength={200}
            />
            <button
              type="submit"
              disabled={!commentText.trim() || submitting}
              className="px-3 py-2 bg-pink-400 text-white rounded-xl text-xs font-semibold hover:bg-pink-500 transition-colors disabled:opacity-40 shrink-0"
            >
              등록
            </button>
          </form>
        ) : (
          <p className="text-xs text-center text-gray-400 py-1">
            상단에서 이름을 선택하면 댓글을 달 수 있어요
          </p>
        )}
      </div>
    </div>
  )
}
