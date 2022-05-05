import {createContext,useState,useEffect} from "react";
import Peer from "simple-peer"
import { io } from "socket.io-client";
import { nanoid } from "nanoid";

interface context{
    stream:MediaStream |undefined,
    myName:string,
    users:{userName:string,stream:MediaStream}[],
    myId:string,
    setMyId:React.Dispatch<React.SetStateAction<string>>,
    setMyName:React.Dispatch<React.SetStateAction<string>>,
    roomId:string,
    setRoomId:React.Dispatch<React.SetStateAction<string>>
}


const SocketContext =createContext<context |null>(null)

const socket=io("ws://localhost:8000");

const Context=({children}:{children:JSX.Element})=>{

    const [myId, setMyId] = useState<string>("");
    const [stream,setStream]=useState<MediaStream |undefined>(undefined)
    const [myName,setMyName]=useState<string>("")
    const [users,setUsers]=useState<{userName:string,stream:MediaStream}[]>([])
    // const [join,setJoin]
    const [roomId,setRoomId]=useState<string>("");




    useEffect(() => {
        
        navigator.mediaDevices.getUserMedia({
            audio:true,
        
        }).then((stream)=>{
            setStream(stream)
            setUsers([...users,{userName:myName,stream}])
        })
        socket.on("addUser",({socketId,signalData,userName}:{socketId:string,signalData:any,userName:string})=>{
            const peer = new Peer({initiator:false,stream})
            peer.on("signal",(data)=>{
                socket.emit("sendSignalToOriginal",{data,socketId})
            })
            peer.on("stream",(currentStream)=>{
                console.log("I have stream")
                setUsers([...users,{userName,stream:currentStream}])

            })
            peer.signal(signalData)
           
        })
        
        

    }, [])

    // const createRoom=()=>{
    //     const peerNew=new Peer({initiator:false,stream:stream});
    //     socket.emit("join-room",{userName,roomId:nanoid(),peerNew})
    // }
    // const joinRoom=()=>{
    //     const peerNew= new Peer({initiator:true,stream:stream})
    //     socket.emit("peer")
    //     socket.on("peer",(peer)=>{
    //         peerNew.on("signal",peer)
    //     })
    // }



    const addToRoom=(roomId:string)=>{
        const peer=new Peer({initiator:true,trickle:false,stream:stream})
        peer.on('signal',(data)=>{
                socket.emit("addToRoom",{
                    roomId,
                    signalData:data,
                   userName:myName
                })
            })

        peer.on("stream",(currentStream)=>{
            console.log("I have stream")
        }) 
        socket.on("added",(data)=>{
            peer.signal(data)
        })

        
        
    }
    // socket.on("peer",(data)=>{
    //     peer.on("signal",(data)=>{
            
    //     })
    // })


    return (
     <SocketContext.Provider value={{
        stream,
        myName,
        users,
        myId,
        setMyId,
        setMyName,
        roomId,
        setRoomId

     }}>

         {children}

     </SocketContext.Provider>
    )
}

export default {Context,SocketContext}