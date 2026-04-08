import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from '../context/CaptainContext';
import AuthLayout from '../components/AuthLayout';
import { setCaptainToken } from '../utils/authStorage';

const CaptainSignup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [color, setColor] = useState('');
  const [plate, setPlate] = useState('');
  const [vehicletype, setVehicleType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { setCaptain } = useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const newCaptain = {
      fullname: {
        firstname,
        lastname,
      },
      email,
      password,
      vehicle: {
        color,
        plate,
        capacity,
        vehicletype,
      },
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, newCaptain);

      if (response.status === 201) {
        const data = response.data;
        setCaptain(data.captain);
        setCaptainToken(data.token);
        navigate('/captain-home');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Unable to create captain account right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      badge="Captain signup"
      title="Set up your captain profile and vehicle in one guided form."
      subtitle="We kept the structure clear so captains can register quickly and start receiving ride requests without guesswork."
      footerText="Already registered?"
      footerLink="/captain-login"
      footerLabel="Sign in"
      switchText="Switch"
      switchLink="/signup"
      switchLabel="Rider signup"
    >
      <div>
        <h2 className="text-3xl font-semibold text-slate-900">Create captain account</h2>
        <p className="mt-3 text-sm leading-6 text-[#6c655c]">Tell us who you are and which vehicle you want to drive with in the app.</p>

        <form onSubmit={submitHandler} className="mt-8 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800">First name</label>
              <input required className="auth-input" type="text" placeholder="Vishal" value={firstname} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800">Last name</label>
              <input required className="auth-input" type="text" placeholder="Prajapati" value={lastname} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">Email</label>
            <input required className="auth-input" type="email" placeholder="captain@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">Password</label>
            <input required className="auth-input" type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="rounded-[24px] border border-black/5 bg-white/70 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Vehicle details</p>
                <p className="mt-1 text-sm text-[#6c655c]">These help riders identify you faster during pickup.</p>
              </div>
              <span className="status-chip warning"><i className="ri-steering-2-line"></i> Driver setup</span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <input required className="auth-input" type="text" placeholder="Vehicle color" value={color} onChange={(e) => setColor(e.target.value)} />
              <input required className="auth-input" type="text" placeholder="Plate number" value={plate} onChange={(e) => setPlate(e.target.value)} />
              <input required className="auth-input" type="number" placeholder="Passenger capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
              <select required className="auth-select" value={vehicletype} onChange={(e) => setVehicleType(e.target.value)}>
                <option value="" disabled>Select vehicle type</option>
                <option value="car">Car</option>
                <option value="auto">Auto</option>
                <option value="motorcycle">Motorcycle</option>
              </select>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">{error}</div>
          ) : null}

          <button disabled={isSubmitting} className="primary-button w-full disabled:opacity-70">
            {isSubmitting ? 'Creating captain profile...' : 'Create captain account'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default CaptainSignup;
