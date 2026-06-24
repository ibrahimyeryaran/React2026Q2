/** Builds the `?query=...` suffix (empty when there is no query). */
export function queryString(query: string): string {
  return query ? `?query=${encodeURIComponent(query)}` : '';
}
