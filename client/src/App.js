import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './containers/HomePage/HomePage';
import Login from './containers/LoginPage/LoginPage';
import Register from './containers/RegisterPage/RegisterPage';
import Profile from './containers/ProfilePage/ProfilePage';
// import Game from './containers/';
import GameHistory from './containers/GameHistoryPage/GameHistoryPage';
import CreateRoom from './containers/CreateRoomPage/CreateRoomPage';
import JoinRoomInput from './containers/JoinRoomPage/JoinRoomInput';
import JoinRoom from './containers/JoinRoomPage/JoinRoom';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/games" element={<GameHistory />} />
        <Route path="/create-room/:roomId" element={<CreateRoom />} />
        <Route path="/join-room" element={<JoinRoomInput />} />
        <Route path="/join-room/:roomId" element={<JoinRoom />} />
      </Routes>
    </Router>
  );
};

export default App;
