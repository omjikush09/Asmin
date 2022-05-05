import express from "express"
const app= express();
import http from "http"
import {Server} from "socket.io"



//routes
// import room from "./route"


const server=http.createServer(app);

interface room{
    userName:string,
    roomId:string,
    socketId:string,
   signalData:any
}


export const io=new Server(server,{
    cors:{
        origin:"*"
    }
})


interface user{
    userName:string,
    roomId:string,
    socketId:string
}

var users:user[]=[];

 const addToRoom=({userName,roomId,socketId}:user):user[]=>{
        const user={userName,roomId,socketId}
        console.log(users)
        users.push(user);
        return users
}
 
io.on("connection",socket=>{

    socket.emit("me",socket.id
    )

    socket.on("addToRoom",({userName,roomId,socketId=socket.id,signalData}:room)=>{
        console.log(userName,roomId,socketId)
        addToRoom({userName,roomId,socketId})
        socket.join(roomId)
        io.to(roomId).emit("addUser",{socketId,signalData,userName})
        // socket.on("answerCall",(data)=>{
        //     socket.emit("callAccepted",(data))
        // })
        io.to(roomId).emit("joinMessage",`${userName} join the room`);
        
        
    })

    socket.on("sendSignalToOriginal",({data,socketId})=>{
            io.to(socketId).emit("added",data)
    })
    
    // socket.on("peer",({roomId,peer})=>{

        
    // })
    




})


// app.use(room)









const port =process.env.PORT || 8000
server.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);
})






