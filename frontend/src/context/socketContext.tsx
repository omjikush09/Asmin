import {createContext,useState,useEffect, useRef} from "react";
import Peer from "simple-peer"
import { io } from "socket.io-client";



type users={userName:string,socketId:string,stream:MediaStream}[]

interface context{
    stream:MediaStream |undefined,
    myName:string,
    users:{userName:string,socketId:string,stream:MediaStream}[],
    myId:string,
    setMyId:React.Dispatch<React.SetStateAction<string>>,
    setMyName:React.Dispatch<React.SetStateAction<string>>,
    roomId:string |undefined,
    setRoomId:React.Dispatch<React.SetStateAction<string>>,
    addToRoom:(id:string)=>void,
    mainDiv:React.RefObject<HTMLDivElement>
}


const SocketContext =createContext<context |null>(null)

const socket=io("ws://localhost:8000");

const Context=({children}:{children:JSX.Element})=>{

    const [myId, setMyId] = useState<string>("");
    const [stream,setStream]=useState<MediaStream |undefined>(undefined)
    const [myName,setMyName]=useState<string>("")
    const [users,setUsers]=useState<users>([])
    // const [join,setJoin]
    const [roomId,setRoomId]=useState<string>("");

    const mainDiv=useRef<HTMLDivElement>(null)


    useEffect(() => {
        
        navigator.mediaDevices.getUserMedia({
            audio:true,
        
        }).then((currentstream)=>{
            setStream(currentstream)
            console.log("stream in coming")
            socket.emit("sendId","id")
            socket.on("me",data=>{
                console.log("me")
                setUsers([...users,{userName:myName,stream:currentstream,socketId:data}])
            })
        })
        socket.on("addUser",({socketId,signalData,userName}:{socketId:string,signalData:any,userName:string})=>{
            const peer = new Peer({initiator:false,stream})
            console.log("happy birthday")
            peer.on("signal",(data)=>{
                socket.emit("sendSignalToOriginal",{data,socketId})
            })
            peer.on("stream",(currentStream)=>{
                console.log("I have stream")
                setUsers([...users,{userName,stream:currentStream,socketId}])
                    
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
        setRoomId,
        addToRoom,
        mainDiv

     }}>

         {children}

     </SocketContext.Provider>
    )
}

export  {Context,SocketContext}