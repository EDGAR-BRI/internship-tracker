import { ref, computed } from 'vue'

interface User {
  id: number
  fullName: string | null
  email: string
}

const user = ref<User | null>(null)
const token = ref<string | null>(null)

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value)

  function setAuth(userData: User, authToken: string) {
    user.value = userData
    token.value = authToken
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', authToken)
      localStorage.setItem('auth_user', JSON.stringify(userData))
    }
  }

  function loadFromStorage() {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('auth_token')
      const savedUser = localStorage.getItem('auth_user')
      if (savedToken && savedUser) {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
      }
    }
  }

  function logout() {
    user.value = null
    token.value = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    setAuth,
    loadFromStorage,
    logout,
  }
}
