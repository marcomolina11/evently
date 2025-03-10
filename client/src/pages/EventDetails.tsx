import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { User } from '@evently/shared';

type EventDetails = {
  _id: string;
  name: string;
  date: string;
  city: string;
  state: string;
  hosts: string[];
  hostsUserDetails: Omit<User, 'password'>[];
  attendees: string[];
  attendeesUserDetails: Omit<User, 'password'>[];
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

  const hosts = event?.hostsUserDetails?.map((host) => {
    return `${host.firstName} ${host.lastName}`;
  });

  return (
    <>
      <section className="event-details">
        <div className="event-description">
          <h2>{event?.name}</h2>
          <p>{event?.date} format as date</p>
          <p>
            {event?.city}, {event?.state}
          </p>
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
                <td>{attendee.city}</td>
                <td>{attendee.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default EventDetails;
