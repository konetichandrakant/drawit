import React, { useEffect, useState } from 'react'
import io from 'socket.io-client';

function GameController() {
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState('default');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = document.cookie.split('=')[1];
    const newSocket = io({ auth: { token } });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [username, room]);

  useEffect(() => {
    if (!socket) return;
  }, [socket])

  return (
    <>
    </>
  )
}

export default GameController