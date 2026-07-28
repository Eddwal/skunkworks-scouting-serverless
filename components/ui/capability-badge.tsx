export function CapabilityBadge({ 
  show, 
  label, 
  className 
}: { 
  show?: boolean; 
  label: string; 
  className?: string 
}) {
  if (!show) return null;
  return (
    <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[11px] font-bold transition-colors border-transparent ${className}`}>
      {label}
    </span>
  );
}
