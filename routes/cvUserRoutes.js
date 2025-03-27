import express from "express";
import { createCvUserDetails, deletecvuser, getcvUsers } from "../controllers/cvUserControllers.js";

const cvUserRoutes = express.Router()

cvUserRoutes.post("/",createCvUserDetails);
cvUserRoutes.get("/:userId",getcvUsers)
cvUserRoutes.delete("/:userId",deletecvuser)


export default cvUserRoutes