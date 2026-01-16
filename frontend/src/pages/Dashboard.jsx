import React, { useState, useEffect } from 'react';
import api from '../api';
import { Gamepad2, Users, ReceiptText, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#ff00ff', '#00ffff', '#ffff00', '#4f46e5', '#10b981'];

const StatCard = ({ title, value, icon: Icon, color }) => (
    <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="card-retro crt group cursor-default"
    >
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs text-[#b4a5d8]">{title}</h3>
            <Icon className={`w-6 h-6`} style={{ color }} />
        </div>
        <p className="text-4xl font-bold neon-text">{value}</p>
    </motion.div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        games: 0,
        players: 0,
        loans: 0,
        topGames: [],
        genreData: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const gamesRes = await api.get('games/');
                const playersRes = await api.get('players/');
                const loansRes = await api.get('loans/');

                const genres = {};
                gamesRes.data.forEach(game => {
                    genres[game.genre] = (genres[game.genre] || 0) + 1;
                });
                const genreData = Object.keys(genres).map(name => ({
                    name,
                    value: genres[name]
                }));

                setStats({
                    games: gamesRes.data.length,
                    players: playersRes.data.length,
                    loans: loansRes.data.filter(l => !l.is_returned).length,
                    topGames: gamesRes.data.slice(0, 5),
                    genreData: genreData
                });
            } catch (error) {
                console.error("Erreur lors de la récupération des stats", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-center text-3xl mb-12 neon-text">ÉTAT DU SYSTÈME</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard title="TOTAL JEUX" value={stats.games} icon={Gamepad2} color="#00ffff" />
                <StatCard title="JOUEURS INSCRITS" value={stats.players} icon={Users} color="#ff00ff" />
                <StatCard title="EMPRUNTS ACTIFS" value={stats.loans} icon={ReceiptText} color="#ffff00" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card-retro crt p-6">
                    <h2 className="text-xl mb-6 text-[#00ffff]">RÉPARTITION PAR GENRE</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={stats.genreData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.genreData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a0b3b', border: '1px solid #4f46e5', color: '#fff' }}
                                    itemStyle={{ color: '#00ffff' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card-retro crt">
                    <h2 className="text-xl mb-6 text-[#ff00ff]">MEILLEURS_SCORES.EXE</h2>
                    <div className="space-y-4">
                        {stats.topGames.map((game) => (
                            <div key={game.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
                                <span className="flex items-center gap-3">
                                    <Trophy className="w-4 h-4 text-[#ffff00]" />
                                    {game.title}
                                </span>
                                <span className="text-[#ff00ff]">{game.studio}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="card-retro crt flex flex-col items-center justify-center text-center p-12">
                <Gamepad2 className="w-24 h-24 mb-6 text-[#ff00ff] animate-pulse" />
                <h2 className="text-lg mb-4">PRÊT À JOUER ?</h2>
                <p className="text-[#b4a5d8] text-sm mb-6">Gérez votre collection avec un style retro ultime.</p>
                <div className="flex gap-4">
                    <button className="btn-retro">NOUVELLE_ENTRÉE</button>
                    <button className="btn-retro" style={{ background: '#00ffff', color: '#0d0221', boxShadow: '4px 4px 0 #00a8a8' }}>SAUVEGARDE</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
