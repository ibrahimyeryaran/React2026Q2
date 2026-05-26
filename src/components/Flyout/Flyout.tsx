import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearAll } from '../../store/selectedItemsSlice';
import type { Item } from '../../types';
import styles from './Flyout.module.css';

function buildCsv(items: Item[]): string {
  const header = 'id,name,description,detailsUrl,height,weight,types';
  const rows = items.map((item) => {
    const types = (item.types ?? []).join(';');
    const desc = `"${item.description.replace(/"/g, '""')}"`;
    const detailsUrl = `https://pokeapi.co/api/v2/pokemon/${item.id}/`;
    return `${item.id},${item.name},${desc},${detailsUrl},${item.height ?? ''},${item.weight ?? ''},${types}`;
  });
  return [header, ...rows].join('\n');
}

function downloadCsv(items: Item[]) {
  const csv = buildCsv(items);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${items.length}_items.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function Flyout() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.selectedItems.items);

  if (items.length === 0) return null;

  return (
    <div className={styles.flyout}>
      <span className={styles.count}>{items.length} item{items.length !== 1 ? 's' : ''} selected</span>
      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${styles.btnUnselect}`}
          onClick={() => dispatch(clearAll())}
        >
          Unselect all
        </button>
        <button
          className={`${styles.btn} ${styles.btnDownload}`}
          onClick={() => downloadCsv(items)}
        >
          Download
        </button>
      </div>
    </div>
  );
}

export default Flyout;
