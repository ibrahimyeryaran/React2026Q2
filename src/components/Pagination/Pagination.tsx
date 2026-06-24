import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { queryString } from '@/lib/href';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  query: string;
}

export async function Pagination({
  currentPage,
  totalPages,
  query,
}: PaginationProps) {
  const t = await getTranslations('Pagination');
  const qs = queryString(query);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={styles.pagination}>
      {currentPage > 1 ? (
        <Link href={`/${currentPage - 1}${qs}`} className={styles.button}>
          {t('prev')}
        </Link>
      ) : (
        <span className={`${styles.button} ${styles.disabled}`}>{t('prev')}</span>
      )}

      <div className={styles.pages}>
        {pages.map((page) => (
          <Link
            key={page}
            href={`/${page}${qs}`}
            className={`${styles.button} ${page === currentPage ? styles.active : ''}`}
          >
            {page}
          </Link>
        ))}
      </div>

      {currentPage < totalPages ? (
        <Link href={`/${currentPage + 1}${qs}`} className={styles.button}>
          {t('next')}
        </Link>
      ) : (
        <span className={`${styles.button} ${styles.disabled}`}>{t('next')}</span>
      )}
    </div>
  );
}
