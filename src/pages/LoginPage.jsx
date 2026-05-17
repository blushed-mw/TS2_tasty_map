import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === import.meta.env.VITE_TEAM_PASSWORD) {
      localStorage.setItem('auth_token', 'ok')
      navigate('/map')
    } else {
      setError('비밀번호가 틀렸어요 🙈 다시 시도해 주세요!')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-peach-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="text-5xl mb-3">🍜</div>
        <h1 className="text-xl font-bold text-gray-700 mb-1">비밀 맛집 지도</h1>
        <p className="text-sm text-gray-400 mb-6">팀원 전용 공간이에요 🔒</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
            placeholder="팀 비밀번호를 입력하세요"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-pink-400 text-white font-semibold text-sm hover:bg-pink-500 transition-colors"
          >
            입장하기 →
          </button>
        </form>
      </div>
    </div>
  )
}
