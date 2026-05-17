import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Loader from './Loader'

describe('Loader', () => {
  it('renders loading text', () => {
    render(<Loader />)
    expect(screen.getByText('Loading Pokémon...')).toBeInTheDocument()
  })

  it('renders spinner element', () => {
    const { container } = render(<Loader />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
