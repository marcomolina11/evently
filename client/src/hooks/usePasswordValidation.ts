import { useEffect, useState } from 'react';

export const usePasswordValidation = (
  password: string,
  passwordConfirmation: string
): string[] => {
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  useEffect(() => {
    const errors: string[] = [];
    // Passwords must match
    if (passwordConfirmation !== '' && password !== passwordConfirmation) {
      errors.push('Passwords must match');
    }

    if (password.length > 0) {
      // Password must be at least 10 characters long
      const atLeast = 3;
      if (password.length < atLeast) {
        errors.push(`Password must be at least ${atLeast} characters long`);
      }
      // Password must be at most 24 characters long
      const atMost = 24;
      if (password.length > atMost) {
        errors.push(`Password must be at most ${atMost} characters long`);
      }
      // Password must contain at least one uppercase letter
      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      // Password must contain at least one lowercase letter
      if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      // Password cannot contain spaces
      if (/\s/.test(password)) {
        errors.push('Password cannot contain spaces');
      }
      // Password must contain at least one number
      if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
      }
    }
    setPasswordErrors(errors);
  }, [password, passwordConfirmation]);

  return passwordErrors;
};
