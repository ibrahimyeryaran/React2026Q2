import type { Item, PokemonDetail } from '../types';

export const getPokemonDescription = (data: PokemonDetail): string => {
  const heightM = (data.height / 10).toFixed(1);
  const weightKg = (data.weight / 10).toFixed(1);
  const types = data.types.map((t) => t.type.name).join('/');
  return `Height: ${heightM}m | Weight: ${weightKg}kg | Type: ${types}`;
};

export const mapPokemonDetailToItem = (data: PokemonDetail): Item => ({
  id: data.id,
  name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
  description: getPokemonDescription(data),
  image:
    data.sprites.other?.['official-artwork']?.front_default ||
    data.sprites.front_default,
  height: data.height,
  weight: data.weight,
  types: data.types.map((t) => t.type.name),
});
