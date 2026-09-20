export function LogoIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Outer Ring */}
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeOpacity="0.15" strokeWidth="4" />
      
      {/* Orbital Connectors */}
      <path d="M50 21 L50 35" stroke="currentColor" strokeWidth="4" strokeOpacity="0.8" strokeLinecap="round" />
      <path d="M72 62 L60 56" stroke="currentColor" strokeWidth="4" strokeOpacity="0.8" strokeLinecap="round" />
      <path d="M28 62 L40 56" stroke="currentColor" strokeWidth="4" strokeOpacity="0.8" strokeLinecap="round" />

      {/* Orbital Nodes */}
      <circle cx="50" cy="15" r="6" fill="currentColor" />
      <circle cx="80" cy="67" r="6" fill="currentColor" />
      <circle cx="20" cy="67" r="6" fill="currentColor" />
      
      {/* Core Node & Pulses */}
      <circle cx="50" cy="50" r="22" stroke="#FF9F68" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="4 4" />
      <circle cx="50" cy="50" r="14" fill="#FF9F68" />
    </svg>
  );
}
