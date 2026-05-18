import { useRef } from 'react'
import { Map, CustomOverlayMap, useKakaoLoader } from 'react-kakao-maps-sdk'
import { SKT_TOWER, MAP_DEFAULT_LEVEL } from '../../constants/locations'
import CharacterMarker from './CharacterMarker'

export default function KakaoMap({ places, onMapClick, center, selectedPlace, onSelectedPlaceChange }) {
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY,
    libraries: ['services'],
  })
  // CustomOverlayMap 내부 클릭이 지도 onClick으로 전파되는 것을 차단하기 위한 플래그
  const overlayClickedRef = useRef(false)

  if (loading) return <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">지도 불러오는 중...</div>
  if (error) {
    console.error('[KakaoMap] 로드 실패:', error)
    return <div className="w-full h-full flex items-center justify-center text-red-400 text-sm">지도를 불러오지 못했어요 😢</div>
  }

  const handleMapClick = (_map, mouseEvent) => {
    const lat = mouseEvent.latLng.getLat()
    const lng = mouseEvent.latLng.getLng()
    // Kakao SDK의 map click이 overlay DOM click보다 먼저 발생할 수 있으므로
    // setTimeout(0)으로 한 틱 뒤에 처리해 overlay click 핸들러가 먼저 실행되도록 함
    setTimeout(() => {
      if (overlayClickedRef.current) {
        overlayClickedRef.current = false
        return
      }
      onSelectedPlaceChange(null)
      onMapClick({ lat, lng })
    }, 0)
  }

  const handleMarkerClick = (p) => {
    overlayClickedRef.current = true
    onSelectedPlaceChange(p)
  }

  return (
    <Map
      center={center ?? { lat: SKT_TOWER.lat, lng: SKT_TOWER.lng }}
      level={MAP_DEFAULT_LEVEL}
      className="w-full h-full"
      onClick={handleMapClick}
    >
      {/* SKT 타워 고정 마커 */}
      <CustomOverlayMap position={{ lat: SKT_TOWER.lat, lng: SKT_TOWER.lng }} yAnchor={1}>
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
          isSelected={selectedPlace?.id === place.id}
          onClick={handleMarkerClick}
        />
      ))}
    </Map>
  )
}
