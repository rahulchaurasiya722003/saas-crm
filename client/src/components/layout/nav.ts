import {
  Activity, BarChart3, Briefcase, Building2, CheckSquare, Columns3, LayoutDashboard, ScrollText, Settings, ShieldCheck, SlidersHorizontal,
  Target, UserCircle, Users, UsersRound, type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'CRM',
    items: [
      { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
      { label: 'Leads', to: '/leads', icon: Target },
      { label: 'Companies', to: '/companies', icon: Building2 },
      { label: 'Contacts', to: '/contacts', icon: Users },
      { label: 'Deals', to: '/deals', icon: Briefcase },
      { label: 'Pipeline', to: '/pipeline', icon: Columns3 },
      { label: 'Tasks', to: '/tasks', icon: CheckSquare },
      { label: 'Activities', to: '/activities', icon: Activity },
    ],
  },
  { label: 'Analytics', items: [{ label: 'Reports', to: '/reports', icon: BarChart3 }] },
  {
    label: 'Management',
    items: [
      { label: 'Team', to: '/team', icon: UsersRound },
      { label: 'Roles & Permissions', to: '/roles', icon: ShieldCheck },
      { label: 'Audit Logs', to: '/audit-logs', icon: ScrollText },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Organization', to: '/settings/organization', icon: Settings },
      { label: 'Profile', to: '/settings/profile', icon: UserCircle },
      { label: 'Preferences', to: '/settings/preferences', icon: SlidersHorizontal },
    ],
  },
]

export const ROUTE_LABELS: Record<string, string> = Object.fromEntries(
  NAV_GROUPS.flatMap((g) => g.items).map((i) => [i.to, i.label]),
)
