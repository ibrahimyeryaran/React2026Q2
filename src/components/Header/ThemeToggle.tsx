'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from '@/hooks/useTheme';
import styles from './Header.module.css';

export function ThemeToggle() {
  const t = useTranslations('Header');
  const { theme, toggleTheme } = useTheme();

  return (
    <button className={styles.themeToggle} onClick={toggleTheme}>
      {theme === 'light' ? t('themeToDark') : t('themeToLight')}
    </button>
  );
}
