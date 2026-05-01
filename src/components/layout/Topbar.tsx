import { useState } from 'react'
import { CalendarDays, LogOut, Menu, Plus } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

type TopbarProps = {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

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
          <p className="topbar-date">Quarta-feira, 29 de abril de 2026</p>
        </div>
      </div>

      <div className="topbar-actions">
        <button className="button secondary" type="button">
          <CalendarDays size={17} aria-hidden="true" />
          Ver calendário
        </button>
        <button className="button outline" type="button">
          <Plus size={17} aria-hidden="true" />
          Nova consulta
        </button>

        <span className="topbar-divider" aria-hidden="true">|</span>

        <div className="user-menu">
          <button
            className="avatar-button"
            type="button"
            aria-expanded={isUserMenuOpen}
            aria-haspopup="menu"
            onClick={() => setIsUserMenuOpen((isOpen) => !isOpen)}
          >
            {user ? getInitials(user.name) : '??'}
          </button>

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
