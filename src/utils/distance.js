const EARTH_RADIUS_KM = 6371

/**
 * Haversine 공식으로 두 위경도 사이의 직선 거리(km)를 계산합니다.
 */
export function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return EARTH_RADIUS_KM * 2 * Math.asin(Math.sqrt(a))
}

/**
 * 거리(km)를 성인 평균 도보 속도(분당 70m) 기준 분(minute)으로 변환합니다.
 */
export function walkingMinutes(km) {
  return Math.ceil((km * 1000) / 70)
}

/**
 * SKT 타워 기준 도보 소요 시간 텍스트를 반환합니다.
 * @param {number} lat - 맛집 위도
 * @param {number} lon - 맛집 경도
 * @param {{ lat: number, lng: number }} origin - 기준점 (SKT_TOWER)
 */
export function walkingTimeFromTower(lat, lon, origin) {
  const km = haversineKm(origin.lat, origin.lng, lat, lon)
  const minutes = walkingMinutes(km)
  return `T타워에서 도보 약 ${minutes}분`
}
