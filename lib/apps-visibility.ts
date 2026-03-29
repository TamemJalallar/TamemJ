function toBool(value: string | undefined): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

const appsVisibilityEnv = process.env.NEXT_PUBLIC_SHOW_APPS_SECTION;
export const appsSectionEnabled =
  typeof appsVisibilityEnv === "string" && appsVisibilityEnv.trim().length > 0
    ? toBool(appsVisibilityEnv)
    : true;
