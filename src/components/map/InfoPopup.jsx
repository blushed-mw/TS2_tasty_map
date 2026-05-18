import { CustomOverlayMap } from 'react-kakao-maps-sdk'
import { getCharacter } from '../../constants/characters'
import { walkingTimeFromTower } from '../../utils/distance'
import { SKT_TOWER } from '../../constants/locations'

/**
 * 마커 클릭 시 나타나는 말풍선 팝업
 */
export default function InfoPopup({ place, onClose, onOverlayClick }) {
  if (!place) return null

  const char = getCharacter(place.character_id)
  const walkText = walkingTimeFromTower(place.latitude, place.longitude, SKT_TOWER)
  const kakaoDirectionUrl = `https://map.kakao.com/link/to/${encodeURIComponent(place.place_name)},${place.latitude},${place.longitude}/from/${encodeURIComponent('SKT타워')},${SKT_TOWER.lat},${SKT_TOWER.lng}`

  return (
    <CustomOverlayMap
      position={{ lat: place.latitude, lng: place.longitude }}
      yAnchor={1.6}
    >
      <div className="relative w-64 bg-white rounded-2xl shadow-xl border border-pink-100 p-4" onClick={onOverlayClick}>
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-300 hover:text-gray-500 text-lg leading-none"
        >
          ×
        </button>

        {/* 헤더 */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center text-xl shrink-0"
            style={{ backgroundColor: char.color }}
          >
            {char.emoji}
          </span>
          <div>
            <p className="font-bold text-gray-800 text-sm leading-tight">{place.place_name}</p>
            <p className="text-xs text-gray-400">{place.pinned_by} 추천</p>
          </div>
        </div>

        {/* 한줄평 */}
        {place.review && (
          <p className="text-xs text-gray-600 bg-pink-50 rounded-xl px-3 py-2 mb-2 leading-relaxed max-h-24 overflow-y-auto">
            💬 {place.review}
          </p>
        )}

        {/* 도보 시간 */}
        <p className="text-xs text-pink-500 font-medium mb-3">🚶 {walkText}</p>

        {/* 길찾기 링크 */}
        <a
          href={kakaoDirectionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-xs bg-yellow-300 hover:bg-yellow-400 text-yellow-900 font-semibold rounded-xl py-1.5 transition-colors"
        >
          카카오맵에서 길찾기 →
        </a>

        {/* 말풍선 꼬리 */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 bg-white border-b border-r border-pink-100 rotate-45" />
      </div>
    </CustomOverlayMap>
  )
}
