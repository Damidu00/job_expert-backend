  
// import { User } from "../models/UserModel.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import getDataUri from "../utils/datauri.js";
// import cloudinary from '../utils/cloudinary.js';
// import { createResponse } from "../utils/responseUtils.js";
// import dotenv from 'dotenv';
// import multer from "multer"; // For handling file uploads

// dotenv.config();

// export const register = async (req, res) => {
//     try {
//         const { fullname, email, phoneNumber, password, role } = req.body;
//         console.log(fullname, email, phoneNumber, password, role);

//         if (!fullname || !email || !phoneNumber || !password || !role) {
//             return res.status(400).json({
//                 message: "Something is missing",
//                 success: false
//             });
//         }

//         const file = req.file;
//         let profilePhoto = "";
//         if (file) {
//             const fileUri = getDataUri(file);
//             const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
//             profilePhoto = cloudResponse.secure_url;
//         }

//         const userExists = await User.findOne({ email });
//         if (userExists) {
//             return res.status(400).json({
//                 message: 'User already exists with this email.',
//                 success: false,
//             });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         await User.create({
//             fullname,
//             email,
//             phoneNumber,
//             password: hashedPassword,
//             role,
//             profile: {
//                 profilePhoto
//             }
//         });

//         return res.status(201).json({
//             message: "Account created successfully.",
//             success: true
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error", success: false });
//     }
// };

// export const login = async (req, res) => {
//     try {
//         const { email, password, role } = req.body;
//         console.log({ email, password, role });

//         if (!email || !password || !role) {
//             return res.status(400).json({
//                 message: "Something is missing",
//                 success: false
//             });
//         }

//         let user = await User.findOne({ email });
//         if (!user || !(await bcrypt.compare(password, user.password)) || role !== user.role) {
//             return res.status(400).json({
//                 message: "Incorrect email, password, or role.",
//                 success: false
//             });
//         }

//         const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

//         res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 24 });

//         return res.json(createResponse({
//             access_token: token,
//             user: {
//                 _id: user._id,
//                 fullname: user.fullname,
//                 email: user.email,
//                 phoneNumber: user.phoneNumber,
//                 role: user.role,
//                 profile: user.profile
//             }
//         }));
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error", success: false });
//     }
// };

// export const logout = async (req, res) => {
//     try {
//         return res.status(200).cookie("token", "", { maxAge: 0 }).json({
//             message: "Logged out successfully.",
//             success: true
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error", success: false });
//     }
// };

// export const updateProfile = async (req, res) => {
//     try {
//         const { fullname, email, phoneNumber, bio, skills } = req.body;
//         const userId = req.id; // Middleware authentication

//         let user = await User.findById(userId);
//         if (!user) {
//             return res.status(400).json({
//                 message: "User not found.",
//                 success: false
//             });
//         }

//         let skillsArray = skills ? skills.split(",") : user.profile.skills;

//         if (fullname) user.fullname = fullname;
//         if (email) user.email = email;
//         if (phoneNumber) user.phoneNumber = phoneNumber;
//         if (bio) user.profile.bio = bio;
//         user.profile.skills = skillsArray;

//         const file = req.file;
//         if (file) {
//             const fileUri = getDataUri(file);
//             const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
//             user.profile.resume = cloudResponse.secure_url;
//             user.profile.resumeOriginalName = file.originalname;
//         }

//         await user.save();

//         return res.status(200).json({
//             message: "Profile updated successfully.",
//             user,
//             success: true
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error", success: false });
//     }
// };

 


// export const getUser = async (req, res) => {
//     try {
//         const userId = req.id; // Middleware authentication

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: "User not found", success: false });
//         }

//         res.json({
//             _id: user._id,
//             fullname: user.fullname,
//             email: user.email,
//             phoneNumber: user.phoneNumber,
//             role: user.role,
//             profile: user.profile
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error", success: false });
//     }
// };

import { User } from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { createResponse } from "../utils/responseUtils.js";
import dotenv from "dotenv";
import multer from "multer"; // For handling file uploads

dotenv.config();

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email", success: false });
        }

        let profilePhoto = "";
        if (req.file) {
            try {
                const fileUri = getDataUri(req.file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                profilePhoto = cloudResponse.secure_url;
            } catch (uploadError) {
                return res.status(500).json({ message: "Error uploading profile photo", success: false });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ fullname, email, phoneNumber, password: hashedPassword, role, profile: { profilePhoto } });
        return res.status(201).json({ message: "Account created successfully", success: true });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const login = async (req,res)=>{
    try {
        const {email, password, role}=req.body;

        if(!email ||!password || !role){
            return res.status(400).json({
                message:"Something is missing",
                success: false
            });
        };
        
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "Incorrect email or password.",
                success:false,
            })
        };

        const isPasswordMath = await bcrypt.compare(password,user.password);
        if(!isPasswordMath){
            return res.status(400).json({
                message:"Incorrect email or password.",
                success: false,
            })
        };
        if (role !== user.role){
            return res.status(400).json({
                message:"Account doesn't exist with current role.",
                success:false,
            })
        };

        if (!process.env.SECRET_KEY) {
            console.error("SECRET_KEY is not defined in environment variables");
            return res.status(500).json({
                message: "Server configuration error. Please contact support.",
                success: false
            });
        }

        const tokenData = {
            userId:user._id
        }
        const token= await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'});

        user ={
            _id:user._id,
            fullname:user.fullname,
            email: user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
        }
        return res.status(200).cookie("token", token, { 
            maxAge: 1 * 24 * 60 * 60 * 1000, 
            httpOnly: true, 
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        }).json({
            message: `Welcome back ${user.fullname}`,
            access_token: token,
            user,
            success: true
        })

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: error.message || "An error occurred during login. Please try again.",
            success: false,
            error: error.message
        });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out successfully", success: true });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const userId = req.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.profile.bio = bio || user.profile.bio;
        user.profile.skills = skills ? skills.split(",") : user.profile.skills;

        if (req.file) {
            try {
                const fileUri = getDataUri(req.file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content, { resource_type: "raw" });
                user.profile.resume = cloudResponse.secure_url;
                user.profile.resumeOriginalName = req.file.originalname;
            } catch (uploadError) {
                return res.status(500).json({ message: "Error uploading resume", success: false });
            }
        }

        await user.save();
        return res.status(200).json({ message: "Profile updated successfully", user, success: true });
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const getUser = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        return res.json({ _id: user._id, fullname: user.fullname, email: user.email, phoneNumber: user.phoneNumber, role: user.role, profile: user.profile });
    } catch (error) {
        console.error("Get User Error:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};


// export async function getUser(req, res) {
//     const authHeader = req.headers.authorization;
  
//     // Check if Authorization header is present
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Authorization header missing or invalid' });
//     }
  
//     // Extract the token
//     const token = authHeader.split(' ')[1];
  
//     try {
//       // Verify the token using the JWT_SECRET_KEY from .env
//       const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
//       // Extract user ID from the token
//       const userId = decoded.userId;
  
//       // Query the database to find the user by ID
//       const user = await User.findById(userId); // Replace with your database query
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       // Return the user details
//       res.json({
//         userId: user._id,
//         username: user.fullname,
//         email: user.email,
//       });
//     } catch (error) {
//       // Handle token verification errors (e.g., expired or invalid token)
//       return res.status(403).json({ message: 'Invalid or expired token' });
//     }
//   }