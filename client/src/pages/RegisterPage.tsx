import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton'
import { FormField } from '../components/common/FormField'
import { Button } from '../components/ui/Button'
import { AuthLayout } from '../layouts/AuthLayout'
import { getErrorMessage } from '../lib/api'
import { useAuth } from '../store/auth'

const schema = z
  .object({
    organizationName: z.string().trim().min(2, 'Organization name must be at least 2 characters'),
    firstName: z.string().trim().min(1, 'First name is required'),
    lastName: z.string().trim().min(1, 'Last name is required'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
type Values = z.infer<typeof schema>

// Visual hint only. The server enforces the real rule (8+ characters).
function getStrength(password: string) {
  if (!password) return { level: 0, label: '', tone: '' }
  const checks = [
    password.length >= 8,
    password.length >= 12,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const score = checks.filter(Boolean).length
  if (score <= 2) return { level: 1, label: 'Weak', tone: 'text-danger' }
  if (score <= 3) return { level: 2, label: 'Medium', tone: 'text-warning' }
  return { level: 3, label: 'Strong', tone: 'text-success' }
}

const SEGMENT_TONE = ['bg-danger', 'bg-warning', 'bg-success']

export function RegisterPage() {
  const { register: signUp, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register, handleSubmit, watch, formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) })

  const password = watch('password') ?? ''
  const strength = getStrength(password)

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      // Send only the fields the API expects. confirmPassword is client-side only.
      await signUp({
        organizationName: values.organizationName,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      })
      navigate('/dashboard', { replace: true })
    } catch (e) {
      setFormError(getErrorMessage(e, 'Unable to create your account. Please try again.'))
    }
  })

  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="Set up your organization and admin account."
      footer={{ text: 'Already have an account?', linkLabel: 'Sign in', to: '/login' }}
    >
      <GoogleSignInButton
        label="Sign up with Google"
        mode="signup"
        onCredential={async (credential) => {
          await loginWithGoogle(credential)
          navigate('/dashboard', { replace: true })
        }}
      />
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <FormField label="Organization name" autoComplete="organization" error={errors.organizationName?.message} {...register('organizationName')} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="First name" autoComplete="given-name" error={errors.firstName?.message} {...register('firstName')} />
          <FormField label="Last name" autoComplete="family-name" error={errors.lastName?.message} {...register('lastName')} />
        </div>
        <FormField label="Work email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />

        <div>
          <FormField label="Password" type="password" revealable autoComplete="new-password" error={errors.password?.message} {...register('password')} />
          {password && (
            <div className="mt-2 flex items-center gap-2" aria-live="polite">
              <div className="flex flex-1 gap-1.5" aria-hidden>
                {[1, 2, 3].map((segment) => (
                  <span
                    key={segment}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${strength.level >= segment ? SEGMENT_TONE[strength.level - 1] : 'bg-surface-muted'}`}
                  />
                ))}
              </div>
              <span className={`text-xs font-medium ${strength.tone}`}>{strength.label}</span>
            </div>
          )}
        </div>

        <FormField label="Confirm password" type="password" revealable autoComplete="new-password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />

        {formError && (
          <p role="alert" className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
            {formError}
          </p>
        )}
        <Button type="submit" loading={isSubmitting} className="w-full">
          Create account
        </Button>
      </form>
    </AuthLayout>
  )
}
