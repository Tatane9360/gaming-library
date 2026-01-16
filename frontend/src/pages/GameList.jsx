import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';

const GameList = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        api.get('games/')
            .then(res => setGames(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl neon-text">CATALOGUE.EXE</h1>
                <div className="flex gap-4">
                    <a href="http://localhost:8000/api/export/games/csv/" className="btn-retro">EXPORT.CSV</a>
                    <a href="http://localhost:8000/api/export/games/json/" className="btn-retro" style={{ background: '#00ffff', color: '#0d0221', boxShadow: '4px 4px 0 #00a8a8' }}>EXPORT.JSON</a>
                </div>
            </div>

            <div className="card-retro crt p-0 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5">
                            <th className="p-4 text-[0.6rem] text-[#ffff00] border-b-2 border-[#ff00ff]">TITRE</th>
                            <th className="p-4 text-[0.6rem] text-[#ffff00] border-b-2 border-[#ff00ff]">STUDIO</th>
                            <th className="p-4 text-[0.6rem] text-[#ffff00] border-b-2 border-[#ff00ff]">GENRE</th>
                            <th className="p-4 text-[0.6rem] text-[#ffff00] border-b-2 border-[#ff00ff]">STATUT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {games.map(game => (
                            <motion.tr
                                key={game.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="border-b border-white/10 hover:bg-white/5 transition-colors"
                            >
                                <td className="p-4 text-[#00ffff] font-bold">{game.title}</td>
                                <td className="p-4">{game.studio}</td>
                                <td className="p-4">{game.genre}</td>
                                <td className="p-4">
                                    {game.is_available ? (
                                        <span className="text-[0.6rem] px-2 py-1 bg-green-500/20 text-green-400 border border-green-500 shadow-[2px_2px_0_#065f46]">DISPONIBLE</span>
                                    ) : (
                                        <span className="text-[0.6rem] px-2 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500 shadow-[2px_2px_0_#92400e]">EMPRUNTÉ</span>
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

export default GameList;
