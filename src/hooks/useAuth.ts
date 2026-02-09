import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { queryClient } from '@/lib/queryClient'
import type { UserCreate, UserLogin, MessageResponse, LoginResponse } from '@/types/auth'
import { clearStoredUser, getStoredUser, setStoredUser } from '@/hooks/useUser'

export function useSignup() {
  return useMutation({
    mutationFn: async (data: UserCreate) => {
      const response = await api.post<MessageResponse>('/auth/signup', data)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data!
    },
  })
}

export function useLogin() {
  return useMutation({
    mutationFn: async (data: UserLogin) => {
      const response = await api.post<LoginResponse>('/auth/login', data)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data!
    },
    onSuccess: (data) => {
      setStoredUser({ email: data.email, name: data.name })
      queryClient.setQueryData(['currentUser'], getStoredUser())
    },
  })
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const response = await api.post<MessageResponse>('/auth/logout')
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data!
    },
    onSuccess: () => {
      clearStoredUser()
      queryClient.removeQueries({ queryKey: ['currentUser'] })
    },
  })
}
