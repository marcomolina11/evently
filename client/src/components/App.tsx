import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthContext } from '../context/AuthContext.tsx';
import { User } from '@evently/shared';
import Home from '../pages/Home.tsx';
import Events from '../pages/Events.tsx';
import LayoutRoute from './LayoutRoute.tsx';
import Login from '../pages/Login.tsx';
import Signup from '../pages/Signup.tsx';
import CreateEvent from '../pages/CreateEvent.tsx';
import EventDetails from '../pages/EventDetails.tsx';
import UpdateUser from '../pages/UpdateUser.tsx';

const loadGoogleMapsAPI = () => {
  return new Promise<void>((resolve, reject) => {
    // Check if already loaded
    if (window.google && window.google.maps) {
      console.log('Google Maps API already loaded');
      resolve();
      return;
    }
    // Check if script already exists
    if (!document.querySelector("script[src*='maps.googleapis.com']")) {
      console.log('Loading Google Maps API...');

      window.onGoogleMapsLoaded = () => {
        console.log('Google Maps API Loaded.');
        resolve();
      };

      // Load script with callback
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_API_KEY
      }&libraries=places&callback=onGoogleMapsLoaded&loading=async`;
      script.async = true;
      script.defer = true;
      script.onerror = reject;
      document.body.appendChild(script);
    }
  });
};

const App = () => {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    loadGoogleMapsAPI()
      .then(() => setIsGoogleLoaded(true))
      .catch((error) => console.error('Failed to load Google Maps API', error));
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <Routes>
            <Route element={<LayoutRoute />}>
              <Route index element={<Home />} />
              <Route
                path="/signup"
                element={<Signup isGoogleLoaded={isGoogleLoaded} />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route
                path="/create-event"
                element={<CreateEvent isGoogleLoaded={isGoogleLoaded} />}
              />
              <Route
                path="/user/:id"
                element={<UpdateUser isGoogleLoaded={isGoogleLoaded} />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </>
  );
};

export default App;
