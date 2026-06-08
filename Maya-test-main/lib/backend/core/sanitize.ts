export function sanitizeText(input: string) {
  return input.replace(/[<>]/g, "").trim();
}

export function sanitizeOptionalText(input?: string | null) {
  return input ? sanitizeText(input) : undefined;
}
