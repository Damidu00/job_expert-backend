import jwt from "jsonwebtoken";
import { User } from "../models/UserModel.js";

// Verify JWT token
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({
                message: "Authentication required. Please login.",
                success: false
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({
                message: "Invalid token.",
                success: false
            });
        }

        // Find user
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Add user info to request
        req.id =decoded.userId;
        req.user = {
            id: user._id,
            email: user.email,
            role: user.role,
            fullname: user.fullname
        };
        
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({
            message: "Authentication failed.",
            success: false,
            error: error.message
        });
    }
};

// Check if user is admin
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            message: "Access denied. Admin privileges required.",
            success: false
        });
    }
}; 