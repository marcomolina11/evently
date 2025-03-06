import { useState } from 'react';
import { LoginFormData } from '../types/auth';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { User } from '@evently/shared';

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Response was not ok');
      }

      const data: { data: Omit<User, 'password'>; message: string } =
        await response.json();

      if (data.message) {
        setServerErrors((prevErrors) => [...prevErrors, data.message]);
      } else {
        // if success
        setUser(data.data);
        setFormData({ email: '', password: '' });

        //wrapping in setTimeout to solve StrictMode redirect loop
        setTimeout(() => navigate('/events'), 0);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setServerErrors([]);
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  return (
    <div>
      {serverErrors &&
        serverErrors.map((error, index) => (
          <p className="error" key={index}>
            {error}
          </p>
        ))}
      <form className="form--signup" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleChange(e)}
            required
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
            required
          />
        </div>
        <button>Login</button>
      </form>
    </div>
  );
};

export default Login;
