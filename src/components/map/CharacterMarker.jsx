import { CustomOverlayMap } from 'react-kakao-maps-sdk'
import { getCharacter } from '../../constants/characters'

/**
 * 캐릭터 이모지 + 이름 라벨 오버레이 마커
 * place: { id, place_name, latitude, longitude, pinned_by, character_id, review }
 */
export default function CharacterMarker({ place, onClick }) {
  const char = getCharacter(place.character_id)

  return (
    <CustomOverlayMap
      position={{ lat: place.latitude, lng: place.longitude }}
      yAnchor={1}
    >
      <div
        className="flex flex-col items-center cursor-pointer select-none group"
        onClick={() => onClick(place)}
      >
        {/* 캐릭터 버블 */}
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-2xl shadow-md border-2 border-white group-hover:scale-110 transition-transform"
          style={{ backgroundColor: char.color }}
        >
          {char.emoji}
        </div>
        {/* 이름 라벨 */}
        <span className="mt-0.5 px-2 py-0.5 bg-white/90 rounded-full text-xs font-medium text-gray-600 shadow-sm whitespace-nowrap border border-gray-100">
          {place.pinned_by}
        </span>
        {/* 말풍선 꼬리 */}
        <div className="w-2 h-2 bg-white border-b border-r border-gray-100 rotate-45 -mt-1 shadow-sm" />
      </div>
    </CustomOverlayMap>
  )
}
