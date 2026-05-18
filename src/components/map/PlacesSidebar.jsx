import { useState } from 'react'
import { getCharacter } from '../../constants/characters'
import { haversineKm } from '../../utils/distance'
import { SKT_TOWER } from '../../constants/locations'
import { useAllLikesCounts } from '../../hooks/useAllLikesCounts'

const SORT_OPTIONS = [
  { key: 'likes',    label: '❤️ 좋아요순' },
  { key: 'distance', label: '🚶 가까운순' },
  { key: 'newest',   label: '🆕 최신순'   },
  { key: 'oldest',   label: '🕰️ 오래된순' },
]

function PlaceItem({ place, onDelete, onPlaceClick }) {
  const char = getCharacter(place.character_id)

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!window.confirm(`"${place.place_name}"을(를) 삭제할까요?`)) return
    try {
      await onDelete(place.id)
    } catch {
      alert('삭제 중 오류가 발생했어요.')
    }
  }

  return (
    <div
      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-amber-50 cursor-pointer group transition-colors"
      onClick={() => onPlaceClick?.(place)}
    >
      <span
        className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0"
        style={{ backgroundColor: char.color }}
      >
        {char.emoji}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate leading-tight">{place.place_name}</p>
        <p className="text-xs text-gray-400 leading-tight">{place.pinned_by} 추천</p>
      </div>
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-400 rounded-full hover:bg-red-50 transition-all shrink-0 text-xs"
        title="삭제"
      >
        ✕
      </button>
    </div>
  )
}

export default function PlacesSidebar({ places, onDelete, onPlaceClick }) {
  const [isOpen, setIsOpen] = useState(true)
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const likesCounts = useAllLikesCounts()

  const filtered = places.filter((p) =>
    p.place_name.toLowerCase().includes(query.toLowerCase()) ||
    p.pinned_by.toLowerCase().includes(query.toLowerCase())
  )

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'likes') {
      return (likesCounts[b.id] ?? 0) - (likesCounts[a.id] ?? 0)
    }
    if (sortBy === 'distance') {
      const da = haversineKm(SKT_TOWER.lat, SKT_TOWER.lng, a.latitude, a.longitude)
      const db = haversineKm(SKT_TOWER.lat, SKT_TOWER.lng, b.latitude, b.longitude)
      return da - db
    }
    if (sortBy === 'oldest') {
      return new Date(a.created_at) - new Date(b.created_at)
    }
    // newest (default)
    return new Date(b.created_at) - new Date(a.created_at)
  })

  return (
    <div className="absolute left-0 top-0 h-full z-10 flex pointer-events-none">
      {/* Sliding panel */}
      <div
        className={`h-full bg-white/95 backdrop-blur shadow-xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out pointer-events-auto ${
          isOpen ? 'w-72' : 'w-0'
        }`}
      >
        {/* 검색 헤더 */}
        <div className="p-4 pb-3 shrink-0">
          <p className="text-xs font-bold text-gray-400 tracking-wider mb-3">📍 맛집 리스트</p>
          <input
            type="text"
            placeholder="리스트 내 맛집 검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
          />
          {/* 정렬 버튼 */}
          <div className="grid grid-cols-2 gap-1.5 mt-2.5">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={`py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  sortBy === opt.key
                    ? 'bg-pink-300 text-white'
                    : 'bg-gray-50 text-gray-500 hover:bg-pink-50 hover:text-pink-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-4 border-t border-gray-100 shrink-0" />

        {/* 맛집 목록 */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {sorted.length === 0 ? (
            <p className="text-center text-xs text-gray-400 py-8">
              {query ? '검색 결과가 없어요' : '등록된 맛집이 없어요'}
            </p>
          ) : (
            sorted.map((place) => (
              <PlaceItem
                key={place.id}
                place={place}
                onDelete={onDelete}
                onPlaceClick={onPlaceClick}
              />
            ))
          )}
        </div>

        {/* 하단 카운트 */}
        <div className="px-4 py-2.5 border-t border-gray-100 shrink-0">
          <p className="text-xs text-gray-400">총 {sorted.length}개</p>
        </div>
      </div>

      {/* 접기/펼치기 탭 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="self-start mt-4 w-7 h-12 bg-white rounded-r-xl shadow-md flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors shrink-0 pointer-events-auto"
      >
        <span className="text-xs leading-none">{isOpen ? '◀' : '▶'}</span>
      </button>
    </div>
  )
}
