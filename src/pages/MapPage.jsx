import { useState } from 'react'
import KakaoMap from '../components/map/KakaoMap'
import AddPinForm from '../components/map/AddPinForm'
import { usePlaces } from '../hooks/usePlaces'

export default function MapPage() {
  const { places, loading, addPlace } = usePlaces()
  const [pendingCoord, setPendingCoord] = useState(null)

  const handleMapClick = (coord) => {
    setPendingCoord(coord)
  }

  return (
    <div className="relative w-full h-full">
      {/* 지도 영역 */}
      {loading ? (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          지도를 불러오는 중...
        </div>
      ) : (
        <KakaoMap places={places} onMapClick={handleMapClick} />
      )}

      {/* 지도 클릭 시 핀 등록 폼 */}
      {pendingCoord && (
        <AddPinForm
          coord={pendingCoord}
          onSubmit={addPlace}
          onClose={() => setPendingCoord(null)}
        />
      )}

      {/* 하단 안내 툴팁 */}
      {!pendingCoord && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/80 backdrop-blur rounded-full shadow text-xs text-gray-500 pointer-events-none">
          지도를 클릭하면 맛집 핀을 등록할 수 있어요 📍
        </div>
      )}
    </div>
  )
}
