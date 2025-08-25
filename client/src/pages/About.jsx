import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import potoProfil from '../assets/poto-sekola.png'; // Pastikan path gambar ini benar
import { FaWhatsapp, FaInstagram, FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa';

// --- [FITUR BARU] Komponen Latar Belakang Tata Surya ---
const SolarSystemBackground = () => (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
        <div className="absolute top-1/2 left-1/2 w-px h-px bg-yellow-400 rounded-full shadow-[0_0_150px_70px_#fde047,0_0_50px_30px_#facc15,0_0_20px_10px_#fff]"></div>
        
        {/* Orbit & Planet */}
        <div className="planet-orbit" style={{ width: '200px', height: '200px', animationDuration: '12s' }}>
            <div className="planet bg-orange-400"></div>
        </div>
        <div className="planet-orbit" style={{ width: '350px', height: '350px', animationDuration: '20s' }}>
            <div className="planet bg-sky-400" style={{ width: '12px', height: '12px' }}></div>
        </div>
        <div className="planet-orbit" style={{ width: '550px', height: '550px', animationDuration: '35s' }}>
            <div className="planet bg-red-500" style={{ width: '10px', height: '10px' }}></div>
        </div>
        <div className="planet-orbit" style={{ width: '750px', height: '750px', animationDuration: '50s' }}>
            <div className="planet bg-amber-600" style={{ width: '20px', height: '20px' }}></div>
        </div>

        {/* Bintang Jatuh */}
        <div className="shooting-star" style={{ top: '10%', left: '-10%', animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="shooting-star" style={{ top: '30%', left: '-10%', animationDelay: '1.2s', animationDuration: '2s' }}></div>
        <div className="shooting-star" style={{ top: '80%', left: '-10%', animationDelay: '2.5s', animationDuration: '4s' }}></div>
        
        <style>{`
            @keyframes orbit {
                from { transform: translate(-50%, -50%) rotate(0deg); }
                to { transform: translate(-50%, -50%) rotate(360deg); }
            }
            @keyframes shoot {
                0% { transform: translateX(0) translateY(0) rotate(45deg); opacity: 1; }
                100% { transform: translateX(150vw) translateY(-150vh) rotate(45deg); opacity: 0; }
            }
            .planet-orbit {
                position: absolute;
                top: 50%;
                left: 50%;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                animation: orbit linear infinite;
            }
            .planet {
                position: absolute;
                top: 50%;
                left: 0;
                transform: translate(-50%, -50%);
                width: 8px;
                height: 8px;
                border-radius: 50%;
            }
            .shooting-star {
                position: absolute;
                width: 2px;
                height: 150px;
                background: linear-gradient(to bottom, rgba(255,255,255,0.8), transparent);
                animation: shoot linear infinite;
            }
        `}</style>
    </div>
);

// Data statis untuk halaman "Tentang Saya"
const myData = {
    name: "Muhamad Refaldo",
    role: "Developer Magang",
    bio: "Tujuan buat website ini hanya untuk pengunaan pribadi dan hanya untuk memperbagus portofolio, tetapi saya pikir website ini kayanya berguna deh buat temen temen umkm seperti saya, dan ini kali pertamanya saya membuat web full-stack.",
    imageUrl: potoProfil,
    socials: {
        whatsapp: "6288296759533",
        instagram: "https://www.instagram.com/mhmdrfldo22/",
        github: "https://github.com/muhamad-refaldo",
        linkedin: "https://www.linkedin.com/in/muhamad-refaldo-748381284/",
        portfolio: "https://portofolio.refaldo.site"
    }
};

// Komponen untuk ikon sosial media
const SocialIcon = ({ href, icon }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-slate-400 hover:text-cyan-400 transition-colors duration-300 transform hover:scale-110"
    >
        {React.cloneElement(icon, { size: 24 })}
    </a>
);

const About = () => {
    return (
        <div className="relative p-4 sm:p-6 bg-slate-900 min-h-full flex flex-col items-center justify-center overflow-hidden">
            <SolarSystemBackground />
            
            <div className="relative z-10 w-full max-w-4xl">
                {/* Header Halaman */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">Tentang Saya</h1>
                </div>

                {/* Kartu Profil Utama */}
                <motion.div 
                    className="w-full bg-slate-900/50 backdrop-blur-xl border border-cyan-400/20 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col md:flex-row"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, type: 'spring' }}
                >
                    {/* Bagian Kiri: Gambar Profil */}
                    <div className="md:w-1/3 p-6 flex flex-col items-center justify-center bg-black/20 border-b md:border-b-0 md:border-r border-slate-700/50">
                        <div className="relative w-40 h-40 sm:w-48 sm:h-48">
                            <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse"></div>
                            <img 
                                src={myData.imageUrl} 
                                alt={myData.name} 
                                className="relative w-full h-full rounded-full object-cover border-4 border-slate-700"
                            />
                        </div>
                        <h2 className="text-2xl font-bold text-white mt-4">{myData.name}</h2>
                        <p className="text-cyan-400">{myData.role}</p>
                    </div>

                    {/* Bagian Kanan: Informasi & Link */}
                    <div className="md:w-2/3 p-6 sm:p-8 flex flex-col">
                        <h3 className="lg:text-xl font-semibold text-white sm:text-lg">Tujuan Di Balik Pembuatan web ini</h3>
                        <p className="text-slate-400 mt-2 text-base leading-relaxed flex-grow">
                            {myData.bio}
                        </p>
                        <div className="divider border-slate-700 my-6"></div>
                        <div className="flex justify-center items-center gap-6">
                            <SocialIcon href={`https://wa.me/${myData.socials.whatsapp}`} icon={<FaWhatsapp />} />
                            <SocialIcon href={myData.socials.instagram} icon={<FaInstagram />} />
                            <SocialIcon href={myData.socials.github} icon={<FaGithub />} />
                            <SocialIcon href={myData.socials.linkedin} icon={<FaLinkedin />} />
                            <SocialIcon href={myData.socials.portfolio} icon={<FaGlobe />} />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
