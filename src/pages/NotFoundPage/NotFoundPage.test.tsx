import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import NotFoundPage from './NotFoundPage'

const renderNotFound = () =>
  render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>
  )

describe('NotFoundPage', () => {
  it('renders 404 code', () => {
    renderNotFound()
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('renders page not found message', () => {
    renderNotFound()
    expect(screen.getByText(/page not found/i)).toBeInTheDocument()
  })

  it('renders a link to go back home', () => {
    renderNotFound()
    const link = screen.getByRole('link', { name: /go back to home/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/1')
  })
})
