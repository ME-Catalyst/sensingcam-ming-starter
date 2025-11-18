import { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'error';
}

export const Badge = ({ variant = 'primary', children, className = '', ...props }: BadgeProps) => {
  const baseClass = 'badge';
  const variantClass = `badge-${variant}`;

  return (
    <span className={`${baseClass} ${variantClass} ${className}`} {...props}>
      {children}
    </span>
  );
};
