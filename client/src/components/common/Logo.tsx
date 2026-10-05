interface LogoProps {
  tone?: 'default' | 'light'
}

// The mark is cropped from the full NexaCRM logo (public/logo-full.png), so only the cloud icon shows.
export function Logo({ tone = 'default' }: LogoProps) {
  const light = tone === 'light'
  return (
    <span className="flex items-center gap-2.5">
      <span aria-hidden className="relative block h-9 w-12 shrink-0 overflow-hidden">
        <img
          src="/logo-full.png"
          alt=""
          draggable={false}
          className="absolute top-0 left-1/2 h-[68px] w-[68px] max-w-none -translate-x-1/2 -translate-y-2.5"
        />
      </span>
      <span className={`text-base font-semibold tracking-tight ${light ? 'text-white' : ''}`}>NexaCRM</span>
    </span>
  )
}
