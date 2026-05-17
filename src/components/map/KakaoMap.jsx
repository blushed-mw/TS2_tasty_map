import { useState } from 'react'
import { Map, CustomOverlayMap, useKakaoLoader } from 'react-kakao-maps-sdk'
import { SKT_TOWER, MAP_DEFAULT_LEVEL } from '../../constants/locations'
import CharacterMarker from './CharacterMarker'
import InfoPopup from './InfoPopup'

/**
 * 카카오맵 컨테이너
 * places: usePlaces()에서 가져온 맛집 배열
 * onMapClick: 지도 클릭 시 좌표 전달 콜백
 */
export default function KakaoMap({ places, onMapClick }) {
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY,
    libraries: ['services'],
  })
  const [selectedPlace, setSelectedPlace] = useState(null)

  if (loading) return <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">지도 불러오는 중...</div>
  if (error) {
    console.error('[KakaoMap] 로드 실패:', error)
    return <div className="w-full h-full flex items-center justify-center text-red-400 text-sm">지도를 불러오지 못했어요 😢</div>
  }

  const handleMapClick = (_map, mouseEvent) => {
    const lat = mouseEvent.latLng.getLat()
    const lng = mouseEvent.latLng.getLng()
    setSelectedPlace(null)
    onMapClick({ lat, lng })
  }

  return (
    <Map
      center={{ lat: SKT_TOWER.lat, lng: SKT_TOWER.lng }}
      level={MAP_DEFAULT_LEVEL}
      className="w-full h-full"
      onClick={handleMapClick}
    >
      {/* SKT 타워 고정 마커 */}
      <CustomOverlayMap position={{ lat: SKT_TOWER.lat, lng: SKT_TOWER.lng }} yAnchor={1.3}>
        <div className="flex flex-col items-center">
          <div className="w-11 h-11 rounded-full bg-red-100 border-2 border-red-400 flex items-center justify-center text-xl shadow-md">
            🏢
          </div>
          <span className="mt-0.5 px-2 py-0.5 bg-red-400 rounded-full text-xs font-bold text-white shadow-sm">
            T타워
          </span>
          <div className="w-2 h-2 bg-red-400 rotate-45 -mt-1" />
        </div>
      </CustomOverlayMap>

      {/* 맛집 캐릭터 마커 */}
      {places.map((place) => (
        <CharacterMarker
          key={place.id}
          place={place}
          onClick={(p) => setSelectedPlace(p)}
        />
      ))}

      {/* 선택된 마커의 상세 팝업 */}
      {selectedPlace && (
        <InfoPopup
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}
    </Map>
  )
}
