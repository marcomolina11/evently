import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { User } from '@evently/shared';

type EventDetails = {
  _id: string;
  name: string;
  date: string;
  hosts: string[];
  hostsUserDetails: Omit<User, 'password'>[];
  attendees: string[];
  attendeesUserDetails: Omit<User, 'password'>[];
  location?: {
    city: string;
    state: string;
    formattedAddress: string;
  };
} | null;

const EventDetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState<EventDetails>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    async function getEventDetails() {
      try {
        const response = await fetch(`http://localhost:3000/events/${id}`);
        if (!response.ok) {
          throw new Error('Error fetching event details');
        }
        const data = await response.json();
        console.log(data);
        setEvent(data);
      } catch (error) {
        console.error(error);
      }
    }
    getEventDetails();
  }, [id]);

  const hosts = event?.hostsUserDetails
    ?.map((host) => {
      return `${host.firstName} ${host.lastName}`;
    })
    .join(', ');

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
      {event && (
        <section className="event-details">
          <div className="event-description">
            <h2>{event.name}</h2>
            <p>{formatDate(event.date)}</p>
            <p>{event.location && event.location.formattedAddress}</p>
            <p>Hosted by {hosts}</p>
            <p>Attendees: {event?.attendees.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {event?.attendeesUserDetails?.map((attendee) => (
                <tr key={attendee._id}>
                  <td>
                    {attendee.firstName} {attendee.lastName}
                  </td>
                  <td>{attendee.location && attendee.location.city}</td>
                  <td>{attendee.location && attendee.location.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </>
  );
};

export default EventDetails;
