import React from 'react'
import {Avatar} from "@material-ui/core"
import randomColor from "randomcolor"


const User = ({users}:{users:{userName:string,socketId:string}[]}) => {
  return (
    <div>
        {users && users.map((user,index)=>{
            return (
              <div key={user.socketId}>{user.userName}</div>
              
               
            )
        })}
    </div>
  )
}

export default User