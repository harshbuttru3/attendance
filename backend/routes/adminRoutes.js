const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

/**
 * ✅ Helper functions for semester conversion
 */
const toOrdinalSemester = (semester) => {
    const ordinalMap = {
        1: "1st", 2: "2nd", 3: "3rd",
        4: "4th", 5: "5th", 6: "6th",
        7: "7th", 8: "8th"
    };
    return ordinalMap[semester] || semester;
};

const toNumericSemester = (ordinal) => {
    const numericMap = {
        "1st": 1, "2nd": 2, "3rd": 3,
        "4th": 4, "5th": 5, "6th": 6,
        "7th": 7, "8th": 8
    };
    return numericMap[ordinal] || ordinal;
};

// 🔹 SECRET KEY for JWT
const SECRET_KEY = "your_secret_key_here"; // Change this to a secure key!

/**
 * ✅ Admin Login
 */
router.post("/login", (req, res) => {
    const { employee_id, password } = req.body;

    if (!employee_id || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    pool.query(
        "SELECT * FROM admins WHERE employee_id = ?",
        [employee_id],
        async (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });
            if (results.length === 0) return res.status(401).json({ error: "Invalid employee ID or password" });

            const admin = results[0];
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid employee ID or password" });
            }

            const token = jwt.sign(
                { id: admin.id, employee_id: admin.employee_id, role: "admin" },
                SECRET_KEY,
                { expiresIn: "1h" }
            );

            res.json({ message: "Login successful", token });
        }
    );
});

/**
 * ✅ Middleware to verify admin authentication
 */
const verifyAdminToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Bearer <token>
    
    if (!token) {
      return res.status(401).json({ error: "Unauthorized. No token provided." });
    }
  
    try {
      const decoded = jwt.verify(token, "secretkey"); // Match the key used during login
      req.admin = decoded;
      next(); // Proceed to the next middleware or route handler
    } catch (err) {
      return res.status(401).json({ error: "Invalid token. Please log in again." });
    }
  };

/**
 * ✅ Add Teacher (Admin Only)
 */
