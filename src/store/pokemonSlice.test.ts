import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import pokemonReducer, {
  fetchPokemons,
  setSearchTerm,
} from './pokemonSlice';
import { apiService } from '../services/api';
import type { Item } from '../types';

const sampleItem: Item = {
  id: 25,
  name: 'Pikachu',
  description: 'desc',
  height: 4,
  weight: 60,
  types: ['electric'],
};

describe('pokemonSlice', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns initial state', () => {
    const state = pokemonReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({
      items: [],
      loading: false,
      error: null,
      searchTerm: '',
    });
  });

  it('setSearchTerm updates searchTerm', () => {
    const state = pokemonReducer(undefined, setSearchTerm('pika'));
    expect(state.searchTerm).toBe('pika');
  });

  it('fetchPokemons.pending sets loading to true', () => {
    const action = { type: fetchPokemons.pending.type };
    const state = pokemonReducer(undefined, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchPokemons.fulfilled stores items', () => {
    const action = {
      type: fetchPokemons.fulfilled.type,
      payload: [sampleItem],
    };
    const state = pokemonReducer(undefined, action);
    expect(state.loading).toBe(false);
    expect(state.items).toEqual([sampleItem]);
  });

  it('fetchPokemons.rejected sets error message', () => {
    const action = { type: fetchPokemons.rejected.type };
    const state = pokemonReducer(undefined, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to load items. Please try again.');
  });

  it('thunk fetches all items when searchTerm is empty', async () => {
    const spy = vi
      .spyOn(apiService, 'getAllItems')
      .mockResolvedValue([sampleItem]);

    const store = configureStore({ reducer: { pokemon: pokemonReducer } });
    await store.dispatch(fetchPokemons(''));

    expect(spy).toHaveBeenCalled();
    expect(store.getState().pokemon.items).toEqual([sampleItem]);
  });

  it('thunk uses searchItems when searchTerm provided', async () => {
    const spy = vi
      .spyOn(apiService, 'searchItems')
      .mockResolvedValue([sampleItem]);

    const store = configureStore({ reducer: { pokemon: pokemonReducer } });
    await store.dispatch(fetchPokemons('pika'));

    expect(spy).toHaveBeenCalledWith('pika');
    expect(store.getState().pokemon.items).toEqual([sampleItem]);
  });

  it('thunk sets error when api call fails', async () => {
    vi.spyOn(apiService, 'getAllItems').mockRejectedValue(new Error('boom'));

    const store = configureStore({ reducer: { pokemon: pokemonReducer } });
    await store.dispatch(fetchPokemons(''));

    expect(store.getState().pokemon.error).toBe(
      'Failed to load items. Please try again.'
    );
  });
});
