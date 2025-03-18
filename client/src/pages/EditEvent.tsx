import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useParams } from 'react-router';
import { User } from '@evently/shared';

type FormData = {
  name: string;
  date: string;
  location: {
    city: string;
    state: string;
    formattedAddress: string;
  };
};

type EventDetails = {
  _id: string;
  name: string;
  date: string;
  hosts: string[];
  hostsUserDetails: Omit<User, 'password'>[];
  attendees: string[];
  attendeesUserDetails: Omit<User, 'password'>[];
  location: {
    city: string;
    state: string;
    formattedAddress: string;
  };
};

type EditEventProps = {
  isGoogleLoaded: boolean;
};

const EditEvent: React.FC<EditEventProps> = ({ isGoogleLoaded }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const locationInputRef = useRef<HTMLInputElement | null>(null);
  const { id } = useParams();
  const today = new Date().toISOString().split('T')[0];
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    date: today,
    location: {
      city: '',
      state: '',
      formattedAddress: '',
    },
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    async function getEventDetails() {
      try {
        const response = await fetch(`http://localhost:3000/events/${id}`);
        if (!response.ok) {
          throw new Error('Error fetching event details');
        }
        const { name, date, location }: EventDetails = await response.json();
        setFormData({ name, date, location });
        setDefaultAddress(location.formattedAddress);
      } catch (error) {
        console.error(error);
      }
    }
    getEventDetails();
  }, [id]);

  const [defaultAddress, setDefaultAddress] = useState('');

  // const defaultAddress = formData.location.formattedAddress;
  const initAutocomplete = useCallback(() => {
    if (!locationInputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      locationInputRef.current
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

      setFormData((prevData) => ({
        ...prevData,
        location: {
          city: cityName,
          state: stateName,
          formattedAddress: place.formatted_address ?? '',
        },
      }));
    });

    // Programmatically set the default place on page load
    setTimeout(() => {
      if (locationInputRef.current) {
        locationInputRef.current.value = defaultAddress; // Set input value
      }
    }, 0); // Delay to ensure Autocomplete is initialized
  }, [defaultAddress, locationInputRef]);

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
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
    setFormErrors([]);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log('formData before api call: ', formData);

    try {
      const response = await fetch(`http://localhost:3000/events/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error creating event');
      }

      await response.json();

      setFormData({
        name: '',
        date: today,
        location: {
          city: '',
          state: '',
          formattedAddress: '',
        },
      });

      const locationInput = document.getElementById('location');
      if (locationInput) {
        locationInput.textContent = '';
      }

      //wrapping in setTimeout to solve StrictMode redirect loop
      setTimeout(() => navigate(`/events`), 0);
    } catch (error) {
      console.log(error);
      setFormErrors(['Error editing the event']);
    }
  }

  return (
    <>
      <h1 className="form--title">Edit event</h1>
      <form className="form--signup" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(event) => saveFormData(event)}
            required
          />
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={(event) => saveFormData(event)}
            required
            min={today}
          />
        </div>
        <div>
          <label htmlFor="location">Location</label>
          <input
            type="text"
            ref={locationInputRef}
            id="location"
            name="location"
          />
        </div>
        {formErrors.length > 0 && (
          <ul className="error">
            {formErrors.map((error, index) => (
              <li key={index} className="error">
                {error}
              </li>
            ))}
          </ul>
        )}
        <button>Save</button>
      </form>
    </>
  );
};

export default EditEvent;
