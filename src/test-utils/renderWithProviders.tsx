import { type ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import selectedItemsReducer from '../store/selectedItemsSlice';
import { pokemonApi } from '../store/pokemonApi';
import { ThemeProvider } from '../context/ThemeContext';

function makeStore() {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
  });
}

type AppStore = ReturnType<typeof makeStore>;
type PreloadedActions = (store: AppStore) => void;

interface WrapperOptions extends RenderOptions {
  initialEntries?: string[];
  setupStore?: PreloadedActions;
}

function renderWithProviders(
  ui: ReactNode,
  { initialEntries = ['/'], setupStore, ...options }: WrapperOptions = {}
) {
  const store = makeStore();
  setupStore?.(store);

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
        </ThemeProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
}

export { renderWithProviders, makeStore };
