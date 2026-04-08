import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainContext';
import AuthLayout from '../components/AuthLayout';
import { setCaptainToken } from '../utils/authStorage';

const CaptainLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setCaptain } = useContext(CaptainDataContext);

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, { email, password });

            if (response.status === 200) {
                const data = response.data;
                setCaptain(data.captain);
                setCaptainToken(data.token);
                navigate('/captain-home');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to sign in as captain right now.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout
            badge="Captain login"
            title="Get back on the road with a sharper driver console."
            subtitle="Sign in to see ride requests, confirm OTP starts, and track active trips with a cleaner captain workflow."
            footerText="Need a captain account?"
            footerLink="/captain-signup"
            footerLabel="Register now"
            switchText="Switch"
            switchLink="/login"
            switchLabel="Rider sign in"
        >
            <div>
                <h2 className="text-3xl font-semibold text-slate-900">Sign in as captain</h2>
                <p className="mt-3 text-sm leading-6 text-[#6c655c]">Use your captain credentials to receive trips and manage the active ride state.</p>

                <form onSubmit={submitHandler} className="mt-8 space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-800">Email</label>
                        <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="captain@example.com" className="auth-input" />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-800">Password</label>
                        <input required value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter your password" className="auth-input" />
                    </div>

                    {error ? (
                        <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">{error}</div>
                    ) : null}

                    <button disabled={isSubmitting} className="primary-button w-full disabled:opacity-70">
                        {isSubmitting ? 'Signing in...' : 'Sign in as captain'}
                    </button>
                </form>
            </div>
        </AuthLayout>
    );
};

export default CaptainLogin;
