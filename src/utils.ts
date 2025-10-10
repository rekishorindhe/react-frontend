export let idCounter = 0;

export function uid(prefix = "z") {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter.toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function isValidHexColor(color: string): boolean {
  return typeof color === "string" && /^#[0-9A-Fa-f]{6}$/.test(color);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function safeString(value: any, fallback: string = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function safeTextToPlain(html: string) {
  return html
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<\/(h\d|p|div|tr|table|li|br)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{2,}/g, "\n\n")
    .trim();
}