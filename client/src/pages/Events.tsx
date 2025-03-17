import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router';
import EventCard from '../components/EventCard';
import { Event } from '../types/event';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    async function getEvents() {
      try {
        const response = await fetch('http://localhost:3000/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });

        if (!response.ok) {
          throw new Error('Error fetching events');
        }

        const data: Event[] = await response.json();

        setEvents(data);
      } catch (error) {
        console.log(error);
      }
    }
    if (user) {
      getEvents();
    }
  }, [user]);

  function handleEventJoin(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    eventId: string,
    alreadyJoined: boolean
  ) {
    e.preventDefault();
    e.stopPropagation();
    joinEvent(eventId, user?._id, alreadyJoined);
  }

  async function joinEvent(
    eventId: string,
    userId: string | undefined,
    alreadyJoined: boolean
  ) {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, alreadyJoined }),
      });

      if (!response.ok) {
        throw new Error('Error joining event');
      }

      const data: Event[] = await response.json();
      setEvents(data);
    } catch (error) {
      console.log(error);
    }
  }

  function handleEventEdit(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    eventId: string
  ) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Editing event: ', eventId);
  }

  function handleEventDelete(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    eventId: string
  ) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Deleting event: ', eventId);
  }

  const eventElements = events.map((event) => {
    return (
      <EventCard
        key={event._id}
        event={event}
        handleEventJoin={handleEventJoin}
        handleEventEdit={handleEventEdit}
        handleEventDelete={handleEventDelete}
      />
    );
  });

  return (
    <>
      <div className="events-header">
        <h2>Welcome {user ? user.firstName : 'Guest'}</h2>
        <Link to="/create-event">
          <button> + Create event</button>
        </Link>
      </div>
      <section className="events-container">{events && eventElements}</section>
    </>
  );
};

export default Events;
