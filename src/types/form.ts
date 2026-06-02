export type Gender = 'Male' | 'Female' | 'Other';

/** Raw values produced by the form inputs, validated by the Zod schema. */
export interface FormValues {
  name: string;
  age: number;
  email: string;
  gender: Gender;
  password: string;
  confirmPassword: string;
  country: string;
  acceptTerms: boolean;
  image: File;
}

/** A successful submission as stored in the state library (image is base64). */
export interface FormSubmission {
  id: string;
  source: 'uncontrolled' | 'react-hook-form';
  name: string;
  age: number;
  email: string;
  gender: Gender;
  country: string;
  image: string;
  createdAt: number;
}
