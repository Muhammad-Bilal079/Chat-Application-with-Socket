import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import http from 'http'

const app = express()
const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:['GET','PUT']
    }
})

io.on("connection", (socket) => {
    console.log('client conencted',socket.id);

    socket.on("join_room",(data)=>{
        socket.join(data)
        console.log(`client ID = ${socket.id} and join room is ${data}`);
    })

socket.on("send_message",(data)=>{
    console.log("send message data",data);
})


    socket.on("disconnect",()=>{
        console.log('client disconnected',socket.id);
    })
    
  });

app.use(cors())


let port = 3000
server.listen(port,()=>{
    console.log('server is running');
})