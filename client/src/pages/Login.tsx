import { useState } from 'react';
import { LoginFormData } from '../types/auth';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const { setUser } = useAuth();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // make http call to validate user
    // if success
    setUser({ firstName: formData.email });
    setFormData({ email: '', password: '' });

    //wrapping in setTimeout to solve StrictMode redirect loop
    setTimeout(() => navigate('/events'), 0);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  return (
    <div>
      <form className="form--signup" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <button>Login</button>
      </form>
    </div>
  );
};

export default Login;
