import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { House } from '@phosphor-icons/react'
import { api } from '@/lib/api'
import { Button } from '@/components/shadcn/button'

export default function GithubCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')
  const installationId = searchParams.get('installation_id')

  const [error, setError] = useState<string | null>(
    !code ? 'Something went wrong with the GitHub authorization.' : null
  )
  const hasFired = useRef(false)

  useEffect(() => {
    if (!code || hasFired.current) return
    hasFired.current = true

    const handleCallback = async () => {
      const { error: apiError } = await api.post('/auth/github/callback', {
        code,
        ...(installationId && { installation_id: installationId }),
      })

      if (apiError) {
        setError(apiError)
      } else {
        navigate('/dashboard', { replace: true })
      }
    }

    handleCallback()
  }, [code, installationId, navigate])

  return (
    <div className="min-h-screen bg-deep-navy flex flex-col items-center justify-center gap-6">
      {error ? (
        <>
          <p className="text-white/70 text-sm">{error}</p>
          <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Link to="/dashboard">
              <House className="size-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </>
      ) : (
        <>
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-ocean-city border-r-transparent" />
          <p className="text-white/70 text-sm">Connecting Delta to your GitHub account&hellip;</p>
        </>
      )}
    </div>
  )
}
