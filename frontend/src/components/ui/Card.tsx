import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const Card = ({ title, children, className = '', ...props }: CardProps) => {
  return (
    <div className={`card ${className}`} {...props}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      {children}
    </div>
  );
};
