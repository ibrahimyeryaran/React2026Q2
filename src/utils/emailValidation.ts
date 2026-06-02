/**
 * Minimal, regex-free email structural validation:
 * - exactly one "@"
 * - non-empty local part
 * - domain contains at least one dot, with non-empty labels
 */
export function isValidEmail(email: string): boolean {
  const parts = email.split('@');
  if (parts.length !== 2) return false;

  const [local, domain] = parts;
  if (local.length === 0) return false;
  if (domain.length === 0) return false;

  if (!domain.includes('.')) return false;

  const labels = domain.split('.');
  if (labels.some((label) => label.length === 0)) return false;

  return true;
}
