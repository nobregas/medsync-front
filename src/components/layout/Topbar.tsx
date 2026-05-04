import { useState } from 'react'
import { CalendarDays, ChevronDown, LogOut, Menu, Plus } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { canAccess, permissions } from '@/types/role'

type TopbarProps = {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const canOpenCalendar = user ? canAccess(user.role, permissions.appointmentCalendar) : false
  const canCreateAppointment = user ? canAccess(user.role, permissions.appointmentCreate) : false
  const todayLabel = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador'
      case 'doctor':
        return 'Médico'
      case 'receptionist':
        return 'Recepcionista'
      default:
        return role
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-button" type="button" aria-label="Abrir menu lateral" onClick={onMenuClick}>
          <Menu size={20} aria-hidden="true" />
        </button>

        <div>
          <p className="topbar-title">Resumo operacional</p>
          <p className="topbar-date">{todayLabel}</p>
        </div>
      </div>

      <div className="topbar-actions">
        {canOpenCalendar && (
          <button className="button secondary" type="button" onClick={() => navigate('/calendar')}>
            <CalendarDays size={17} aria-hidden="true" />
            Ver calendário
          </button>
        )}
        {canCreateAppointment && (
          <button className="button accent" type="button" onClick={() => navigate('/appointments/new')}>
            <Plus size={17} aria-hidden="true" />
            Nova consulta
          </button>
        )}

        <span className="topbar-divider" aria-hidden="true">|</span>

        <div className="user-menu">
          <div className="avatar-wrapper">
            <button
              className="avatar-button"
              type="button"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="menu"
              onClick={() => setIsUserMenuOpen((isOpen) => !isOpen)}
            >
              {user ? getInitials(user.name) : '??'}
            </button>
            <button
              className="avatar-chevron-button"
              type="button"
              aria-expanded={isUserMenuOpen}
              aria-label="Abrir menu do usuário"
              onClick={() => setIsUserMenuOpen((isOpen) => !isOpen)}
            >
              <ChevronDown
                size={18}
                className={isUserMenuOpen ? 'chevron-open' : ''}
                aria-hidden="true"
              />
            </button>
          </div>

          {isUserMenuOpen && (
            <div className="logout-popover" role="menu">
              <div className="logout-user">
                <p className="logout-name">{user?.name}</p>
                <p className="logout-role">{user ? getRoleLabel(user.role) : ''}</p>
              </div>
              <button className="logout-button" type="button" role="menuitem" onClick={handleLogout}>
                <LogOut size={16} aria-hidden="true" />
                Sair da conta
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
