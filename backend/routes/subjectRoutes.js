const express = require("express");
const pool = require("../db");

const router = express.Router();

// ✅ Fetch subjects assigned to a teacher for a specific semester and branch
router.get("/subjects/:teacher_id/:semester/:branch", (req, res) => {
    const { teacher_id, semester, branch } = req.params;

    pool.query(
        `SELECT DISTINCT subject 
         FROM teacher_subjects 
         WHERE teacher_id = ? AND semester = ? AND branch = ?`,
        [teacher_id, semester, branch],
        (error, results) => {
            if (error) {
                console.error("Database error fetching subjects:", error);
                return res.status(500).json({ error: "Database error" });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: "No subjects found for this selection" });
            }

            // Extract subject names from results
            const subjects = results.map((row) => row.subject);
            res.json(subjects);
        }
    );
});

module.exports = router;
