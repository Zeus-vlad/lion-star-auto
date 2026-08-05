"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Select = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
  }
>(({ className, placeholder, value, onChange, ...props }, ref) => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(value || "");

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full cursor-text rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors",
        className
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      <span className={selected ? "text-foreground" : "text-muted-foreground"}>
        {selected || placeholder}
      </span>
      {/* Simple select implementation */}
    </div>
  );
});
Select.displayName = "Select";

export { Select };
