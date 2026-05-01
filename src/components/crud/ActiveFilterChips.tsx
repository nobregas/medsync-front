import { X } from "lucide-react";

export type ActiveFilterChip = {
  id: string;
  value: string;
};

type ActiveFilterChipsProps = {
  filters: ActiveFilterChip[];
  onRemove: (filter: ActiveFilterChip) => void;
};

export function ActiveFilterChips({ filters, onRemove }: ActiveFilterChipsProps) {
  if (filters.length === 0) {
    return <div className="active-filter-list" aria-hidden="true" />;
  }

  return (
    <div className="active-filter-list" aria-label="Filtros aplicados">
      {filters.map((filter, index) => (
        <button
          className="active-filter-chip"
          type="button"
          key={`${filter.id}-${filter.value}-${index}`}
          onClick={() => onRemove(filter)}
          aria-label={`Remover filtro ${filter.value}`}
        >
          <span>{filter.value}</span>
          <X size={14} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
