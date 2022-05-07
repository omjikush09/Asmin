import React,{useContext,useEffect} from 'react'
import {Avatar} from "@material-ui/core"
import randomColor from "randomcolor"
import { SocketContext } from '../context/SocketContext'
import { useRef } from 'react';


const User = () => {

  const context=useContext(SocketContext)
  const {mainDiv,users}=context!
  console.log(users)

  const divref=useRef(null);

  // const str=new MediaStream
  useEffect(()=>{
    users && users.map((user,index)=>{
      if(divref.current){
      
        if(divref.current["children"][0]){
          console.log(divref.current["children"][index]["children"][0])
          // @ts-ignore: 
          let refsrc=divref.current["children"][index]["children"][0]["srcObject"]=user.stream
          console.log("hello stream is working")
          // refsrc
          console.log(refsrc)
        }
      }
    })
   
    // users.forEach((user)=>{
    //    <audio ref={} src={window.URL.createObjectURL(str)}></audio>
    //     const ref[user.socketId]=useRef(null)

    // })
    

  },[users])


  return (
    <div ref={mainDiv}>
      <h1>hdfd</h1>
      <div ref={divref} >

        {users && users.map((user,index)=>{
          return (
              <>
              <div key={user.socketId}>
                <audio  autoPlay controls></audio>
              <div >{user.userName}</div>
              <h2 >df</h2>
              </div>
                
              </>
               
               )
              })}
              </div>
    </div>
  )
}

export default User