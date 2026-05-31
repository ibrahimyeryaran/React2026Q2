import { configureStore } from '@reduxjs/toolkit';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { pokemonApi } from './pokemonApi';
import {
  createFetchMock,
  urlOf,
  type MockPokemon,
} from '../test-utils/mockFetch';

const mockPokemons: MockPokemon[] = [
  { id: 1, name: 'Bulbasaur', type: 'grass' },
  { id: 2, name: 'Charmander', type: 'fire' },
];

const makeApiStore = () =>
  configureStore({
    reducer: { [pokemonApi.reducerPath]: pokemonApi.reducer },
    middleware: (gDM) => gDM().concat(pokemonApi.middleware),
  });

const countListCalls = (mock: ReturnType<typeof vi.fn>) =>
  mock.mock.calls.filter((c) => urlOf(c[0]).includes('pokemon?limit')).length;

describe('pokemonApi', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = createFetchMock(mockPokemons);
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('getAllPokemons returns mapped items on success', async () => {
    const store = makeApiStore();
    const result = await store.dispatch(
      pokemonApi.endpoints.getAllPokemons.initiate()
    );

    expect(result.data).toHaveLength(2);
    expect(result.data?.[0].name).toBe('Bulbasaur');
    expect(result.data?.[0].types).toEqual(['grass']);
  });

  it('getAllPokemons tracks loading state then resolves', async () => {
    const store = makeApiStore();
    const promise = store.dispatch(
      pokemonApi.endpoints.getAllPokemons.initiate()
    );

    const pending = pokemonApi.endpoints.getAllPokemons.select()(
      store.getState()
    );
    expect(pending.isLoading).toBe(true);

    await promise;

    const fulfilled = pokemonApi.endpoints.getAllPokemons.select()(
      store.getState()
    );
    expect(fulfilled.isSuccess).toBe(true);
    expect(fulfilled.isLoading).toBe(false);
  });

  it('getAllPokemons surfaces an error when the request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('boom', { status: 500 }))
    );
    const store = makeApiStore();
    const result = await store.dispatch(
      pokemonApi.endpoints.getAllPokemons.initiate()
    );

    expect(result.isError).toBe(true);
    expect(result.error).toBeDefined();
  });

  it('caches the list so repeated reads do not refetch', async () => {
    const store = makeApiStore();

    await store.dispatch(pokemonApi.endpoints.getAllPokemons.initiate());
    const callsAfterFirst = countListCalls(fetchMock);

    // Second subscription should be served from cache.
    await store.dispatch(pokemonApi.endpoints.getAllPokemons.initiate());
    const callsAfterSecond = countListCalls(fetchMock);

    expect(callsAfterSecond).toBe(callsAfterFirst);
  });

  it('refetches the list after cache invalidation', async () => {
    const store = makeApiStore();

    // Keep an active subscription so invalidation triggers an automatic refetch.
    const subscription = store.dispatch(
      pokemonApi.endpoints.getAllPokemons.initiate()
    );
    const first = await subscription.unwrap();
    expect(first).toHaveLength(2);

    const callsBefore = countListCalls(fetchMock);
    expect(callsBefore).toBeGreaterThan(0);

    store.dispatch(pokemonApi.util.invalidateTags(['PokemonList']));

    await vi.waitFor(() => {
      expect(countListCalls(fetchMock)).toBeGreaterThan(callsBefore);
    });

    subscription.unsubscribe();
  });

  it('getPokemonById returns a single mapped item', async () => {
    const store = makeApiStore();
    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonById.initiate(2)
    );

    expect(result.data?.name).toBe('Charmander');
    expect(result.data?.id).toBe(2);
  });

  it('getPokemonById caches per id and avoids duplicate requests', async () => {
    const store = makeApiStore();

    await store.dispatch(pokemonApi.endpoints.getPokemonById.initiate(1));
    const detailCalls = () =>
      fetchMock.mock.calls.filter((c) => /pokemon\/1$/.test(urlOf(c[0]))).length;
    const callsAfterFirst = detailCalls();

    await store.dispatch(pokemonApi.endpoints.getPokemonById.initiate(1));
    expect(detailCalls()).toBe(callsAfterFirst);
  });
});
