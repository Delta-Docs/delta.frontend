import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { UserCreate, UserLogin, MessageResponse } from '@/types/auth'

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
      const response = await api.post<MessageResponse>('/auth/login', data)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data!
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
  })
}
