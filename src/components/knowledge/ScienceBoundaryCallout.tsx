import './ScienceBoundaryCallout.css';

interface ScienceBoundaryCalloutProps {
  message: string;
  detail?: string;
  variant?: 'warning' | 'info';
}

export function ScienceBoundaryCallout({ message, detail, variant = 'warning' }: ScienceBoundaryCalloutProps) {
  return (
    <div className={`science-boundary-callout science-boundary-${variant}`} role="note">
      <strong className="science-boundary-callout__message">{message}</strong>
      {detail && <p className="science-boundary-callout__detail">{detail}</p>}
    </div>
  );
}
