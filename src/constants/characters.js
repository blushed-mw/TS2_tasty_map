// 팀원 이름 → 캐릭터 이모지 & 색상 매핑
// 실제 이미지 파일이 있다면 imagePath 를 /characters/char_XX.png 로 교체하세요.
export const CHARACTERS = [
  { id: 'char_01', emoji: '🐰', color: '#fce4ec', label: '토끼' },
  { id: 'char_02', emoji: '🐻', color: '#fff9c4', label: '곰돌이' },
  { id: 'char_03', emoji: '🦊', color: '#ffe0b2', label: '여우' },
  { id: 'char_04', emoji: '🐸', color: '#e8f5e9', label: '개구리' },
  { id: 'char_05', emoji: '🐼', color: '#e3f2fd', label: '판다' },
  { id: 'char_06', emoji: '🐨', color: '#f3e5f5', label: '코알라' },
  { id: 'char_07', emoji: '🦁', color: '#fff3e0', label: '사자' },
  { id: 'char_08', emoji: '🐧', color: '#e0f7fa', label: '펭귄' },
  { id: 'char_09', emoji: '🐷', color: '#fbe9e7', label: '꿀꿀이' },
  { id: 'char_10', emoji: '🐱', color: '#efebe9', label: '고양이' },
  { id: 'char_11', emoji: '🐹', color: '#f1f8e9', label: '햄스터' }
]

// characterId 문자열로 캐릭터 객체 반환 (없으면 기본값)
export function getCharacter(characterId) {
  return CHARACTERS.find((c) => c.id === characterId) ?? CHARACTERS[0]
}

// 팀원 이름 목록 (AddPinForm 선택박스용) — 실제 팀원으로 수정하세요
export const TEAM_MEMBERS = [
  { name: '이승률', characterId: 'char_01' },
  { name: '강희정', characterId: 'char_02' },
  { name: '김정인', characterId: 'char_03' },
  { name: '노민정', characterId: 'char_04' },
  { name: '문지영', characterId: 'char_05' },
  { name: '박은혜', characterId: 'char_06' },
  { name: '이현지', characterId: 'char_07' },
  { name: '정희정', characterId: 'char_08' },
  { name: '최목원', characterId: 'char_09' },
  { name: '한현정', characterId: 'char_10' },
  { name: '황대웅', characterId: 'char_11' },
]

// 이름으로 characterId 찾기
export function getCharacterIdByName(name) {
  return TEAM_MEMBERS.find((m) => m.name === name)?.characterId ?? 'char_01'
}
