import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { emptyUpdateUserFormData, UpdateUserFormData } from '../types/update';
import { useNavigate } from 'react-router';
import { User } from '@evently/shared';

type UpdateUserProps = {
  isGoogleLoaded: boolean;
};

const UpdateUser: React.FC<UpdateUserProps> = ({ isGoogleLoaded }) => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState<UpdateUserFormData>({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    location: {
      city: user?.location.city ?? '',
      state: user?.location.state ?? '',
    },
  });
  const [isFormError, setIsFormError] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const locationInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const defaultAddress = `${user?.location.city}, ${user?.location.state}`;
  const initAutocomplete = useCallback(() => {
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

    // Programmatically set the default place on page load
    setTimeout(() => {
      if (locationInputRef.current) {
        locationInputRef.current.value = defaultAddress; // Set input value
      }
    }, 0); // Delay to ensure Autocomplete is initialized
  }, [defaultAddress]);

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      initAutocomplete();
    }
  }, [isGoogleLoaded, initAutocomplete]);

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
      try {
        const response = await fetch(
          `http://localhost:3000/users/${user?._id}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          }
        );

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
          setFormData(emptyUpdateUserFormData);
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
      <h1 className="form--title">Update your profile</h1>
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
        <button>Save</button>
      </form>
    </div>
  );
};

export default UpdateUser;
