import { getTranslations, setRequestLocale } from 'next-intl/server';
import styles from './about.module.css';

// Statically generated server component (SSG): no client components,
// no runtime data fetching.
export const dynamic = 'force-static';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('About');

  return (
    <main className={styles.about}>
      <h1 className={styles.title}>{t('title')}</h1>
      <p className={styles.lead}>{t('intro')}</p>
      <p className={styles.paragraph}>{t('paragraph1')}</p>
      <p className={styles.paragraph}>{t('paragraph2')}</p>
      <p className={styles.stack}>{t('stack')}</p>
    </main>
  );
}
