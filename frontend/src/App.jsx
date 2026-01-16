import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import GameList from './pages/GameList';
import PlayerList from './pages/PlayerList';
import LoanList from './pages/LoanList';
import Login from './pages/Login';
import Register from './pages/Register';
import { AnimatePresence } from 'framer-motion';
import './index.css';

function App() {
  const [isAuth, setIsAuth] = useState(() => localStorage.getItem('access') !== null);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuth(false);
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col relative">
        <div className="synth-grid"></div>
        <nav className="bg-[#0d0221]/90 backdrop-blur-md border-b-4 border-[#ff00ff] shadow-[0_5px_15px_rgba(255,0,255,0.3)] sticky top-0 z-50 p-6 flex justify-between items-center mb-0">
          <Link to="/" className="text-[#00ffff] pixel-font text-xl uppercase no-underline drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">
            RETRO GAMES
          </Link>

          <div className="flex gap-8">
            {isAuth && (
              <>
                <Link to="/" className="text-white no-underline font-semibold uppercase text-sm tracking-widest hover:text-[#00ffff] hover:scale-105 transition-all">Accueil</Link>
                <Link to="/games" className="text-white no-underline font-semibold uppercase text-sm tracking-widest hover:text-[#00ffff] hover:scale-105 transition-all">Jeux</Link>
                <Link to="/players" className="text-white no-underline font-semibold uppercase text-sm tracking-widest hover:text-[#00ffff] hover:scale-105 transition-all">Joueurs</Link>
                <Link to="/loans" className="text-white no-underline font-semibold uppercase text-sm tracking-widest hover:text-[#00ffff] hover:scale-105 transition-all">Emprunts</Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-6">
            {isAuth ? (
              <button onClick={handleLogout} className="btn-retro" style={{ background: '#ef4444', boxShadow: '4px 4px 0 #991b1b' }}>DECONNEXION</button>
            ) : (
              <Link to="/login" className="btn-retro">CONNEXION</Link>
            )}
            <a href="http://localhost:8000/admin/" className="btn-retro" style={{ padding: '0.5rem 1rem' }}>Admin</a>
          </div>
        </nav>

        <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-12 relative z-10">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={isAuth ? <Dashboard /> : <Login />} />
              <Route path="/games" element={isAuth ? <GameList /> : <Login />} />
              <Route path="/players" element={isAuth ? <PlayerList /> : <Login />} />
              <Route path="/loans" element={isAuth ? <LoanList /> : <Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </AnimatePresence>
        </main>

        {isAuth && (
          <footer className="p-8 mt-auto text-center text-[#b4a5d8] border-t-4 border-[#00ffff] bg-[#0d0221]/90 pixel-font text-[0.6rem] tracking-[2px] z-10">
            RESTEZ COOL ● INSÉREZ UNE PIÈCE ● 2026
          </footer>
        )}
      </div>
    </Router>
  );
}

export default App;
