import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PasswordStrengthMeter from './PasswordStrengthMeter';

describe('PasswordStrengthMeter', () => {
  it('shows all rules as unmet for an empty password', () => {
    render(<PasswordStrengthMeter password="" />);
    expect(screen.getByText(/strength: empty/i)).toBeInTheDocument();
    expect(screen.getByText(/1 number/i).textContent).toContain('○');
  });

  it('marks satisfied rules for a strong password', () => {
    render(<PasswordStrengthMeter password="Abc123!@" />);
    expect(screen.getByText(/strength: strong/i)).toBeInTheDocument();
    expect(screen.getByText(/1 uppercase/i).textContent).toContain('✓');
    expect(screen.getByText(/1 special character/i).textContent).toContain('✓');
  });
});
