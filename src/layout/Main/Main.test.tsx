import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Main from './Main'

describe('Main', () => {
  it('renders children', () => {
    render(<Main><p>child content</p></Main>)
    expect(screen.getByText('child content')).toBeInTheDocument()
  })

  it('renders a main element', () => {
    render(<Main><span>x</span></Main>)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
