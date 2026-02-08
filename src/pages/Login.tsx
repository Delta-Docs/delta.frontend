import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { WarningCircle, Eye, EyeSlash, SignIn } from '@phosphor-icons/react'
import { useLogin } from '@/hooks/useAuth'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/card'
import { Alert, AlertDescription } from '@/components/shadcn/alert'

export default function Login() {
  const navigate = useNavigate()
  const { mutate: login, isPending, error, reset } = useLogin()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    reset()
    login(
      { email, password },
      {
        onSuccess: () => {
          navigate('/repos')
        },
      }
    )
  }

  const isFormValid = email.trim() !== '' && password.trim() !== ''

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-(--background)">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-(--foreground) tracking-tight">
            Delta
          </h1>
          <p className="mt-2 text-(--foreground-muted)">
            Welcome back
          </p>
        </div>

        <Card className="border-(--border)">
          <CardHeader className="flex flex-col gap-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center">
              Sign in
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="flex flex-col gap-4">
              {error && (
                <Alert variant="destructive" className="border-(--error) bg-(--error-background)">
                  <WarningCircle className="size-4 text-(--error)" />
                  <AlertDescription className="text-(--error)">
                    {error.message}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  disabled={isPending}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    disabled={isPending}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-(--foreground-muted) hover:text-(--foreground) transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeSlash className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isPending || !isFormValid}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <SignIn className="size-4" />
                    Sign in
                  </span>
                )}
              </Button>

              <p className="text-sm text-center text-(--foreground-muted)">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-(--primary) hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        <p className="mt-8 text-center text-xs text-(--foreground-muted)">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
