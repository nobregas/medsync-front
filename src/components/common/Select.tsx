import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type SelectHTMLAttributes,
} from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  options,
  placeholder,
  className = "",
  id,
  name,
  value,
  onChange,
  disabled,
  required,
  "aria-describedby": ariaDescribedBy,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectId = id || name;
  const errorId = error && selectId ? `${selectId}-error` : undefined;
  const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(" ") || undefined;
  const listboxId = selectId ? `${selectId}-listbox` : undefined;
  const selectedOption = options.find((opt) => opt.value === value);

  const close = useCallback(() => {
    setIsOpen(false);
    setHighlightIndex(-1);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen || highlightIndex < 0 || !listRef.current) return;
    const highlighted = listRef.current.children[highlightIndex] as HTMLElement;
    highlighted?.scrollIntoView({ block: "nearest" });
  }, [highlightIndex, isOpen]);

  function handleToggle() {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    setHighlightIndex(-1);
  }

  function handleSelect(option: SelectOption) {
    if (option.disabled) return;

    const nativeEvent = new Event("change", { bubbles: true });
    const selectEl = document.createElement("select");

    selectEl.name = name ?? "";
    selectEl.value = option.value;

    Object.defineProperty(selectEl, "value", { value: option.value, writable: false });

    const syntheticTarget = {
      name: name ?? "",
      value: option.value,
    };

    if (onChange) {
      const syntheticEvent = {
        target: syntheticTarget,
        currentTarget: syntheticTarget,
        type: "change",
        bubbles: true,
        nativeEvent,
        preventDefault: () => {},
        stopPropagation: () => {},
      } as unknown as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }

    close();
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (disabled) return;

    const enabledOptions = options.filter((opt) => !opt.disabled);

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightIndex(-1);
        } else if (highlightIndex >= 0) {
          const enabledIndex = highlightIndex;
          const option = enabledOptions[enabledIndex];
          if (option) handleSelect(option);
        }
        break;
      case "Escape":
        event.preventDefault();
        close();
        break;
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightIndex(0);
        } else {
          setHighlightIndex((prev) =>
            prev < enabledOptions.length - 1 ? prev + 1 : prev,
          );
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (isOpen) {
          setHighlightIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }
        break;
      case "Tab":
        close();
        break;
    }
  }

  const enabledOptions = options.filter((opt) => !opt.disabled);

  return (
    <div
      ref={containerRef}
      className={`select-wrapper ${error ? "select-wrapper--error" : ""} ${className}`}
    >
      {label && (
        <label className="input-label" htmlFor={selectId}>
          {label}
          {required && <span className="select-required">*</span>}
        </label>
      )}

      <button
        type="button"
        id={selectId}
        className={`select-trigger ${isOpen ? "select-trigger--open" : ""} ${error ? "select-trigger--error" : ""} ${disabled ? "select-trigger--disabled" : ""}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        aria-required={required}
        disabled={disabled}
        role="combobox"
        aria-controls={isOpen ? listboxId : undefined}
      >
        <span className={`select-value ${!selectedOption ? "select-value--placeholder" : ""}`}>
          {selectedOption ? selectedOption.label : (placeholder || "Selecione...")}
        </span>
        <ChevronDown
          size={18}
          className={`select-chevron ${isOpen ? "select-chevron--open" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          ref={listRef}
          className="select-dropdown"
          role="listbox"
          aria-activedescendant={
            highlightIndex >= 0 ? `${selectId}-option-${enabledOptions[highlightIndex]?.value}` : undefined
          }
        >
          {options.map((option) => {
            const isEnabled = !option.disabled;
            const isSelected = option.value === value;
            const isHighlighted = isEnabled && enabledOptions[highlightIndex]?.value === option.value;

            return (
              <li
                key={option.value}
                id={`${selectId}-option-${option.value}`}
                className={`select-option ${isSelected ? "select-option--selected" : ""} ${isHighlighted ? "select-option--highlighted" : ""} ${option.disabled ? "select-option--disabled" : ""}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => {
                  if (isEnabled) {
                    const idx = enabledOptions.indexOf(option);
                    setHighlightIndex(idx);
                  }
                }}
              >
                <span className="select-option-label">{option.label}</span>
                {isSelected && (
                  <span className="select-option-check" aria-hidden="true">
                    ✓
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        tabIndex={-1}
        aria-hidden="true"
        className="select-native"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p id={errorId} className="input-error-message">
          {error}
        </p>
      )}
    </div>
  );
}
