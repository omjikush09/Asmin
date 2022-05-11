import {createContext,useState,useEffect, useRef} from "react";
import Peer from "simple-peer"
import { io } from "socket.io-client";


type users={userName:string,socketId:string,stream:MediaStream}[]

interface user{
    userName:string,
    roomId:string,
    socketId:string
}
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
        console.log("useEffecte")
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
            const peer = new Peer({initiator:false,trickle:false,stream})
            console.log("happy birthday")
            peer.on("signal",(data)=>{
                socket.emit("sendSignalToOriginal",{data,socketId,userName})
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

        socket.emit("getUserInRoom",roomId);
        socket.emit("addToRoom",{roomId,userName:"temp"})
        socket.on("userInRoom",(users)=>{
            console.log("userInRoom working",users)
            console.log("socket it while addtomRoom ", socket.id)
                users && users.forEach((user:user)=>{
                    if(user.socketId!==socket.id){
                       
                    
                    const peer=new Peer({initiator:true,trickle:false,stream:stream})
                    peer.on('signal',(data)=>{
                            socket.emit("sendSignal",{
                                roomId,
                                signalData:data,
                               userName:myName,
                               socketId:user.socketId
                            }) 
                        })
                        
                    socket.on("added",({data,socketId,userName})=>{
                        if(socketId===user.socketId){

                            peer.on("stream",(currentStream)=>{
                                console.log("end")
                                setUsers([...users,{userName,stream:currentStream,socketId}])
                            }) 
                            
                            peer.signal(data)
                            console.log("add data to signal")
                        }
                    })

                }
                })
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