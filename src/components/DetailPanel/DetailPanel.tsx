import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getPokemonById } from '@/lib/pokemon';
import { TYPE_COLORS, buildGradient } from '@/lib/pokemonTypeStyles';
import styles from './DetailPanel.module.css';

interface DetailPanelProps {
  id: number;
  closeHref: string;
}

// Server component: fetches the selected Pokémon on the server.
export async function DetailPanel({ id, closeHref }: DetailPanelProps) {
  const t = await getTranslations('Detail');
  const pokemon = await getPokemonById(id);

  if (!pokemon) {
    return (
      <div className={styles.panel}>
        <Link href={closeHref} className={styles.close}>
          {t('close')}
        </Link>
        <p className={styles.error}>{t('notFound')}</p>
      </div>
    );
  }

  const borderColor =
    pokemon.types && pokemon.types[0]
      ? TYPE_COLORS[pokemon.types[0]]
      : 'var(--color-border)';

  return (
    <div className={styles.panel} style={{ borderColor }}>
      <Link href={closeHref} className={styles.close}>
        {t('close')}
      </Link>
      <div
        className={styles.imageContainer}
        style={{ background: buildGradient(pokemon.types) }}
      >
        {pokemon.image && (
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            width={200}
            height={200}
            className={styles.image}
          />
        )}
      </div>
      <div className={styles.content}>
        <h2 className={styles.name}>{pokemon.name}</h2>
        <div className={styles.divider} style={{ borderColor }} />
        {pokemon.types && pokemon.types.length > 0 && (
          <p className={styles.infoLine}>
            <span className={styles.infoLabel}>{t('types')}</span>{' '}
            {pokemon.types.join(', ')}
          </p>
        )}
        {pokemon.height !== undefined && (
          <p className={styles.infoLine}>
            <span className={styles.infoLabel}>{t('height')}</span>{' '}
            {(pokemon.height / 10).toFixed(1)} m
          </p>
        )}
        {pokemon.weight !== undefined && (
          <p className={styles.infoLine}>
            <span className={styles.infoLabel}>{t('weight')}</span>{' '}
            {(pokemon.weight / 10).toFixed(1)} kg
          </p>
        )}
      </div>
    </div>
  );
}
