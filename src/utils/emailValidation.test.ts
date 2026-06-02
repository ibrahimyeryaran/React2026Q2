import { describe, it, expect } from 'vitest';
import { isValidEmail } from './emailValidation';

describe('isValidEmail', () => {
  it('accepts a basic valid email', () => {
    expect(isValidEmail('john@example.com')).toBe(true);
  });

  it('accepts subdomains', () => {
    expect(isValidEmail('a@mail.example.co')).toBe(true);
  });

  it('rejects missing @', () => {
    expect(isValidEmail('johnexample.com')).toBe(false);
  });

  it('rejects multiple @', () => {
    expect(isValidEmail('john@@example.com')).toBe(false);
  });

  it('rejects empty local part', () => {
    expect(isValidEmail('@example.com')).toBe(false);
  });

  it('rejects domain without a dot', () => {
    expect(isValidEmail('john@example')).toBe(false);
  });

  it('rejects domain with empty label', () => {
    expect(isValidEmail('john@example.')).toBe(false);
    expect(isValidEmail('john@.com')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });
});
