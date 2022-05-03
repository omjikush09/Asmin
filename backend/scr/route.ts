import { Router } from "express";
import { main } from "./controllers/main";

const route=Router();


route.get("/createRoom",main)


export default route;