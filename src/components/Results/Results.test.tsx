import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Results from './Results'
import type { Item } from '../../types'

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

describe('Results', () => {
  it('renders correct number of items', () => {
    render(<Results items={mockItems} />)
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    expect(screen.getByText('Charmander')).toBeInTheDocument()
  })

  it('displays results count', () => {
    render(<Results items={mockItems} />)
    expect(screen.getByText('Results (2)')).toBeInTheDocument()
  })

  it('shows no results message when items array is empty', () => {
    render(<Results items={[]} />)
    expect(screen.getByText(/no items found/i)).toBeInTheDocument()
  })

  it('shows zero count when no items', () => {
    render(<Results items={[]} />)
    expect(screen.getByText('Results (0)')).toBeInTheDocument()
  })

  it('renders all item names', () => {
    render(<Results items={mockItems} />)
    mockItems.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument()
    })
  })

  it('renders item descriptions', () => {
    render(<Results items={mockItems} />)
    expect(screen.getByText(mockItems[0].description)).toBeInTheDocument()
  })

  it('handles undefined items gracefully with default', () => {
    // @ts-expect-error testing undefined items
    render(<Results />)
    expect(screen.getByText('Results (0)')).toBeInTheDocument()
  })
})
