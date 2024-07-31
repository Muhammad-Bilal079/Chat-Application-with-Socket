import React, { useState } from 'react'
import io, { Socket } from 'socket.io-client'
import Chat from './Chat'

const socket = io.connect("http://localhost:3000")

function App() {
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('')
  const [showChat, setShowChat] = useState(false);

  const joinchat = () => {
    if (username !== '' && room !== '') {
      socket.emit("join_room", room)
      setShowChat(true)
    }
  }
  return (
    <>
      {!showChat &&
        (
          <div className="join_room">

            <h1>CHAT APPLICATION</h1>

            <h1>JOIN CHAT</h1>

            <input
              type="text"
              placeholder='Enter your name'
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="text"
              placeholder='Enter your room (e.g:1,2,3)'
              onChange={(e) => setRoom(e.target.value)}
            />

            <button onClick={joinchat}>join</button>
          </div>
        )}

      {showChat && (
        <Chat socket={socket} username={username} room={room} />
      )}

    </>
  )
}

export default App