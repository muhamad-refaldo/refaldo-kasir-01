import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

// Komponen latar belakang bintang yang sama dengan halaman login/register
const AnimatedStars = () => (
    <div className="stars">
        <div className="stars-bg"></div>
    </div>
);

// Komponen efek kilau yang sama
const FormShine = () => (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl">
        <div className="absolute top-0 -left-1/2 w-full h-full bg-white/20 transform -skew-x-12 mix-blend-overlay animate-[shine_5s_ease-in-out_infinite]"></div>
    </div>
);


const AuthLayout = ({ children, title }) => {
    return (
        <div className="relative min-h-screen w-full bg-[#02041a] flex items-center justify-center p-4 overflow-hidden font-sans">
            <AnimatedStars />
            
            <Tilt 
                glareEnable={true} 
                glareMaxOpacity={0.05} 
                glareColor="#ffffff" 
                glarePosition="all" 
                scale={1.02}
                className="relative z-10 w-full max-w-md"
            >
                <motion.div
                    className="relative bg-slate-900/50 backdrop-blur-md border border-cyan-400/20 rounded-2xl shadow-2xl shadow-cyan-500/10"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                >
                    <FormShine />
                    
                    <div className="relative p-6 sm:p-10">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white tracking-wider font-mono">
                                {title}
                            </h1>
                        </div>
                        {children}
                    </div>
                </motion.div>
            </Tilt>
        </div>
    );
};

export default AuthLayout;
