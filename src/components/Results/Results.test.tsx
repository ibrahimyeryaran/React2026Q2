import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Results from './Results';
import { mockItems } from '../../test-utils/mockData';
import { renderWithProviders } from '../../test-utils/renderWithProviders';

describe('Results', () => {
  it('renders correct number of items', () => {
    renderWithProviders(<Results items={mockItems} />);
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Charmander')).toBeInTheDocument();
  });

  it('displays results count', () => {
    renderWithProviders(<Results items={mockItems} />);
    expect(screen.getByText('Results (2)')).toBeInTheDocument();
  });

  it('shows no results message when items array is empty', () => {
    renderWithProviders(<Results items={[]} />);
    expect(screen.getByText(/no items found/i)).toBeInTheDocument();
  });

  it('shows zero count when no items', () => {
    renderWithProviders(<Results items={[]} />);
    expect(screen.getByText('Results (0)')).toBeInTheDocument();
  });

  it('renders all item names', () => {
    renderWithProviders(<Results items={mockItems} />);
    mockItems.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  it('renders item descriptions', () => {
    renderWithProviders(<Results items={mockItems} />);
    expect(screen.getByText(mockItems[0].description)).toBeInTheDocument();
  });

  it('handles empty items array gracefully', () => {
    renderWithProviders(<Results items={[]} />);
    expect(screen.getByText('Results (0)')).toBeInTheDocument();
    expect(screen.getByText(/no items found/i)).toBeInTheDocument();
  });
});
