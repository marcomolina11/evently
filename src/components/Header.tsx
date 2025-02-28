import { Link } from "react-router";

export default function Header() {
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
}
