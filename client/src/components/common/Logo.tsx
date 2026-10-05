interface LogoProps {
  tone?: 'default' | 'light'
}

// Cloud mark cropped from the full NexaCRM logo (public/logo-full.png).
export function Logo({ tone = 'default' }: LogoProps) {
  const light = tone === 'light'
  return (
    <span className="flex items-center gap-2.5">
      <img
        src="/logo-mark.png"
        alt=""
        aria-hidden
        draggable={false}
        className="h-8 w-auto shrink-0 select-none"
      />
      <span className={`text-base font-semibold tracking-tight ${light ? 'text-white' : ''}`}>NexaCRM</span>
    </span>
  )
}
