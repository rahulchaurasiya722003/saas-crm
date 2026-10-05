import { useEffect, useRef, useState } from 'react'
import { getErrorMessage } from '../../lib/api'
import { useTheme } from '../../store/theme'

// Google Identity Services. Set VITE_GOOGLE_CLIENT_ID in client/.env to enable.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined
const GIS_SCRIPT_URL = 'https://accounts.google.com/gsi/client'

interface GoogleIdApi {
  initialize(config: { client_id: string; callback: (response: { credential: string }) => void }): void
  renderButton(parent: HTMLElement, options: Record<string, unknown>): void
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleIdApi } }
  }
}

let scriptRequest: Promise<void> | null = null

// Loads the Google script once, however many buttons are on screen.
function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve()
  scriptRequest ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = GIS_SCRIPT_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      scriptRequest = null
      reject(new Error('Could not load Google sign-in. Check your connection and try again.'))
    }
    document.head.appendChild(script)
  })
  return scriptRequest
}

interface GoogleSignInButtonProps {
  label: string
  mode: 'signin' | 'signup'
  onCredential: (credential: string) => Promise<void>
}

export function GoogleSignInButton({ label, mode, onCredential }: GoogleSignInButtonProps) {
  const { resolved } = useTheme()
  const container = useRef<HTMLDivElement>(null)
  const handler = useRef(onCredential)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    handler.current = onCredential
  }, [onCredential])

  // Renders Google's own button, re-rendered when the theme changes so it matches.
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return
    let cancelled = false

    loadGoogleScript()
      .then(() => {
        if (cancelled || !container.current || !window.google) return
        const id = window.google.accounts.id
        id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: ({ credential }) => {
            setError(null)
            handler.current(credential).catch((e: unknown) => {
              setError(getErrorMessage(e, 'Google sign-in failed. Please try again.'))
            })
          },
        })
        container.current.innerHTML = ''
        id.renderButton(container.current, {
          theme: resolved === 'dark' ? 'filled_black' : 'outline',
          size: 'large',
          shape: 'rectangular',
          text: mode === 'signup' ? 'signup_with' : 'signin_with',
          logo_alignment: 'left',
          width: Math.min(container.current.offsetWidth || 320, 400),
        })
        setReady(true)
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Google sign-in failed.'))

    return () => {
      cancelled = true
    }
  }, [resolved, mode])

  const divider = (
    <div className="my-5 flex items-center gap-3 text-xs text-text-muted">
      <span className="h-px flex-1 bg-border" />
      or continue with email
      <span className="h-px flex-1 bg-border" />
    </div>
  )

  if (!GOOGLE_CLIENT_ID) {
    return (
      <div>
        <button
          type="button"
          disabled
          title="Set VITE_GOOGLE_CLIENT_ID in client/.env to enable Google sign-in"
          className="inline-flex h-11 w-full items-center justify-center rounded-md border border-border bg-surface text-sm font-medium opacity-60"
        >
          {label}
        </button>
        {divider}
      </div>
    )
  }

  return (
    <div>
      <div ref={container} className="flex min-h-11 w-full justify-center" />
      {!ready && !error && <p className="mt-2 text-center text-xs text-text-muted">Loading Google sign-in…</p>}
      {error && (
        <p role="alert" className="mt-2 rounded-md bg-danger/10 px-3 py-2 text-center text-sm text-danger">
          {error}
        </p>
      )}
      {divider}
    </div>
  )
}
