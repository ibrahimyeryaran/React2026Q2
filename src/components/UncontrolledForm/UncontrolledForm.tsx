import { useMemo, useState, type FormEvent } from 'react';
import { useFormStore } from '../../store/formStore';
import {
  createFormSchema,
  ACCEPTED_IMAGE_TYPES,
} from '../../schema/formSchema';
import { buildSubmission } from '../../utils/buildSubmission';
import { GENDER_OPTIONS } from '../../constants';
import FieldError from '../fields/FieldError';
import CountryDataList from '../fields/CountryDataList';
import PasswordStrengthMeter from '../PasswordStrength/PasswordStrengthMeter';
import styles from '../fields/fields.module.css';

interface UncontrolledFormProps {
  onSuccess: () => void;
}

type FieldErrors = Record<string, string>;

function UncontrolledForm({ onSuccess }: UncontrolledFormProps) {
  const countries = useFormStore((state) => state.countries);
  const addSubmission = useFormStore((state) => state.addSubmission);

  const schema = useMemo(() => createFormSchema(countries), [countries]);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const imageInput = form.elements.namedItem('image');
    const imageFile =
      imageInput instanceof HTMLInputElement
        ? (imageInput.files?.[0] ?? null)
        : null;

    const raw = {
      name: String(data.get('name') ?? ''),
      age: String(data.get('age') ?? ''),
      email: String(data.get('email') ?? ''),
      gender: String(data.get('gender') ?? ''),
      password: String(data.get('password') ?? ''),
      confirmPassword: String(data.get('confirmPassword') ?? ''),
      country: String(data.get('country') ?? ''),
      acceptTerms: data.get('acceptTerms') === 'on',
      image: imageFile,
    };

    const result = schema.safeParse(raw);

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === 'string' && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      // The schema's cross-field password check is skipped when other fields
      // fail to parse, so enforce it independently on submit.
      if (raw.password !== raw.confirmPassword && !fieldErrors.confirmPassword) {
        fieldErrors.confirmPassword = 'Passwords do not match';
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    const submission = await buildSubmission(result.data, 'uncontrolled');
    addSubmission(submission);
    onSuccess();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="uf-name">
          Name
        </label>
        <input id="uf-name" name="name" className={styles.input} type="text" />
        <FieldError message={errors.name} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="uf-age">
          Age
        </label>
        <input id="uf-age" name="age" className={styles.input} type="number" />
        <FieldError message={errors.age} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="uf-email">
          Email
        </label>
        <input
          id="uf-email"
          name="email"
          className={styles.input}
          type="email"
        />
        <FieldError message={errors.email} />
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Gender</span>
        <div className={styles.radioGroup}>
          {GENDER_OPTIONS.map((option) => (
            <label key={option} className={styles.radioOption}>
              <input type="radio" name="gender" value={option} />
              {option}
            </label>
          ))}
        </div>
        <FieldError message={errors.gender} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="uf-password">
          Password
        </label>
        <input
          id="uf-password"
          name="password"
          className={styles.input}
          type="password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <PasswordStrengthMeter password={password} />
        <FieldError message={errors.password} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="uf-confirm">
          Confirm Password
        </label>
        <input
          id="uf-confirm"
          name="confirmPassword"
          className={styles.input}
          type="password"
        />
        <FieldError message={errors.confirmPassword} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="uf-country">
          Country
        </label>
        <input
          id="uf-country"
          name="country"
          className={styles.input}
          list="uf-country-list"
        />
        <CountryDataList id="uf-country-list" countries={countries} />
        <FieldError message={errors.country} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="uf-image">
          Profile image (PNG or JPEG)
        </label>
        <input
          id="uf-image"
          name="image"
          className={styles.input}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
        />
        <FieldError message={errors.image} />
      </div>

      <div className={styles.checkboxRow}>
        <input id="uf-terms" name="acceptTerms" type="checkbox" />
        <label htmlFor="uf-terms">I accept the Terms and Conditions</label>
      </div>
      <FieldError message={errors.acceptTerms} />

      <div className={styles.actions}>
        <button type="submit" className={styles.submit}>
          Submit
        </button>
      </div>
    </form>
  );
}

export default UncontrolledForm;
