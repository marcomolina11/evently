export type User = {
  firstName: string;
} | null;

export type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
} | null;

export type SignupFormData = {
  firstName: string;
  lastName: string; 
  email: string;
  city: string;
  state: string;
  password: string;
  passwordConfirmation: string;
};

export const emptyFormData = {
  firstName: '',
  lastName: '',
  email: '',
  city: '',
  state: '',
  password: '',
  passwordConfirmation: '',
};

export type LoginFormData = {
  email: string,
  password: string
}
