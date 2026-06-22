import { getTranslations } from 'next-intl/server';
import { Loader } from '@/components/Loader/Loader';

export default async function Loading() {
  const t = await getTranslations('Common');
  return <Loader label={t('loading')} />;
}
