"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const SelectContext = React.createContext<{
  value: string;
  onChange?: (value: string) => void;
}>({ value: "" });

const Select = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> & {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
  }
>(({ className, placeholder, value, onChange, children, ...props }, ref) => {
  const [open, setOpen] = React.useState(false);
  const selected = value || "";

  return (
    <SelectContext.Provider value={{ value: selected, onChange }}>
      <div
        ref={ref}
        className={cn(
          "relative w-full cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors",
          className
        )}
        onClick={() => setOpen(!open)}
        {...props}
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected || placeholder}
        </span>
        {open && (
          <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg">
            {children}
          </div>
        )}
      </div>
    </SelectContext.Provider>
  );
});
Select.displayName = "Select";

const SelectTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }
>(({ className, placeholder, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "flex-1 truncate",
      !props.children && "text-muted-foreground",
      className
    )}
    {...props}
  >
    {props.children || placeholder}
  </span>
));
SelectValue.displayName = "SelectValue";

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  >
    <div className="p-1">{children}</div>
  </div>
));
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: string }
>(({ className, children, value, ...props }, ref) => {
  const { onChange } = React.useContext(SelectContext);
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      data-value={value}
      onClick={() => onChange?.(value || "")}
      {...props}
    >
      {children}
    </div>
  );
});
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
