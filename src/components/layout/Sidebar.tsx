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

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Pacientes', icon: Users, path: '/patients' },
  { label: 'Consultas', icon: ClipboardList, path: '/appointments' },
  { label: 'Calendario', icon: CalendarClock, path: '/calendar' },
  { label: 'Prontuario', icon: FileText, path: '/medical-records' },
  { label: 'Usuarios', icon: UserCog, path: '/users' },
]

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()

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
          {navItems.map(({ label, icon: Icon, path }) => (
            <li key={path}>
              <Link
                className={`nav-link ${location.pathname === path ? 'active' : ''}`}
                to={path}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
