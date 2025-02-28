import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const fetchSubjects = () => {
    if (semester && branch) {
      axios
        .get(`https://dce-attendance.onrender.com/api/subjects/${user.id}/${semester}/${branch}`)
        .then((res) => {
          if (res.data.length > 0) {
            setSubjects(res.data);
            setShowSubjectDropdown(true);
          } else {
            alert("No subjects assigned for this selection.");
            setShowSubjectDropdown(false);
          }
        })
        .catch((err) => {
          console.error("Error fetching subjects:", err);
          setShowSubjectDropdown(false);
        });
    }
  };

  const fetchStudents = () => {
    if (semester && branch && selectedSubject) {
      axios.get(`https://dce-attendance.onrender.com/api/attendance/${semester}/${branch}/${selectedSubject}`)
        .then(res => {
          setStudents(res.data);
          setAttendance(
            res.data.map(student => ({
              student_id: student.id,
              subject: selectedSubject,
              semester,
              branch,
              total_classes: student.total_classes || 0,
              attended_classes: student.attended_classes || 0,
            }))
          );
        })
        .catch(err => {
          console.error("Error fetching students:", err);
          alert("No students found for this selection.");
        });
    }
  };

  const handleInputChange = (index, field, value) => {
    setAttendance((prevAttendance) => {
      const updatedAttendance = [...prevAttendance];
  
      // Remove leading zeros by converting to a number, but allow empty input
      let numericValue = value === "" ? "" : Math.max(0, Number(value));
  
      if (field === "total_classes") {
        updatedAttendance.forEach((entry) => {
          entry.total_classes = numericValue;
        });
      } else {
        updatedAttendance[index][field] = numericValue;
      }
  
      return updatedAttendance;
    });
  };
  
  

  const handleSubmit = () => {
    axios
      .post("https://dce-attendance.onrender.com/api/attendance/update", attendance)
      .then(() => alert("Attendance updated successfully!"))
      .catch((err) => console.error("Error updating attendance:", err));
  };

  return (
    <div>
      <h2>Welcome, {user?.name}</h2>
      <button onClick={logout}>Logout</button>

      <label>Select Semester:</label>
      <select value={semester} onChange={(e) => setSemester(e.target.value)}>
        <option value="">-- Select Semester --</option>
        {["1st", "2nd", "3rd","4th", "5th", "6th", "7th", "8th"]
        .map((sem) => (
          <option key={sem} value={sem}>{sem} Semester</option>
        ))}
      </select>

      <label>Select Branch:</label>
      <select value={branch} onChange={(e) => setBranch(e.target.value)}>
        <option value="">-- Select Branch --</option>
        {["CSE", "Civil", "EEE", "Cybersecurity","Mechanical", "FTS"].map((br) => (
          <option key={br} value={br}>{br}</option>
        ))}
      </select>

      <button onClick={fetchSubjects} disabled={!semester || !branch}>Load Subjects</button>

      {showSubjectDropdown && (
        <>
          <label>Select Subject:</label>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="">-- Select Subject --</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject}>{subject}</option>
            ))}
          </select>

          <button onClick={fetchStudents}>Load Students</button>
        </>
      )}

      {students.length > 0 && (
        <div>
          <h3>Subject: {selectedSubject}</h3>
          <table border="1">
            <thead>
              <tr>
                <th>Reg ID</th>
                <th>Name</th>
                <th>Total Classes</th>
                <th>Attended Classes</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={`${student.id}-${selectedSubject}-${semester}-${branch}`}>
                  <td>{student.registration_no}</td>
                  <td>{student.name}</td>
                  <td>
                    <input
                      type="number"
                      value={attendance[index]?.total_classes || 0}
                      onChange={(e) => handleInputChange(index, "total_classes", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={attendance[index]?.attended_classes || 0}
                      onChange={(e) => handleInputChange(index, "attended_classes", e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
