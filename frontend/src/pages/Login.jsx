import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, UserPlus, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8000/api/token/', credentials);
            localStorage.setItem('access', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);
            navigate('/');
            window.location.reload();
        } catch {
            setError('ACCÈS REFUSÉ : Identifiants invalides');
        }
    };

    return (
        <div className="auth-container">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="card-retro card-auth crt"
            >
                <div className="flex justify-center mb-8">
                    <div className="p-4 rounded-full bg-primary/20 border-2 border-primary animate-pulse">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                </div>

                <h2 className="text-xl mb-6 neon-text text-center uppercase tracking-[4px]">Connection</h2>
                <p className="register-text-xs text-center text-secondary mb-10 pixel-font leading-relaxed">Identification requise pour le secteur 7</p>

                {error && (
                    <motion.div
                        initial={{ x: -10 }}
                        animate={{ x: 0 }}
                        className="bg-red-500/20 border border-red-500 p-3 mb-6 register-text-sm text-red-500 flex items-center gap-2"
                    >
                        <span className="font-bold">[ERR]</span> {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label>Matricule_Utilisateur</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Entrez votre nom..."
                            value={credentials.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Code_Secret</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-retro w-full group">
                        <LogIn className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        <span>S'identifier</span>
                    </button>

                    <div className="text-center pt-8 border-t border-white/10">
                        <Link to="/register" className="flex items-center justify-center gap-2 register-text-md text-secondary hover:text-primary hover:neon-text transition-all uppercase no-underline font-bold tracking-wider group">
                            <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>Créer un nouveau profil</span>
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
