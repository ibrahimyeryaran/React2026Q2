import { getTranslations } from 'next-intl/server';
import { searchAction } from '@/app/actions';
import styles from './Search.module.css';

// Server component: the form is wired directly to a server action, so the
// search submission is handled on the server (no client-only fetch).
export async function SearchForm({ defaultQuery }: { defaultQuery: string }) {
  const t = await getTranslations('Search');

  return (
    <form action={searchAction} className={styles.wrapper}>
      <input
        type="text"
        name="query"
        defaultValue={defaultQuery}
        placeholder={t('placeholder')}
        className={styles.input}
        aria-label={t('placeholder')}
      />
      <button type="submit" className={styles.button}>
        {t('button')}
      </button>
    </form>
  );
}
