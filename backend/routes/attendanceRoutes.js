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
router.get("/student-attendance/:semester/:branch", (req, res) => {
    const { semester, branch } = req.params;

    pool.query(
        `SELECT s.registration_no, s.name, a.subject, 
                COALESCE(a.total_classes, 0) AS total_classes, 
                COALESCE(a.attended_classes, 0) AS attended_classes 
         FROM students s 
         LEFT JOIN attendance a ON s.id = a.student_id 
         WHERE s.semester = ? AND s.branch = ? 
         ORDER BY a.subject, s.registration_no`,
        [semester, branch],
        (error, results) => {
            if (error) {
                console.error("Database error fetching student attendance:", error);
                return res.status(500).json({ error: "Database error" });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: "No attendance records found for this selection" });
            }

            // Group attendance by subject
            const attendanceBySubject = {};
            results.forEach(row => {
                if (!attendanceBySubject[row.subject]) {
                    attendanceBySubject[row.subject] = [];
                }
                attendanceBySubject[row.subject].push(row);
            });

            res.json(attendanceBySubject);
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
