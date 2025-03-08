import { Outlet } from 'react-router';
import Header from './Header.tsx';

const LayoutRoute = () => {
  return (
    <>
      <Header />
      <main className='page-content-wrapper'>
        <Outlet />
      </main>
    </>
  );
};

export default LayoutRoute;
