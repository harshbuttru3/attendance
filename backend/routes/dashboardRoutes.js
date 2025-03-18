const express = require("express");
const pool = require("../db");

const router = express.Router();

/**
 * ✅ Add Subject for a Teacher (Prevent Duplicates)
 */
router.post("/add-subjects", async (req, res) => {
  const { teacher_id, subject, semester, branch } = req.body;

  if (!teacher_id || !subject || !semester || !branch) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // 🔹 Check if subject already exists for teacher
    const checkQuery = `
            SELECT * FROM teacher_subjects
            WHERE teacher_id = ? AND subject = ? AND semester = ? AND branch = ?`;

    pool.query(
      checkQuery,
      [teacher_id, subject, semester, branch],
      (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }

        if (results.length > 0) {
          return res.status(409).json({ error: "Subject already assigned" });
        }

        // 🔹 Insert subject into `teacher_subjects` table
        const insertQuery = `
                INSERT INTO teacher_subjects (teacher_id, subject, semester, branch)
                VALUES (?, ?, ?, ?)`;

        pool.query(
          insertQuery,
          [teacher_id, subject, semester, branch],
          (err, result) => {
            if (err) {
              console.error("Error inserting subject:", err);
              return res.status(500).json({ error: "Error inserting subject" });
            }

            res.status(201).json({ message: "Subject added successfully!" });
          }
        );
      }
    );
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * ✅ Fetch Teacher's Subjects by Semester & Branch
 */
router.get("/subjects/:teacher_id", (req, res) => {
  const { teacher_id } = req.params;

  const query = `
        SELECT subject, semester, branch FROM teacher_subjects
        WHERE teacher_id = ?`;

  pool.query(query, [teacher_id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No subjects found" });
    }

    res.json(results);
  });
});

/**
 * ✅ Fetch Students for Selected Semester & Branch
 */
router.get("/students/:semester/:branch", (req, res) => {
  const { semester, branch } = req.params;

  console.log("🔹 Fetching students for:", { semester, branch });

  const query = `
        SELECT id, registration_no, name
        FROM students
        WHERE semester = ? AND branch = ?`;

  pool.query(query, [semester, branch], (err, results) => {
    if (err) {
      console.error("❌ Database error fetching students:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      console.warn("⚠️ No students found for:", { semester, branch });
      return res.status(404).json({ error: "No students found" });
    }

    console.log("✅ Students Fetched:", results);
    res.json(results);
  });
});

/**
 * ✅ Fetch Attendance for a Specific Semester, Branch, and Subject
 */
router.get("/attendance/:semester/:branch/:subject", (req, res) => {
  const { semester, branch, subject } = req.params;

  console.log("🔹 Fetching attendance for:", { semester, branch, subject });

  const query = `
        SELECT a.student_id, s.registration_no, s.name, 
               a.total_classes, a.attended_classes
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE a.semester = ? AND a.branch = ? AND a.subject = ?`;

  pool.query(query, [semester, branch, subject], (err, results) => {
    if (err) {
      console.error("❌ Database error fetching attendance:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      console.warn("⚠️ No attendance records found for:", {
        semester,
        branch,
        subject,
      });
      return res.status(404).json({ error: "No attendance records found" });
    }

    console.log("✅ Attendance Fetched:", results);
    res.json(results);
  });
});

/**
 * ✅ Update Student Attendance
 */
router.post("/attendance/update", (req, res) => {
  const attendanceData = req.body;

  console.log(attendanceData);

  if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
    return res.status(400).json({ error: "Invalid attendance data" });
  }

  console.log("📌 Storing Attendance:", attendanceData);

  const query = `
        INSERT INTO attendance (student_id, subject, semester, branch, total_classes, attended_classes)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        total_classes = VALUES(total_classes),
        attended_classes = VALUES(attended_classes)`;

  attendanceData.forEach(
    ({
      student_id,
      subject,
      semester,
      branch,
      total_classes,
      attended_classes,
    }) => {
      pool.query(
        query,
        [
          student_id,
          subject,
          semester,
          branch,
          total_classes,
          attended_classes,
        ],
        (err) => {
          if (err) console.error("Error updating attendance:", err);
        }
      );
    }
  );

  res.json({ message: "Attendance updated successfully!" });
});

//remove subject
router.delete("/remove-subject", (req, res) => {
  const { teacher_id, subject, semester, branch } = req.body;

  if (!teacher_id || !subject || !semester || !branch) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `
        DELETE FROM teacher_subjects
        WHERE teacher_id = ? AND subject = ? AND semester = ? AND branch = ?
    `;

  pool.query(query, [teacher_id, subject, semester, branch], (err, result) => {
    if (err) {
      console.error("Error deleting subject:", err);
      return res
        .status(500)
        .json({ error: "Database error while removing subject" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Subject not found" });
    }

    res.json({ message: "Subject removed successfully!" });
  });
});

module.exports = router;
