import {createContext,useState,useEffect} from "react";
import Peer from "simple-peer"
import { io } from "socket.io-client";
import { nanoid } from "nanoid";
const socketContext =createContext(null)

const socket=io("ws://localhost:8000");

const Context=()=>{

    const [myId, setMyId] = useState<string>("");
    const [stream,setStream]=useState<MediaStream |undefined>(undefined)
    const [userName,setUserName]=useState<string>("")
    // const [join,setJoin]
    const [roomId,setRoomId]=useState<string>("");
    useEffect(() => {
        
        navigator.mediaDevices.getUserMedia({
            audio:true,
        
        }).then((stream)=>{
            setStream(stream)
            
        })
        socket.on("")
        
        

    }, [])

    const createRoom=()=>{
        const peerNew=new Peer({initiator:false,stream:stream});
        socket.emit("join-room",{userName,roomId:nanoid(),peerNew})
    }
    const joinRoom=()=>{
        const peerNew= new Peer({initiator:true,stream:stream})
        socket.emit("peer")
        socket.on("peer",(peer)=>{
            peerNew.on("signal",peer)
        })
    }
    
    socket.on("joinMessage",(data)=>{

    })


    return (
      {myId}
    )
}

export default {Context,socketContext}