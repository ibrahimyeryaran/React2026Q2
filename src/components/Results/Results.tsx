import { getTranslations } from 'next-intl/server';
import { Card } from '../Card/Card';
import { queryString } from '@/lib/href';
import type { Item } from '@/types';
import styles from './Results.module.css';

interface ResultsProps {
  items: Item[];
  count: number;
  page: number;
  query: string;
}

export async function Results({ items, count, page, query }: ResultsProps) {
  const t = await getTranslations('Results');
  const qs = queryString(query);

  return (
    <div>
      <h2 className={styles.title}>{t('title', { count })}</h2>
      {items.length === 0 ? (
        <p className={styles.noResults}>{t('empty')}</p>
      ) : (
        <div className={styles.cardsList}>
          {items.map((item) => (
            <Card
              key={item.id}
              item={item}
              detailHref={`/${page}/details/${item.id}${qs}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
