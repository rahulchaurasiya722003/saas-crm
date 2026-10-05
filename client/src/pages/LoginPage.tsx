import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { FormField } from '../components/common/FormField'
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton'
import { Button } from '../components/ui/Button'
import { AuthLayout } from '../layouts/AuthLayout'
import { getErrorMessage } from '../lib/api'
import { useAuth } from '../store/auth'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})
type Values = z.infer<typeof schema>

const DEMO = { email: 'admin@nexacrm.dev', password: 'Password123!' }

export function LoginPage() {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register, handleSubmit, setValue, formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setFormError(null)
    try {
      await login(email, password)
      const from = (location.state as { from?: string } | null)?.from
      navigate(from ?? '/dashboard', { replace: true })
    } catch (e) {
      setFormError(getErrorMessage(e, 'Unable to sign in. Please try again.'))
    }
  })

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your NexaCRM workspace."
      footer={{ text: "Don't have an account?", linkLabel: 'Create one', to: '/register' }}
    >
      <GoogleSignInButton
        label="Sign in with Google"
        mode="signin"
        onCredential={async (credential) => {
          await loginWithGoogle(credential)
          const from = (location.state as { from?: string } | null)?.from
          navigate(from ?? '/dashboard', { replace: true })
        }}
      />
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <FormField label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <FormField label="Password" type="password" revealable autoComplete="current-password" error={errors.password?.message} {...register('password')} />
        {formError && (
          <p role="alert" className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
            {formError}
          </p>
        )}
        <Button type="submit" loading={isSubmitting} className="w-full">
          Sign in
        </Button>
        <button
          type="button"
          onClick={() => {
            setValue('email', DEMO.email)
            setValue('password', DEMO.password)
          }}
          className="w-full text-center text-xs text-text-muted hover:text-text-primary"
        >
          Fill demo credentials
        </button>
      </form>
    </AuthLayout>
  )
}
