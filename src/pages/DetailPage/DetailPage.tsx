import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../../services/api';
import type { Item } from '../../types';
import Loader from '../../components/Loader/Loader';
import styles from './DetailPage.module.css';

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

function DetailPage() {
  const { detailId } = useParams<{ detailId: string }>();
  const [pokemon, setPokemon] = useState<Item | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!detailId) return;
    const id = parseInt(detailId, 10);
    if (isNaN(id)) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.getPokemonById(id);
        setPokemon(data);
      } catch {
        setError('Failed to load details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [detailId]);

  if (loading) return <Loader />;

  if (error)
    return <p className={styles.error}>{error}</p>;

  if (!pokemon) return null;

  return (
    <div className={styles.detail}>
      {pokemon.image && (
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className={styles.image}
        />
      )}
      <h2 className={styles.name}>{pokemon.name}</h2>
      {pokemon.types && pokemon.types.length > 0 && (
        <div className={styles.types}>
          {pokemon.types.map((type) => (
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
      {pokemon.height !== undefined && (
        <p className={styles.stat}>
          <strong>Height:</strong> {(pokemon.height / 10).toFixed(1)} m
        </p>
      )}
      {pokemon.weight !== undefined && (
        <p className={styles.stat}>
          <strong>Weight:</strong> {(pokemon.weight / 10).toFixed(1)} kg
        </p>
      )}
    </div>
  );
}

export default DetailPage;
