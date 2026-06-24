import { redirect } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';

// Home redirects to the first results page.
export default async function LocaleIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  redirect({ href: '/1', locale });
}
