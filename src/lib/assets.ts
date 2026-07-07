export function assetPath(path: string): string {
  const base = import.meta.env.BASE_URL || "./";
  return `${base}${path}`.replace(/\/{2,}/g, "/").replace(/^\.\//, "./");
}

export function cssAssetPath(path: string): string {
  const resolved = assetPath(path);

  if (typeof window === "undefined") {
    return resolved;
  }

  return new URL(resolved, window.location.href).pathname;
}

export function absoluteAssetUrl(path: string): string {
  const resolved = assetPath(path);

  if (typeof window === "undefined") {
    return resolved;
  }

  return new URL(resolved, window.location.href).href;
}
