import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import App from './App'
import { apiService } from './services/api'
import type { Item } from './types'

vi.mock('./services/api', () => ({
  apiService: {
    getAllItems: vi.fn(),
    searchItems: vi.fn(),
  },
}))

const mockItems: Item[] = [
  {
    id: 1,
    name: 'Bulbasaur',
    description: 'Height: 0.7m | Weight: 6.9kg | Type: grass/poison',
    types: ['grass', 'poison'],
  },
  {
    id: 2,
    name: 'Charmander',
    description: 'Height: 0.6m | Weight: 8.5kg | Type: fire',
    types: ['fire'],
  },
]

describe('App', () => {
  beforeEach(() => {
    vi.mocked(apiService.getAllItems).mockResolvedValue(mockItems)
    vi.mocked(apiService.searchItems).mockResolvedValue([mockItems[0]])
    localStorage.clear()
  })

  it('renders header and search on mount', async () => {
    render(<App />)
    expect(screen.getByText('Pokemon Search App')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter pokemon name')).toBeInTheDocument()
  })

  it('shows loader during initial data fetch', () => {
    vi.mocked(apiService.getAllItems).mockReturnValue(new Promise(() => {}))
    render(<App />)
    expect(screen.getByText('Loading Pokémon...')).toBeInTheDocument()
  })

  it('displays items after successful API call', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
      expect(screen.getByText('Charmander')).toBeInTheDocument()
    })
  })

  it('calls getAllItems on mount', async () => {
    render(<App />)
    await waitFor(() => {
      expect(apiService.getAllItems).toHaveBeenCalled()
    })
  })

  it('shows error message when API call fails', async () => {
    vi.mocked(apiService.getAllItems).mockRejectedValue(new Error('Network error'))
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('Failed to load items. Please try again.')).toBeInTheDocument()
    })
  })

  it('hides loader after data loads', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.queryByText('Loading Pokémon...')).not.toBeInTheDocument()
    })
  })

  it('hides loader after error', async () => {
    vi.mocked(apiService.getAllItems).mockRejectedValue(new Error('fail'))
    render(<App />)
    await waitFor(() => {
      expect(screen.queryByText('Loading Pokémon...')).not.toBeInTheDocument()
    })
  })

  it('searches when search term changes', async () => {
    const user = userEvent.setup()
    render(<App />)
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
    render(<App />)
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
    render(<App />)
    await waitFor(() => {
      expect(apiService.searchItems).toHaveBeenCalledWith('Pika')
    })
  })
})
