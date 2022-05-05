import { io } from "."


io.on("connection",(socket)=>{
    
    socket.emit("myid",socket.id);
    socket.on("join-room",({...data})=>{
        socket.join(data.roomId)
    })
})


























