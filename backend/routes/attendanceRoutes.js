const express = require("express");
const pool = require("../db");

const router = express.Router();

// Fetch students for a selected semester, branch, and subject
router.get("/attendance/:semester/:branch/:subject", (req, res) => {
    const { semester, branch, subject } = req.params;

    pool.query(
        `SELECT students.id, students.registration_no, students.name, 
                COALESCE(attendance.total_classes, 0) AS total_classes, 
                COALESCE(attendance.attended_classes, 0) AS attended_classes 
         FROM students 
         LEFT JOIN attendance 
         ON students.id = attendance.student_id 
         AND attendance.subject = ? 
         AND attendance.semester = ? 
         AND attendance.branch = ?
         WHERE students.semester = ? 
         AND students.branch = ?`,
        [subject, semester, branch, semester, branch], // Bind values
        (error, results) => {
            if (error) {
                console.error("Database error fetching students:", error);
                return res.status(500).json({ error: "Database error" });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: "No students found for this selection" });
            }

            res.json(results);
        }
    );
});

// Update Attendance for Students
router.post("/attendance/update", (req, res) => {
    const attendanceData = req.body;

    attendanceData.forEach(({ student_id, subject, semester, branch, total_classes, attended_classes }) => {
        pool.query(
            `INSERT INTO attendance (student_id, subject, semester, branch, total_classes, attended_classes)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE total_classes = ?, attended_classes = ?`,
            [student_id, subject, semester, branch, total_classes, attended_classes, total_classes, attended_classes],
            (error) => {
                if (error) console.error("Error updating attendance:", error);
            }
        );
    });

    res.json({ message: "Attendance updated successfully!" });
});

module.exports = router;
