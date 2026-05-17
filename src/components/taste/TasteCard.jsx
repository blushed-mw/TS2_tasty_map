import { getCharacterIdByName, getCharacter } from '../../constants/characters'

const CARD_COLORS = [
  'bg-pink-100',
  'bg-yellow-100',
  'bg-green-100',
  'bg-blue-100',
  'bg-purple-100',
  'bg-orange-100',
]

export default function TasteCard({ taste, index, onEdit }) {
  const char = getCharacter(getCharacterIdByName(taste.member_name))
  const cardColor = CARD_COLORS[index % CARD_COLORS.length]

  return (
    <div
      className={`relative ${cardColor} rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-default`}
    >
      {/* 수정 버튼 */}
      <button
        onClick={() => onEdit(taste)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-sm"
        title="수정"
      >
        ✏️
      </button>

      {/* 캐릭터 + 이름 */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="w-10 h-10 rounded-full flex items-center justify-center text-2xl border-2 border-white shadow-sm"
          style={{ backgroundColor: char.color }}
        >
          {char.emoji}
        </span>
        <span className="font-bold text-gray-700 text-sm">{taste.member_name}</span>
      </div>

      {/* 취향 내용 */}
      <div className="space-y-1.5 text-xs text-gray-600">
        {taste.favorite_food && (
          <div className="flex gap-1.5">
            <span className="shrink-0">😋 최애:</span>
            <span className="font-medium">{taste.favorite_food}</span>
          </div>
        )}
        {taste.dislike_food && (
          <div className="flex gap-1.5">
            <span className="shrink-0">🙅 불호:</span>
            <span className="font-medium">{taste.dislike_food}</span>
          </div>
        )}
        {taste.memo && (
          <div className="mt-2 pt-2 border-t border-white/60">
            <p className="text-gray-500 italic">💬 {taste.memo}</p>
          </div>
        )}
      </div>
    </div>
  )
}
