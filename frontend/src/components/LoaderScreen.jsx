import React from 'react';

const LoaderScreen = ({ title = 'Loading your workspace', subtitle = 'Just a moment while we sync your ride data.' }) => {
    return (
        <div className="flex min-h-screen items-center justify-center px-6">
            <div className="glass-card w-full max-w-md rounded-[28px] p-8 text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white">
                    <i className="ri-loader-4-line animate-spin text-2xl"></i>
                </div>
                <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#6c655c]">{subtitle}</p>
            </div>
        </div>
    );
};

export default LoaderScreen;
