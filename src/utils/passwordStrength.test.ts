import { describe, it, expect } from 'vitest';
import {
  getPasswordChecks,
  countSatisfied,
  getPasswordStrength,
} from './passwordStrength';

describe('getPasswordChecks', () => {
  it('detects all character classes', () => {
    expect(getPasswordChecks('Abc123!@')).toEqual({
      hasNumber: true,
      hasUppercase: true,
      hasLowercase: true,
      hasSpecial: true,
    });
  });

  it('detects a subset', () => {
    expect(getPasswordChecks('abc')).toEqual({
      hasNumber: false,
      hasUppercase: false,
      hasLowercase: true,
      hasSpecial: false,
    });
  });

  it('returns all false for empty', () => {
    expect(countSatisfied(getPasswordChecks(''))).toBe(0);
  });
});

describe('getPasswordStrength', () => {
  it('is empty for empty input', () => {
    expect(getPasswordStrength('')).toBe('empty');
  });

  it('is weak with one class', () => {
    expect(getPasswordStrength('aaaa')).toBe('weak');
  });

  it('is medium with two or three classes', () => {
    expect(getPasswordStrength('Abc')).toBe('medium');
    expect(getPasswordStrength('Abc1')).toBe('medium');
  });

  it('is strong with all four classes', () => {
    expect(getPasswordStrength('Abc123!@')).toBe('strong');
  });
});
