import { useState } from "react";
import axios from "axios";
// import styles from "../css/StudentAttendance.module.css";

const StudentAttendance = () => {
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [attendanceData, setAttendanceData] = useState({});
  const [summaryData, setSummaryData] = useState({});
  const [showTables, setShowTables] = useState(false);

  const fetchAttendance = () => {
    if (semester && branch) {
      axios
        .get(
          `http://localhost:5000/api/student-attendance/${semester}/${branch}`
        )
        .then((res) => {
          setAttendanceData(res.data);
          setShowTables(true);
          calculateSummary(res.data);
        })
        .catch((err) => {
          console.error("Error fetching attendance:", err);
          alert("No attendance records found.");
        });
    }
  };

  const calculateSummary = (data) => {
    let summary = {};
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
        summary[student.registration_no].attended_classes +=
          student.attended_classes;
      });
    });
    setSummaryData(summary);
  };

  return (
    <div>
      <h1>DCE Attendance System</h1>
      <h2>Check Attendance</h2>

      <label>Select Semester:</label>
      <select onChange={(e) => setSemester(e.target.value)}>
        <option value="">-- Select Semester --</option>
        {[1,2,3,4,5,6,7,8].map((sem) => (
          <option key={sem} value={sem}>
            {sem} Semester
          </option>
        ))}
      </select>

      <label>Select Branch:</label>
      <select onChange={(e) => setBranch(e.target.value)}>
        <option value="">-- Select Branch --</option>
        {["CSE", "FTS", "EEE", "Cybersecurity", "Civil", "Mechanical"].map(
          (br) => (
            <option key={br} value={br}>
              {br}
            </option>
          )
        )}
      </select>

      <button onClick={fetchAttendance} disabled={!semester || !branch}>
        View Attendance
      </button>

      <div>
        {showTables && Object.keys(attendanceData).length > 0
          ? Object.keys(attendanceData).map((subject, index) => (
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
                    {attendanceData[subject].map((student, idx) => {
                      const attendancePercentage =
                        student.total_classes > 0
                          ? (student.attended_classes / student.total_classes) *
                            100
                          : 0;
                      return (
                        <tr
                          key={`${student.registration_no}-${subject}`}
                          style={{
                            backgroundColor:
                              attendancePercentage < 75
                                ? "rgb(122, 36, 28)"
                                : "transparent",
                          }}
                        >
                          <td>{student.registration_no}</td>
                          <td>{student.name}</td>
                          <td>{student.total_classes}</td>
                          <td>{student.attended_classes}</td>
                          <td>{attendancePercentage.toFixed(2)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))
          : showTables && <p>No attendance records found.</p>}

        {showTables && Object.keys(summaryData).length > 0 && (
          <div >
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
                {Object.keys(summaryData).map((regId, index) => {
                  const overallPercentage =
                    summaryData[regId].total_classes > 0
                      ? (summaryData[regId].attended_classes /
                          summaryData[regId].total_classes) *
                        100
                      : 0;
                  return (
                    <tr
                      key={index}
                      style={{
                        backgroundColor:
                          overallPercentage < 75
                            ? "rgb(122, 36, 28)"
                            : "transparent",
                      }}
                    >
                      <td>{regId}</td>
                      <td>{summaryData[regId].name}</td>
                      <td>{summaryData[regId].total_classes}</td>
                      <td>{summaryData[regId].attended_classes}</td>
                      <td>{overallPercentage.toFixed(2)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAttendance;
