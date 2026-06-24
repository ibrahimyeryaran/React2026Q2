'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './ErrorTestButton.module.css';

// Throws during render when clicked, so the nearest Next.js error boundary
// (error.tsx) catches it — preserving the "Test Error Boundary" feature.
export function ErrorTestButton() {
  const t = useTranslations('ErrorBoundary');
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Test error triggered by user!');
  }

  return (
    <button className={styles.button} onClick={() => setShouldThrow(true)}>
      {t('trigger')}
    </button>
  );
}
