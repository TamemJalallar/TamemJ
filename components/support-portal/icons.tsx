import type { SVGProps } from "react";

export type SupportIconName =
  | "home"
  | "book"
  | "catalog"
  | "incident"
  | "tickets"
  | "analytics"
  | "admin"
  | "search"
  | "chevron"
  | "menu"
  | "close";

interface SupportIconProps extends SVGProps<SVGSVGElement> {
  name: SupportIconName;
}

export function SupportIcon({ name, className, ...props }: SupportIconProps) {
  const commonProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    ...props
  };

  switch (name) {
    case "home":
      return (
        <svg {...commonProps}>
          <path d="M3 10.5L12 3l9 7.5" />
          <path d="M5.5 9.5V21h13V9.5" />
          <path d="M9.5 21v-6h5v6" />
        </svg>
      );
    case "book":
      return (
        <svg {...commonProps}>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
          <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" />
          <path d="M8 7h8" />
          <path d="M8 10.5h6" />
        </svg>
      );
    case "catalog":
      return (
        <svg {...commonProps}>
          <rect x="3" y="4" width="18" height="16" rx="2.5" />
          <path d="M3 9h18" />
          <path d="M8 4v16" />
          <path d="M12 13h5" />
          <path d="M12 16.5h3.5" />
        </svg>
      );
    case "incident":
      return (
        <svg {...commonProps}>
          <path d="M12 3 3.5 19h17L12 3Z" />
          <path d="M12 9v4.5" />
          <path d="M12 17h.01" />
        </svg>
      );
    case "tickets":
      return (
        <svg {...commonProps}>
          <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H21v5a2 2 0 0 0 0 4v5H6.5A2.5 2.5 0 0 1 4 16.5v-9Z" />
          <path d="M8.5 9.5h6" />
          <path d="M8.5 13h8" />
          <path d="M8.5 16.5h4" />
        </svg>
      );
    case "analytics":
      return (
        <svg {...commonProps}>
          <path d="M4 20V9.5" />
          <path d="M10 20V4" />
          <path d="M16 20v-7" />
          <path d="M22 20v-11" />
          <path d="M2 20h20" />
        </svg>
      );
    case "admin":
      return (
        <svg {...commonProps}>
          <path d="M12 3v3" />
          <path d="M12 18v3" />
          <path d="M3 12h3" />
          <path d="M18 12h3" />
          <path d="m5.6 5.6 2.1 2.1" />
          <path d="m16.3 16.3 2.1 2.1" />
          <path d="m18.4 5.6-2.1 2.1" />
          <path d="m7.7 16.3-2.1 2.1" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
    case "search":
      return (
        <svg {...commonProps}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );
    case "chevron":
      return (
        <svg {...commonProps}>
          <path d="m9 6 6 6-6 6" />
        </svg>
      );
    case "menu":
      return (
        <svg {...commonProps}>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h12" />
        </svg>
      );
    case "close":
      return (
        <svg {...commonProps}>
          <path d="m6 6 12 12" />
          <path d="M18 6 6 18" />
        </svg>
      );
    default:
      return null;
  }
}
