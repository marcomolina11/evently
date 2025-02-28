import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './pages/Home.tsx';
import Events from './pages/Events.tsx';
import LayoutRoute from './components/LayoutRoute.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
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
  </StrictMode>
);
