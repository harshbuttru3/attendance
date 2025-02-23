import { useState } from "react";
import axios from "axios";
import "../css/studentAttendance.css";

const StudentAttendance = () => {
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [attendanceData, setAttendanceData] = useState({});
  const [showTables, setShowTables] = useState(false);

  const fetchAttendance = () => {
    if (semester && branch) {
      axios
        .get(`http://localhost:5000/api/student-attendance/${semester}/${branch}`)
        .then((res) => {
          setAttendanceData(res.data);
          setShowTables(true);
        })
        .catch((err) => {
          console.error("Error fetching attendance:", err);
          alert("No attendance records found.");
        });
    }
  };

  return (
    <div>
      <h1>Dce attendance system</h1>
      <h2>Check Attendance</h2>

      <label>Select Semester:</label>
      <select onChange={(e) => setSemester(e.target.value)}>
        <option value="">-- Select Semester --</option>
        {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map((sem) => (
          <option key={sem} value={sem}>{sem} Semester</option>
        ))}
      </select>

      <label>Select Branch:</label>
      <select onChange={(e) => setBranch(e.target.value)}>
        <option value="">-- Select Branch --</option>
        {["CSE", "ECE", "EEE", "Cybersecurity"].map((br) => (
          <option key={br} value={br}>{br}</option>
        ))}
      </select>

      <button onClick={fetchAttendance} disabled={!semester || !branch}>View Attendance</button>

      {showTables && Object.keys(attendanceData).length > 0 ? (
        Object.keys(attendanceData).map((subject, index) => (
          <div key={index}>
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
                    <td>{((student.attended_classes / student.total_classes) * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        showTables && <p>No attendance records found.</p>
      )}
      <footer>
        <p>© 2021 DCE Attendance System</p>
      </footer>
    </div>

  );
};

export default StudentAttendance;
