type CircularProgressProps = {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
};

export function CircularProgress({
  value,
  color = "#eae8e0",
  size = 120,
  strokeWidth = 10,
}: CircularProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex items-center justify-center">
        <div
            className="relative flex items-center justify-center rounded-full bg-[#0a0a0a]"
            style={{ width: size, height: size }}
        >
            <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="block"
            >
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="rgba(88, 88, 88, 0.4)"
                strokeWidth={strokeWidth}
                fill="none"
            />

            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-[stroke-dashoffset] duration-300 ease-out transform -rotate-90 origin-center"
            />
            </svg>
            <span className="absolute text-xl font-semibold" style={{ color: color }}>
            {clamped.toFixed(0)}%
            </span>
        </div>
    </div>
  );
}
