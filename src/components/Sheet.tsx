import { X } from "lucide-react";
import type { ReactNode } from "react";

type SheetProps = {
  children: ReactNode;
  isOpen: boolean;
  label: string;
  onClose: () => void;
  title: string;
};

export function Sheet({ children, isOpen, label, onClose, title }: SheetProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="sheet-layer" role="presentation" onClick={onClose}>
      <section
        aria-label={label}
        className="glass-sheet"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sheet-handle" aria-hidden="true" />
        <div className="sheet-title-row">
          <h2>{title}</h2>
          <button className="glass-icon-button compact" type="button" onClick={onClose} aria-label="close">
            <X aria-hidden="true" size={18} strokeWidth={1.8} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
