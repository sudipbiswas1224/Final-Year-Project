const express = require("express");
const {
  createJournal,
  getJournals,
  updateJournal,
  deleteJournal,
} = require("../controllers/journalController");

const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Apply authentication middleware to all journal routes
router.use(authenticate);

router.post("/create", createJournal);
router.get("/all", getJournals);
router.put("/update/:id", updateJournal);
router.delete("/delete/:id", deleteJournal);

module.exports = router;
