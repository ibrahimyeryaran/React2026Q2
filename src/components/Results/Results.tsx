import type { ResultsProps } from '../../types';
import Card from '../Card/Card';
import styles from './Results.module.css';

function Results({ items = [], onItemClick }: ResultsProps) {
  return (
    <div>
      <h2 className={styles.title}>Results ({items.length})</h2>
      {items.length === 0 ? (
        <p className={styles.noResults}>
          No items found. Try searching for something!
        </p>
      ) : (
        <div className={styles.cardsList}>
          {items.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              image={item.image}
              height={item.height}
              weight={item.weight}
              types={item.types}
              onClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Results;
