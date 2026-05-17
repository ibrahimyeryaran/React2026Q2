import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Header from './Header'

const renderHeader = () =>
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  )

describe('Header', () => {
  it('renders the app title', () => {
    renderHeader()
    expect(screen.getByText('Pokemon Search App')).toBeInTheDocument()
  })

  it('renders a header element', () => {
    renderHeader()
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    renderHeader()
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
  })
})
