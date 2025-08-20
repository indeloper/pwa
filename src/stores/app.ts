import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const notifications = ref<Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    duration?: number
  }>>([])

  // Getters
  const getIsLoading = computed(() => isLoading.value)
  const getError = computed(() => error.value)
  const getNotifications = computed(() => notifications.value)

  // Actions
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
  }

  const addNotification = (notification: {
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    duration?: number
  }) => {
    const id = Date.now().toString()
    const newNotification = { id, ...notification }
    
    notifications.value.push(newNotification)

    // Auto remove notification after duration
    if (notification.duration !== undefined) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration)
    }
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    isLoading,
    error,
    notifications,
    
    // Getters
    getIsLoading,
    getError,
    getNotifications,
    
    // Actions
    setLoading,
    setError,
    addNotification,
    removeNotification,
    clearNotifications,
    clearError
  }
})
