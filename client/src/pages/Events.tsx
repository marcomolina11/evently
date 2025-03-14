import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router';

type Event = {
  _id: string;
  name: string;
  date: string;
  city: string;
  state: string;
  hosts: string[];
  attendees: string[];
};

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);

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

  const eventElements = events.map((event) => {
    return (
      <Link
        to={`/events/${event._id}`}
        key={event._id}
        className="event-card-wrapper"
      >
        <div className="event-card">
          <h3>{event.name}</h3>
          <p>{formatDate(event.date)}</p>
          <p>
            {event.city}, {event.state}
          </p>
          <p>Hosted by Marco Molina</p>
        </div>
      </Link>
    );
  });

  function formatDate(dateString: string): string {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  return (
    <>
      <div className="events-header">
        <h2>Welcome {user ? user.firstName : 'Guest'}</h2>
        <Link to="/create-event">
          <button> + Create Event</button>
        </Link>
      </div>
      <section className="events-container">{events && eventElements}</section>
    </>
  );
};

export default Events;
