const express = require("express");
const pool = require("../db");

const router = express.Router();

// 🔹 Add Multiple Subjects for a Teacher
router.post("/add-subjects", async (req, res) => {
    const { teacher_id, subjects } = req.body;

    if (!teacher_id || !Array.isArray(subjects) || subjects.length === 0) {
        return res.status(400).json({ error: "Teacher ID and subjects are required" });
    }

    try {
        // ✅ Check if teacher exists
        const [teacherCheck] = await pool.promise().query(
            "SELECT id FROM teachers WHERE id = ?", [teacher_id]
        );
        if (teacherCheck.length === 0) {
            return res.status(404).json({ error: "Teacher not found" });
        }

        // ✅ Prepare values for bulk insert
        const values = subjects.map(({ subject, semester, branch }) => [
            teacher_id,
            subject,
            semester,
            branch,
        ]);

        // ✅ Use "INSERT IGNORE" to prevent duplicate entries
        const query = `
            INSERT IGNORE INTO teacher_subjects (teacher_id, subject, semester, branch) 
            VALUES ?`;

        pool.query(query, [values], (error, results) => {
            if (error) {
                console.error("Error adding subjects:", error);
                return res.status(500).json({ error: "Database error while adding subjects" });
            }

            res.json({
                message: `${results.affectedRows} subjects added successfully`,
            });
        });

    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
