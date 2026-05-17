import { useState } from 'react'
import { TEAM_MEMBERS } from '../../constants/characters'

/**
 * 취향 등록/수정 모달
 * initial: 수정 시 기존 데이터 (없으면 신규 등록)
 */
export default function TasteForm({ initial, onSubmit, onClose }) {
  const [form, setForm] = useState({
    member_name: initial?.member_name ?? TEAM_MEMBERS[0].name,
    favorite_food: initial?.favorite_food ?? '',
    dislike_food: initial?.dislike_food ?? '',
    memo: initial?.memo ?? '',
  })
  const [submitting, setSubmitting] = useState(false)

  const isEdit = !!initial

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit({
        member_name: form.member_name,
        favorite_food: form.favorite_food.trim(),
        dislike_food: form.dislike_food.trim(),
        memo: form.memo.trim(),
        updated_at: new Date().toISOString(),
      })
      onClose()
    } catch (err) {
      alert('저장 중 오류가 발생했어요 😢')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 px-4 pb-4 sm:pb-0">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6">
        <h2 className="text-lg font-bold text-gray-700 mb-4">
          {isEdit ? '✏️ 취향 수정' : '🍰 내 취향 등록'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* 이름 */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">이름 *</label>
            {isEdit ? (
              <p className="px-3 py-2 bg-gray-50 rounded-xl text-sm text-gray-700 font-medium">
                {form.member_name}
              </p>
            ) : (
              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-200 bg-white"
                value={form.member_name}
                onChange={(e) => setForm((f) => ({ ...f, member_name: e.target.value }))}
              >
                {TEAM_MEMBERS.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 최애 음식 */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">😋 선호하는 음식 (최애)</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-200"
              placeholder="예: 파스타, 삼겹살, 초밥"
              value={form.favorite_food}
              onChange={(e) => setForm((f) => ({ ...f, favorite_food: e.target.value }))}
            />
          </div>

          {/* 불호 음식 */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">🙅 기피하는 음식 (불호)</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-200"
              placeholder="예: 고수, 내장류, 해산물"
              value={form.dislike_food}
              onChange={(e) => setForm((f) => ({ ...f, dislike_food: e.target.value }))}
            />
          </div>

          {/* 메모 */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">💬 한마디</label>
            <textarea
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-200 resize-none"
              placeholder="팀원들에게 전하고 싶은 말"
              value={form.memo}
              onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))}
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-yellow-300 text-yellow-900 text-sm font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-60"
            >
              {submitting ? '저장 중...' : '저장하기 💾'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
