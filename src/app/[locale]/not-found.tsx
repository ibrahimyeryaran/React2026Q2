import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import styles from './not-found.module.css';

export default async function NotFound() {
  const t = await getTranslations('NotFound');

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>{t('title')}</h1>
      <p className={styles.description}>{t('description')}</p>
      <Link href="/1" className={styles.link}>
        {t('backHome')}
      </Link>
    </main>
  );
}
