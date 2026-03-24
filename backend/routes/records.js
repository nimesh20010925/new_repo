const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getRecords } = require("../controllers/recordController");

router.get("/", auth, getRecords);

module.exports = router;
