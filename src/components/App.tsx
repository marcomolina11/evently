import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import Home from '../pages/Home.tsx';
import Events from '../pages/Events.tsx';
import LayoutRoute from './LayoutRoute.tsx';
import Login from '../pages/Login.tsx';
import Signup from '../pages/Signup.tsx';
import { AuthContext } from '../context/AuthContext.tsx';
import { User } from '../types/auth.tsx';

const App = () => {
  const [user, setUser] = useState<User>(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  return (
    <>
      <AuthContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <Routes>
            <Route element={<LayoutRoute />}>
              <Route index element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </>
  );
};

export default App;
