type DashboardMetricCardProps = {
  title: string
  value: number | string
  description?: string
}

export function DashboardMetricCard({ title, value, description }: DashboardMetricCardProps) {
  return (
    <article className="card metric-card">
      <p className="metric-label">{title}</p>
      <p className="metric-value">{value}</p>
      {description && <p className="metric-caption">{description}</p>}
    </article>
  )
}
