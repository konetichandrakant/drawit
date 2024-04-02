import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/others/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/others/Profile';
import Game from './components/game/Game';
import GameHistory from './components/others/Games';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path='/game' element={<Game />} />
        <Route path='/games' element={<GameHistory />} />
      </Routes>
    </Router>
  );
};

export default App;
