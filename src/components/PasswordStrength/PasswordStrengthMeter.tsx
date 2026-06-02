import {
  getPasswordChecks,
  getPasswordStrength,
} from '../../utils/passwordStrength';
import styles from './PasswordStrengthMeter.module.css';

interface PasswordStrengthMeterProps {
  password: string;
}

const RULES: { key: keyof ReturnType<typeof getPasswordChecks>; label: string }[] =
  [
    { key: 'hasNumber', label: '1 number' },
    { key: 'hasUppercase', label: '1 uppercase' },
    { key: 'hasLowercase', label: '1 lowercase' },
    { key: 'hasSpecial', label: '1 special character' },
  ];

function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const checks = getPasswordChecks(password);
  const strength = getPasswordStrength(password);

  return (
    <div className={styles.wrapper} data-testid="password-strength">
      <div className={`${styles.bar} ${styles[strength]}`} aria-hidden="true" />
      <span className={styles.label}>Strength: {strength}</span>
      <ul className={styles.rules}>
        {RULES.map((rule) => (
          <li
            key={rule.key}
            className={checks[rule.key] ? styles.met : styles.unmet}
          >
            {checks[rule.key] ? '✓' : '○'} {rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PasswordStrengthMeter;
