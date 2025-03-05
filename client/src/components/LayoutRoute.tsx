import { Outlet } from 'react-router';
import Header from './Header.tsx';

const LayoutRoute = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default LayoutRoute;
