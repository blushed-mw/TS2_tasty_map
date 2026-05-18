import { createContext, useContext, useState } from 'react'

const UserContext = createContext(null)
const STORAGE_KEY = 'current_member'

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? ''
  )

  const selectUser = (name) => {
    localStorage.setItem(STORAGE_KEY, name)
    setCurrentUser(name)
  }

  return (
    <UserContext.Provider value={{ currentUser, selectUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useCurrentUser() {
  return useContext(UserContext)
}
