import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-emerald-700 text-white shadow-sm hover:bg-emerald-800',
  secondary:
    'border border-stone-200 bg-stone-100 text-stone-700 hover:bg-amber-100',
  ghost: 'text-stone-700 hover:text-emerald-800',
}

export function Button({
  className = '',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`rounded-lg px-2.5 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200 focus-visible:ring-offset-2 ${variantClasses[variant]} ${className}`}
    />
  )
}
