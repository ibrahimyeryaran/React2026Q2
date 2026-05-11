import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Card from './Card'

describe('Card', () => {
  it('renders name and description', () => {
    render(<Card name="Pikachu" description="Height: 0.4m | Weight: 6.0kg | Type: electric" />)
    expect(screen.getByText('Pikachu')).toBeInTheDocument()
    expect(screen.getByText('Height: 0.4m | Weight: 6.0kg | Type: electric')).toBeInTheDocument()
  })

  it('renders image when provided', () => {
    render(
      <Card
        name="Pikachu"
        description="desc"
        image="https://example.com/pikachu.png"
      />
    )
    const img = screen.getByAltText('Pikachu')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/pikachu.png')
  })

  it('does not render image when not provided', () => {
    render(<Card name="Pikachu" description="desc" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders type badges', () => {
    render(
      <Card name="Bulbasaur" description="desc" types={['grass', 'poison']} />
    )
    expect(screen.getByText('grass')).toBeInTheDocument()
    expect(screen.getByText('poison')).toBeInTheDocument()
  })

  it('does not render types when not provided', () => {
    render(<Card name="Pikachu" description="desc" />)
    expect(screen.queryByText('electric')).not.toBeInTheDocument()
  })

  it('does not render types when array is empty', () => {
    const { container } = render(<Card name="Pikachu" description="desc" types={[]} />)
    const typeSpans = container.querySelectorAll('span')
    expect(typeSpans.length).toBe(0)
  })

  it('applies background color for known type', () => {
    render(<Card name="Bulbasaur" description="desc" types={['grass']} />)
    const badge = screen.getByText('grass')
    expect(badge).toHaveStyle({ backgroundColor: '#78c850' })
  })

  it('applies fallback color for unknown type', () => {
    render(<Card name="Unknown" description="desc" types={['unknown']} />)
    const badge = screen.getByText('unknown')
    expect(badge).toHaveStyle({ backgroundColor: '#888' })
  })
})
