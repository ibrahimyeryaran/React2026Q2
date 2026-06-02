import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';
import { useFormStore } from './store/formStore';
import { fillValidForm } from './test-utils/fillForm';

describe('App', () => {
  beforeEach(() => {
    useFormStore.setState({ submissions: [] });
  });

  it('shows an empty state initially', () => {
    render(<App />);
    expect(screen.getByText(/no submissions yet/i)).toBeInTheDocument();
    expect(screen.getByText(/submissions \(0\)/i)).toBeInTheDocument();
  });

  it('opens the uncontrolled form modal', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(
      screen.getByRole('button', { name: /open uncontrolled form/i })
    );
    expect(
      screen.getByRole('dialog', { name: /uncontrolled form/i })
    ).toBeInTheDocument();
  });

  it('opens the react hook form modal', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(
      screen.getByRole('button', { name: /open react hook form/i })
    );
    expect(
      screen.getByRole('dialog', { name: /react hook form/i })
    ).toBeInTheDocument();
  });

  it('submits the uncontrolled form, closes the modal, and displays the card', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole('button', { name: /open uncontrolled form/i })
    );
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /^submit$/i }));

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    );

    expect(screen.getByTestId('submission-card')).toBeInTheDocument();
    expect(screen.getByText(/submissions \(1\)/i)).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('marks the newest submission card as new', () => {
    useFormStore.setState({
      submissions: [
        {
          id: 'newest',
          source: 'uncontrolled',
          name: 'Zoe',
          age: 22,
          email: 'zoe@example.com',
          gender: 'Female',
          country: 'Spain',
          image: 'data:image/png;base64,abc',
          createdAt: Date.now(),
        },
      ],
    });
    render(<App />);
    const card = screen.getByTestId('submission-card');
    expect(card.className).toMatch(/new/);
  });
});
