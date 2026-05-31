import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { makeStore } from './test-utils/renderWithProviders';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import MainPage from './pages/MainPage/MainPage';
import {
  createFetchMock,
  defaultMockPokemons,
  urlOf,
} from './test-utils/mockFetch';

const createTestRouter = (initialPath = '/1') =>
  createMemoryRouter(
    [
      {
        path: '/',
        element: <App />,
        children: [{ path: ':page', element: <MainPage /> }],
      },
    ],
    { initialEntries: [initialPath] }
  );

const renderApp = (initialPath = '/1') =>
  render(
    <Provider store={makeStore()}>
      <ThemeProvider>
        <RouterProvider router={createTestRouter(initialPath)} />
      </ThemeProvider>
    </Provider>
  );

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', createFetchMock(defaultMockPokemons));
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders header and search on mount', () => {
    renderApp();
    expect(screen.getByText('Pokemon Search App')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter pokemon name')
    ).toBeInTheDocument();
  });

  it('shows loader during initial data fetch', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>(() => {}))
    );
    renderApp();
    expect(screen.getByText('Loading Pokémon...')).toBeInTheDocument();
  });

  it('displays items after successful API call', async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('Charmander')).toBeInTheDocument();
    });
  });

  it('fetches the pokemon list on mount', async () => {
    renderApp();
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
    const calledUrls = (fetch as ReturnType<typeof vi.fn>).mock.calls.map((c) =>
      urlOf(c[0])
    );
    expect(calledUrls.some((u) => u.includes('pokemon?limit'))).toBe(true);
  });

  it('shows error message when API call fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('error', { status: 500 }))
    );
    renderApp();
    await waitFor(() => {
      expect(
        screen.getByText('Failed to load items. Please try again.')
      ).toBeInTheDocument();
    });
  });

  it('hides loader after data loads', async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.queryByText('Loading Pokémon...')).not.toBeInTheDocument();
    });
  });

  it('hides loader after error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('error', { status: 500 }))
    );
    renderApp();
    await waitFor(() => {
      expect(screen.queryByText('Loading Pokémon...')).not.toBeInTheDocument();
    });
  });

  it('filters results client-side when searching', async () => {
    const user = userEvent.setup();
    renderApp();
    await waitFor(() => screen.getByText('Charmander'));

    const input = screen.getByPlaceholderText('Enter pokemon name');
    await user.type(input, 'Bulb');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.queryByText('Charmander')).not.toBeInTheDocument();
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    });
  });

  it('does not refetch the list when searching (uses cache)', async () => {
    const user = userEvent.setup();
    renderApp();
    await waitFor(() => screen.getByText('Bulbasaur'));

    const listCallsBefore = (
      fetch as ReturnType<typeof vi.fn>
    ).mock.calls.filter((c) => urlOf(c[0]).includes('pokemon?limit')).length;

    const input = screen.getByPlaceholderText('Enter pokemon name');
    await user.type(input, 'Bulb');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => screen.getByText('Bulbasaur'));

    const listCallsAfter = (
      fetch as ReturnType<typeof vi.fn>
    ).mock.calls.filter((c) => urlOf(c[0]).includes('pokemon?limit')).length;

    expect(listCallsAfter).toBe(listCallsBefore);
  });

  it('applies saved localStorage search term on mount', async () => {
    localStorage.setItem('pokemonSearchTerm', 'Bulb');
    renderApp();
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    });
    expect(screen.queryByText('Charmander')).not.toBeInTheDocument();
  });
});
