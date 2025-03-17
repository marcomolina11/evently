import { User } from '@evently/shared';

export type AuthContextType = {
  user: Omit<User, 'password'> | null;
  setUser: (user: Omit<User, 'password'> | null) => void;
} | null;

export type SignupFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  location: {
    city: string;
    state: string;
  };
};

export const emptyFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  location: {
    city: '',
    state: '',
  },
};

export type LoginFormData = {
  email: string;
  password: string;
};
