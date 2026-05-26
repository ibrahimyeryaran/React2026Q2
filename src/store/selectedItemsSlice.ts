import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Item } from '../types';

interface SelectedItemsState {
  items: Item[];
}

const initialState: SelectedItemsState = {
  items: [],
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    toggleItem(state, action: PayloadAction<Item>) {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },
    clearAll(state) {
      state.items = [];
    },
  },
});

export const { toggleItem, clearAll } = selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;
