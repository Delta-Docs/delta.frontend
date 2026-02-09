import md5 from 'md5'

/**
 * Hook to fetch the current authenticated user
 * Note: The backend uses cookie-based authentication via get_current_user dependency.
 * User data is validated through protected endpoints like /dashboard/stats or /repos/
 * There is no separate /auth/me endpoint - auth is verified automatically via cookies.
 */
export function useCurrentUser() {
    // Return null as the backend doesn't have a /auth/me endpoint
    // Authentication is handled via cookies and validated on protected routes
    return {
        data: null,
        isLoading: false,
        error: null,
    }
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
