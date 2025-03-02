const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

// 🔹 Signup Route (No Subject Selection)
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
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

                console.log(`Teacher created with ID: ${result.insertId}`);
                res.status(201).json({ message: "User registered successfully" });
            }
        );
    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// 🔹 Login Route
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    pool.query("SELECT * FROM teachers WHERE email = ?", [email], (error, results) => {
        if (error) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(401).json({ error: "Invalid email or password" });

        const teacher = results[0];

        bcrypt.compare(password, teacher.password, (err, match) => {
            if (!match) return res.status(401).json({ error: "Invalid email or password" });

            // Prepare user object (excluding password)
            const user = {
                id: teacher.id,
                name: teacher.name,
                email: teacher.email,
                semester: teacher.semester,
                branch: teacher.branch
            };

            // Generate a JWT Token
            const token = jwt.sign(user, "secretkey", { expiresIn: "1h" });

            res.json({ message: "Login successful", token, user });
        });
    });
});

// 🔹 Get Teacher Info (Authenticated Route)
router.get("/profile", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"
    
    if (!token) {
        return res.status(401).json({ error: "Unauthorized. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, "secretkey");
        res.json({ user: decoded });
    } catch (err) {
        res.status(401).json({ error: "Invalid token. Please log in again." });
    }
});

module.exports = router;
