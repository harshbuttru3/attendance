const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
    const { name, email, password, subjects, semesters, branches } = req.body;

    if (!name || !email || !password || !Array.isArray(subjects) || subjects.length === 0 ||
        !Array.isArray(semesters) || semesters.length === 0 ||
        !Array.isArray(branches) || branches.length === 0) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        pool.query(
            "INSERT INTO teachers (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword],
            (error, result) => {
                if (error) {
                    console.error("Error inserting teacher:", error);
                    return res.status(500).json({ error: "Database error while inserting teacher" });
                }

                const teacherId = result.insertId;
                console.log(`Teacher created with ID: ${teacherId}`);

                // ✅ Ensure subjects, semesters, and branches are inserted
                const values = [];
                subjects.forEach(subject => {
                    semesters.forEach(semester => {
                        branches.forEach(branch => {
                            values.push([teacherId, subject, semester, branch]);
                        });
                    });
                });

                if (values.length === 0) {
                    return res.status(400).json({ error: "Invalid subjects/semesters/branches" });
                }

                const insertQuery = "INSERT INTO teacher_subjects (teacher_id, subject, semester, branch) VALUES ?";
                pool.query(insertQuery, [values], (err, result) => {
                    if (err) {
                        console.error("Error inserting subjects/branches:", err);
                        return res.status(500).json({ error: "Error inserting subjects/branches" });
                    }
                    console.log("Subjects/branches inserted successfully");
                    res.status(201).json({ message: "User registered successfully" });
                    // res.status(201).json({ message: "User registered successfully", token  });

                });
            }
        );
    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ error: "Server error" });
    }
});



// Login Route
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    pool.query("SELECT * FROM teachers WHERE email = ?", [email], (error, results) => {
        if (error) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(401).json({ error: "Invalid email or password" });

        const teacher = results[0];

        bcrypt.compare(password, teacher.password, (err, match) => {
            if (!match) return res.status(401).json({ error: "Invalid email or password" });

            // ✅ Fetch subjects from `teacher_subjects` table
            pool.query(
                "SELECT subject FROM teacher_subjects WHERE teacher_id = ?",
                [teacher.id],
                (subError, subResults) => {
                    if (subError) return res.status(500).json({ error: "Database error while fetching subjects" });

                    const subjects = subResults.map(sub => sub.subject);

                    // ✅ Debug: Log output
                    console.log("Fetched subjects:", subjects);

                    const user = {
                        id: teacher.id,
                        name: teacher.name,
                        email: teacher.email,
                        subjects: subjects
                    };

                    const token = jwt.sign(user, "secretkey", { expiresIn: "1h" });
                    res.json({ message: "Login successful", token, user });
                }
            );
        });
    });
});



module.exports = router;
