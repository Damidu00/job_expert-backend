import Referees from "../models/RefereesModel.js";

export async function createReferee(req, res) {
  try {
    const refereeDetails = req.body;
    const referee = new Referees(refereeDetails);
    await referee.save();

    res.json({
      message: "referees created",
    });
  } catch (error) {
    res.json({
      message: "error to create referees",
      error: error.message,
    });
  }
}

export async function getAllReferess(req, res) {
  try {
    const userId = req.params.userId;
    const referees = await Referees.findOne({ userId: userId }).sort({
      _id: -1,
    });

    res.json(referees);
  } catch (error) {
    res.json({
      message: "error to fetch referees",
      error: error.message,
    });
  }
}
