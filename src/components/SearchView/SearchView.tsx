import { getTranslations } from 'next-intl/server';
import { getAllPokemons, filterAndPaginate } from '@/lib/pokemon';
import { SearchForm } from '../Search/SearchForm';
import { Results } from '../Results/Results';
import { Pagination } from '../Pagination/Pagination';
import { DetailPanel } from '../DetailPanel/DetailPanel';
import styles from './SearchView.module.css';

interface SearchViewProps {
  page: number;
  query: string;
  selectedId?: number;
}

// Server component: renders the search list and the details-panel container
// entirely on the server (initial SSR + SEO-friendly markup).
export async function SearchView({ page, query, selectedId }: SearchViewProps) {
  const t = await getTranslations('Detail');
  const all = await getAllPokemons();
  const { items, totalItems, totalPages, page: safePage } = filterAndPaginate(
    all,
    query,
    page
  );
  const qs = query ? `?query=${encodeURIComponent(query)}` : '';
  const closeHref = `/${safePage}${qs}`;

  return (
    <main className={styles.main}>
      <div className={styles.split}>
        <section className={styles.left}>
          <SearchForm defaultQuery={query} />
          <Results items={items} count={totalItems} page={safePage} query={query} />
          {totalPages > 1 && (
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              query={query}
            />
          )}
        </section>
        <aside className={styles.right}>
          {selectedId ? (
            <DetailPanel id={selectedId} closeHref={closeHref} />
          ) : (
            <div className={styles.placeholder}>{t('empty')}</div>
          )}
        </aside>
      </div>
    </main>
  );
}
