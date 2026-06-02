import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import HookForm from './HookForm';
import { useFormStore } from '../../store/formStore';
import { fillValidForm } from '../../test-utils/fillForm';

describe('HookForm', () => {
  beforeEach(() => {
    useFormStore.setState({ submissions: [] });
  });

  it('renders all fields with connected labels', () => {
    render(<HookForm onSuccess={() => {}} />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Female')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByLabelText(/profile image/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/accept the terms/i)).toBeInTheDocument();
  });

  it('disables the submit button while the form is invalid (live validation)', () => {
    render(<HookForm onSuccess={() => {}} />);
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('shows a live validation error for a lowercase name', async () => {
    const user = userEvent.setup();
    render(<HookForm onSuccess={() => {}} />);
    await user.type(screen.getByLabelText('Name'), 'john');
    expect(
      await screen.findByText(/first letter must be uppercase/i)
    ).toBeInTheDocument();
  });

  it('shows the password mismatch error immediately, even with other fields empty', async () => {
    const user = userEvent.setup();
    render(<HookForm onSuccess={() => {}} />);

    await user.type(screen.getByLabelText('Password'), 'Abc123!@');
    await user.type(screen.getByLabelText('Confirm Password'), 'Different1!');

    expect(
      await screen.findByText(/passwords do not match/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('enables submit and stores data when the form is valid', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(<HookForm onSuccess={onSuccess} />);

    await fillValidForm(user);

    const submit = screen.getByRole('button', { name: /submit/i });
    await waitFor(() => expect(submit).toBeEnabled());

    await user.click(submit);

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));

    const { submissions } = useFormStore.getState();
    expect(submissions).toHaveLength(1);
    expect(submissions[0].source).toBe('react-hook-form');
    expect(submissions[0].image).toMatch(/^data:image\/png;base64,/);
  });
});
