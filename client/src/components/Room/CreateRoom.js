import React, { useEffect } from 'react';

const ROOM = '/room';

function CreateRoom() {
  // Please enter the code as {xyz...} to enter my room. Lets DrawIt together!!
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SOCKET_URL + ROOM);
    setSocket(newSocket);

    // Cleanup function to disconnect socket on unmount
    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    socket.on('connection', () => {
      // get room id
    })
  }, [socket])

  const addIntoRoom = () => {
    socket.on()
  }

  const denyIntoRoom = () => {

  }

  return (
    <div>

    </div>
  )
}

export default CreateRoom