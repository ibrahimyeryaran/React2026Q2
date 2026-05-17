import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import MainPage from './pages/MainPage/MainPage'
import { apiService } from './services/api'
import { mockItems } from './test-utils/mockData'

vi.mock('./services/api', () => ({
  apiService: {
    getAllItems: vi.fn(),
    searchItems: vi.fn(),
  },
}))

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
  )

describe('App', () => {
  beforeEach(() => {
    vi.mocked(apiService.getAllItems).mockResolvedValue(mockItems)
    vi.mocked(apiService.searchItems).mockResolvedValue([mockItems[0]])
    localStorage.clear()
  })

  it('renders header and search on mount', async () => {
    render(<RouterProvider router={createTestRouter()} />)
    expect(screen.getByText('Pokemon Search App')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter pokemon name')).toBeInTheDocument()
  })

  it('shows loader during initial data fetch', () => {
    vi.mocked(apiService.getAllItems).mockReturnValue(new Promise(() => {}))
    render(<RouterProvider router={createTestRouter()} />)
    expect(screen.getByText('Loading Pokémon...')).toBeInTheDocument()
  })

  it('displays items after successful API call', async () => {
    render(<RouterProvider router={createTestRouter()} />)
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
      expect(screen.getByText('Charmander')).toBeInTheDocument()
    })
  })

  it('calls getAllItems on mount', async () => {
    render(<RouterProvider router={createTestRouter()} />)
    await waitFor(() => {
      expect(apiService.getAllItems).toHaveBeenCalled()
    })
  })

  it('shows error message when API call fails', async () => {
    vi.mocked(apiService.getAllItems).mockRejectedValue(new Error('Network error'))
    render(<RouterProvider router={createTestRouter()} />)
    await waitFor(() => {
      expect(screen.getByText('Failed to load items. Please try again.')).toBeInTheDocument()
    })
  })

  it('hides loader after data loads', async () => {
    render(<RouterProvider router={createTestRouter()} />)
    await waitFor(() => {
      expect(screen.queryByText('Loading Pokémon...')).not.toBeInTheDocument()
    })
  })

  it('hides loader after error', async () => {
    vi.mocked(apiService.getAllItems).mockRejectedValue(new Error('fail'))
    render(<RouterProvider router={createTestRouter()} />)
    await waitFor(() => {
      expect(screen.queryByText('Loading Pokémon...')).not.toBeInTheDocument()
    })
  })

  it('searches when search term changes', async () => {
    const user = userEvent.setup()
    render(<RouterProvider router={createTestRouter()} />)
    await waitFor(() => screen.getByText('Bulbasaur'))

    const input = screen.getByPlaceholderText('Enter pokemon name')
    await user.clear(input)
    await user.type(input, 'Bulb')
    await user.click(screen.getByRole('button', { name: /search/i }))

    await waitFor(() => {
      expect(apiService.searchItems).toHaveBeenCalledWith('Bulb')
    })
  })

  it('updates results after a new search', async () => {
    const user = userEvent.setup()
    render(<RouterProvider router={createTestRouter()} />)
    await waitFor(() => screen.getByText('Charmander'))

    const input = screen.getByPlaceholderText('Enter pokemon name')
    await user.type(input, 'Bulb')
    await user.click(screen.getByRole('button', { name: /search/i }))

    await waitFor(() => {
      expect(screen.queryByText('Charmander')).not.toBeInTheDocument()
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    })
  })

  it('uses saved localStorage term on mount', async () => {
    localStorage.setItem('pokemonSearchTerm', 'Pika')
    render(<RouterProvider router={createTestRouter()} />)
    await waitFor(() => {
      expect(apiService.searchItems).toHaveBeenCalledWith('Pika')
    })
  })
})
