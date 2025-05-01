import { HTMLAttributes, ReactNode } from 'react'

export type ProgressVariant = 'primary' | 'success' | 'warning' | 'danger'
export type ProgressSize = 'xs' | 'sm' | 'md' | 'lg'

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  variant?: ProgressVariant
  size?: ProgressSize
  showLabel?: boolean
  labelFormat?: (value: number, max: number) => ReactNode
  animate?: boolean
  className?: string
}

interface ProgressBarStyleConfig {
  bar: string
  track: string
  text: string
}

const variantStyles: Record<ProgressVariant, ProgressBarStyleConfig> = {
  primary: {
    bar: 'bg-blue-500',
    track: 'bg-blue-100',
    text: 'text-blue-800'
  },
  success: {
    bar: 'bg-green-500',
    track: 'bg-green-100',
    text: 'text-green-800'
  },
  warning: {
    bar: 'bg-amber-500',
    track: 'bg-amber-100',
    text: 'text-amber-800'
  },
  danger: {
    bar: 'bg-red-500',
    track: 'bg-red-100',
    text: 'text-red-800'
  }
}

const sizeStyles: Record<ProgressSize, string> = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4'
}

const textSizeStyles: Record<ProgressSize, string> = {
  xs: 'text-xs',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-sm'
}

interface ProgressTrackProps {
  variant: ProgressVariant
  children: ReactNode
  ariaProps: {
    valuenow: number
    valuemin: number
    valuemax: number
  }
}

function ProgressTrack({ variant, children, ariaProps }: ProgressTrackProps) {
  return (
    <div
      className={`flex-1 overflow-hidden rounded-full ${variantStyles[variant].track}`}
      role='progressbar'
      aria-valuenow={ariaProps.valuenow}
      aria-valuemin={ariaProps.valuemin}
      aria-valuemax={ariaProps.valuemax}
    >
      {children}
    </div>
  )
}

interface ProgressBarFillProps {
  percentage: number
  size: ProgressSize
  variant: ProgressVariant
  animate: boolean
}

function ProgressBarFill({
  percentage,
  size,
  variant,
  animate
}: ProgressBarFillProps) {
  return (
    <div
      className={`${sizeStyles[size]} ${variantStyles[variant].bar} rounded-full transition-all duration-300 ease-out ${animate ? 'animate-pulse' : ''}`}
      style={{ width: `${percentage}%` }}
    ></div>
  )
}

interface ProgressLabelProps {
  clampedValue: number
  max: number
  size: ProgressSize
  variant: ProgressVariant
  labelFormat?: (value: number, max: number) => ReactNode
}

function ProgressLabel({
  clampedValue,
  max,
  size,
  variant,
  labelFormat
}: ProgressLabelProps) {
  return (
    <span
      className={`flex-shrink-0 ${textSizeStyles[size]} font-medium ${variantStyles[variant].text}`}
    >
      {labelFormat
        ? labelFormat(clampedValue, max)
        : `${Math.round((clampedValue / max) * 100)}%`}
    </span>
  )
}

export function ProgressBar({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = true,
  labelFormat,
  animate = false,
  className = '',
  ...props
}: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(value, max))
  const percentage = (clampedValue / max) * 100

  return (
    <div className={`w-full ${className}`} {...props}>
      <div className='flex items-center gap-3'>
        <ProgressTrack
          variant={variant}
          ariaProps={{ valuenow: clampedValue, valuemin: 0, valuemax: max }}
        >
          <ProgressBarFill
            percentage={percentage}
            size={size}
            variant={variant}
            animate={animate}
          />
        </ProgressTrack>

        {showLabel && (
          <ProgressLabel
            clampedValue={clampedValue}
            max={max}
            size={size}
            variant={variant}
            labelFormat={labelFormat}
          />
        )}
      </div>
    </div>
  )
}
