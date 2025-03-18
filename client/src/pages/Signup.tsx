import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { emptyFormData, SignupFormData } from '../types/auth';
import { usePasswordValidation } from '../hooks/usePasswordValidation';
import { User } from '@evently/shared';

type SignupProps = {
  isGoogleLoaded: boolean;
};

const Signup: React.FC<SignupProps> = ({ isGoogleLoaded }) => {
  const [formData, setFormData] = useState<SignupFormData>(emptyFormData);
  const [isFormError, setIsFormError] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const locationInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      navigate('/events');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      initAutocomplete();
    }
  }, [isGoogleLoaded]);

  function initAutocomplete() {
    if (!locationInputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      locationInputRef.current,
      {
        types: ['(cities)'],
      }
    );

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.formatted_address) {
        console.log('No details available for the selected location');
        return;
      }

      const stateComponent = place.address_components?.find((component) =>
        component.types.includes('administrative_area_level_1')
      );
      const cityComponent = place.address_components?.find((component) =>
        component.types.includes('locality')
      );

      const stateName = stateComponent ? stateComponent.short_name : '';
      const cityName = cityComponent ? cityComponent.long_name : '';

      setFormData((prevData) => {
        return {
          ...prevData,
          location: {
            city: cityName,
            state: stateName,
          },
        };
      });
    });
  }

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
      <h1 className="form--title">Please sign up</h1>
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
        <div>
          <label htmlFor="location">Location</label>
          <input
            type="text"
            ref={locationInputRef}
            name="location"
            id="location"
          />
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
          <label htmlFor="passwordConfirmation">Confirm</label>
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
        <button>Sign up</button>
      </form>
    </div>
  );
};

export default Signup;
