import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import AboutPage from './AboutPage'

const renderAbout = () =>
  render(
    <MemoryRouter>
      <AboutPage />
    </MemoryRouter>
  )

describe('AboutPage', () => {
  it('renders the about heading', () => {
    renderAbout()
    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument()
  })

  it('renders a link to RS School React course', () => {
    renderAbout()
    const link = screen.getByRole('link', { name: /rs school react course/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://rs.school/courses/reactjs')
  })

  it('renders author information', () => {
    renderAbout()
    expect(screen.getByText(/ibrahim yeryaran/i)).toBeInTheDocument()
  })
})
