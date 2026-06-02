import { screen } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';

export const validImageFile = () =>
  new File(['x'.repeat(64)], 'photo.png', { type: 'image/png' });

interface FillOptions {
  name?: string;
  age?: string;
  email?: string;
  gender?: string;
  password?: string;
  confirmPassword?: string;
  country?: string;
  acceptTerms?: boolean;
  withImage?: boolean;
}

/** Fills a rendered form (uncontrolled or RHF) with valid-by-default values. */
export async function fillValidForm(user: UserEvent, options: FillOptions = {}) {
  const {
    name = 'John',
    age = '30',
    email = 'john@example.com',
    gender = 'Male',
    password = 'Abc123!@',
    confirmPassword = 'Abc123!@',
    country = 'Canada',
    acceptTerms = true,
    withImage = true,
  } = options;

  await user.type(screen.getByLabelText('Name'), name);
  await user.type(screen.getByLabelText('Age'), age);
  await user.type(screen.getByLabelText('Email'), email);
  await user.click(screen.getByLabelText(gender));
  await user.type(screen.getByLabelText('Password'), password);
  await user.type(screen.getByLabelText('Confirm Password'), confirmPassword);
  await user.type(screen.getByLabelText('Country'), country);
  if (withImage) {
    await user.upload(
      screen.getByLabelText(/profile image/i),
      validImageFile()
    );
  }
  if (acceptTerms) {
    await user.click(screen.getByLabelText(/accept the terms/i));
  }
}
