import { DashboardMetricCard } from '../components/DashboardMetricCard'
import { receptionistDashboardMock } from '../mock'

const appointmentStatusLabel = {
  scheduled: 'Agendada',
  completed: 'Realizada',
  cancelled: 'Cancelada',
} as const

const appointmentStatusVariant = {
  scheduled: 'info',
  completed: 'success',
  cancelled: 'danger',
} as const

export function DashboardPage() {
  const { metrics, todayAppointments, monthAppointments } = receptionistDashboardMock

  return (
    <div className="dashboard-page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Visão geral</p>
          <h2 className="page-title">Resumo da recepção</h2>
          <p className="page-description">
            Acompanhamento rápido das consultas de hoje, deste mês e dos pacientes cadastrados.
          </p>
        </div>
      </section>

      <section className="grid metric-grid" aria-label="Métricas principais">
        {metrics.map((metric) => (
          <DashboardMetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            description={metric.description}
          />
        ))}
      </section>

      <section className="grid dashboard-grid">
        <article className="card">
          <div className="section-header">
            <div>
              <h3 className="section-title">Agenda do dia</h3>
              <p className="section-description">Próximos horários organizados para a recepção.</p>
            </div>
            <span className="badge info">Sem conflitos</span>
          </div>

          <div className="schedule-list scroll-container">
            {todayAppointments.map((appointment) => (
              <div className="appointment-card" key={appointment.id}>
                <strong className="appointment-time">{appointment.time}</strong>
                <div>
                  <p className="appointment-patient">{appointment.patient}</p>
                  <p className="appointment-meta">{appointment.doctor}</p>
                </div>
                <span className={`badge ${appointmentStatusVariant[appointment.status]}`}>
                  {appointmentStatusLabel[appointment.status]}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <div className="section-header">
            <div>
              <h3 className="section-title">Consultas deste mês</h3>
              <p className="section-description">Visão geral dos agendamentos de abril.</p>
            </div>
          </div>

          <div className="schedule-list scroll-container">
            {monthAppointments.map((appointment) => (
              <div className="appointment-card" key={appointment.id}>
                <strong className="appointment-time">{appointment.time}</strong>
                <div>
                  <p className="appointment-patient">{appointment.patient}</p>
                  <p className="appointment-meta">{appointment.doctor}</p>
                </div>
                <span className={`badge ${appointmentStatusVariant[appointment.status]}`}>
                  {appointmentStatusLabel[appointment.status]}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}
