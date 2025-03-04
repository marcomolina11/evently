import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    setUser(null);
    navigate('/login');
  }

  return (
    <header className="header">
      <Link to="/" className="logo">
        <img className="logo--image" src="/evently.png" alt="evently logo" />
        Evently
      </Link>
      <nav className="header--nav">
        <Link to="/events">Events</Link>
      </nav>
      {user ? (
        <div>
          <button onClick={handleLogout}>Log out</button>
        </div>
      ) : (
        <div>
          <Link to="/login">
            <button>Log in</button>
          </Link>
          <Link to="/signup">
            <button>Sign up</button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
