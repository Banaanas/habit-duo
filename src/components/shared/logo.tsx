import { useId } from "react";

export const Logo = ({ size = 48, variant = 'gradient', className = '' }: LogoProps) => {
  const gradientId = useId();

  const getFill = () => {
    if (variant === 'mono') return 'currentColor';
    if (variant === 'solid') return '#9945ff';
    return `url(#${gradientId})`;
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {variant === 'gradient' && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9945ff" />
            <stop offset="100%" stopColor="#ff6b9d" />
          </linearGradient>
        </defs>
      )}

      {/* Two interlocking rings representing partnership */}
      <circle cx="24" cy="32" r="14" stroke={getFill()} strokeWidth="6" fill="none" />
      <circle cx="40" cy="32" r="14" stroke={getFill()} strokeWidth="6" fill="none" />
    </svg>
  );
};

interface LogoProps {
  size?: number;
  variant?: 'gradient' | 'solid' | 'mono';
  className?: string;
}
