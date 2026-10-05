interface LogoProps {
  tone?: 'default' | 'light'
}

export function Logo({ tone = 'default' }: LogoProps) {
  const light = tone === 'light'
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden
        className={`flex size-8 items-center justify-center rounded-md text-sm font-bold shadow-md ${
          light ? 'bg-white text-primary shadow-black/20' : 'bg-primary text-white shadow-primary/30'
        }`}
      >
        N
      </span>
      <span className={`text-base font-semibold tracking-tight ${light ? 'text-white' : ''}`}>NexaCRM</span>
    </span>
  )
}
