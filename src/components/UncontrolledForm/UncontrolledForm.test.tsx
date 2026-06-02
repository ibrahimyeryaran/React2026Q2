import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import UncontrolledForm from './UncontrolledForm';
import { useFormStore } from '../../store/formStore';
import { fillValidForm } from '../../test-utils/fillForm';

describe('UncontrolledForm', () => {
  beforeEach(() => {
    useFormStore.setState({ submissions: [] });
  });

  it('renders all fields with connected labels', () => {
    render(<UncontrolledForm onSuccess={() => {}} />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Male')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByLabelText(/profile image/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/accept the terms/i)).toBeInTheDocument();
  });

  it('shows validation errors only after submit', async () => {
    const user = userEvent.setup();
    render(<UncontrolledForm onSuccess={() => {}} />);

    expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/please select a gender/i)).toBeInTheDocument();
  });

  it('shows the password strength indicator on input', async () => {
    const user = userEvent.setup();
    render(<UncontrolledForm onSuccess={() => {}} />);
    await user.type(screen.getByLabelText('Password'), 'Abc123!@');
    expect(screen.getByText(/strength: strong/i)).toBeInTheDocument();
  });

  it('submits valid data, stores it, and calls onSuccess', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(<UncontrolledForm onSuccess={onSuccess} />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));

    const { submissions } = useFormStore.getState();
    expect(submissions).toHaveLength(1);
    expect(submissions[0].source).toBe('uncontrolled');
    expect(submissions[0].name).toBe('John');
    expect(submissions[0].image).toMatch(/^data:image\/png;base64,/);
  });

  it('reports the password mismatch on submit even when other fields are empty', async () => {
    const user = userEvent.setup();
    render(<UncontrolledForm onSuccess={() => {}} />);

    await user.type(screen.getByLabelText('Password'), 'Abc123!@');
    await user.type(screen.getByLabelText('Confirm Password'), 'Different1!');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(
      await screen.findByText(/passwords do not match/i)
    ).toBeInTheDocument();
  });

  it('blocks submission when passwords do not match', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(<UncontrolledForm onSuccess={onSuccess} />);

    await fillValidForm(user, { confirmPassword: 'Different1!' });
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
