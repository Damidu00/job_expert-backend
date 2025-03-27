import express from "express";
import { createCertificates, getAllCertificates } from "../controllers/certificationsController.js";

const certificates = express.Router()

certificates.post("/",createCertificates)
certificates.get("/:userId",getAllCertificates)

export default certificates