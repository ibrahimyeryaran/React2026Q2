import { type ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, type Reducer, type UnknownAction } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import selectedItemsReducer from '../store/selectedItemsSlice';
import { ThemeProvider } from '../context/ThemeContext';
import type { RootState } from '../store/store';

function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer as Reducer<
        RootState['selectedItems'],
        UnknownAction,
        RootState['selectedItems'] | undefined
      >,
    },
    preloadedState,
  });
}

interface WrapperOptions extends RenderOptions {
  preloadedState?: Partial<RootState>;
  initialEntries?: string[];
}

function renderWithProviders(
  ui: ReactNode,
  { preloadedState, initialEntries = ['/'], ...options }: WrapperOptions = {}
) {
  const store = makeStore(preloadedState);

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
