import { describe, it, expect } from 'vitest';
import { createFormSchema, MAX_IMAGE_BYTES } from './formSchema';
import { COUNTRIES } from '../data/countries';

const schema = createFormSchema(COUNTRIES);

const validImage = () =>
  new File(['x'.repeat(100)], 'photo.png', { type: 'image/png' });

const validRaw = () => ({
  name: 'John',
  age: '30',
  email: 'john@example.com',
  gender: 'Male',
  password: 'Abc123!@',
  confirmPassword: 'Abc123!@',
  country: 'Canada',
  acceptTerms: true,
  image: validImage(),
});

const fieldError = (
  result: ReturnType<typeof schema.safeParse>,
  field: string
): string | undefined => {
  if (result.success) return undefined;
  return result.error.issues.find((issue) => issue.path[0] === field)?.message;
};

describe('createFormSchema', () => {
  it('accepts fully valid data', () => {
    const result = schema.safeParse(validRaw());
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.age).toBe(30);
      expect(result.data.image).toBeInstanceOf(File);
    }
  });

  it('requires the name to start with an uppercase letter', () => {
    const result = schema.safeParse({ ...validRaw(), name: 'john' });
    expect(fieldError(result, 'name')).toMatch(/uppercase/i);
  });

  it('rejects negative age', () => {
    const result = schema.safeParse({ ...validRaw(), age: '-5' });
    expect(fieldError(result, 'age')).toMatch(/negative/i);
  });

  it('rejects non-numeric age', () => {
    const result = schema.safeParse({ ...validRaw(), age: 'abc' });
    expect(fieldError(result, 'age')).toBeDefined();
  });

  it('rejects an invalid email', () => {
    const result = schema.safeParse({ ...validRaw(), email: 'bad@email' });
    expect(fieldError(result, 'email')).toMatch(/valid email/i);
  });

  it('rejects mismatched passwords', () => {
    const result = schema.safeParse({
      ...validRaw(),
      confirmPassword: 'Different1!',
    });
    expect(fieldError(result, 'confirmPassword')).toMatch(/match/i);
  });

  it('rejects a country not in the list', () => {
    const result = schema.safeParse({ ...validRaw(), country: 'Atlantis' });
    expect(fieldError(result, 'country')).toMatch(/list/i);
  });

  it('rejects unaccepted terms', () => {
    const result = schema.safeParse({ ...validRaw(), acceptTerms: false });
    expect(fieldError(result, 'acceptTerms')).toMatch(/accept/i);
  });

  it('rejects a non-image file type', () => {
    const result = schema.safeParse({
      ...validRaw(),
      image: new File(['x'], 'doc.txt', { type: 'text/plain' }),
    });
    expect(fieldError(result, 'image')).toMatch(/png or jpeg/i);
  });

  it('rejects an oversized image', () => {
    const big = new File([new Uint8Array(MAX_IMAGE_BYTES + 1)], 'big.png', {
      type: 'image/png',
    });
    const result = schema.safeParse({ ...validRaw(), image: big });
    expect(fieldError(result, 'image')).toMatch(/2 mb/i);
  });

  it('requires an image', () => {
    const result = schema.safeParse({ ...validRaw(), image: undefined });
    expect(fieldError(result, 'image')).toMatch(/required/i);
  });
});
