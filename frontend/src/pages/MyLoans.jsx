import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { Tablet, Calendar, Clock } from 'lucide-react';

const MyLoans = () => {
    const [loans, setLoans] = useState([]);

    async function fetchLoans() {
        try {
            const res = await api.get('my-loans/');
            setLoans(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    async function handleReturn(loanId) {
        try {
            await api.post(`loans/return/${loanId}/`);
            fetchLoans();
            alert('Jeu rendu avec succès !');
        } catch (err) {
            console.error(err);
            alert('Erreur lors du retour du jeu');
        }
    }

    useEffect(() => {
        fetchLoans();
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-2xl neon-text">MES_EMPRUNTS.EXE</h1>

            {loans.length === 0 ? (
                <div className="card-retro crt p-12 text-center text-secondary">
                    <Tablet className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="pixel-font text-xs">AUCUN EMPRUNT ACTIF DÉTECTÉ</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {loans.map(loan => (
                        <motion.div
                            key={loan.id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="card-retro crt border-l-4 border-l-[#ffff00]"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl text-[#00ffff]">{loan.game_title}</h2>
                                {loan.is_returned ? (
                                    <span className="text-[0.5rem] px-2 py-1 bg-green-500/20 text-green-400 border border-green-500">REDU</span>
                                ) : (
                                    <span className="text-[0.5rem] px-2 py-1 bg-primary/20 text-primary border border-primary animate-pulse">EN COURS</span>
                                )}
                            </div>

                            <div className="space-y-2 text-xs text-[#b4a5d8]">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3 h-3 text-[#ffff00]" />
                                    <span>Date d'emprunt : {loan.loan_date}</span>
                                </div>
                                {loan.return_date && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3 h-3 text-[#00ffff]" />
                                        <span>Date de retour : {loan.return_date}</span>
                                    </div>
                                )}
                            </div>

                            {!loan.is_returned && (
                                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                                    <p className="text-[0.5rem] italic opacity-60">Conservez précieusement ce titre !</p>
                                    <button
                                        onClick={() => handleReturn(loan.id)}
                                        className="px-3 py-1 bg-secondary text-bg font-bold pixel-font text-[0.5rem] shadow-[2px_2px_0_#00a8a8] hover:translate-y-[1px] hover:shadow-none transition-all"
                                    >
                                        RENDRE
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyLoans;
