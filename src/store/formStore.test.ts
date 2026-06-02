import { describe, it, expect, beforeEach } from 'vitest';
import { useFormStore } from './formStore';
import { COUNTRIES } from '../data/countries';
import type { FormSubmission } from '../types/form';

const makeSubmission = (id: string): FormSubmission => ({
  id,
  source: 'uncontrolled',
  name: 'John',
  age: 30,
  email: 'john@example.com',
  gender: 'Male',
  country: 'Canada',
  image: 'data:image/png;base64,abc',
  createdAt: Date.now(),
});

describe('formStore', () => {
  beforeEach(() => {
    useFormStore.setState({ submissions: [] });
  });

  it('initializes with the countries list', () => {
    expect(useFormStore.getState().countries).toEqual(COUNTRIES);
  });

  it('starts with no submissions', () => {
    expect(useFormStore.getState().submissions).toHaveLength(0);
  });

  it('adds a submission to the front (history)', () => {
    useFormStore.getState().addSubmission(makeSubmission('1'));
    useFormStore.getState().addSubmission(makeSubmission('2'));

    const { submissions } = useFormStore.getState();
    expect(submissions).toHaveLength(2);
    expect(submissions[0].id).toBe('2');
    expect(submissions[1].id).toBe('1');
  });
});
