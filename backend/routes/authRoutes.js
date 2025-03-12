const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

// 🔹 Teacher Login Route (Using Employee ID)
router.post("/login", (req, res) => {
    const { employee_id, password } = req.body;

    pool.query("SELECT * FROM teachers WHERE employee_id = ?", [employee_id], (error, results) => {
        if (error) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(401).json({ error: "Invalid employee ID or password" });

        const teacher = results[0];

        bcrypt.compare(password, teacher.password, (err, match) => {
            if (!match) return res.status(401).json({ error: "Invalid employee ID or password" });

            // ✅ Fetch subjects from `teacher_subjects` table
            pool.query(
                "SELECT subject FROM teacher_subjects WHERE teacher_id = ?",
                [teacher.id],
                (subError, subResults) => {
                    if (subError) return res.status(500).json({ error: "Database error while fetching subjects" });

                    const subjects = subResults.map(sub => sub.subject);

                    // ✅ Send `id` in response
                    const user = {
                        id: teacher.id,
                        name: teacher.name,
                        employee_id: teacher.employee_id,
                        subjects
                    };

                    const token = jwt.sign(user, "secretkey", { expiresIn: "1h" });
                    res.json({ message: "Login successful", token, user });
                }
            );
        });
    });
});

module.exports = router;
