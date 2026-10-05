import { Link } from 'react-router-dom'

interface AuthLayoutProps {
  title: string
  subtitle: string
  footer: { text: string; linkLabel: string; to: string }
  children: React.ReactNode
}

export function AuthLayout({ title, subtitle, footer, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2.5">
          <span aria-hidden className="flex size-9 items-center justify-center rounded-md bg-primary text-base font-bold text-white">
            N
          </span>
          <span className="text-lg font-semibold tracking-tight">NexaCRM</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1.5 mb-6 text-sm text-text-secondary">{subtitle}</p>
        <div className="rounded-lg border border-border bg-surface p-5">{children}</div>
        <p className="mt-5 text-center text-sm text-text-secondary">
          {footer.text}{' '}
          <Link to={footer.to} className="font-medium text-primary hover:underline">
            {footer.linkLabel}
          </Link>
        </p>
      </div>
    </div>
  )
}
