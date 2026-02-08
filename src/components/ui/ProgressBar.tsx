import type { HTMLAttributes } from 'react';

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

function ProgressBar({
  value,
  variant = 'default',
  size = 'md',
  showLabel = false,
  className = '',
  ...props
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const variants = {
    default: 'bg-[#f7931a]',
    success: 'bg-[#22c55e]',
    warning: 'bg-[#eab308]',
    error: 'bg-[#ef4444]',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={className} {...props}>
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="text-sm text-[#a0a0a0]">Progress</span>
          <span className="text-sm font-medium text-white">{clampedValue}%</span>
        </div>
      )}
      <div className={`w-full bg-[#252525] rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${sizes[size]} rounded-full transition-all duration-300 ${variants[variant]}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}

// Acceptance-specific progress bar
interface AcceptanceBarProps extends HTMLAttributes<HTMLDivElement> {
  accepted: number;
  total: number;
  size?: 'sm' | 'md' | 'lg';
}

function AcceptanceBar({ accepted, total, size = 'md', className = '', ...props }: AcceptanceBarProps) {
  const percentage = total > 0 ? Math.round((accepted / total) * 100) : 0;

  // Color based on acceptance rate
  const getColor = () => {
    if (percentage >= 80) return 'bg-[#22c55e]';
    if (percentage >= 60) return 'bg-[#84cc16]';
    if (percentage >= 40) return 'bg-[#eab308]';
    if (percentage >= 20) return 'bg-[#f97316]';
    return 'bg-[#ef4444]';
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={className} {...props}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-[#a0a0a0]">Endpoint Acceptance</span>
        <span className="text-sm font-medium text-white">
          {percentage}% ({accepted}/{total} endpoints)
        </span>
      </div>
      <div className={`w-full bg-[#252525] rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${sizes[size]} rounded-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export { ProgressBar, AcceptanceBar };
