import express from "express"
const app= express();
import http from "http"
import {Server} from "socket.io"
import { addToRoom } from "./controllers/main";


//routes
import room from "./route"


const server=http.createServer(app);

interface room{
    userName:string,
    roomId:string,
    socketId:string,
    peer:any
}


export const io=new Server(server,{
    cors:{
        origin:"*"
    }
})


 
io.on("connection",socket=>{

    socket.on("join-room",({userName,roomId,socketId=socket.id,peer}:room)=>{
        addToRoom({userName,roomId,socketId})
        socket.join(roomId)
        socket.to(roomId).emit("joinMessage",`${userName} join the room`);
        socket.to(roomId).emit("peer",peer)
        
        
        
        
    })
    // socket.on("peer",({roomId,peer})=>{

        
    // })
    




})


app.use(room)









const port =process.env.PORT || 8000
server.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);
})






