import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', isLoading, disabled, className = '', ...props }, ref) => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const disabledClass = (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : '';

    return (
      <button
        ref={ref}
        className={`${baseClass} ${variantClass} ${disabledClass} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="animate-spin mr-2 h-4 w-4 inline" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
