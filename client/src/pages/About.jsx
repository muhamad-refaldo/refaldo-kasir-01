import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import potoProfil from '../assets/poto-sekola.png'


const myData = {
    name: "muhamad Refaldo",
    role: "Developer magang",
    bio: "Tujuan buat website ini hanya untuk pengunaan pribadi dan hanya untuk memperbagus portofolio, tetapi saya pikir website ini kayanya berguna deh buat temen temen umkm seperti saya, dan ini kali pertamanya saya buat web full-stack",
    imageUrl: potoProfil, // Ganti dengan URL foto Anda
    socials: {
        whatsapp: "+6288296759533",
        instagram: "https://www.instagram.com/mhmdrfldo22/",
        github: "https://github.com/muhamad-refaldo",
        linkedin: "https://www.linkedin.com/in/muhamad-refaldo-748381284/",
        portfolio: "https://portofolio.refaldo.site"
    }
};

const SocialIcon = ({ href, children }) => (
    <motion.a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="social-icon"
        whileHover={{ y: -5, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        {children}
    </motion.a>
);

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

const About = () => {
    return (
        <motion.div 
            className="about-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <Tilt glareEnable={true} glareMaxOpacity={0.2} glareColor="#00FFFF" glarePosition="all">
                <div className="profile-card">
                    <motion.figure variants={itemVariants} className="profile-image-container">
                        <img src={myData.imageUrl} alt={myData.name} className="profile-image" />
                        <div className="scan-line"></div>
                    </motion.figure>

                    <motion.div variants={itemVariants} className="profile-info">
                        <motion.h1 variants={itemVariants} className="name">{myData.name}</motion.h1>
                        <motion.p variants={itemVariants} className="role">{myData.role}</motion.p>
                        <motion.p variants={itemVariants} className="bio">{myData.bio}</motion.p>
                        
                        <motion.div variants={itemVariants} className="social-links">
                            <SocialIcon href={`https://wa.me/${myData.socials.whatsapp}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.731 6.086l.244.463-1.012 3.712 3.712-1.012.462.245z"/></svg>
                            </SocialIcon>
                            <SocialIcon href={myData.socials.instagram}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                            </SocialIcon>
                            <SocialIcon href={myData.socials.github}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            </SocialIcon>
                            <SocialIcon href={myData.socials.linkedin}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-2.002 1.801-3.668 4.002-3.668 2.203 0 3.998 1.666 3.998 3.668v8.399h4.984v-8.661c0-4.036-2.937-7.339-6.986-7.339-3.328 0-5.405 1.834-6.324 3.424h-.05v-2.924h-4.968v16h4.968v-8.399z"/></svg>
                            </SocialIcon>
                            <SocialIcon href={myData.socials.portfolio}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6.188 8.719c.439-.439.926-.801 1.444-1.087 2.887-1.591 6.589-.745 8.445 2.064l-2.064-2.064c-.937-.937-2.457-.937-3.394 0l-2.064 2.064-2.064-2.064c-.937-.937-2.457-.937-3.394 0s-.937 2.457 0 3.394l2.064 2.064-2.064 2.064c-.937.937-.937 2.457 0 3.394s2.457.937 3.394 0l2.064-2.064 2.064 2.064c.937.937 2.457.937 3.394 0l2.064-2.064c2.809-3.745 2.215-9.28-.888-12.383l1.791 1.791c.937.937 2.457.937 3.394 0s.937-2.457 0-3.394l-1.791-1.791c-2.5-2.5-6.553-2.5-9.053 0l-1.791 1.791c-.937.937-.937 2.457 0 3.394s2.457.937 3.394 0z"/></svg>
                            </SocialIcon>
                        </motion.div>
                    </motion.div>
                </div>
            </Tilt>
        </motion.div>
    );
};

export default About;