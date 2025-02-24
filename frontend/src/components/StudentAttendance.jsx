import { useState } from "react";
import axios from "axios";
import styles from "../css/StudentAttendance.module.css";

const StudentAttendance = () => {
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [attendanceData, setAttendanceData] = useState({});
  const [summaryData, setSummaryData] = useState({});
  const [showTables, setShowTables] = useState(false);

  const fetchAttendance = () => {
    if (semester && branch) {
      axios
        .get(`https://dce-attendance.onrender.com/api/student-attendance/${semester}/${branch}`)
        .then((res) => {
          setAttendanceData(res.data);
          setShowTables(true);
          calculateSummary(res.data); // 🔹 Calculate total attendance summary
        })
        .catch((err) => {
          console.error("Error fetching attendance:", err);
          alert("No attendance records found.");
        });
    }
  };

  const calculateSummary = (data) => {
    let summary = {};

    // 🔹 Loop through subjects and collect attendance data per student
    Object.keys(data).forEach((subject) => {
      data[subject].forEach((student) => {
        if (!summary[student.registration_no]) {
          summary[student.registration_no] = {
            name: student.name,
            total_classes: 0,
            attended_classes: 0,
          };
        }

        summary[student.registration_no].total_classes += student.total_classes;
        summary[student.registration_no].attended_classes += student.attended_classes;
      });
    });

    setSummaryData(summary);
  };

  return (
    <div>
      <h1 className={styles.title}>DCE Attendance System</h1>
      <h2>Check Attendance</h2>

      {/* 🔹 Semester Selection */}
      <label>Select Semester:</label>
      <select onChange={(e) => setSemester(e.target.value)}>
        <option value="">-- Select Semester --</option>
        {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map((sem) => (
          <option key={sem} value={sem}>{sem} Semester</option>
        ))}
      </select>

      {/* 🔹 Branch Selection */}
      <label>Select Branch:</label>
      <select onChange={(e) => setBranch(e.target.value)}>
        <option value="">-- Select Branch --</option>
        {["CSE", "FTS", "EEE", "Cybersecurity","Civil", "Mechanical", ].map((br) => (
          <option key={br} value={br}>{br}</option>
        ))}
      </select>

      <button onClick={fetchAttendance} disabled={!semester || !branch}>View Attendance</button>

      {/* 🔹 Attendance Tables by Subject */}
      <div id={styles.attendanceTablesContainer}>
      {showTables && Object.keys(attendanceData).length > 0 ? (
        Object.keys(attendanceData).map((subject, index) => (
          <div key={index} className={styles.attendanceTable}>
            <h3>Subject: {subject}</h3>
            <table border="1">
              <thead>
                <tr>
                  <th>Reg ID</th>
                  <th>Name</th>
                  <th>Total Classes</th>
                  <th>Attended Classes</th>
                  <th>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData[subject].map((student, idx) => (
                  <tr key={`${student.registration_no}-${subject}`}>
                    <td>{student.registration_no}</td>
                    <td>{student.name}</td>
                    <td>{student.total_classes}</td>
                    <td>{student.attended_classes}</td>
                    <td>{student.total_classes > 0 
                        ? ((student.attended_classes / student.total_classes) * 100).toFixed(2) 
                        : "0.00"}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        showTables && <p>No attendance records found.</p>
      )}
      
      {/* 🔹 Overall Summary Table */}
      {showTables && Object.keys(summaryData).length > 0 && (
        <div className={styles.summaryTable}>
          <h2>Overall Attendance Summary</h2>
          <table border="1">
            <thead>
              <tr>
                <th>Reg ID</th>
                <th>Name</th>
                <th>Total Classes</th>
                <th>Total Attended</th>
                <th>Overall %</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(summaryData).map((regId, index) => (
                <tr key={index}>
                  <td>{regId}</td>
                  <td>{summaryData[regId].name}</td>
                  <td>{summaryData[regId].total_classes}</td>
                  <td>{summaryData[regId].attended_classes}</td>
                  <td>{summaryData[regId].total_classes > 0 
                      ? ((summaryData[regId].attended_classes / summaryData[regId].total_classes) * 100).toFixed(2) 
                      : "0.00"}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
      
      {/* 🔹 Footer */}
      <footer>
        <p>© 2024 DCE Attendance System</p>
      </footer>
    </div>
  );
};

export default StudentAttendance;
