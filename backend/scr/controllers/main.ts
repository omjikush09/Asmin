
interface user{
    userName:string,
    roomId:string,
    socketId:string
}

let users:user[];

export const addToRoom=({userName,roomId,socketId}:user):user[]=>{
        const user={userName,roomId,socketId}
        users.push(user);
        return users
}