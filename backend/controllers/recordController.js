const Record = require("../models/Record");

exports.getRecords = async (req, res) => {
  try {
    const records = await Record.find({ user: req.userId })
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching records" });
  }
};
