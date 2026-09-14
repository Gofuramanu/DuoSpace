import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Button = forwardRef(({ className, variant = 'primary', ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-label-md font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";
  const variants = {
    primary: "bg-accent text-white hover:bg-accent/90",
    secondary: "bg-slate-100 text-primary hover:bg-slate-200",
    outline: "border border-border bg-transparent hover:bg-slate-100 text-primary",
  };
  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    />
  );
});

Button.displayName = 'Button';
export { Button };
