import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';

const PlayerList = () => {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        api.get('players/')
            .then(res => setPlayers(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-2xl neon-text">JOUEURS.DB</h1>

            <div className="card-retro crt p-0 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5">
                            <th className="p-4 text-[0.6rem] text-[#ffff00] border-b-2 border-[#ff00ff]">NOM</th>
                            <th className="p-4 text-[0.6rem] text-[#ffff00] border-b-2 border-[#ff00ff]">PRÉNOM</th>
                            <th className="p-4 text-[0.6rem] text-[#ffff00] border-b-2 border-[#ff00ff]">EMAIL</th>
                            <th className="p-4 text-[0.6rem] text-[#ffff00] border-b-2 border-[#ff00ff]">EMPRUNTS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map(player => (
                            <motion.tr
                                key={player.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="border-b border-white/10 hover:bg-white/5 transition-colors"
                            >
                                <td className="p-4 text-[#ff00ff] font-bold">{player.last_name}</td>
                                <td className="p-4">{player.first_name}</td>
                                <td className="p-4 text-[#b4a5d8]">{player.email}</td>
                                <td className="p-4 text-[#00ffff] font-mono">{player.active_loans_count}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PlayerList;
