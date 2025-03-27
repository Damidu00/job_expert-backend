import express from 'express';
import { createReferee, getAllReferess } from '../controllers/refereesController.js';

const refereeRoutes = express.Router()

refereeRoutes.post("/",createReferee)
refereeRoutes.get("/:userId",getAllReferess)


export default refereeRoutes