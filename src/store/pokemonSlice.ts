import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { apiService } from '../services/api';
import type { Item } from '../types';

interface PokemonState {
  items: Item[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

const initialState: PokemonState = {
  items: [],
  loading: false,
  error: null,
  searchTerm: '',
};

export const fetchPokemons = createAsyncThunk<Item[], string>(
  'pokemon/fetchPokemons',
  async (searchTerm: string) => {
    if (searchTerm) {
      return apiService.searchItems(searchTerm);
    }
    return apiService.getAllItems();
  }
);

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPokemons.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPokemons.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to load items. Please try again.';
      });
  },
});

export const { setSearchTerm } = pokemonSlice.actions;
export default pokemonSlice.reducer;
