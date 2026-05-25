import { describe, it, expect } from 'vitest';
import reducer, { toggleItem, clearAll } from './selectedItemsSlice';
import type { Item } from '../types';

const item1: Item = { id: 1, name: 'Bulbasaur', description: 'desc' };
const item2: Item = { id: 2, name: 'Charmander', description: 'desc' };

describe('selectedItemsSlice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual({ items: [] });
  });

  it('toggleItem adds item when not present', () => {
    const state = reducer({ items: [] }, toggleItem(item1));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe(1);
  });

  it('toggleItem removes item when already present', () => {
    const state = reducer({ items: [item1] }, toggleItem(item1));
    expect(state.items).toHaveLength(0);
  });

  it('toggleItem handles multiple items', () => {
    let state = reducer({ items: [] }, toggleItem(item1));
    state = reducer(state, toggleItem(item2));
    expect(state.items).toHaveLength(2);

    state = reducer(state, toggleItem(item1));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe(2);
  });

  it('clearAll removes all items', () => {
    const state = reducer({ items: [item1, item2] }, clearAll());
    expect(state.items).toHaveLength(0);
  });
});
