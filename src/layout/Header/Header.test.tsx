import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import Header from './Header';
import { renderWithProviders } from '../../test-utils/renderWithProviders';

const renderHeader = () => renderWithProviders(<Header />);

describe('Header', () => {
  it('renders the app title', () => {
    renderHeader();
    expect(screen.getByText('Pokemon Search App')).toBeInTheDocument();
  });

  it('renders a header element', () => {
    renderHeader();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    renderHeader();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('theme toggle switches between dark and light', async () => {
    renderHeader();
    const btn = screen.getByRole('button');
    expect(btn).toHaveTextContent(/dark/i);
    await userEvent.click(btn);
    expect(btn).toHaveTextContent(/light/i);
  });
});
