'use client';

import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { ThemeToggle } from './ThemeToggle';
import { LocaleSwitcher } from './LocaleSwitcher';
import styles from './Header.module.css';

export function Header() {
  const t = useTranslations('Header');
  const pathname = usePathname();
  const isAbout = pathname.startsWith('/about');

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{t('title')}</h1>
      <nav className={styles.nav}>
        <Link
          href="/1"
          className={isAbout ? styles.navLink : styles.navLinkActive}
        >
          {t('home')}
        </Link>
        <Link
          href="/about"
          className={isAbout ? styles.navLinkActive : styles.navLink}
        >
          {t('about')}
        </Link>
        <Suspense fallback={null}>
          <LocaleSwitcher />
        </Suspense>
        <ThemeToggle />
      </nav>
    </header>
  );
}
