import React from 'react'
import {Avatar} from "@material-ui/core"
import randomColor from "randomcolor"


const user = ({users}:{users:{userName:string,socketId:string}[]}) => {
  return (
    <div>
        {users && users.map((user,index)=>{
            return (
              <div>{user.userName}</div>
              
               
            )
        })}
    </div>
  )
}

export default user