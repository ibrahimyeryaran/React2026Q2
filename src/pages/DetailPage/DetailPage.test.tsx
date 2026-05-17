import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import DetailPage from './DetailPage'
import { apiService } from '../../services/api'
import { mockItems } from '../../test-utils/mockData'

vi.mock('../../services/api', () => ({
  apiService: {
    getAllItems: vi.fn(),
    searchItems: vi.fn(),
    getPokemonById: vi.fn(),
  },
}))

const renderDetail = (detailId = '1') =>
  render(
    <MemoryRouter initialEntries={[`/1/details/${detailId}`]}>
      <Routes>
        <Route path="/:page/details/:detailId" element={<DetailPage />} />
      </Routes>
    </MemoryRouter>
  )

describe('DetailPage', () => {
  beforeEach(() => {
    vi.mocked(apiService.getPokemonById).mockResolvedValue(mockItems[0])
  })

  it('shows loader while fetching', () => {
    vi.mocked(apiService.getPokemonById).mockReturnValue(new Promise(() => {}))
    renderDetail()
    expect(screen.getByText('Loading Pokémon...')).toBeInTheDocument()
  })

  it('renders pokemon name after loading', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    })
  })

  it('renders pokemon image after loading', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByRole('img', { name: /bulbasaur/i })).toBeInTheDocument()
    })
  })

  it('shows error message when fetch fails', async () => {
    vi.mocked(apiService.getPokemonById).mockRejectedValue(new Error('Not found'))
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText(/failed to load details/i)).toBeInTheDocument()
    })
  })

  it('calls getPokemonById with correct id', async () => {
    renderDetail('25')
    await waitFor(() => {
      expect(apiService.getPokemonById).toHaveBeenCalledWith(25)
    })
  })
})
