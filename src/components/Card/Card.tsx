import type { CardProps } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleItem } from '../../store/selectedItemsSlice';
import styles from './Card.module.css';

const TYPE_COLORS: Record<string, string> = {
  grass: '#78c850',
  fire: '#f08030',
  water: '#6890f0',
  electric: '#f8d030',
  psychic: '#f85888',
  ice: '#98d8d8',
  dragon: '#7038f8',
  dark: '#705848',
  fairy: '#ee99ac',
  normal: '#a8a878',
  fighting: '#c03028',
  flying: '#a890f0',
  poison: '#a040a0',
  ground: '#e0c068',
  rock: '#b8a038',
  bug: '#a8b820',
  ghost: '#705898',
  steel: '#b8b8d0',
};

const TYPE_GRADIENT_STOPS: Record<string, [string, string]> = {
  grass: ['#a8e063', '#c2f8c8'],
  fire: ['#ff9966', '#ffcca8'],
  water: ['#56ccf2', '#a8d8f5'],
  electric: ['#fceabb', '#f8d030'],
  psychic: ['#f6d365', '#fda085'],
  ice: ['#a1c4fd', '#c2e9fb'],
  dragon: ['#5b86e5', '#36d1dc'],
  dark: ['#5a5a5a', '#909090'],
  fairy: ['#ff9a9e', '#fad0c4'],
  normal: ['#d7d2cc', '#cfc9c4'],
  fighting: ['#e07050', '#f0a890'],
  flying: ['#a8c0ff', '#c9b6ff'],
  poison: ['#c878c8', '#e0a8e0'],
  ground: ['#e0c068', '#f0d894'],
  rock: ['#c8b070', '#e0c890'],
  bug: ['#b8d038', '#d4e870'],
  ghost: ['#9078b8', '#b89cd0'],
  steel: ['#c0c0d0', '#d8d8e0'],
};

function buildGradient(types?: string[]): string {
  const fallback: [string, string] = ['#e0e0e0', '#b0b0b0'];
  if (!types || types.length === 0) {
    return `linear-gradient(135deg, ${fallback[0]}, ${fallback[1]})`;
  }
  const first = TYPE_GRADIENT_STOPS[types[0]] ?? fallback;
  if (types.length < 2) {
    return `linear-gradient(135deg, ${first[0]}, ${first[1]})`;
  }
  const second = TYPE_GRADIENT_STOPS[types[1]] ?? first;
  return `linear-gradient(135deg, ${first[0]}, ${second[1]})`;
}

function Card({ name, description, image, types, id, height, weight, onClick }: CardProps) {
  const dispatch = useAppDispatch();
  const isSelected = useAppSelector((state) =>
    state.selectedItems.items.some((i) => i.id === id)
  );

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(id);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    dispatch(toggleItem({ id, name, description, image, height, weight, types }));
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const borderColor = types && types[0] ? TYPE_COLORS[types[0]] : undefined;

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
      onClick={handleCardClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        borderColor: isSelected ? undefined : borderColor,
      }}
    >
      <div className={styles.checkboxWrapper}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={isSelected}
          onChange={handleCheckboxChange}
          onClick={handleCheckboxClick}
          aria-label={`Select ${name}`}
        />
      </div>
      <div
        className={styles.imageContainer}
        style={{ background: buildGradient(types) }}
      >
        {types && types.length > 0 && (
          <div className={styles.typeBadges}>
            {types.map((type) => (
              <span
                key={type}
                className={styles.typeBadge}
                style={{ backgroundColor: TYPE_COLORS[type] || '#888' }}
              >
                <span className={styles.typeDot} />
                {type}
              </span>
            ))}
          </div>
        )}
        {image && <img src={image} alt={name} className={styles.image} />}
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        <div
          className={styles.divider}
          style={{ borderColor: borderColor ?? 'var(--color-border)' }}
        />
        {types && types.length > 0 && (
          <p className={styles.infoLine}>
            <span className={styles.infoLabel}>Types:</span> {types.join(', ')}
          </p>
        )}
        {height !== undefined && (
          <p className={styles.infoLine}>
            <span className={styles.infoLabel}>Height:</span> {height}
          </p>
        )}
        {weight !== undefined && (
          <p className={styles.infoLine}>
            <span className={styles.infoLabel}>Weight:</span> {weight}
          </p>
        )}
      </div>
    </div>
  );
}

export default Card;
