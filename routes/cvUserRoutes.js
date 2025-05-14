import express from "express";
import {
  createCvUserDetails,
  deletecvuser,
  getAllDetails,
  getcvUserById,
  getcvUsers,
  updateCertificate,
  updateCvUserDetails,
  updateEducation,
  updateExperience,
  updateProjects,
  updateReferees,
  updateUserSkills,
  updatUserCvID,
  upload,
} from "../controllers/cvUserControllers.js";

const cvUserRoutes = express.Router();

cvUserRoutes.post("/", createCvUserDetails);
cvUserRoutes.get("/:userId", getcvUsers);
cvUserRoutes.delete("/:userId", deletecvuser);
cvUserRoutes.get("/UserAllCv/:userId", getAllDetails);
cvUserRoutes.put("/updateCvID/:userId/:cvId", updatUserCvID);
cvUserRoutes.put("/createDetails/:cvUserId", updateUserSkills);
cvUserRoutes.put("/updateCertification/:cvUserId", updateCertificate);
cvUserRoutes.put("/updateProjects/:cvUserId", updateProjects);
cvUserRoutes.put("/updateExperience/:cvUserId", updateExperience);
cvUserRoutes.put("/updateEducation/:cvUserId", updateEducation);
cvUserRoutes.put("/updateReference/:cvUserId", updateReferees);
cvUserRoutes.get("/getUsers/:cvUserId", getcvUserById);
cvUserRoutes.put("/updateUser/:cvUserId", upload, updateCvUserDetails);

export default cvUserRoutes;
