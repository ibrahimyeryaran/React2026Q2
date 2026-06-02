import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormStore } from '../../store/formStore';
import { createFormSchema } from '../../schema/formSchema';
import { ACCEPTED_IMAGE_TYPES } from '../../schema/formSchema';
import { buildSubmission } from '../../utils/buildSubmission';
import { GENDER_OPTIONS } from '../../constants';
import FieldError from '../fields/FieldError';
import CountryDataList from '../fields/CountryDataList';
import PasswordStrengthMeter from '../PasswordStrength/PasswordStrengthMeter';
import styles from '../fields/fields.module.css';

interface HookFormProps {
  onSuccess: () => void;
}

function HookForm({ onSuccess }: HookFormProps) {
  const countries = useFormStore((state) => state.countries);
  const addSubmission = useFormStore((state) => state.addSubmission);

  const schema = useMemo(() => createFormSchema(countries), [countries]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const password = watch('password') ?? '';
  const confirmPassword = watch('confirmPassword') ?? '';
  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;
  const confirmError =
    errors.confirmPassword?.message ??
    (passwordsMismatch ? 'Passwords do not match' : undefined);

  const onValid = handleSubmit(async (values) => {
    const submission = await buildSubmission(values, 'react-hook-form');
    addSubmission(submission);
    reset();
    onSuccess();
  });

  return (
    <form className={styles.form} onSubmit={onValid} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="rhf-name">
          Name
        </label>
        <input
          id="rhf-name"
          className={styles.input}
          type="text"
          {...register('name')}
        />
        <FieldError message={errors.name?.message} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="rhf-age">
          Age
        </label>
        <input
          id="rhf-age"
          className={styles.input}
          type="number"
          {...register('age')}
        />
        <FieldError message={errors.age?.message} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="rhf-email">
          Email
        </label>
        <input
          id="rhf-email"
          className={styles.input}
          type="email"
          {...register('email')}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Gender</span>
        <div className={styles.radioGroup}>
          {GENDER_OPTIONS.map((option) => (
            <label key={option} className={styles.radioOption}>
              <input type="radio" value={option} {...register('gender')} />
              {option}
            </label>
          ))}
        </div>
        <FieldError message={errors.gender?.message} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="rhf-password">
          Password
        </label>
        <input
          id="rhf-password"
          className={styles.input}
          type="password"
          {...register('password')}
        />
        <PasswordStrengthMeter password={password} />
        <FieldError message={errors.password?.message} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="rhf-confirm">
          Confirm Password
        </label>
        <input
          id="rhf-confirm"
          className={styles.input}
          type="password"
          {...register('confirmPassword')}
        />
        <FieldError message={confirmError} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="rhf-country">
          Country
        </label>
        <input
          id="rhf-country"
          className={styles.input}
          list="rhf-country-list"
          {...register('country')}
        />
        <CountryDataList id="rhf-country-list" countries={countries} />
        <FieldError message={errors.country?.message} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="rhf-image">
          Profile image (PNG or JPEG)
        </label>
        <input
          id="rhf-image"
          className={styles.input}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          {...register('image')}
        />
        <FieldError message={errors.image?.message} />
      </div>

      <div className={styles.checkboxRow}>
        <input id="rhf-terms" type="checkbox" {...register('acceptTerms')} />
        <label htmlFor="rhf-terms">I accept the Terms and Conditions</label>
      </div>
      <FieldError message={errors.acceptTerms?.message} />

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.submit}
          disabled={!isValid || passwordsMismatch}
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default HookForm;
