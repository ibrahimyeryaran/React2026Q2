'use client';

import type { ChangeEvent } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleItem } from '@/store/selectedItemsSlice';
import { TYPE_COLORS, buildGradient } from '@/lib/pokemonTypeStyles';
import type { Item } from '@/types';
import styles from './Card.module.css';

interface CardProps {
  item: Item;
  detailHref: string;
}

export function Card({ item, detailHref }: CardProps) {
  const { id, name, image, types, height, weight } = item;
  const t = useTranslations('Card');
  const dispatch = useAppDispatch();
  const isSelected = useAppSelector((state) =>
    state.selectedItems.items.some((i) => i.id === id)
  );

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    dispatch(toggleItem(item));
  };

  const borderColor = types && types[0] ? TYPE_COLORS[types[0]] : undefined;

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
      style={{ borderColor: isSelected ? undefined : borderColor }}
    >
      {/* Checkbox sits above the link (sibling, not nested) so selecting an
          item does not trigger navigation. */}
      <div className={styles.checkboxWrapper}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={isSelected}
          onChange={handleCheckboxChange}
          aria-label={t('select', { name })}
        />
      </div>

      <Link href={detailHref} className={styles.cardLink}>
        <div className={styles.imageContainer} style={{ background: buildGradient(types) }}>
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
          {image && (
            <Image
              src={image}
              alt={name}
              width={150}
              height={150}
              className={styles.image}
            />
          )}
        </div>
        <div className={styles.content}>
          <h3 className={styles.name}>{name}</h3>
          <div
            className={styles.divider}
            style={{ borderColor: borderColor ?? 'var(--color-border)' }}
          />
          {types && types.length > 0 && (
            <p className={styles.infoLine}>
              <span className={styles.infoLabel}>{t('types')}</span> {types.join(', ')}
            </p>
          )}
          {height !== undefined && (
            <p className={styles.infoLine}>
              <span className={styles.infoLabel}>{t('height')}</span> {height}
            </p>
          )}
          {weight !== undefined && (
            <p className={styles.infoLine}>
              <span className={styles.infoLabel}>{t('weight')}</span> {weight}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
