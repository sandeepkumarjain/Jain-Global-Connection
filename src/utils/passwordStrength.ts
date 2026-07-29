export interface PasswordCriteria {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export function getPasswordCriteria(password: string): PasswordCriteria {
  return {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };
}

export function getPasswordStrengthScore(password: string) {
  if (!password) {
    return {
      score: 0,
      label: '',
      color: 'text-slate-400',
      bgColor: 'bg-slate-200 dark:bg-slate-700',
      percentage: 0,
      criteria: getPasswordCriteria(''),
    };
  }

  const criteria = getPasswordCriteria(password);
  let count = 0;
  if (criteria.minLength) count++;
  if (criteria.hasUpper && criteria.hasLower) count++;
  if (criteria.hasNumber) count++;
  if (criteria.hasSpecial) count++;

  if (password.length < 4) {
    return {
      score: 1,
      label: 'Too Short',
      color: 'text-red-500',
      bgColor: 'bg-red-500',
      percentage: 20,
      criteria,
    };
  }

  if (count <= 1) {
    return {
      score: 1,
      label: 'Weak',
      color: 'text-red-500',
      bgColor: 'bg-red-500',
      percentage: 25,
      criteria,
    };
  } else if (count === 2) {
    return {
      score: 2,
      label: 'Fair',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500',
      percentage: 50,
      criteria,
    };
  } else if (count === 3) {
    return {
      score: 3,
      label: 'Strong',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500',
      percentage: 75,
      criteria,
    };
  } else {
    return {
      score: 4,
      label: 'Very Strong',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500',
      percentage: 100,
      criteria,
    };
  }
}
