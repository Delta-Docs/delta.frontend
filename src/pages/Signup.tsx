import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { WarningCircle, Eye, EyeSlash, UserPlus, CheckCircle } from '@phosphor-icons/react'
import { useSignup } from '@/hooks/useAuth'
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

export default function Signup() {
  const navigate = useNavigate()
  const { mutate: signup, isPending, error, reset } = useSignup()
  
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const passwordsMatch = password === confirmPassword
  const passwordMinLength = password.length >= 8
  const isFormValid = 
    fullName.trim() !== '' && 
    email.trim() !== '' && 
    password.trim() !== '' && 
    passwordsMatch &&
    passwordMinLength

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!passwordsMatch) return
    
    reset()
    signup(
      { email, full_name: fullName, password },
      {
        onSuccess: () => {
          navigate('/login')
        },
      }
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-deep-blue via-deep-blue/90 to-ocean-city">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Delta<span className="text-ocean-city">.</span>
          </h1>
          <p className="mt-2 text-glacial-salt">
            Create your account
          </p>
        </div>

        <Card className="bg-concerto border-glacial-salt/40 shadow-brand-medium rounded-md">
          <CardHeader className="flex flex-col gap-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center text-deep-navy">
              Sign up
            </CardTitle>
            <CardDescription className="text-center text-muted-slate">
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="flex flex-col gap-4">
              {error && (
                <Alert variant="destructive" className="border-error bg-error/10">
                  <WarningCircle className="size-4 text-error" />
                  <AlertDescription className="text-error">
                    {error.message}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="fullName" className="text-soft-ink">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  required
                  disabled={isPending}
                  className="bg-pure-white border-glacial-salt/60 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-deep-blue"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-soft-ink">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  disabled={isPending}
                  className="bg-pure-white border-glacial-salt/60 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-deep-blue"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-soft-ink">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    disabled={isPending}
                    className="pr-10 bg-pure-white border-glacial-salt/60 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-deep-blue"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-slate hover:text-soft-ink transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeSlash className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {/* Password requirements */}
                {password.length > 0 && (
                  <div className="flex items-center gap-2 text-xs mt-1.5">
                    <CheckCircle 
                      className={`size-3.5 ${passwordMinLength ? 'text-success' : 'text-muted-slate'}`} 
                      weight={passwordMinLength ? 'fill' : 'regular'}
                    />
                    <span className={passwordMinLength ? 'text-success' : 'text-muted-slate'}>
                      At least 8 characters
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword" className="text-soft-ink">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    disabled={isPending}
                    className="pr-10 bg-pure-white border-glacial-salt/60 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-deep-blue"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-slate hover:text-soft-ink transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeSlash className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {/* Password match indicator */}
                {confirmPassword.length > 0 && (
                  <div className="flex items-center gap-2 text-xs mt-1.5">
                    <CheckCircle 
                      className={`size-3.5 ${passwordsMatch ? 'text-success' : 'text-error'}`} 
                      weight={passwordsMatch ? 'fill' : 'regular'}
                    />
                    <span className={passwordsMatch ? 'text-success' : 'text-error'}>
                      {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button
                type="submit"
                className="w-full bg-deep-blue text-white hover:bg-deep-blue/90 hover:shadow-cta transition-all"
                size="lg"
                disabled={isPending || !isFormValid}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="size-4" />
                    Create account
                  </span>
                )}
              </Button>

              <p className="text-sm text-center text-muted-slate">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-deep-blue hover:text-ocean-city hover:underline transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        <p className="mt-8 text-center text-xs text-glacial-salt/80">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
