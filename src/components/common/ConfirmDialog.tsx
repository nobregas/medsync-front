import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import type { ConfirmDialogVariant, ConfirmDialogProps } from "./ConfirmDialog.types";

const variantStyles: Record<ConfirmDialogVariant, string> = {
  danger: "dialog-danger",
  warning: "dialog-warning",
  info: "dialog-info",
};

const variantIcon: Record<ConfirmDialogVariant, React.ReactNode> = {
  danger: <AlertTriangle size={32} />,
  warning: <AlertCircle size={32} />,
  info: <Info size={32} />,
};

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  variant = "info",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-container" onClick={(e) => e.stopPropagation()}>
        <div className={`dialog-icon ${variantStyles[variant]}`}>
          {variantIcon[variant]}
        </div>
        <h2 className="dialog-title">{title}</h2>
        <p className="dialog-message">{message}</p>
        <div className="dialog-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className={`btn ${variant === "danger" ? "btn-danger" : "btn-primary"}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}