export const HabitDuoLogo = ({
  size = 80,
  showText = true,
}: HabitDuoLogoProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Logo Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle for app icon */}
        <circle cx="100" cy="100" r="90" fill="#F0F4F8" />

        {/* First person - left shape */}
        <circle cx="75" cy="85" r="28" fill="#6B9BD1" opacity="0.9" />
        <path
          d="M 75 113 Q 55 125, 50 145 Q 50 155, 60 155 L 90 155 Q 100 155, 100 145 Q 95 125, 75 113 Z"
          fill="#6B9BD1"
          opacity="0.9"
        />

        {/* Second person - right shape */}
        <circle cx="125" cy="85" r="28" fill="#7FD4B5" opacity="0.9" />
        <path
          d="M 125 113 Q 145 125, 150 145 Q 150 155, 140 155 L 110 155 Q 100 155, 100 145 Q 105 125, 125 113 Z"
          fill="#7FD4B5"
          opacity="0.9"
        />

        {/* Connection element - heart/link symbol */}
        <circle cx="100" cy="95" r="8" fill="#FFA5A5" opacity="0.85" />
        <circle cx="90" cy="88" r="5" fill="#FFA5A5" opacity="0.6" />
        <circle cx="110" cy="88" r="5" fill="#FFA5A5" opacity="0.6" />

        {/* Checkmark accent - representing habit tracking */}
        <path
          d="M 85 170 L 95 180 L 115 160"
          stroke="#6B9BD1"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.7"
        />
      </svg>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col items-center">
          <h1
            className="text-[2.5rem] tracking-tight"
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 600,
              color: "#4A5568",
            }}
          >
            HabitDuo
          </h1>
          <p
            className="text-sm tracking-wide"
            style={{
              color: "#7FD4B5",
              fontWeight: 500,
              letterSpacing: "0.15em",
            }}
          >
            TOGETHER
          </p>
        </div>
      )}
    </div>
  );
};

interface HabitDuoLogoProps {
  size?: number;
  showText?: boolean;
}
