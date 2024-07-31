import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

// Express App Setup
const app = express();
app.use(cors()); // CORS Setup

// Create HTTP Server
const server = http.createServer(app);

// Socket.io Server Setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Frontend URL
        methods: ['GET', 'POST'], // Use 'GET' and 'POST'
    }
});

// Handle Socket Connections
io.on("connection", (socket) => {
    console.log('Client connected', socket.id);

    // Join Room Event
    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`Client ID = ${socket.id} joined room = ${room}`);
    });

    // Send Message Event
    socket.on("send_message", (data) => {
        console.log("Send message data", data);
        
        // Broadcast to all clients in the room, including sender
        io.emit('receive_message', data);
        // .in(data.room) not important
    });

    // Handle Disconnect
    socket.on("disconnect", () => {
        console.log('Client disconnected', socket.id);
    });
});

// Server Listening
let port = 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
