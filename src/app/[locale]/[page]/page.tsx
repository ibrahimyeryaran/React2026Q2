import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { SearchView } from '@/components/SearchView/SearchView';

interface PageProps {
  params: Promise<{ locale: string; page: string }>;
  searchParams: Promise<{ query?: string | string[] }>;
}

export default async function SearchResultsPage({
  params,
  searchParams,
}: PageProps) {
  const { locale, page } = await params;
  const { query } = await searchParams;
  setRequestLocale(locale);

  const pageNum = Number(page);
  if (!Number.isInteger(pageNum) || pageNum < 1) {
    notFound();
  }

  const q = typeof query === 'string' ? query : '';
  return <SearchView page={pageNum} query={q} />;
}
