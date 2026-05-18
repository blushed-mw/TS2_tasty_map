import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/layout/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import MapPage from './pages/MapPage'
import TastePage from './pages/TastePage'

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div className="flex flex-col h-screen">
                <Navbar />
                <main className="flex-1 overflow-hidden">
                  <Navigate to="/map" replace />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <div className="flex flex-col h-screen">
                <Navbar />
                <main className="flex-1 overflow-hidden">
                  <MapPage />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/taste"
          element={
            <ProtectedRoute>
              <div className="flex flex-col h-screen">
                <Navbar />
                <main className="flex-1 overflow-auto">
                  <TastePage />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/map" replace />} />
      </Routes>
      </UserProvider>
    </BrowserRouter>
  )
}
