const express = require("express");
const pool = require("../db");

const router = express.Router();

/**
 * ✅ Register a new student
 */
router.post("/register-student", (req, res) => {
    const { registration_no, name, branch, semester } = req.body;

    if (!registration_no || !name || !branch || !semester) {
        return res.status(400).json({ error: "All fields are required" });
    }

    pool.query(
        "INSERT INTO students (registration_no, name, branch, semester) VALUES (?, ?, ?, ?)",
        [registration_no, name, branch, semester],
        (error, result) => {
            if (error) {
                console.error("Error inserting student:", error);
                return res.status(500).json({ error: "Database error while adding student" });
            }
            res.status(201).json({ message: "Student registered successfully" });
        }
    );
});

/**
 * ✅ Move all students to the next semester
 */
router.put("/promote-semester", (req, res) => {
    const { currentSemester } = req.body;

    if (!currentSemester) {
        return res.status(400).json({ error: "Current semester is required" });
    }

    const semesterMap = {
        "1st": "2nd", "2nd": "3rd", "3rd": "4th", "4th": "5th",
        "5th": "6th", "6th": "7th", "7th": "8th", "8th": "8th"
    };

    const nextSemester = semesterMap[currentSemester];

    pool.query(
        "UPDATE students SET semester = ? WHERE semester = ?",
        [nextSemester, currentSemester],
        (error, result) => {
            if (error) {
                console.error("Error promoting students:", error);
                return res.status(500).json({ error: "Database error while updating students" });
            }
            res.json({ message: `All students from ${currentSemester} promoted to ${nextSemester}` });
        }
    );
});


/**
 * ✅ Manually update a single student's semester
 */
router.put("/update-student-semester", (req, res) => {
    const { registration_no, newSemester } = req.body;

    if (!registration_no || !newSemester) {
        return res.status(400).json({ error: "All fields are required" });
    }

    pool.query(
        "UPDATE students SET semester = ? WHERE registration_no = ?",
        [newSemester, registration_no],
        (error, result) => {
            if (error) {
                console.error("Error updating student semester:", error);
                return res.status(500).json({ error: "Database error while updating semester" });
            }
            res.json({ message: "Student semester updated successfully" });
        }
    );
});

module.exports = router;
