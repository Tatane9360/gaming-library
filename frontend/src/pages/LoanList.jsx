import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';

const LoanList = () => {
    const [loans, setLoans] = useState([]);

    const fetchLoans = () => {
        api.get('loans/')
            .then(res => setLoans(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    const handleReturn = async (id) => {
        try {
            await api.post(`loans/return/${id}/`);
            fetchLoans();
        } catch (error) {
            console.error("Erreur lors du retour du jeu", error);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl neon-text">LOG_EMPRUNTS.LOG</h1>

            <div className="card-retro crt p-0 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5">
                            <th className="p-4 text-[0.6rem] text-[#ffff00] border-b-2 border-[#ff00ff]">JEU</th>
                            <th className="p-4 text-[0.6rem] text-[#ffff00] border-b-2 border-[#ff00ff]">JOUEUR</th>
                            <th className="p-4 text-[0.6rem] text-[#ffff00] border-b-2 border-[#ff00ff]">DATE_EMPRUNT</th>
                            <th className="p-4 text-[0.6rem] text-[#ffff00] border-b-2 border-[#ff00ff]">STATUT</th>
                            <th className="p-4 text-[0.6rem] text-[#ffff00] border-b-2 border-[#ff00ff]">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map(loan => (
                            <motion.tr
                                key={loan.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="border-b border-white/10 hover:bg-white/5 transition-colors"
                            >
                                <td className="p-4 text-[#00ffff] font-bold">{loan.game_title}</td>
                                <td className="p-4">{loan.player_name}</td>
                                <td className="p-4 text-xs">{loan.loan_date}</td>
                                <td className="p-4">
                                    {loan.is_returned ? (
                                        <span className="text-[0.6rem] px-2 py-1 bg-green-500/20 text-green-400 border border-green-500">RENDU</span>
                                    ) : (
                                        <span className="text-[0.6rem] px-2 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500">EN COURS</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    {!loan.is_returned && (
                                        <button
                                            onClick={() => handleReturn(loan.id)}
                                            className="btn-retro"
                                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.5rem', background: '#10b981', border: 'none', boxShadow: '2px 2px 0 #065f46' }}
                                        >
                                            RÉCUPÉRER
                                        </button>
                                    )}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LoanList;
