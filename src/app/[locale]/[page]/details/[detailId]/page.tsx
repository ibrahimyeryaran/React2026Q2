import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { SearchView } from '@/components/SearchView/SearchView';

interface PageProps {
  params: Promise<{ locale: string; page: string; detailId: string }>;
  searchParams: Promise<{ query?: string | string[] }>;
}

export default async function DetailRoutePage({
  params,
  searchParams,
}: PageProps) {
  const { locale, page, detailId } = await params;
  const { query } = await searchParams;
  setRequestLocale(locale);

  const pageNum = Number(page);
  const idNum = Number(detailId);
  if (!Number.isInteger(pageNum) || pageNum < 1 || !Number.isInteger(idNum)) {
    notFound();
  }

  const q = typeof query === 'string' ? query : '';
  return <SearchView page={pageNum} query={q} selectedId={idNum} />;
}
