// src/components/KpiCard.jsx

import React from 'react';

const KpiCard = ({ title, value, icon, color = 'cyan' }) => {
    // Tentukan warna gradien berdasarkan prop 'color'
    const colorClasses = {
        cyan: 'from-cyan-500 to-blue-500',
        violet: 'from-violet-500 to-purple-500',
        amber: 'from-amber-500 to-orange-500',
        emerald: 'from-emerald-500 to-green-500',
    };

    return (
        <div className={`relative p-6 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700
                         transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl`}>
            {/* Efek gradien di latar belakang */}
            <div className={`absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br ${colorClasses[color]} 
                             opacity-20 blur-3xl`}></div>
            
            <div className="relative z-10 flex items-center space-x-4">
                <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-slate-900/50
                                 border border-slate-600`}>
                    {React.cloneElement(icon, { className: `h-6 w-6 text-${color}-400` })}
                </div>
                <div>
                    <p className="text-sm text-slate-400">{title}</p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                </div>
            </div>
        </div>
    );
};

export default KpiCard;
