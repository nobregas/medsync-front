import { useId, type ReactNode } from "react";

type CrudTableSectionProps = {
  title?: string;
  description?: string;
  summary?: ReactNode;
  children: ReactNode;
};

export function CrudTableSection({
  title,
  description,
  summary,
  children,
}: CrudTableSectionProps) {
  const titleId = useId();
  const hasHeader = Boolean(title || description || summary);

  return (
    <section className="card crud-table-card" aria-labelledby={title ? titleId : undefined}>
      {hasHeader && (
        <div className="section-header crud-table-header">
          {(title || description) && (
            <div>
              {title && (
                <h3 className="section-title" id={titleId}>
                  {title}
                </h3>
              )}
              {description && <p className="section-description">{description}</p>}
            </div>
          )}
          {summary && <div className="crud-table-summary">{summary}</div>}
        </div>
      )}

      {children}
    </section>
  );
}
