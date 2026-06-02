export interface PasswordChecks {
  hasNumber: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasSpecial: boolean;
}

export type PasswordStrength = 'empty' | 'weak' | 'medium' | 'strong';

const SPECIAL_CHARACTERS = '!@#$%^&*()_+-=[]{};:\'",.<>/?\\|`~';

export function getPasswordChecks(password: string): PasswordChecks {
  let hasNumber = false;
  let hasUppercase = false;
  let hasLowercase = false;
  let hasSpecial = false;

  for (const char of password) {
    if (char >= '0' && char <= '9') {
      hasNumber = true;
    } else if (char >= 'A' && char <= 'Z') {
      hasUppercase = true;
    } else if (char >= 'a' && char <= 'z') {
      hasLowercase = true;
    } else if (SPECIAL_CHARACTERS.includes(char)) {
      hasSpecial = true;
    }
  }

  return { hasNumber, hasUppercase, hasLowercase, hasSpecial };
}

export function countSatisfied(checks: PasswordChecks): number {
  return Object.values(checks).filter(Boolean).length;
}

export function getPasswordStrength(password: string): PasswordStrength {
  if (password.length === 0) return 'empty';
  const score = countSatisfied(getPasswordChecks(password));
  if (score <= 1) return 'weak';
  if (score <= 3) return 'medium';
  return 'strong';
}
