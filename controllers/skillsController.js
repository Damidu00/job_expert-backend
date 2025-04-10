import Skills from "../models/skillsModel.js";

/**
 * @desc Create Skills Entry
 * @route POST /api/skills/
 */
export async function createSkills(req, res) {
    try {


        const { userId, cvId, skills } = req.body;

        // ❌ Validate missing fields
        if (!userId || !cvId || !skills || !Array.isArray(skills)) {
            return res.status(400).json({ message: "Invalid input: userId, cvId, and skills array are required" });
        }

        // ❌ Ensure skills array contains valid objects
        for (const skill of skills) {
            if (!skill.category || !skill.items) {
                return res.status(400).json({ message: "Each skill must have a category and items" });
            }
        }

        // ✅ Save skills data
        const skillsEntry = new Skills({ userId, cvId, skills });
        await skillsEntry.save();

        return res.status(201).json({ message: "Skills uploaded successfully" });
    } catch (error) {
        console.error("Server Error:", error); // Log actual error
        return res.status(500).json({
            message: "Error creating skills",
            error: error.message
        });
    }
}

/**
 * @desc Get Skills by User ID
 * @route GET /api/skills/:userId
 */
export async function getSkills(req, res) {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const skills = await Skills.findOne({ userId });

        if (!skills) {
            return res.status(404).json({ message: "No skills found for this user" });
        }

        return res.status(200).json(skills);
    } catch (error) {
        console.error("Error fetching skills:", error);
        return res.status(500).json({
            message: "Error fetching skills",
            error: error.message
        });
    }
}
