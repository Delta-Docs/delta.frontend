import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { User } from '@/types/auth'
import md5 from 'md5'

/**
 * Hook to fetch the current authenticated user
 * Uses /auth/me endpoint to get user info
 */
export function useCurrentUser() {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const response = await api.get<User>('/auth/me')
            if (response.error) {
                return null
            }
            return response.data!
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: false,
    })
}

/**
 * Generate a Gravatar URL from an email or string identifier
 * @param identifier - Email address or any string to hash
 * @param size - Image size in pixels (default: 80)
 * @returns Gravatar URL
 */
export function getGravatarUrl(identifier: string, size: number = 80): string {
    // If it looks like an email, use it directly; otherwise, create a fake email
    const email = identifier.includes('@')
        ? identifier.toLowerCase().trim()
        : `${identifier.toLowerCase().trim()}@placeholder.com`

    const hash = md5(email)
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`
}
