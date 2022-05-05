import { Button } from '@material-ui/core';
import React from 'react'
import { useState } from 'react';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const navigate=useNavigate()

  // const [roomId,setRoomId]=useState<string>("");


  const navigatetoRoom=()=>{
    const Id=nanoid();
    // setRoomId(Id)
    navigate(`room/${Id}`)
  }

  return (
    

    <Button onClick={navigatetoRoom} >create Room</Button>



  )
}

export default Home