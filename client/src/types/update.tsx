export type UpdateUserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  location: {
    city: string;
    state: string;
  };
};

export const emptyUpdateUserFormData = {
  firstName: '',
  lastName: '',
  email: '',
  location: {
    city: '',
    state: '',
  },
};
