import { useAuth } from '../hooks/useAuth';

const Events = () => {
  const { user } = useAuth();

  return (
    <>
      <h1>All Events</h1>
      <h2>Welcome {user ? user.firstName : 'Guest'}</h2>
      <button>Create Event</button>
    </>
  );
};

export default Events;
