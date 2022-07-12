import React, { useEffect, useRef, useState } from "react";
import{ io }from "socket.io-client";
import Peer from "simple-peer";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
`;

const Video = (props:any) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", (stream:any) => {
            if(ref.current){
               // @ts-ignore
                ref.current.srcObject = stream;
            }
        })
    }, []);

    return (
         //@ts-ignore
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}


const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

interface peer{
    peerID:string,
    peer:any
}

type peers=peer[]

const Room = (props:any) => {
    const param=useParams();
    const [peers, setPeers] = useState<any>([]);
    const socketRef = useRef<any>(null);
    const userVideo = useRef<HTMLVideoElement>(null);
    const peersRef = useRef([]);
    const roomID = param.roomId;

    useEffect(() => {
        console.log(param)
        console.log(socketRef)
        if(socketRef){
            //@ts-ignore
            socketRef.current = io.connect("ws://localhost:8000");
            console.log(socketRef.current)
            socketRef.current.emit("join room", roomID);
        }
        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
            if(userVideo.current){
                 //@ts-ignore
                 userVideo.current.srcObject = stream;
                }
                //@ts-ignore
                console.log(socketRef.current)
                socketRef.current.emit("join room", roomID);
                //@ts-ignore
            socketRef.current.on("all users", users => {
                //@ts-ignore
                const peers = [];
                console.log(users)
                users.forEach((userID:string) => {
                    //@ts-ignore
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        //@ts-ignore
                        peerID: userID,
                        //@ts-ignore
                        peer,
                    })
                    peers.push(peer);
                })
                //@ts-ignore
                setPeers(peers);
            })
             //@ts-ignore
            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                     //@ts-ignore
                    peerID: payload.callerID,
                     //@ts-ignore
                    peer,
                })
                 //@ts-ignore
                setPeers(users => [...users, peer]);
            });
 
            socketRef.current.on("receiving returned signal",( payload:any) => {
                 
                 const item = peersRef.current.find((p:peer) => p.peerID === payload.id);
                 if(item){
                     //@ts-ignore
                     item.peer.signal(payload.signal);
                 }
                });
            })
        }, []);
        
        
        function createPeer(userToSignal:any, callerID:string, stream:MediaStream) {
            const peer = new Peer({
                initiator: true,
                trickle: false,
                stream,
            });
            
        
            peer.on("signal", signal => {
            
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })
        
        return peer;
    }
    
    function addPeer(incomingSignal:Peer.SignalData |string, callerID:string, stream:MediaStream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })
        
        peer.on("signal", signal => {
            if(socketRef.current){
                //@ts-ignore
                socketRef.current.emit("returning signal", { signal, callerID })
                
            }
        })

        peer.signal(incomingSignal);
        
        return peer;
    }

    return (
        <Container>
             
            <StyledVideo muted ref={userVideo} autoPlay playsInline />
            
            {peers.map((peer:any, index:number) => {
                return (
                    <Video key={index} peer={peer} />
                );
            })}
        </Container>
    );
};

export default Room;
