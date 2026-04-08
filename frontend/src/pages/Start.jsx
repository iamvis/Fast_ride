import React from 'react';
import { Link } from 'react-router-dom';
import BrandMark from '../components/BrandMark';

const Start = () => {
  return (
    <div className="app-shell relative overflow-hidden bg-[#f3ede3] px-4 py-6 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col overflow-hidden rounded-[36px] border border-white/60 glass-card lg:grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-[420px] bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=2574&auto=format&fit=crop)] bg-cover bg-center">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.15),rgba(15,23,42,0.65))]" />
          <div className="relative flex h-full flex-col justify-between p-6 text-white sm:p-10">
            <BrandMark theme="light" />
            <div className="max-w-xl">
              <span className="auth-badge border-white/10 bg-white/10 text-white/80">Open street routing</span>
              <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-6xl">Move through the city with a cleaner ride experience.</h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/75 sm:text-lg">Search pickup points, compare ride types, and track your trip in real time with an interface that feels calmer and more confident.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between px-6 py-8 sm:px-10 sm:py-10">
          <div>
            <div className="status-chip success">
              <i className="ri-shield-check-line"></i>
              Rider and captain flows ready
            </div>
            <h2 className="mt-6 text-3xl font-semibold text-slate-900 sm:text-4xl">Start your next trip in a few taps.</h2>
            <p className="mt-4 max-w-md text-base leading-7 text-[#6c655c]">We rebuilt the flow to feel lighter on mobile, clearer during booking, and easier to trust while the ride is in motion.</p>

            <div className="mt-8 grid gap-4">
              <div className="metric-tile">
                <p className="text-xs uppercase tracking-[0.28em] text-[#8a8075]">What's new</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Smarter panels, clearer ride states, and live map views</p>
              </div>
              <div className="metric-tile">
                <p className="text-xs uppercase tracking-[0.28em] text-[#8a8075]">Best on</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Mobile first layouts with roomy touch targets</p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-3">
            <Link to="/login" className="primary-button w-full">Continue as rider <i className="ri-arrow-right-line"></i></Link>
            <Link to="/captain-login" className="secondary-button w-full">Continue as captain</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Start;
