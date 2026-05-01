import { useId, type FormEventHandler, type ReactNode } from "react";
import { Filter } from "lucide-react";

type CrudFilterSectionProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onClear: () => void;
  canClear?: boolean;
  disabled?: boolean;
  submitLabel?: string;
  clearLabel?: string;
};

export function CrudFilterSection({
  title,
  description,
  children,
  onSubmit,
  onClear,
  canClear = true,
  disabled = false,
  submitLabel = "Filtrar",
  clearLabel = "Limpar",
}: CrudFilterSectionProps) {
  const titleId = useId();
  const hasHeader = Boolean(title || description);

  return (
    <section className="card crud-filter-card" aria-labelledby={title ? titleId : undefined}>
      {hasHeader && (
        <div className="section-header">
          <div>
            {title && (
              <h3 className="section-title" id={titleId}>
                {title}
              </h3>
            )}
            {description && <p className="section-description">{description}</p>}
          </div>
        </div>
      )}

      <form className="crud-filter-form" onSubmit={onSubmit}>
        <div className="crud-filter-fields">{children}</div>
        <div className="crud-filter-actions">
          <button
            className="button secondary"
            type="button"
            onClick={onClear}
            disabled={disabled || !canClear}
          >
            {clearLabel}
          </button>
          <button className="button primary" type="submit" disabled={disabled}>
            <Filter size={18} aria-hidden="true" />
            {submitLabel}
          </button>
        </div>
      </form>
    </section>
  );
}
