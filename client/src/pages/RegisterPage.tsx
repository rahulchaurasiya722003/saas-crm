import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { FormField } from '../components/common/FormField'
import { Button } from '../components/ui/Button'
import { AuthLayout } from '../layouts/AuthLayout'
import { getErrorMessage } from '../lib/api'
import { useAuth } from '../store/auth'

const schema = z.object({
  organizationName: z.string().trim().min(2, 'Organization name must be at least 2 characters'),
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
type Values = z.infer<typeof schema>

export function RegisterPage() {
  const { register: signUp } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register, handleSubmit, formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await signUp(values)
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
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <FormField label="Organization name" autoComplete="organization" error={errors.organizationName?.message} {...register('organizationName')} />
        <div className="grid grid-cols-2 gap-3">
          <FormField label="First name" autoComplete="given-name" error={errors.firstName?.message} {...register('firstName')} />
          <FormField label="Last name" autoComplete="family-name" error={errors.lastName?.message} {...register('lastName')} />
        </div>
        <FormField label="Work email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <FormField label="Password" type="password" autoComplete="new-password" error={errors.password?.message} {...register('password')} />
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
