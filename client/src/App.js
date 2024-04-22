import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/others/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/others/Profile';
import Game from './components/game/Game';
import GameHistory from './components/others/Games';
import CreateRoom from './components/room/CreateRoom';
import JoinRoomInput from './components/room/JoinRoomInput';
import JoinRoom from './components/room/JoinRoom';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path='/game' element={<Game />} />
        <Route path='/games' element={<GameHistory />} />
        <Route path="/create-room/:roomId" element={<CreateRoom />} />
        <Route path="/join-room" element={<JoinRoomInput />} />
        <Route path="/join-room/:roomId" element={<JoinRoom />} />
      </Routes>
    </Router>
  );
};

export default App;
