import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useAuthApi } from '../composables/useAuthApi'
import type { LoginResponse } from '../types/auth'
import User from '../models/User'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)

  const getUser = computed<User | null>(() => user.value || null)
  const getToken = computed(() => null)
  const getIsAuthenticated = computed(() => isAuthenticated.value)

  const setUser = (userData: User | null) => {
    user.value = userData
    isAuthenticated.value = !!userData
  }

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    const { login: authLogin } = useAuth()
    const response = await authLogin(email, password)
    
    isAuthenticated.value = true
    
    return response
  }

  const logout = async (): Promise<void> => {
    const { logout: authLogout } = useAuth()
    await authLogout()
    
    setUser(null)
    isAuthenticated.value = false
  }

  const initializeAuth = async (): Promise<void> => {
    try {
      const authApi = useAuthApi()
      await authApi.get('/sanctum/csrf-cookie')

      const { getUser: fetchUser } = useAuth()
      const userData = await fetchUser()
      setUser(userData)
      isAuthenticated.value = true
    } catch (error) {
      setUser(null)
      isAuthenticated.value = false
    }
  }

  return {
    user,
    isAuthenticated,
    
    getUser,
    getToken,
    getIsAuthenticated,
    
    setUser,
    login,
    logout,
    initializeAuth
  }
})
