import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';
import AuthLayout from '../components/AuthLayout';
import { setUserToken } from '../utils/authStorage';

const UserSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email,
      password,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);
      if (response.status === 201) {
        const data = response.data;
        setUserToken(data.token);
        setUser(data.user);
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Unable to create your account right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      badge="Rider signup"
      title="Set up your rider account in one clean step."
      subtitle="We kept the signup short so you can get to searching pickup points and booking rides faster."
      footerText="Already have an account?"
      footerLink="/login"
      footerLabel="Sign in"
      switchText="Switch"
      switchLink="/captain-signup"
      switchLabel="Captain signup"
    >
      <div>
        <h2 className="text-3xl font-semibold text-slate-900">Create rider account</h2>
        <p className="mt-3 text-sm leading-6 text-[#6c655c]">We'll use these details for trip history, ride status, and account security.</p>

        <form onSubmit={submitHandler} className="mt-8 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800">First name</label>
              <input required className="auth-input" type="text" placeholder="Vijay" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800">Last name</label>
              <input required className="auth-input" type="text" placeholder="Sharma" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">Email</label>
            <input required className="auth-input" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">Password</label>
            <input required className="auth-input" type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error ? (
            <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">{error}</div>
          ) : null}

          <button disabled={isSubmitting} className="primary-button w-full disabled:opacity-70">
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-xs leading-5 text-[#7b7268]">By continuing, you agree to account verification and basic trip communication needed to run the ride flow.</p>
      </div>
    </AuthLayout>
  );
};

export default UserSignup;
