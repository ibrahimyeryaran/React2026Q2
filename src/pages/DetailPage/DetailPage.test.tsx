import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import DetailPage from './DetailPage';
import { makeStore } from '../../test-utils/renderWithProviders';
import {
  createFetchMock,
  urlOf,
  type MockPokemon,
} from '../../test-utils/mockFetch';

const mockPokemons: MockPokemon[] = [
  { id: 1, name: 'Bulbasaur', type: 'grass' },
  { id: 25, name: 'Pikachu', type: 'electric' },
];

const renderDetail = (detailId = '1') =>
  render(
    <Provider store={makeStore()}>
      <MemoryRouter initialEntries={[`/1/details/${detailId}`]}>
        <Routes>
          <Route path="/:page/details/:detailId" element={<DetailPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

describe('DetailPage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', createFetchMock(mockPokemons));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows loader while fetching', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>(() => {}))
    );
    renderDetail();
    expect(screen.getByText('Loading Pokémon...')).toBeInTheDocument();
  });

  it('renders pokemon name after loading', async () => {
    renderDetail();
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    });
  });

  it('renders pokemon image after loading', async () => {
    renderDetail();
    await waitFor(() => {
      expect(
        screen.getByRole('img', { name: /bulbasaur/i })
      ).toBeInTheDocument();
    });
  });

  it('shows error message when fetch fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('error', { status: 500 }))
    );
    renderDetail();
    await waitFor(() => {
      expect(screen.getByText(/failed to load details/i)).toBeInTheDocument();
    });
  });

  it('requests the correct pokemon id', async () => {
    renderDetail('25');
    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
    });
    const calledUrls = (fetch as ReturnType<typeof vi.fn>).mock.calls.map((c) =>
      urlOf(c[0])
    );
    expect(calledUrls.some((u) => u.includes('pokemon/25'))).toBe(true);
  });

  it('shows a refresh button that re-requests details', async () => {
    renderDetail('1');
    await waitFor(() => screen.getByText('Bulbasaur'));

    const refreshBtn = screen.getByRole('button', { name: /refresh details/i });
    const callsBefore = (
      fetch as ReturnType<typeof vi.fn>
    ).mock.calls.filter((c) => urlOf(c[0]).includes('pokemon/1')).length;

    await refreshBtn.click();

    await waitFor(() => {
      const callsAfter = (
        fetch as ReturnType<typeof vi.fn>
      ).mock.calls.filter((c) => urlOf(c[0]).includes('pokemon/1')).length;
      expect(callsAfter).toBeGreaterThan(callsBefore);
    });
  });
});
