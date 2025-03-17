import { NavLink, Link, useNavigate } from 'react-router';
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
      <Link to={user ? '/events' : '/'} className="logo">
        <img className="logo--image" src="/evently.png" alt="evently logo" />
        Evently
      </Link>
      <nav className="header--nav">
        <NavLink
          to="/events"
          className={({ isActive }) => (isActive ? 'selected' : '')}
        >
          <div>Events dashboard</div>
        </NavLink>
        <NavLink
          to={`/user/${user?._id}`}
          className={({ isActive }) => (isActive ? 'selected' : '')}
        >
          <div>Edit my profile</div>
        </NavLink>
      </nav>
      {user ? (
        <div>
          <button className="btn--nav-button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      ) : (
        <div className="header--auth-buttons">
          <Link to="/login">
            <button className="btn--nav-button">Log in</button>
          </Link>
          <Link to="/">
            <button className="btn--nav-button">Sign up</button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
