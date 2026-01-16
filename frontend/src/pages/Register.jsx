import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ChevronLeft, Mail, Lock, User } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '', email: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/register/', formData);
            navigate('/login');
        } catch {
            setError('ERREUR : Échec de la création du profil');
        }
    };

    return (
        <div className="auth-container">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="card-retro card-auth crt"
            >
                <h2 className="text-xl mb-6 neon-text text-center uppercase tracking-[4px]">Inscription</h2>
                <p className="register-text-xs text-center text-secondary mb-10 pixel-font leading-relaxed">Initialisation d'un nouveau profil citoyen</p>

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
                    <div className="relative">
                        <label className="flex items-center gap-2">
                            <User className="w-3 h-3" /> Nom_Utilisateur
                        </label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Choisir un nom..."
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-2">
                            <Mail className="w-3 h-3" /> Adresse_Mail
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="nom@domaine.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-2">
                            <Lock className="w-3 h-3" /> Code_De_Securite
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Mot de passe robuste..."
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-retro w-full group">
                        <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>Créer Profil</span>
                    </button>

                    <div className="text-center pt-8 border-t border-white/10">
                        <Link to="/login" className="flex items-center justify-center gap-2 register-text-md text-secondary hover:text-primary hover:neon-text transition-all uppercase no-underline font-bold tracking-wider group">
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>Retour à la connection</span>
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
