import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SubmissionCard from './SubmissionCard';
import type { FormSubmission } from '../../types/form';

const submission: FormSubmission = {
  id: 'abc',
  source: 'react-hook-form',
  name: 'Alice',
  age: 28,
  email: 'alice@example.com',
  gender: 'Female',
  country: 'France',
  image: 'data:image/png;base64,xyz',
  createdAt: Date.now(),
};

describe('SubmissionCard', () => {
  it('renders all submission fields', () => {
    render(<SubmissionCard submission={submission} isNew={false} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('28')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('Female')).toBeInTheDocument();
    expect(screen.getByText('France')).toBeInTheDocument();
  });

  it('renders the image with the base64 source', () => {
    render(<SubmissionCard submission={submission} isNew={false} />);
    const img = screen.getByRole('img', { name: /alice's profile/i });
    expect(img).toHaveAttribute('src', 'data:image/png;base64,xyz');
  });

  it('shows the source badge', () => {
    render(<SubmissionCard submission={submission} isNew={false} />);
    expect(screen.getByText('react-hook-form')).toBeInTheDocument();
  });
});
