import { z } from 'zod';
import { isValidEmail } from '../utils/emailValidation';

export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg'];
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB

const startsWithUppercase = (value: string): boolean => {
  if (value.length === 0) return false;
  const first = value[0];
  return first === first.toUpperCase() && first !== first.toLowerCase();
};

const normalizeAge = (value: unknown): unknown => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return undefined;
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? trimmed : parsed;
  }
  return value;
};

/** Normalizes the various shapes a file input can yield (File, FileList) to a File. */
const resolveFile = (value: unknown): File | undefined => {
  if (value instanceof File) return value;
  if (value && typeof value === 'object' && 'item' in value) {
    const list = value as FileList;
    return list.length > 0 ? list[0] : undefined;
  }
  return undefined;
};

const imageSchema = z.preprocess(
  resolveFile,
  z
    .instanceof(File, { error: 'Image is required' })
    .refine((file) => file.size > 0, { error: 'Image is required' })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      error: 'Only PNG or JPEG images are allowed',
    })
    .refine((file) => file.size <= MAX_IMAGE_BYTES, {
      error: 'Image must be 2 MB or smaller',
    })
);

export function createFormSchema(countries: string[]) {
  return z
    .object({
      name: z
        .string()
        .min(1, { error: 'Name is required' })
        .refine(startsWithUppercase, {
          error: 'First letter must be uppercase',
        }),
      age: z.preprocess(
        normalizeAge,
        z
          .number({ error: 'Please enter a valid age' })
          .int({ error: 'Age must be a whole number' })
          .min(0, { error: 'Age cannot be negative' })
      ),
      email: z
        .string()
        .min(1, { error: 'Email is required' })
        .refine(isValidEmail, { error: 'Enter a valid email address' }),
      gender: z.enum(['Male', 'Female', 'Other'], {
        error: 'Please select a gender',
      }),
      password: z.string().min(1, { error: 'Password is required' }),
      confirmPassword: z
        .string()
        .min(1, { error: 'Please confirm your password' }),
      country: z
        .string()
        .min(1, { error: 'Country is required' })
        .refine((value) => countries.includes(value), {
          error: 'Choose a country from the list',
        }),
      acceptTerms: z.literal(true, {
        error: 'You must accept the Terms and Conditions',
      }),
      image: imageSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
      error: 'Passwords do not match',
      path: ['confirmPassword'],
    });
}

export type FormSchema = ReturnType<typeof createFormSchema>;
