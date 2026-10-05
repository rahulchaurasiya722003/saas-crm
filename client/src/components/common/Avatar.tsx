import { initials } from '../../lib/format'

export function Avatar({ person, size = 'md' }: { person: { firstName: string; lastName: string }; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'size-6 text-[10px]' : 'size-8 text-xs'
  return (
    <span aria-hidden className={`inline-flex ${dim} shrink-0 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary`}>
      {initials(person)}
    </span>
  )
}
