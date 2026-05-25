import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Card from './Card';
import { renderWithProviders } from '../../test-utils/renderWithProviders';

describe('Card', () => {
  it('renders name and description', () => {
    renderWithProviders(
      <Card id={25} name="Pikachu" description="Height: 0.4m | Weight: 6.0kg | Type: electric" />
    );
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('Height: 0.4m | Weight: 6.0kg | Type: electric')).toBeInTheDocument();
  });

  it('renders image when provided', () => {
    renderWithProviders(
      <Card
        id={25}
        name="Pikachu"
        description="desc"
        image="https://example.com/pikachu.png"
      />
    );
    const img = screen.getByAltText('Pikachu');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/pikachu.png');
  });

  it('does not render image when not provided', () => {
    renderWithProviders(<Card id={25} name="Pikachu" description="desc" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders type badges', () => {
    renderWithProviders(
      <Card id={1} name="Bulbasaur" description="desc" types={['grass', 'poison']} />
    );
    expect(screen.getByText('grass')).toBeInTheDocument();
    expect(screen.getByText('poison')).toBeInTheDocument();
  });

  it('does not render types when not provided', () => {
    renderWithProviders(<Card id={25} name="Pikachu" description="desc" />);
    expect(screen.queryByText('electric')).not.toBeInTheDocument();
  });

  it('does not render types when array is empty', () => {
    const { container } = renderWithProviders(
      <Card id={25} name="Pikachu" description="desc" types={[]} />
    );
    const typeSpans = container.querySelectorAll(`.${container.firstElementChild?.className.split(' ')[0]} span`);
    expect(typeSpans.length).toBe(0);
  });

  it('applies background color for known type', () => {
    renderWithProviders(<Card id={1} name="Bulbasaur" description="desc" types={['grass']} />);
    const badge = screen.getByText('grass');
    expect(badge).toHaveStyle({ backgroundColor: '#78c850' });
  });

  it('applies fallback color for unknown type', () => {
    renderWithProviders(<Card id={0} name="Unknown" description="desc" types={['unknown']} />);
    const badge = screen.getByText('unknown');
    expect(badge).toHaveStyle({ backgroundColor: '#888' });
  });

  it('renders a checkbox', () => {
    renderWithProviders(<Card id={25} name="Pikachu" description="desc" />);
    const checkbox = screen.getByRole('checkbox', { name: /select pikachu/i });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('checkbox toggles selection in store', async () => {
    const { store } = renderWithProviders(<Card id={25} name="Pikachu" description="desc" />);
    const checkbox = screen.getByRole('checkbox', { name: /select pikachu/i });

    await userEvent.click(checkbox);
    expect(store.getState().selectedItems.items).toHaveLength(1);
    expect(store.getState().selectedItems.items[0].id).toBe(25);

    await userEvent.click(checkbox);
    expect(store.getState().selectedItems.items).toHaveLength(0);
  });

  it('checkbox click does not trigger card onClick', async () => {
    const onClick = vi.fn();
    renderWithProviders(<Card id={25} name="Pikachu" description="desc" onClick={onClick} />);
    const checkbox = screen.getByRole('checkbox', { name: /select pikachu/i });
    await userEvent.click(checkbox);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('card click triggers onClick without affecting checkbox', async () => {
    const onClick = vi.fn();
    renderWithProviders(<Card id={25} name="Pikachu" description="desc" onClick={onClick} />);
    const nameEl = screen.getByText('Pikachu');
    await userEvent.click(nameEl);
    expect(onClick).toHaveBeenCalledWith(25);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('shows as selected when preloaded in store', () => {
    renderWithProviders(<Card id={25} name="Pikachu" description="desc" />, {
      preloadedState: {
        selectedItems: {
          items: [{ id: 25, name: 'Pikachu', description: 'desc' }],
        },
      },
    });
    const checkbox = screen.getByRole('checkbox', { name: /select pikachu/i });
    expect(checkbox).toBeChecked();
  });
});
