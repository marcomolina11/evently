import { Link } from 'react-router'; //comment

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="logo">
        <img className="logo--image" src="/evently.png" alt="evently logo" />
        Evently
      </Link>
      <nav className="header--nav">
        <Link to="/events">Events</Link>
      </nav>
      <div>
        <Link to="/login">
          <button>Log in</button>
        </Link>
        <Link to="/signup">
          <button>Sign up</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
