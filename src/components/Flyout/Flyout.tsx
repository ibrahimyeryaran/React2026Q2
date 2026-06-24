'use client';

import { useActionState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearAll } from '@/store/selectedItemsSlice';
import { compileCsvAction, type CsvState } from '@/app/actions';
import styles from './Flyout.module.css';

export function Flyout() {
  const t = useTranslations('Flyout');
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.selectedItems.items);
  const [state, formAction] = useActionState<CsvState | null, FormData>(
    compileCsvAction,
    null
  );

  // The CSV is compiled on the server (server action); the client only triggers
  // the browser download — creating a temporary link is explicitly allowed.
  useEffect(() => {
    if (!state) return;
    const blob = new Blob([state.csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = state.filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  if (items.length === 0) return null;

  return (
    <div className={styles.flyout}>
      <span className={styles.count}>{t('selected', { count: items.length })}</span>
      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${styles.btnUnselect}`}
          onClick={() => dispatch(clearAll())}
        >
          {t('unselectAll')}
        </button>
        <form action={formAction}>
          <input type="hidden" name="items" value={JSON.stringify(items)} />
          <button type="submit" className={`${styles.btn} ${styles.btnDownload}`}>
            {t('download')}
          </button>
        </form>
      </div>
    </div>
  );
}
