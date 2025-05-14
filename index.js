import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
import cvUserRoutes from "./routes/cvUserRoutes.js";
import skillsRoutes from "./routes/skillsroutes.js";
import certificates from "./routes/certificatesRoutes.js";
import refereeRoutes from "./routes/refereesRoutes.js";
import educationRoutes from "./routes/educationRoutes.js";
import ExperienceRoutes from "./routes/experienceRoutes.js";
import ProjectRouter from "./routes/projectsRouter.js";
import userRouter from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

//user
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const mongodbURL = process.env.MONGODB_URI;

mongoose.connect(mongodbURL, {});
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Database Connected!!");
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/cvuser", cvUserRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/certificates", certificates);
app.use("/api/referees", refereeRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/experience", ExperienceRoutes);
app.use("/api/projects", ProjectRouter);
app.use("/api/users", userRouter);

// New routes
app.use("/api/jobs", jobRoutes);
app.use("/api/companies", companyRoutes);

//company routes

//job-listing  route

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
