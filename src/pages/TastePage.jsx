import { useState } from 'react'
import TasteCard from '../components/taste/TasteCard'
import TasteForm from '../components/taste/TasteForm'
import { useTastes } from '../hooks/useTastes'

export default function TastePage() {
  const { tastes, loading, upsertTaste } = useTastes()
  const [formState, setFormState] = useState(null) // null=닫힘, {}=신규, taste=수정

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-700">🍰 팀원 취향 보드</h1>
          <p className="text-xs text-gray-400 mt-0.5">팀원들의 음식 취향을 한눈에 확인하세요</p>
        </div>
        <button
          onClick={() => setFormState({})}
          className="px-4 py-2 bg-yellow-300 hover:bg-yellow-400 text-yellow-900 text-sm font-semibold rounded-xl shadow-sm transition-colors"
        >
          + 내 취향 등록
        </button>
      </div>

      {/* 카드 그리드 */}
      {loading ? (
        <p className="text-center text-gray-400 text-sm py-12">불러오는 중...</p>
      ) : tastes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🌸</p>
          <p className="text-sm">아직 등록된 취향이 없어요.</p>
          <p className="text-xs mt-1">첫 번째로 내 취향을 공유해 보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {tastes.map((taste, i) => (
            <TasteCard
              key={taste.id}
              taste={taste}
              index={i}
              onEdit={(t) => setFormState(t)}
            />
          ))}
        </div>
      )}

      {/* 취향 등록/수정 모달 */}
      {formState !== null && (
        <TasteForm
          initial={Object.keys(formState).length > 0 ? formState : null}
          onSubmit={upsertTaste}
          onClose={() => setFormState(null)}
        />
      )}
    </div>
  )
}
