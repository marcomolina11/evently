import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router';

type FormData = {
  name: string;
  date: string;
  hosts: string[];
  location: {
    city: string;
    state: string;
    formattedAddress: string;
  };
};

const CreateEvent: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const locationInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Check if already loaded
    if (window.google) {
      console.log('window.google exists');
      initAutocomplete();
      return;
    }

    // Check if script already exists
    if (!document.querySelector("script[src*='maps.googleapis.com']")) {
      // Define global callback function
      window.initAutocomplete = initAutocomplete;

      // Load script with callback
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_API_KEY
      }&libraries=places&callback=initAutocomplete&loading=async`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  function initAutocomplete() {
    if (
      !window.google ||
      !window.google.maps ||
      !window.google.maps.places ||
      !locationInputRef.current
    ) {
      console.error('Google Places API not loaded.');
      return;
    }

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

      setFormData((prevData) => {
        return {
          ...prevData,
          location: {
            city: cityName,
            state: stateName,
            formattedAddress: place.formatted_address ?? '',
          },
        };
      });

      console.log('Selected Place Complete:', place);
    });
  }

  const today = new Date().toISOString().split('T')[0];

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    date: today,
    hosts: [user ? user._id : ''],
    location: {
      city: '',
      state: '',
      formattedAddress: '',
    },
  });

  console.log(formData);

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

    try {
      const response = await fetch('http://localhost:3000/create-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error creating event');
      }

      const data = await response.json();

      console.log('response data: ', data);

      setFormData({
        name: '',
        date: today,
        hosts: [],
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
      setTimeout(() => navigate('/events'), 0);

      // TODO: redirect to event details page instead of all events page
    } catch (error) {
      console.log(error);
      setFormErrors(['Error creating the event']);
    }
  }

  return (
    <>
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
            id="location"
            name="location"
            ref={locationInputRef}
            placeholder="Search Locations"
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
        <button>Create</button>
      </form>
    </>
  );
};

export default CreateEvent;
