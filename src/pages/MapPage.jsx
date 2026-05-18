import { useState } from 'react'
import KakaoMap from '../components/map/KakaoMap'
import AddPinForm from '../components/map/AddPinForm'
import PlacesSidebar from '../components/map/PlacesSidebar'
import PlaceDetailPanel from '../components/map/PlaceDetailPanel'
import { usePlaces } from '../hooks/usePlaces'
import { useCurrentUser } from '../context/UserContext'
import { SKT_TOWER } from '../constants/locations'

export default function MapPage() {
  const { places, loading, addPlace, deletePlace } = usePlaces()
  const { currentUser } = useCurrentUser()
  const [pendingCoord, setPendingCoord] = useState(null)
  const [mapCenter, setMapCenter] = useState({ lat: SKT_TOWER.lat, lng: SKT_TOWER.lng })
  const [selectedPlace, setSelectedPlace] = useState(null)

  const handleMapClick = (coord) => {
    setSelectedPlace(null)
    setPendingCoord(coord)
  }

  const handlePlaceSelect = (coord) => {
    setMapCenter(coord)
    setPendingCoord(coord)
  }

  const handleSidebarPlaceClick = (place) => {
    setMapCenter({ lat: place.latitude, lng: place.longitude })
    setSelectedPlace(place)
  }

  return (
    <div className="relative w-full h-full">
      {/* 지도 영역 */}
      {loading ? (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          지도를 불러오는 중...
        </div>
      ) : (
        <KakaoMap places={places} onMapClick={handleMapClick} center={mapCenter} selectedPlace={selectedPlace} onSelectedPlaceChange={setSelectedPlace} />
      )}

      {/* 맛집 리스트 사이드바 */}
      {!loading && (
        <PlacesSidebar
          places={places}
          onDelete={deletePlace}
          onPlaceClick={handleSidebarPlaceClick}
        />
      )}

      {/* 맛집 상세 패널 (좋아요/댓글) */}
      {selectedPlace && !pendingCoord && (
        <PlaceDetailPanel
          place={selectedPlace}
          currentUser={currentUser}
          onClose={() => setSelectedPlace(null)}
        />
      )}

      {/* 맛집 등록 버튼: 패널이 열려 있으면 숨김 */}
      {!pendingCoord && !selectedPlace && (
        <button
          onClick={() => setPendingCoord(mapCenter)}
          className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-4 py-2 bg-white rounded-full shadow-md text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          🔍 새로운 맛집 등록
        </button>
      )}

      {/* 핀 등록 폼 */}
      {pendingCoord && (
        <AddPinForm
          coord={pendingCoord}
          onSubmit={addPlace}
          onClose={() => setPendingCoord(null)}
          onPlaceSelect={handlePlaceSelect}
        />
      )}

      {/* 하단 안내 툴팁 */}
      {!pendingCoord && !selectedPlace && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/80 backdrop-blur rounded-full shadow text-xs text-gray-500 pointer-events-none">
          지도를 클릭하거나 검색으로 맛집 핀을 등록하세요 📍
        </div>
      )}
    </div>
  )
}
