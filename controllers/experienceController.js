import Experience from "../models/experienceModel.js";

export async function createExperiences(req, res) {
  try {
    const details = req.body;
    const experiences = new Experience(details);
    await experiences.save();
    res.status(200).json({
      message: "experiences created",
    });
  } catch (error) {
    res.status(500).json({
      message: "error to create experiences",
      error: error.message,
    });
  }
}

export async function getAllExperiences(req, res) {
  try {
    const userId = req.params.userId;
    const details = await Experience.findOne({ userId: userId }).sort({
      _id: -1,
    });
    res.json(details);
  } catch (error) {
    res.json({
      message: "cannot fetch experiences",
      error: error.message,
    });
  }
}
