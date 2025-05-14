import cvUsers from "../models/cvUserModel.js";
import path from "path";
import fs from "fs";

import multer from "multer";

const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const isValid =
      allowedTypes.test(file.mimetype) &&
      allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (isValid) cb(null, true);
    else cb("Invalid file type. Only jpg, jpeg, and png allowed.");
  },
}).single("profilePhoto");

export async function createCvUserDetails(req, res) {
  try {
    const {
      userId,
      cvId,
      firstName,
      lastName,
      email,
      phone,
      linkedinURL,
      githubURL,
      Address,
      shortBio,
    } = req.body;

    // req.file is available because of multer
    let profilePhoto = "";
    if (req.file) {
      profilePhoto = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    const user = new cvUsers({
      userId,
      cvId,
      firstName,
      lastName,
      email,
      phone,
      profilePhoto,
      linkedinURL,
      githubURL,
      Address,
      shortBio,
    });

    await user.save();

    res.status(201).json({ message: "User details saved successfully", user });
  } catch (error) {
    res.status(500).json({
      message: "Error saving user details",
      error: error.message,
    });
  }
}
export async function updateCvUserDetails(req, res) {
  try {
    const { cvUserId } = req.params;

    // Create update object from req.body
    const updateData = { ...req.body };

    // Handle profile photo if uploaded
    if (req.file) {
      updateData.profilePhoto = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    const updatedUser = await cvUsers.findByIdAndUpdate(
      cvUserId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "CV user not found" });
    }

    res.status(200).json({
      message: "User details updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user details",
      error: error.message,
    });
  }
}

export async function updateUserSkills(req, res) {
  const { cvUserId } = req.params; // Get cvUserId (MongoDB _id) from the URL params
  const { skills } = req.body; // Get skills from the request body

  try {
    // Find user by MongoDB _id and update their skills
    const updatedUser = await cvUsers.findByIdAndUpdate(
      cvUserId, // Find the user based on MongoDB _id (cvUserId)
      { $set: { skills } }, // Update only the skills field
      { new: true } // Return the updated user document
    );

    // If no user is found, return 404 error
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Successfully updated, send response with updated user data
    res
      .status(200)
      .json({ message: "Skills updated successfully", user: updatedUser });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({
      message: "Error updating skills",
      error: error.message,
    });
  }
}

export async function updateCertificate(req, res) {
  const { cvUserId } = req.params;
  const { certificates } = req.body;
  try {
    const updatedUser = await cvUsers.findByIdAndUpdate(
      cvUserId,
      { $set: { certificates } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Certificates updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating certificates",
      error: error.message,
    });
  }
}

export async function updateReferees(req, res) {
  const { cvUserId } = req.params;
  const { referees } = req.body;

  try {
    const updated = await cvUsers.findByIdAndUpdate(
      cvUserId,
      { referees },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Referees updated", user: updated });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update referees", error: error.message });
  }
}
export async function updateEducation(req, res) {
  const { cvUserId } = req.params;
  const { details } = req.body;

  try {
    const updated = await cvUsers.findByIdAndUpdate(
      cvUserId,
      { details },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Education updated", user: updated });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update education", error: error.message });
  }
}

export async function updateExperience(req, res) {
  const { cvUserId } = req.params;
  const { experiences } = req.body;

  try {
    const updated = await cvUsers.findByIdAndUpdate(
      cvUserId,
      { experiences },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Experience updated", user: updated });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update experience", error: error.message });
  }
}

export async function getcvUsers(req, res) {
  const userId = req.params.userId;

  try {
    const cvUser = await cvUsers.findOne({ userId: userId }).sort({ _id: -1 }); // Sort by most recent

    if (!cvUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(cvUser);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching the user",
      error: error.message,
    });
  }
}

export async function getcvUserById(req, res) {
  const cvUserId = req.params.cvUserId;
  try {
    const cvUser = await cvUsers.findById(cvUserId);
    if (!cvUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(cvUser);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching the user",
      error: error.message,
    });
  }
}
export async function updateProjects(req, res) {
  const { cvUserId } = req.params;
  const { projects } = req.body;

  try {
    const updated = await cvUsers.findByIdAndUpdate(
      cvUserId,
      { projects },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Projects updated", user: updated });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update projects", error: error.message });
  }
}

export async function updatUserCvID(req, res) {
  const { userId, cvId } = req.params;

  try {
    const updatedUserCvId = await cvUsers.findOneAndUpdate(
      { userId }, // Filter by userId
      { cvId }, // Update cvId
      { new: true, sort: { _id: -1 } } // Sort by latest and return updated doc
    );

    if (!updatedUserCvId) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUserCvId); // <-- FIXED variable name
  } catch (error) {
    res.status(500).json({
      message: "Error updating the user",
      error: error.message,
    });
  }
}

export async function getAllDetails(req, res) {
  const userId = req.params.userId;
  try {
    const cvUser = await cvUsers.find({ userId }).sort({ _id: -1 }); // Sort by most recent

    if (!cvUser || cvUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(cvUser);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching the user",
      error: error.message,
    });
  }
}

export async function deletecvuser(req, res) {
  const userId = req.params.userId;
  try {
    await cvUsers.deleteOne({ userId: userId });
    res.json({
      message: "cvuser details deleted",
    });
  } catch (error) {
    res.json({
      message: "error to delete",
      error: error.message,
    });
  }
}
