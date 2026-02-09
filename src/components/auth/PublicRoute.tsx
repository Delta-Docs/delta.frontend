import { Navigate } from 'react-router-dom'
import { useDashboardStats } from '@/hooks/useDashboard'

interface PublicRouteProps {
    children: React.ReactNode
    redirectIfAuthenticated?: boolean
}

/**
 * PublicRoute - For pages that should redirect authenticated users away
 * Example: Login and Signup pages should redirect to dashboard if already logged in
 */
export function PublicRoute({ children, redirectIfAuthenticated = false }: PublicRouteProps) {
    const { data, isLoading } = useDashboardStats()

    // If we're checking for authentication and the user is authenticated, redirect to dashboard
    if (redirectIfAuthenticated && !isLoading && data) {
        return <Navigate to="/dashboard" replace />
    }

    return <>{children}</>
}
