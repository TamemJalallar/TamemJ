function toBool(value: string | undefined): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

export const appsSectionEnabled = toBool(process.env.NEXT_PUBLIC_SHOW_APPS_SECTION);

