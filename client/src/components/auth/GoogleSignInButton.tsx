// Google sign-in button. It stays disabled until VITE_GOOGLE_CLIENT_ID is set in client/.env,
// because Google requires a client ID from your own Google Cloud project.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4-5.5 4-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z" />
      <path fill="#34A853" d="M3.9 7.5l3.2 2.3C8 7.8 9.8 6.5 12 6.5c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.8 14.6 2.9 12 2.9c-3.7 0-6.9 2.1-8.1 4.6z" />
      <path fill="#FBBC05" d="M12 21.6c2.5 0 4.7-.8 6.2-2.3l-2.9-2.4c-.8.6-1.9 1-3.3 1-3.9 0-5.3-2.6-5.5-3.9l-3.2 2.5c1.2 2.5 4.4 5.1 8.7 5.1z" />
      <path fill="#4285F4" d="M21.2 12.2c0-.6-.1-1.1-.2-1.6H12v3.9h5.5c-.3 1.3-1 2.3-2.1 3l2.9 2.4c1.7-1.6 2.9-4 2.9-7.7z" />
    </svg>
  )
}

export function GoogleSignInButton({ label }: { label: string }) {
  const configured = Boolean(GOOGLE_CLIENT_ID)
  return (
    <div>
      <button
        type="button"
        disabled={!configured}
        title={configured ? undefined : 'Set VITE_GOOGLE_CLIENT_ID in client/.env to enable Google sign-in'}
        className="inline-flex h-11 w-full items-center justify-center gap-3 rounded-md border border-border bg-surface text-sm font-medium transition duration-150 hover:bg-surface-muted active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <GoogleIcon />
        {label}
      </button>
      <div className="my-5 flex items-center gap-3 text-xs text-text-muted">
        <span className="h-px flex-1 bg-border" />
        or continue with email
        <span className="h-px flex-1 bg-border" />
      </div>
    </div>
  )
}
