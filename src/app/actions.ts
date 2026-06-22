'use server';

import { getLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { buildCsv } from '@/lib/csv';
import type { Item } from '@/types';

/**
 * Handles the search form submission on the server and redirects to page 1
 * with the query as a search param (locale-aware).
 */
export async function searchAction(formData: FormData): Promise<void> {
  const query = String(formData.get('query') ?? '').trim();
  const locale = await getLocale();
  const href = query ? `/1?query=${encodeURIComponent(query)}` : '/1';
  redirect({ href, locale });
}

export interface CsvState {
  csv: string;
  filename: string;
}

/**
 * Compiles the selected items into a CSV string on the server.
 * Invoked from the client via useActionState; the client triggers the download.
 */
export async function compileCsvAction(
  _prevState: CsvState | null,
  formData: FormData
): Promise<CsvState> {
  const raw = String(formData.get('items') ?? '[]');
  let items: Item[] = [];
  try {
    items = JSON.parse(raw) as Item[];
  } catch {
    items = [];
  }

  return {
    csv: buildCsv(items),
    filename: `${items.length}_items.csv`,
  };
}
