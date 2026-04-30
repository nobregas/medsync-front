import { CalendarPlus, FileText, UserPlus } from 'lucide-react'

const metrics = [
  {
    label: 'Consultas hoje',
    value: '18',
    caption: '5 proximos atendimentos',
  },
  {
    label: 'Pacientes cadastrados',
    value: '1.284',
    caption: '+32 neste mes',
  },
  {
    label: 'Consultas realizadas',
    value: '246',
    caption: 'Resumo mensal medico',
  },
  {
    label: 'Ocupacao da semana',
    value: '82%',
    caption: 'Agenda sem conflitos',
  },
]

const appointments = [
  {
    time: '08:30',
    patient: 'Maria Souza',
    doctor: 'Dra. Ana Martins',
    status: 'Agendada',
    variant: 'info',
  },
  {
    time: '10:00',
    patient: 'Joao Lima',
    doctor: 'Dr. Pedro Alves',
    status: 'Realizada',
    variant: 'success',
  },
  {
    time: '14:30',
    patient: 'Carla Mendes',
    doctor: 'Dra. Ana Martins',
    status: 'Retorno',
    variant: 'warning',
  },
]

export function DashboardPage() {
  return (
    <>
      <section className="page-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2 className="page-title">Visao geral da clinica</h2>
        </div>
      </section>

      <section className="grid metric-grid" aria-label="Metricas principais">
        {metrics.map((metric) => (
          <article className="card metric-card" key={metric.label}>
            <p className="metric-label">{metric.label}</p>
            <p className="metric-value">{metric.value}</p>
            <p className="metric-caption">{metric.caption}</p>
          </article>
        ))}
      </section>

      <section className="grid dashboard-grid">
        <article className="card">
          <div className="section-header">
            <div>
              <h3 className="section-title">Agenda do dia</h3>
              <p className="section-description">Proximos atendimentos organizados por horario.</p>
            </div>
            <span className="badge info">Sem conflitos</span>
          </div>

          <div className="schedule-list">
            {appointments.map((appointment) => (
              <div className="appointment-card" key={`${appointment.time}-${appointment.patient}`}>
                <strong className="appointment-time">{appointment.time}</strong>
                <div>
                  <p className="appointment-patient">{appointment.patient}</p>
                  <p className="appointment-meta">{appointment.doctor}</p>
                </div>
                <span className={`badge ${appointment.variant}`}>{appointment.status}</span>
              </div>
            ))}
          </div>
        </article>

        <aside className="card">
          <div className="section-header">
            <div>
              <h3 className="section-title">Atalhos</h3>
              <p className="section-description">Acoes frequentes para a rotina da clinica.</p>
            </div>
          </div>

          <div className="shortcut-list">
            <button className="shortcut-button" type="button">
              <UserPlus size={18} aria-hidden="true" />
              Cadastrar paciente
            </button>
            <button className="shortcut-button" type="button">
              <CalendarPlus size={18} aria-hidden="true" />
              Agendar consulta
            </button>
            <button className="shortcut-button" type="button">
              <FileText size={18} aria-hidden="true" />
              Abrir prontuario
            </button>
          </div>
        </aside>
      </section>
    </>
  )
}
