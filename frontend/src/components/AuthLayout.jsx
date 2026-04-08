import React from 'react';
import { Link } from 'react-router-dom';
import BrandMark from './BrandMark';

const AuthLayout = ({
    badge,
    title,
    subtitle,
    footerText,
    footerLink,
    footerLabel,
    switchText,
    switchLink,
    switchLabel,
    children,
}) => {
    return (
        <div className="auth-shell px-4 py-6 sm:px-6">
            <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col overflow-hidden rounded-[32px] border border-white/60 glass-card lg:grid lg:grid-cols-[1.05fr_0.95fr]">
                <div className="relative flex flex-col justify-between bg-[#111111] px-6 py-8 text-white sm:px-10 lg:px-12">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(33,211,146,0.16),_transparent_24%)]" />
                    <div className="relative flex items-center justify-between gap-4">
                        <BrandMark theme="light" />
                        <span className="auth-badge bg-white/10 text-white/80 border-white/10">{badge}</span>
                    </div>

                    <div className="relative mt-14 max-w-md lg:mt-0">
                        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/55">Urban mobility</p>
                        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">{title}</h1>
                        <p className="mt-5 max-w-sm text-base leading-7 text-white/72">{subtitle}</p>

                        <div className="mt-10 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-[24px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
                                <p className="text-sm text-white/55">Coverage</p>
                                <p className="mt-3 text-2xl font-semibold">Live rides</p>
                                <p className="mt-2 text-sm text-white/70">Maps, routing, pickup search, and ride status in one clean flow.</p>
                            </div>
                            <div className="rounded-[24px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
                                <p className="text-sm text-white/55">Experience</p>
                                <p className="mt-3 text-2xl font-semibold">Faster check-in</p>
                                <p className="mt-2 text-sm text-white/70">Focused forms, clearer steps, and a calmer interface on mobile.</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative mt-10 hidden text-sm text-white/60 lg:block">Designed for riders and captains who just want the flow to work.</div>
                </div>

                <div className="relative flex flex-col justify-between px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
                    <div className="mx-auto w-full max-w-xl">
                        {children}
                    </div>

                    <div className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-4 border-t border-black/5 pt-5 text-sm text-[#6c655c] sm:flex-row sm:items-center sm:justify-between">
                        <p>{footerText} <Link to={footerLink} className="font-semibold text-slate-900">{footerLabel}</Link></p>
                        <Link to={switchLink} className="secondary-button w-full sm:w-auto">{switchText}: {switchLabel}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
