import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({ className, variant = 'default', children, ...props }) {
  const variants = {
    default: "bg-slate-100 text-primary",
    success: "bg-success/10 text-success",
    pending: "bg-pending/10 text-pending",
    urgent: "bg-urgent/10 text-urgent",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-label-sm uppercase",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
