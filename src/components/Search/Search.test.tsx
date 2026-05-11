import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Search from './Search'

describe('Search', () => {
  const onSearch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders input and search button', () => {
    render(<Search onSearch={onSearch} />)
    expect(screen.getByPlaceholderText('Enter pokemon name')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
  })

  it('shows empty input when no saved term', () => {
    render(<Search onSearch={onSearch} />)
    expect(screen.getByPlaceholderText('Enter pokemon name')).toHaveValue('')
  })

  it('displays saved localStorage term on mount', () => {
    localStorage.setItem('pokemonSearchTerm', 'pikachu')
    render(<Search onSearch={onSearch} />)
    expect(screen.getByPlaceholderText('Enter pokemon name')).toHaveValue('pikachu')
  })

  it('calls onSearch with saved term on mount', () => {
    localStorage.setItem('pokemonSearchTerm', 'pikachu')
    render(<Search onSearch={onSearch} />)
    expect(onSearch).toHaveBeenCalledWith('pikachu')
  })

  it('does not call onSearch on mount when no saved term', () => {
    render(<Search onSearch={onSearch} />)
    expect(onSearch).not.toHaveBeenCalled()
  })

  it('updates input value when user types', async () => {
    const user = userEvent.setup()
    render(<Search onSearch={onSearch} />)
    const input = screen.getByPlaceholderText('Enter pokemon name')
    await user.type(input, 'char')
    expect(input).toHaveValue('char')
  })

  it('calls onSearch with trimmed value on button click', async () => {
    const user = userEvent.setup()
    render(<Search onSearch={onSearch} />)
    const input = screen.getByPlaceholderText('Enter pokemon name')
    await user.type(input, '  bulba  ')
    await user.click(screen.getByRole('button', { name: /search/i }))
    expect(onSearch).toHaveBeenCalledWith('bulba')
  })

  it('saves trimmed term to localStorage on search', async () => {
    const user = userEvent.setup()
    render(<Search onSearch={onSearch} />)
    const input = screen.getByPlaceholderText('Enter pokemon name')
    await user.type(input, 'charm')
    await user.click(screen.getByRole('button', { name: /search/i }))
    expect(localStorage.getItem('pokemonSearchTerm')).toBe('charm')
  })

  it('removes localStorage entry when search term is empty', async () => {
    const user = userEvent.setup()
    localStorage.setItem('pokemonSearchTerm', 'old')
    render(<Search onSearch={onSearch} />)
    const input = screen.getByPlaceholderText('Enter pokemon name')
    await user.clear(input)
    await user.click(screen.getByRole('button', { name: /search/i }))
    expect(localStorage.getItem('pokemonSearchTerm')).toBeNull()
  })

  it('overwrites existing localStorage value on new search', async () => {
    const user = userEvent.setup()
    localStorage.setItem('pokemonSearchTerm', 'old')
    render(<Search onSearch={onSearch} />)
    const input = screen.getByPlaceholderText('Enter pokemon name')
    await user.clear(input)
    await user.type(input, 'new')
    await user.click(screen.getByRole('button', { name: /search/i }))
    expect(localStorage.getItem('pokemonSearchTerm')).toBe('new')
  })

  it('triggers search on Enter key press', async () => {
    const user = userEvent.setup()
    render(<Search onSearch={onSearch} />)
    const input = screen.getByPlaceholderText('Enter pokemon name')
    await user.type(input, 'squirtle')
    await user.keyboard('{Enter}')
    expect(onSearch).toHaveBeenCalledWith('squirtle')
  })

  it('uses initialSearchTerm prop when no localStorage value', () => {
    render(<Search onSearch={onSearch} initialSearchTerm="starter" />)
    expect(screen.getByPlaceholderText('Enter pokemon name')).toHaveValue('starter')
  })

  it('prefers localStorage over initialSearchTerm', () => {
    localStorage.setItem('pokemonSearchTerm', 'saved')
    render(<Search onSearch={onSearch} initialSearchTerm="prop" />)
    expect(screen.getByPlaceholderText('Enter pokemon name')).toHaveValue('saved')
  })
})
