import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import { useEffect } from 'react';
import User from '../components/User';
const Main = () => {

    const context=useContext(SocketContext)
    const {setRoomId,users,addToRoom}=context!

    const param=useParams();
   
    useEffect(()=>{
        if(typeof param.roomId ==="string"){
          console.log(param.roomId)
            setRoomId(param.roomId)
          addToRoom(param.roomId)
        }

    },[param,setRoomId])

  return (

    <User users={users} />
    // <h1>dd</h1>


    
  )
}

export default Main