router.post("/add-teacher", verifyAdminToken, async (req, res) => {
    const { name, employee_id, password } = req.body;
  
    if (!name || !employee_id || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      pool.query(
        "INSERT INTO teachers (name, employee_id, password) VALUES (?, ?, ?)",
        [name, employee_id, hashedPassword],
        (error, result) => {
          if (error) {
            console.error("Error inserting teacher:", error);
            return res.status(500).json({ error: "Database error while adding teacher" });
          }
          res.status(201).json({ message: "Teacher added successfully" });
        }
      );
    } catch (err) {
      console.error("Server error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });


// ✅ Delete teacher using employee_id in the URL
router.delete("/delete-teacher/:employee_id", verifyAdminToken, (req, res) => {
    const { employee_id } = req.params;

    if (!employee_id) {
        return res.status(400).json({ error: "Employee ID is required" });
    }

    pool.query(
        "DELETE FROM teachers WHERE employee_id = ?",
        [employee_id],
        (error, result) => {
            if (error) {
                console.error("Error deleting teacher:", error);
                return res.status(500).json({ error: "Database error while deleting teacher" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Teacher not found" });
            }
            res.json({ message: "Teacher deleted successfully" });
        }
    );
});
 
// for fetching teachers 
router.get("/teachers", verifyAdminToken, (req, res) => {
    pool.query("SELECT * FROM teachers", (error, results) => {
        if (error) {
            console.error("Error fetching teachers:", error);
            return res.status(500).json({ error: "Database error while fetching teachers" });
        }
        res.json(results);
    });
});

// for resetting password of a teacher using employee_id
router.put("/reset-password/:employee_id", verifyAdminToken, async (req, res) => {
    const { employee_id } = req.params;
    const { password } = req.body;

    if (!employee_id || !password) {
        return res.status(400).json({ error: "Employee ID and password are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        pool.query(
            "UPDATE teachers SET password = ? WHERE employee_id = ?",
            [hashedPassword, employee_id],
            (error, result) => {
                if (error) {
                    console.error("Error resetting password:", error);
                    return res.status(500).json({ error: "Database error while resetting password" });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: "Teacher not found" });
                }
                res.json({ message: "Password reset successfully" });
            }
        );
    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

/**
 * ✅ Register a new student (Store semester as "1st", "2nd", ...)
 */
router.post("/register-student", (req, res) => {
    let { registration_no, name, branch, semester } = req.body;

    if (!registration_no || !name || !branch || !semester) {
        return res.status(400).json({ error: "All fields are required" });
    }

    semester = toOrdinalSemester(semester);

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
 * ✅ Promote all students to the next semester
 */
router.put("/promote-semester", (req, res) => {
    let { currentSemester } = req.body;

    if (!currentSemester) {
        return res.status(400).json({ error: "Current semester is required" });
    }

    let numericSemester = toNumericSemester(currentSemester);
    if (numericSemester < 1 || numericSemester > 7) {
        return res.status(400).json({ error: "Invalid semester for promotion" });
    }

    const nextSemester = toOrdinalSemester(numericSemester + 1);

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
 * ✅ Update a single student's semester
 */
router.put("/update-student-semester", (req, res) => {
    let { registration_no, newSemester } = req.body;

    if (!registration_no || !newSemester) {
        return res.status(400).json({ error: "All fields are required" });
    }

    newSemester = toOrdinalSemester(newSemester);

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

// ✅ Delete student using registration number in the URL
router.delete("/delete-student/:registration_no", verifyAdminToken, (req, res) => {
    const { registration_no } = req.params;

    if (!registration_no) {
        return res.status(400).json({ error: "Registration number is required" });
    }

    pool.query(
        "DELETE FROM students WHERE registration_no = ?",
        [registration_no],
        (error, result) => {
            if (error) {
                console.error("Error deleting student:", error);
                return res.status(500).json({ error: "Database error while deleting student" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Student not found" });
            }
            res.json({ message: "Student deleted successfully" });
        }
    );
});

//delete student-attendance of whole class using semester while promoting
router.delete("/delete-student-attendance/:semester", verifyAdminToken, (req, res) => {
    const { semester } = req.params;

    if (!semester) {
        return res.status(400).json({ error: "Semester is required" });
    }

    pool.query(
        "DELETE FROM attendance WHERE semester = ?",
        [semester],
        (error, result) => {
            if (error) {
                console.error("Error deleting student attendance:", error);
                return res.status(500).json({ error: "Database error while deleting student attendance" });
            }
            res.json({ message: "Student attendance deleted successfully" });
        }
    );
});

 //delete-students-of-last-semester
router.delete("/delete-students-of-last-semester", verifyAdminToken, (req, res) => {
    const lastSemester = "8th";

    pool.query(
        "DELETE FROM students WHERE semester = ?",
        [lastSemester],
        (error, result) => {
            if (error) {
                console.error("Error deleting students:", error);
                return res.status(500).json({ error: "Database error while deleting students" });
            }
            res.json({ message: "8th semester students deleted successfully" });
        }
    );
});

//admin login
router.post("/auth/login", (req, res) => {
    const { employee_id, password } = req.body;

    if (!employee_id || !password) {
        return res.status(400).json({ error: "Employee ID and password are required" });
    }

    // 🔹 Fetch admin details from the database
    pool.query("SELECT * FROM admins WHERE employee_id = ?", [employee_id], (error, results) => {
        if (error) return res.status(500).json({ error: "Database error" });

        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid employee ID or password" });
        }

        const admin = results[0];

        // 🔹 Compare hashed password
        bcrypt.compare(password, admin.password, (err, match) => {
            if (err) return res.status(500).json({ error: "Error checking password" });

            if (!match) {
                return res.status(401).json({ error: "Invalid employee ID or password" });
            }

            // ✅ Generate JWT token
            const token = jwt.sign(
                { id: admin.id, employee_id: admin.employee_id, name: admin.name },
                "secretkey",
                { expiresIn: "1h" }
            );

            res.json({ message: "Login successful", token });
        });
    });
});



module.exports = router;
