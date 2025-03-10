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

const App = () => {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <>
      <AuthContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <Routes>
            <Route element={<LayoutRoute />}>
              <Route index element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails/>} />
              <Route path="/create-event" element={<CreateEvent />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </>
  );
};

export default App;
