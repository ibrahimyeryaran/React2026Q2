'use client';

import { useTranslations } from 'next-intl';
import styles from './error.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('ErrorBoundary');

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t('title')}</h2>
      <p className={styles.message}>{error.message}</p>
      <button className={styles.button} onClick={reset}>
        {t('reload')}
      </button>
    </div>
  );
}
