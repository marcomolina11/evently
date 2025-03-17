import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { Event } from '../types/event';

type EventCardProps = {
  event: Event;
  handleEventJoin: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    eventId: string,
    alreadyJoined: boolean
  ) => void;
  handleEventEdit: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    eventId: string
  ) => void;
  handleEventDelete: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    eventId: string
  ) => void;
};

const EventCard: React.FC<EventCardProps> = ({
  event,
  handleEventJoin,
  handleEventEdit,
  handleEventDelete,
}) => {
  const { user } = useAuth();

  const hosts = event.hostsUserDetails
    ?.map((host) => {
      return `${host.firstName} ${host.lastName}`;
    })
    .join(', ');

  const isHosting = event.hostsUserDetails.find(
    (host) => host._id === user?._id
  );

  const alreadyJoined = event.attendeesUserDetails.some(
    (attendee) => attendee._id === user?._id
  );

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
    <Link
      to={`/events/${event._id}`}
      key={event._id}
      className="event-card-wrapper"
    >
      <div className="event-card">
        <h3>{event.name}</h3>
        <p>{formatDate(event.date)}</p>
        <p>{event.location && event.location.formattedAddress}</p>
        <p>Hosted by {hosts}</p>
        <div className="event-card-button-row">
          {isHosting ? (
            <div className="event-card--host-buttons">
              <button onClick={(e) => handleEventEdit(e, event._id)}>
                Edit
              </button>
              <button onClick={(e) => handleEventDelete(e, event._id)}>
                Delete
              </button>
            </div>
          ) : (
            <div>
              <button
                className={`btn-join ${alreadyJoined ? 'joined' : ''}`}
                onClick={(e) => handleEventJoin(e, event._id, alreadyJoined)}
              >
                {alreadyJoined ? (
                  <>
                    <span className="check-mark">✅</span> Joined
                  </>
                ) : (
                  'Join'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
