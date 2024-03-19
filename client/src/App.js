import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/others/Home';
import Login from './components/others/Login';
import Register from './components/others/Register';
import Profile from './components/others/Profile';
import Game from './components/game/Game';
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
        {/* <Route path='/game/:id' element={<GameController />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
