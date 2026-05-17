import { NavLink, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    navigate('/login')
  }

  const baseClass =
    'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200'
  const activeClass = 'bg-pink-300 text-white shadow-sm'
  const inactiveClass = 'text-pink-400 hover:bg-pink-100'

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 h-14 bg-white/90 backdrop-blur border-b border-pink-100 shadow-sm">
      <span className="text-base font-bold text-pink-400 tracking-tight">🍜 비밀 맛집 지도</span>

      <div className="flex gap-2">
        <NavLink
          to="/map"
          className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}
        >
          📍 맛집 지도
        </NavLink>
        <NavLink
          to="/taste"
          className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}
        >
          🍰 팀원 취향 보드
        </NavLink>
      </div>

      <button
        onClick={handleLogout}
        className="text-xs text-gray-400 hover:text-pink-400 transition-colors"
      >
        나가기
      </button>
    </nav>
  )
}
