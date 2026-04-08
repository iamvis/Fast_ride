import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import AuthLayout from '../components/AuthLayout';
import { setUserToken } from '../utils/authStorage';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, { email, password });

      if (response.status === 200) {
        const data = response.data;
        setUserToken(data.token);
        setUser(data.user);
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign you in right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      badge="Rider login"
      title="Welcome back to a smoother commute."
      subtitle="Sign in to request a ride, compare vehicle options, and keep every trip in view from pickup to drop-off."
      footerText="New here?"
      footerLink="/signup"
      footerLabel="Create a rider account"
      switchText="Switch"
      switchLink="/captain-login"
      switchLabel="Captain sign in"
    >
      <div>
        <h2 className="text-3xl font-semibold text-slate-900">Sign in as rider</h2>
        <p className="mt-3 text-sm leading-6 text-[#6c655c]">Use the account you created for booking and tracking rides.</p>

        <form onSubmit={submitHandler} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">Email</label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="name@example.com"
              className="auth-input"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">Password</label>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              className="auth-input"
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">{error}</div>
          ) : null}

          <button disabled={isSubmitting} className="primary-button w-full disabled:opacity-70">
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default UserLogin;
