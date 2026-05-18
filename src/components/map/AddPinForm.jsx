import { useState, useEffect, useRef } from 'react'
import { TEAM_MEMBERS, getCharacterIdByName } from '../../constants/characters'
import { useCurrentUser } from '../../context/UserContext'

const SKIP_TAGS = new Set(['음식점', '음식'])

function parseKakaoCategory(categoryName) {
  if (!categoryName) return []
  return categoryName
    .split('>')
    .map((s) => s.trim())
    .filter((s) => s && !SKIP_TAGS.has(s))
}

export default function AddPinForm({ coord, onSubmit, onClose, onPlaceSelect }) {
  const { currentUser } = useCurrentUser()
  const [form, setForm] = useState({
    place_name: '',
    review: '',
    pinned_by: currentUser || TEAM_MEMBERS[0].name,
  })
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedCoord, setSelectedCoord] = useState(coord)
  const [selectedAddress, setSelectedAddress] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const psRef = useRef(null)

  useEffect(() => {
    if (window.kakao?.maps?.services) {
      psRef.current = new window.kakao.maps.services.Places()
    }
  }, [])

  const handleSearch = () => {
    if (!searchQuery.trim() || !psRef.current) return
    psRef.current.keywordSearch(searchQuery, (results, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setSearchResults(results.slice(0, 5))
      }
    })
  }

  const handleSelectResult = (result) => {
    const newCoord = { lat: parseFloat(result.y), lng: parseFloat(result.x) }
    setSelectedCoord(newCoord)
    setSelectedAddress(result.road_address_name || result.address_name)
    setForm((f) => ({ ...f, place_name: result.place_name }))
    setTags(parseKakaoCategory(result.category_name))
    setSearchResults([])
    setSearchQuery('')
    onPlaceSelect?.(newCoord)
  }

  const addTag = (raw) => {
    const cleaned = raw.trim().replace(/^#/, '')
    if (!cleaned || tags.includes(cleaned)) return
    setTags((prev) => [...prev, cleaned])
  }

  const removeTag = (tag) => setTags((prev) => prev.filter((t) => t !== tag))

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(tagInput)
      setTagInput('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.place_name.trim()) return
    setSubmitting(true)
    try {
      await onSubmit({
        place_name: form.place_name.trim(),
        address: selectedAddress,
        latitude: selectedCoord.lat,
        longitude: selectedCoord.lng,
        pinned_by: form.pinned_by,
        character_id: getCharacterIdByName(form.pinned_by),
        review: form.review.trim(),
        tags,
      })
      onClose()
    } catch (err) {
      alert('저장 중 오류가 발생했어요 😢')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 px-4 pb-4 sm:pb-0">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6">
        <h2 className="text-lg font-bold text-gray-700 mb-4">📍 맛집 핀 등록</h2>

        {/* 장소 검색 */}
        <div className="mb-3">
          <label className="text-xs text-gray-500 mb-1 block">장소 검색</label>
          <div className="flex gap-2">
            <input
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
              placeholder="장소명 또는 주소 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
            />
            <button
              type="button"
              onClick={handleSearch}
              className="px-3 py-2 bg-pink-100 text-pink-600 rounded-xl text-sm font-medium hover:bg-pink-200 transition-colors"
            >
              검색
            </button>
          </div>

          {/* 검색 결과 */}
          {searchResults.length > 0 && (
            <ul className="mt-1 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              {searchResults.map((r) => (
                <li
                  key={r.id}
                  className="px-3 py-2 text-sm hover:bg-pink-50 cursor-pointer border-b border-gray-50 last:border-0"
                  onClick={() => handleSelectResult(r)}
                >
                  <p className="font-medium text-gray-700">{r.place_name}</p>
                  <p className="text-xs text-gray-400">{r.road_address_name || r.address_name}</p>
                  {r.category_name && (
                    <p className="text-xs text-pink-400 mt-0.5">{r.category_name}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* 가게 이름 */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">가게 이름 *</label>
            <input
              required
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
              placeholder="직접 입력하거나 검색으로 자동입력"
              value={form.place_name}
              onChange={(e) => setForm((f) => ({ ...f, place_name: e.target.value }))}
            />
          </div>

          {/* 태그 */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">태그 (검색 시 자동 입력, 직접 추가 가능)</label>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-pink-50 text-pink-500 rounded-full text-xs font-medium"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-pink-300 hover:text-pink-500 leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                placeholder="예: 혼밥, 데이트, 뷰맛집 — Enter로 추가"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
              <button
                type="button"
                onClick={() => { addTag(tagInput); setTagInput('') }}
                className="px-3 py-2 bg-pink-100 text-pink-600 rounded-xl text-sm font-medium hover:bg-pink-200 transition-colors"
              >
                추가
              </button>
            </div>
          </div>

          {/* 등록자 */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">핀 등록자</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 bg-white"
              value={form.pinned_by}
              onChange={(e) => setForm((f) => ({ ...f, pinned_by: e.target.value }))}
            >
              {TEAM_MEMBERS.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* 한줄평 */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">한줄평</label>
            <textarea
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 resize-none"
              placeholder="맛, 분위기, 추천 메뉴 등 자유롭게 적어주세요"
              value={form.review}
              onChange={(e) => setForm((f) => ({ ...f, review: e.target.value }))}
            />
          </div>

          {/* 좌표 표시 */}
          <p className="text-xs text-gray-400">
            📌 위치: {selectedCoord.lat.toFixed(5)}, {selectedCoord.lng.toFixed(5)}
            {selectedAddress && ` (${selectedAddress})`}
          </p>

          {/* 버튼 */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-pink-400 text-white text-sm font-semibold hover:bg-pink-500 transition-colors disabled:opacity-60"
            >
              {submitting ? '저장 중...' : '핀 꽂기 🎯'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
