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

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
      onClick={handleCardClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
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
      {image && (
        <div className={styles.imageContainer}>
          <img src={image} alt={name} className={styles.image} />
        </div>
      )}
      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        {types && types.length > 0 && (
          <div className={styles.types}>
            {types.map((type) => (
              <span
                key={type}
                className={styles.type}
                style={{ backgroundColor: TYPE_COLORS[type] || '#888' }}
              >
                {type}
              </span>
            ))}
          </div>
        )}
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}

export default Card;
