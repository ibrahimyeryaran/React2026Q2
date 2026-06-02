import { fileToBase64 } from './fileToBase64';
import type { FormSubmission, FormValues } from '../types/form';

let counter = 0;

const createId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  counter += 1;
  return `submission-${Date.now()}-${counter}`;
};

/** Converts validated form values (with a File) into a stored submission (base64 image). */
export async function buildSubmission(
  values: FormValues,
  source: FormSubmission['source']
): Promise<FormSubmission> {
  const image = await fileToBase64(values.image);
  return {
    id: createId(),
    source,
    name: values.name,
    age: values.age,
    email: values.email,
    gender: values.gender,
    country: values.country,
    image,
    createdAt: Date.now(),
  };
}
