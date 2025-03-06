import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { emptyFormData, SignupFormData } from '../types/auth';
import { usePasswordValidation } from '../hooks/usePasswordValidation';
import { User } from '@evently/shared';

const Signup = () => {
  const [formData, setFormData] = useState<SignupFormData>(emptyFormData);
  const [isFormError, setIsFormError] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const passwordErrors = usePasswordValidation(
    formData.password,
    formData.passwordConfirmation
  );

  function saveFormData(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    setIsFormError(false);
    setServerErrors([]);

    setFormData((prevData) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value,
      };
    });
  }

  function validateFormData(): boolean {
    const isError = Object.values(formData).includes('');
    setIsFormError(isError);
    return !isError;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const isFormDataValid = validateFormData();

    if (isFormDataValid) {
      const { passwordConfirmation: _, ...payload } = formData;
      void _;
      try {
        const response = await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Response was not ok');
        }

        const data: { data: Omit<User, 'password'> | null; message: string } =
          await response.json();
        console.log('Response data: ', data);

        if (data.message) {
          setServerErrors((prevErrors) => [...prevErrors, data.message]);
          return;
        } else {
          setUser(data.data);
          setFormData(emptyFormData);
          //wrapping in setTimeout to solve StrictMode redirect loop
          setTimeout(() => navigate('/events'), 0);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div>
      {isFormError && <p className="error">All fields are required</p>}
      {serverErrors &&
        serverErrors.map((error, index) => (
          <p className="error" key={index}>
            {error}
          </p>
        ))}
      <form className="form--signup" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={(event) => saveFormData(event)}
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={(event) => saveFormData(event)}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(event) => saveFormData(event)}
          />
        </div>
        <div className="form--location">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={(event) => saveFormData(event)}
          />
          <label htmlFor="state">State</label>
          <select
            id="state"
            name="state"
            value={formData.state}
            onChange={(event) => saveFormData(event)}
          >
            <option value=""></option>
            <option value="ca">CA</option>
            <option value="fl">FL</option>
          </select>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(event) => saveFormData(event)}
          />
        </div>
        <div>
          <label htmlFor="passwordConfirmation">Password Confirmation</label>
          <input
            type="password"
            id="passwordConfirmation"
            name="passwordConfirmation"
            value={formData.passwordConfirmation}
            onChange={(event) => saveFormData(event)}
          />
        </div>
        {passwordErrors.length > 0 && (
          <ul className="error">
            {passwordErrors.map((error, index) => (
              <li key={index} className="error">
                {error}
              </li>
            ))}
          </ul>
        )}
        <button>Register</button>
      </form>
    </div>
  );
};

export default Signup;
