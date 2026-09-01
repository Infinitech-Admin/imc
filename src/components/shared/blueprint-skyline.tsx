export function BlueprintSkyline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Blueprint line drawing of a building under construction with a tower crane"
    >
      <g opacity="0.9" stroke="currentColor" strokeWidth="1.4">
        {/* ground line */}
        <line x1="20" y1="470" x2="540" y2="470" strokeDasharray="2 5" opacity="0.5" />

        {/* main building block */}
        <rect x="150" y="190" width="220" height="280" strokeWidth="2" />
        {/* floor lines */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1="150" y1={230 + i * 30} x2="370" y2={230 + i * 30} opacity="0.45" />
        ))}
        {/* facade grid columns */}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={i} x1={190 + i * 40} y1="190" x2={190 + i * 40} y2="470" opacity="0.35" />
        ))}

        {/* left low-rise wing */}
        <rect x="60" y="330" width="90" height="140" strokeWidth="2" />
        <line x1="60" y1="365" x2="150" y2="365" opacity="0.45" />
        <line x1="60" y1="400" x2="150" y2="400" opacity="0.45" />
        <line x1="60" y1="435" x2="150" y2="435" opacity="0.45" />

        {/* right podium */}
        <rect x="370" y="380" width="110" height="90" strokeWidth="2" />
        <line x1="370" y1="415" x2="480" y2="415" opacity="0.45" />
        <line x1="370" y1="450" x2="480" y2="450" opacity="0.45" />

        {/* tower crane mast */}
        <line x1="470" y1="470" x2="470" y2="70" strokeWidth="2" />
        <line x1="466" y1="470" x2="466" y2="70" opacity="0.3" />
        {/* crane jib */}
        <line x1="470" y1="80" x2="560" y2="95" strokeWidth="2" />
        <line x1="470" y1="80" x2="330" y2="110" strokeWidth="2" />
        {/* counter-jib lines */}
        <line x1="470" y1="80" x2="530" y2="120" opacity="0.5" />
        <line x1="470" y1="80" x2="360" y2="130" opacity="0.5" />
        {/* hook line */}
        <line x1="330" y1="110" x2="330" y2="175" strokeDasharray="2 4" opacity="0.6" />
        <rect x="320" y="175" width="20" height="14" opacity="0.6" />
        {/* cab */}
        <rect x="458" y="70" width="24" height="16" strokeWidth="1.6" />

        {/* dimension markers */}
        <g opacity="0.55">
          <line x1="150" y1="500" x2="370" y2="500" />
          <line x1="150" y1="494" x2="150" y2="506" />
          <line x1="370" y1="494" x2="370" y2="506" />
        </g>
      </g>

      {/* accent hatch marks, orange */}
      <g stroke="var(--imc-orange-500)" strokeWidth="2" opacity="0.9">
        <line x1="60" y1="470" x2="80" y2="450" />
        <line x1="75" y1="470" x2="95" y2="450" />
        <line x1="90" y1="470" x2="110" y2="450" />
      </g>
    </svg>
  );
}
