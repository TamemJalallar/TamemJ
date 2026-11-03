"use client";

import { useEffect, useState } from "react";
import { SupportIcon } from "@/components/support-portal/icons";

interface TopSearchBarProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  buttonLabel?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onClear?: () => void;
  className?: string;
  autoFocus?: boolean;
}

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function TopSearchBar({
  value,
  defaultValue = "",
  placeholder = "Search...",
  buttonLabel = "Search",
  onChange,
  onSubmit,
  onClear,
  className,
  autoFocus = false
}: TopSearchBarProps) {
  const isControlled = typeof value === "string";
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? value : internalValue;

  useEffect(() => {
    if (!isControlled) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue, isControlled]);

  function setValue(next: string) {
    if (!isControlled) {
      setInternalValue(next);
    }
    onChange?.(next);
  }

  return (
    <form
      className={cx("flex flex-col gap-2 sm:flex-row sm:items-center", className)}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(currentValue);
      }}
      role="search"
    >
      <div className="relative flex-1">
        <SupportIcon
          name="search"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          value={currentValue}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="form-input py-2.5 pl-9 pr-10"
        />
        {currentValue ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setValue("");
              onClear?.();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-muted transition hover:bg-neutral-100 hover:text-fg dark:hover:bg-white/10"
          >
            Clear
          </button>
        ) : null}
      </div>
      <button type="submit" className="btn-primary h-10 shrink-0 px-4 py-0">
        {buttonLabel}
      </button>
    </form>
  );
}
