import { Link, useLocation } from 'react-router-dom'
import {
  CalendarClock,
  ClipboardList,
  FileText,
  LayoutDashboard,
  UserCog,
  Users,
  X,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { canAccess, permissions } from '@/types/role'
import type { UserRole } from '@/types/role'

type NavItem = {
  label: string
  icon: typeof LayoutDashboard
  path: string
  allowedRoles: readonly UserRole[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', allowedRoles: permissions.dashboard },
  { label: 'Pacientes', icon: Users, path: '/patients', allowedRoles: permissions.patientList },
  { label: 'Consultas', icon: ClipboardList, path: '/appointments', allowedRoles: permissions.appointmentList },
  { label: 'Calendario', icon: CalendarClock, path: '/calendar', allowedRoles: permissions.appointmentCalendar },
  { label: 'Prontuario', icon: FileText, path: '/medical-records', allowedRoles: permissions.medicalRecordView },
  { label: 'Usuarios', icon: UserCog, path: '/users', allowedRoles: permissions.userManagement },
]

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const { user } = useAuth()
  const visibleNavItems = user
    ? navItems.filter((item) => canAccess(user.role, item.allowedRoles))
    : []

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Navegacao principal">
      <div className="sidebar-header">
        <div className="brand">
          <div className="brand-mark">M</div>
          <div>
            <h1 className="brand-title">MedSync</h1>
            <p className="brand-subtitle">Gestao clinica administrativa</p>
          </div>
        </div>

        <button className="sidebar-close" type="button" aria-label="Fechar menu" onClick={onClose}>
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <nav>
        <ul className="nav-list">
          {visibleNavItems.map(({ label, icon: Icon, path }) => {
            const isActive =
              location.pathname === path ||
              (path !== '/dashboard' && location.pathname.startsWith(`${path}/`))

            return (
              <li key={path}>
                <Link className={`nav-link ${isActive ? 'active' : ''}`} to={path} onClick={onClose}>
                  <Icon size={18} strokeWidth={isActive ? 2.75 : 2.25} aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
