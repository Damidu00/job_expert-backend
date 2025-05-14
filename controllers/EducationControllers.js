import Education from "../models/educationModel.js";

export async function createEducation(req, res) {
  try {
    const details = req.body;
    const education = new Education(details);
    await education.save();

    res.status(200).json({
      message: "education details saved",
    });
  } catch (error) {
    res.status(500).json({
      message: "error to create education details",
      error: error.message,
    });
  }
}

export async function getAllEducation(req, res) {
  try {
    const userId = req.params.userId;
    const education = await Education.findOne({ userId: userId }).sort({
      _id: -1,
    });

    res.json(education);
  } catch (error) {
    res.json({
      message: "error to fetch education details",
      error: error.message,
    });
  }
}
