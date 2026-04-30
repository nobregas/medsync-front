import { useState } from 'react'
import { CalendarDays, LogOut, Menu, Plus } from 'lucide-react'

type TopbarProps = {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

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
          Ver calendario
        </button>
        <button className="button primary" type="button">
          <Plus size={17} aria-hidden="true" />
          Nova consulta
        </button>

        <div className="user-menu">
          <button
            className="avatar-button"
            type="button"
            aria-expanded={isUserMenuOpen}
            aria-haspopup="menu"
            onClick={() => setIsUserMenuOpen((isOpen) => !isOpen)}
          >
            AM
          </button>

          {isUserMenuOpen && (
            <div className="logout-popover" role="menu">
              <div className="logout-user">
                <p className="logout-name">Dra. Ana Martins</p>
                <p className="logout-role">Medico</p>
              </div>
              <button className="logout-button" type="button" role="menuitem">
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
